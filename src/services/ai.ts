/* ─────────────────────────────────────────────
   Smart AI Router — MahabharataDecoded
   English  → Groq  (llama-3.3-70b) — instant
   Regional → Gemini (2.5-flash-lite) — best quality
───────────────────────────────────────────── */

export type Tone = "epic" | "devotional" | "kids" | "philosophical";
export type Language = "en" | "te" | "hi" | "kn";
export interface StoryRequest     { characterName: string; prompt: string; tone: Tone; language: Language; }
export interface StoryResponse    { story: string; error?: string; }
export interface LifeLessonRequest { characterName: string; storyContext: string; language: Language; }
export interface MySituationRequest { characterName: string; storyContext: string; userSituation: string; language: Language; }

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English", te: "Telugu", hi: "Hindi", kn: "Kannada",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  epic:          "Narrate in a bold, cinematic, dramatic style — like a blockbuster film. Use vivid imagery. NO archaic words. Speak directly to the reader.",
  devotional:    "Narrate in a warm, spiritual, devotional tone — like a Harikatha. Evoke bhakti and divine love. Simple heartfelt language.",
  kids:          "Narrate in a simple, fun style for children aged 8–12. Very short sentences. No complex words.",
  philosophical: "Narrate with deep philosophical insight. Explore Dharma, Karma. Clear modern English. Connect to everyday life.",
};

/* ── Prompts ── */
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

/* ── Text cleaner ── */
function clean(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .trim();
}

/* ── Groq caller (English) ── */
async function callGroq(system: string, user: string, temp: number, apiKey: string): Promise<StoryResponse> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
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
  return { story: clean(story) };
}

/* ── Gemini caller (Regional languages) ── */
async function callGemini(system: string, user: string, temp: number, apiKey: string): Promise<StoryResponse> {
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
  // Trim at last complete sentence if truncated
  if (candidate?.finishReason === "MAX_TOKENS") {
    const last = Math.max(story.lastIndexOf("।"), story.lastIndexOf("."), story.lastIndexOf("!"), story.lastIndexOf("?"));
    if (last > story.length * 0.5) story = story.slice(0, last + 1);
  }
  return { story: clean(story) };
}

/* ── Smart Router ── */
async function callAI(system: string, user: string, temp: number, language: Language): Promise<StoryResponse> {
  const groqKey   = import.meta.env.VITE_GROQ_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // English → Groq (fastest)
  if (language === "en") {
    if (!groqKey) return { story: "", error: "Add VITE_GROQ_API_KEY to Cloudflare environment variables. Get free key at console.groq.com" };
    return callGroq(system, user, temp, groqKey);
  }

  // Regional → Gemini (best quality)
  if (!geminiKey) {
    // Fallback to Groq if Gemini key missing
    if (!groqKey) return { story: "", error: "Add VITE_GROQ_API_KEY or VITE_GEMINI_API_KEY to Cloudflare environment variables." };
    return callGroq(system, user, temp, groqKey);
  }
  return callGemini(system, user, temp, geminiKey);
}

/* ── Public API ── */
export async function generateStory(req: StoryRequest): Promise<StoryResponse> {
  const user = `Character: ${req.characterName}
Story Request: ${req.prompt}
Tone: ${TONE_INSTRUCTIONS[req.tone]}
Language: Respond entirely in ${LANGUAGE_NAMES[req.language]}. Do not mix languages.
Now narrate this story.`;
  try { return await callAI(STORY_PROMPT, user, 0.85, req.language); }
  catch (err) { return { story: "", error: err instanceof Error ? err.message : "Unknown error" }; }
}

export async function generateLifeLesson(req: LifeLessonRequest): Promise<StoryResponse> {
  const user = `Character: ${req.characterName}
Story context: ${req.storyContext}
What universal life lesson does ${req.characterName}'s struggle teach anyone in modern life today?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;
  try { return await callAI(LESSON_PROMPT, user, 0.8, req.language); }
  catch (err) { return { story: "", error: err instanceof Error ? err.message : "Unknown error" }; }
}

export async function generateMySituation(req: MySituationRequest): Promise<StoryResponse> {
  const user = `Character: ${req.characterName}
Character's story: ${req.storyContext}
The person's situation: "${req.userSituation}"
How does ${req.characterName}'s story mirror this struggle? What steps can they take?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;
  try { return await callAI(SITUATION_PROMPT, user, 0.82, req.language); }
  catch (err) { return { story: "", error: err instanceof Error ? err.message : "Unknown error" }; }
}
