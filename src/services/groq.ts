/* ─────────────────────────────────────────────
   Groq Story Service — MahabharataDecoded
   Model: llama-3.3-70b-versatile (free tier)
   Fast inference — near instant responses
───────────────────────────────────────────── */

export type Tone = "epic" | "devotional" | "kids" | "philosophical";
export type Language = "en" | "te" | "hi" | "kn";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English", te: "Telugu", hi: "Hindi", kn: "Kannada",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  epic: "Narrate in a bold, cinematic, dramatic style using clear modern English — like a blockbuster film narration. Use vivid imagery and tension. NO archaic words. Speak directly to the reader.",
  devotional: "Narrate in a warm, spiritual, devotional tone — like a loving Harikatha. Use simple heartfelt language. Evoke bhakti and divine love.",
  kids: "Narrate in a simple, fun style for children aged 8–12. Use very short sentences and relatable comparisons. No complex words.",
  philosophical: "Narrate with deep philosophical insight in clear modern English. Explore Dharma, Karma, and moral complexity. Connect to everyday life.",
};

const SYSTEM_PROMPT = `You are a master storyteller of the Mahabharata.

Write like a master poet. Every line must pierce the heart. Be dramatic, cinematic, emotionally devastating. NEVER use archaic words like "hearken", "beget", "thee", "thou", "thus", "hath", "O seeker".

Rules:
- Write EXACTLY 5 to 6 lines — no more, no less
- Every line must be emotionally powerful and unforgettable
- The LAST line must be the most powerful moral truth
- Use clear modern language a 16-year-old understands
- Stay faithful to Mahabharata canon — never invent events
- Keep total response under 120 words in English, under 100 words in Telugu/Hindi/Kannada
- ALWAYS complete the last sentence — never stop mid-sentence
- Respond ONLY in the language specified — Telugu in Telugu script, Hindi in Devanagari, Kannada in Kannada script
- Do NOT include any preamble, explanation or commentary — ONLY the story`;

const LIFE_LESSON_PROMPT = `You are a life coach and Mahabharata scholar.

Rules:
- MAXIMUM 5 lines — powerful and concise
- Make it deeply relatable — the reader must feel "this is about ME"
- End with one actionable truth they can use today
- NO mythology jargon — connect to modern life directly
- Keep under 100 words in Telugu/Hindi/Kannada, under 120 in English
- ALWAYS complete your last sentence
- Respond ONLY in the language specified
- Do NOT include any preamble or commentary — ONLY the lesson`;

const MY_SITUATION_PROMPT = `You are a compassionate life coach and Mahabharata scholar.

Rules:
- Speak directly to the person — warm, honest, like a trusted mentor
- MAXIMUM 6 lines
- Give 2 to 3 clear practical steps they can take RIGHT NOW
- End with a powerful truth from the character that applies directly
- Keep under 150 words in Telugu/Hindi/Kannada
- ALWAYS complete your last sentence
- Respond ONLY in the language specified
- Do NOT include any preamble or commentary — ONLY the guidance`;

export interface StoryRequest { characterName: string; prompt: string; tone: Tone; language: Language; }
export interface StoryResponse { story: string; error?: string; }
export interface LifeLessonRequest { characterName: string; storyContext: string; language: Language; }
export interface MySituationRequest { characterName: string; storyContext: string; userSituation: string; language: Language; }

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .trim();
}

async function callGroq(
  systemPrompt: string,
  userMessage: string,
  temperature: number,
  apiKey: string
): Promise<StoryResponse> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
      temperature,
      max_tokens: 1024,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const story = data?.choices?.[0]?.message?.content ?? "";

  if (!story) throw new Error("Empty response from Groq");

  return { story: cleanText(story) };
}

/* ── Story ── */
export async function generateStory(req: StoryRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return { story: "", error: "Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file. Get free key at console.groq.com" };

  const userMessage = `Character: ${req.characterName}
Story Request: ${req.prompt}
Tone: ${TONE_INSTRUCTIONS[req.tone]}
Language: Respond entirely in ${LANGUAGE_NAMES[req.language]}. Do not mix languages.
Now narrate this story.`;

  try {
    return await callGroq(SYSTEM_PROMPT, userMessage, 0.85, apiKey);
  } catch (err) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ── Life Lesson ── */
export async function generateLifeLesson(req: LifeLessonRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return { story: "", error: "Groq API key not configured." };

  const userMessage = `Character: ${req.characterName}
Story context: ${req.storyContext}
What universal life lesson does ${req.characterName}'s struggle teach anyone facing a similar situation in modern life today?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;

  try {
    return await callGroq(LIFE_LESSON_PROMPT, userMessage, 0.8, apiKey);
  } catch (err) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ── My Situation ── */
export async function generateMySituation(req: MySituationRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return { story: "", error: "Groq API key not configured." };

  const userMessage = `Character: ${req.characterName}
Character's story: ${req.storyContext}
The person's situation: "${req.userSituation}"
How does ${req.characterName}'s story mirror this person's struggle? What specific steps can they take?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;

  try {
    return await callGroq(MY_SITUATION_PROMPT, userMessage, 0.82, apiKey);
  } catch (err) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}
