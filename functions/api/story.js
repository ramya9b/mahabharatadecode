/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — /api/story
   Story Teller generation, server-side.

   English  → Groq   (llama-3.3-70b) — instant
   Regional → Gemini (2.5-flash-lite) — best quality

   Both API keys stay here. The browser sends only structured
   parameters (character, tone, language, situation) — never prompt
   text — so this endpoint cannot be used as a general-purpose LLM.
───────────────────────────────────────────────────────────── */

const LANGUAGE_NAMES = { en: "English", te: "Telugu", hi: "Hindi", kn: "Kannada" };

const TONE_INSTRUCTIONS = {
  epic:          "Narrate in a bold, cinematic, dramatic style — like a blockbuster film. Use vivid imagery. NO archaic words. Speak directly to the reader.",
  devotional:    "Narrate in a warm, spiritual, devotional tone — like a Harikatha. Evoke bhakti and divine love. Simple heartfelt language.",
  kids:          "Narrate in a simple, fun style for children aged 8–12. Very short sentences. No complex words.",
  philosophical: "Narrate with deep philosophical insight. Explore Dharma, Karma. Clear modern English. Connect to everyday life.",
};

const STORY_PROMPT = `You are a master storyteller of the Mahabharata.
Write like a master poet. Every line must pierce the heart. NEVER use archaic words like "hearken", "beget", "thee", "thou", "thus", "O seeker".
Rules:
- Write EXACTLY 5 to 6 lines — no more, no less
- Every line emotionally powerful and unforgettable
- The LAST line must be the most powerful moral truth
- Clear modern language a 16-year-old understands
- Stay faithful to canon — never invent events
- Under 120 words English, under 100 words Telugu/Hindi/Kannada
- ALWAYS complete the last sentence
- Respond ONLY in the language specified
- Output ONLY the story — no preamble or commentary`;

const LESSON_PROMPT = `You are a life coach and Mahabharata scholar.
Rules:
- MAXIMUM 5 lines — powerful and concise
- Reader must feel "this is about ME"
- End with one actionable truth
- NO jargon — connect to modern life
- Under 100 words Telugu/Hindi/Kannada, under 120 English
- ALWAYS complete last sentence
- Respond ONLY in language specified
- Output ONLY the lesson — no preamble`;

const SITUATION_PROMPT = `You are a compassionate life coach and Mahabharata scholar.
Rules:
- Speak directly — warm, honest, like a trusted mentor
- MAXIMUM 6 lines
- Give 2–3 clear practical steps RIGHT NOW
- End with powerful truth from character
- Under 150 words Telugu/Hindi/Kannada
- ALWAYS complete last sentence
- Respond ONLY in language specified
- Output ONLY the guidance — no preamble`;

/* Free-text the caller supplies is bounded — these are the only fields a
   visitor controls, and they are quoted into the user turn. */
const LIMITS = {
  characterName: 80, prompt: 600, storyContext: 4000,
  userSituation: 1200, question: 500,
};

const CHARACTER_QA_PROMPT = (name) =>
  `You are a wise scholar of the Mahabharata. Answer questions about ${name} — their character, choices, philosophy, and role in the epic. Keep answers to 3-5 sentences, insightful and grounded in the original text. Literary tone, no bullet points.`;

const ALLOWED_ORIGINS = [
  "https://mahabharatadecoded.com",
  "https://www.mahabharatadecoded.com",
  "http://localhost:8080",
  "http://localhost:8788",
];

const corsFor = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
});

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers });

function clean(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .trim();
}

async function callGroq(system, user, temp, apiKey) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      temperature: temp,
      max_tokens: 1024,
      top_p: 0.95,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }
  const data = await res.json();
  const story = data?.choices?.[0]?.message?.content ?? "";
  if (!story) throw new Error("Empty response from Groq");
  return clean(story);
}

async function callGemini(system, user, temp, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: temp,
          maxOutputTokens: 4096,
          topP: 0.95,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini error ${res.status}`);
  }
  const data = await res.json();
  const candidate = data?.candidates?.[0];
  let story = candidate?.content?.parts?.[0]?.text ?? "";
  if (!story) throw new Error("Empty response from Gemini");
  /* Trim at the last complete sentence if the model was cut off. */
  if (candidate?.finishReason === "MAX_TOKENS") {
    const last = Math.max(
      story.lastIndexOf("।"), story.lastIndexOf("."),
      story.lastIndexOf("!"), story.lastIndexOf("?")
    );
    if (last > story.length * 0.5) story = story.slice(0, last + 1);
  }
  return clean(story);
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin") || "";
  const cors = corsFor(origin);

  try {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ success: false, error: "Forbidden" }, 403, cors);
    }

    const body = await context.request.json();
    const { kind, language, tone } = body;

    if (!["story", "lesson", "situation", "character"].includes(kind)) {
      return json({ success: false, error: "Unknown request kind" }, 400, cors);
    }
    /* Character Q&A has no language selector — it answers in English. */
    if (kind !== "character" && !Object.prototype.hasOwnProperty.call(LANGUAGE_NAMES, language)) {
      return json({ success: false, error: "Unsupported language" }, 400, cors);
    }
    if (kind === "story" && !Object.prototype.hasOwnProperty.call(TONE_INSTRUCTIONS, tone)) {
      return json({ success: false, error: "Unsupported tone" }, 400, cors);
    }

    /* Bound every caller-supplied string before it reaches a prompt. */
    const field = (name) => {
      const v = typeof body[name] === "string" ? body[name].trim() : "";
      if (v.length > LIMITS[name]) throw new Error(`${name} too long`);
      return v;
    };
    const characterName = field("characterName");
    const prompt = field("prompt");
    const storyContext = field("storyContext");
    const userSituation = field("userSituation");
    const question = field("question");

    if (!characterName) {
      return json({ success: false, error: "Missing character" }, 400, cors);
    }

    const langName = LANGUAGE_NAMES[language];
    let system, user, temp;

    if (kind === "character") {
      if (!question) {
        return json({ success: false, error: "Missing question" }, 400, cors);
      }
      system = CHARACTER_QA_PROMPT(characterName);
      user = question;
      temp = 0.75;
    } else if (kind === "story") {
      system = STORY_PROMPT;
      temp = 0.85;
      user = `Character: ${characterName}
Story Request: ${prompt}
Tone: ${TONE_INSTRUCTIONS[tone]}
Language: Respond entirely in ${langName}. Do not mix languages.
Now narrate this story.`;
    } else if (kind === "lesson") {
      system = LESSON_PROMPT;
      temp = 0.8;
      user = `Character: ${characterName}
Story context: ${storyContext}
What universal life lesson does ${characterName}'s struggle teach anyone in modern life today?
Respond entirely in ${langName}.`;
    } else {
      system = SITUATION_PROMPT;
      temp = 0.82;
      user = `Character: ${characterName}
Character's story: ${storyContext}
The person's situation: "${userSituation}"
How does ${characterName}'s story mirror this struggle? What steps can they take?
Respond entirely in ${langName}.`;
    }

    const groqKey = context.env.GROQ_API_KEY;
    const geminiKey = context.env.GEMINI_API_KEY;

    if (!groqKey && !geminiKey) {
      return json({ success: false, error: "Story generation not configured" }, 500, cors);
    }

    /* English → Groq (fastest). Regional → Gemini, falling back to Groq.
       Character Q&A has always used Gemini regardless of language. */
    const useGemini = geminiKey && (kind === "character" || language !== "en");
    const story = useGemini
      ? await callGemini(system, user, temp, geminiKey)
      : await callGroq(system, user, temp, groqKey || geminiKey);

    return json({ success: true, story }, 200, cors);

  } catch (err) {
    console.error("story generation failed:", err);
    const msg = err instanceof Error ? err.message : "";
    /* Length-validation failures are the caller's fault, not ours. */
    if (msg.endsWith("too long")) {
      return json({ success: false, error: msg }, 413, cors);
    }
    return json({ success: false, error: "Story generation failed" }, 502, cors);
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  return new Response(null, { status: 204, headers: corsFor(origin) });
}
