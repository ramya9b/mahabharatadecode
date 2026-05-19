/* ─────────────────────────────────────────────
   Gemini Story Service — MahabharataDecoded
   Model: gemini-2.0-flash-lite (free, no thinking overhead)
───────────────────────────────────────────── */

export type Tone = "epic" | "devotional" | "kids" | "philosophical";
export type Language = "en" | "te" | "hi" | "kn";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English", te: "Telugu", hi: "Hindi", kn: "Kannada",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  epic: "Narrate in a bold, cinematic, dramatic style using clear modern English — like a blockbuster film narration. Use vivid imagery and tension. NO archaic words like 'hearken', 'beget', 'thee', 'thus' or 'O seeker'. Speak directly to the reader.",
  devotional: "Narrate in a warm, spiritual, devotional tone — like a loving Harikatha performance. Use simple heartfelt language. Evoke bhakti and divine love. Accessible to everyone.",
  kids: "Narrate in a simple, fun, engaging style for children aged 8–12. Use very short sentences, relatable comparisons, and gentle drama. No complex words at all.",
  philosophical: "Narrate with deep philosophical insight in clear modern English. Explore the Dharma, Karma, and moral complexity. Connect the story to everyday life lessons people can relate to.",
};

const SYSTEM_PROMPT = `You are a master storyteller of the Mahabharata.

Write like a master poet. Every line must pierce the heart. Be dramatic, cinematic, emotionally devastating. NEVER use archaic words like "hearken", "beget", "thee", "thou", "thus", "hath", "O seeker", "O listener".

Rules:
- Write EXACTLY 5 to 6 lines — no more, no less
- Every line must be emotionally powerful and unforgettable
- The LAST line must be the most powerful moral truth
- Use clear modern language a 16-year-old understands
- Stay faithful to Mahabharata canon — never invent events
- Keep total response under 120 words in English, under 100 words in Telugu/Hindi/Kannada
- ALWAYS complete the last sentence — never stop mid-sentence
- Respond ONLY in the language specified`;

export interface StoryRequest { characterName: string; prompt: string; tone: Tone; language: Language; }
export interface StoryResponse { story: string; error?: string; }

const MODEL = "gemini-2.0-flash-lite";
const API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .trim();
}

function trimAtLastSentence(text: string): string {
  const lastPunct = Math.max(
    text.lastIndexOf("।"), text.lastIndexOf("."),
    text.lastIndexOf("!"), text.lastIndexOf("?")
  );
  return lastPunct > text.length * 0.5 ? text.slice(0, lastPunct + 1) : text;
}

async function callGemini(systemPrompt: string, userMessage: string, temperature: number, apiKey: string): Promise<StoryResponse> {
  const response = await fetch(`${API_BASE}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { temperature, maxOutputTokens: 4096, topP: 0.95 },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  let story = candidate?.content?.parts?.[0]?.text ?? "";

  if (!story) throw new Error("Empty response from Gemini");

  if (candidate?.finishReason === "MAX_TOKENS") {
    story = trimAtLastSentence(story);
  }

  return { story: cleanMarkdown(story) };
}

export async function generateStory(req: StoryRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { story: "", error: "Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file." };

  const userMessage = `Character: ${req.characterName}
Story Request: ${req.prompt}
Tone: ${TONE_INSTRUCTIONS[req.tone]}
Language: Respond entirely in ${LANGUAGE_NAMES[req.language]}. Do not mix languages.
Now narrate this story.`;

  try {
    return await callGemini(SYSTEM_PROMPT, userMessage, 0.85, apiKey);
  } catch (err: unknown) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ── Life Lesson (Approach A) ── */
const LIFE_LESSON_PROMPT = `You are a life coach and Mahabharata scholar.

Rules:
- MAXIMUM 5 lines — powerful and concise
- Make it deeply relatable — the reader must feel "this is about ME"
- End with one actionable truth they can use today
- NO mythology jargon — connect to modern life directly
- Keep under 100 words in Telugu/Hindi/Kannada, under 120 in English
- ALWAYS complete your last sentence
- Respond ONLY in the language specified`;

export interface LifeLessonRequest { characterName: string; storyContext: string; language: Language; }

export async function generateLifeLesson(req: LifeLessonRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { story: "", error: "API key not configured." };

  const userMessage = `Character: ${req.characterName}
Story context: ${req.storyContext}

What universal life lesson does ${req.characterName}'s struggle teach anyone facing a similar situation in modern life today?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;

  try {
    return await callGemini(LIFE_LESSON_PROMPT, userMessage, 0.8, apiKey);
  } catch (err: unknown) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ── My Situation (Approach B) ── */
const MY_SITUATION_PROMPT = `You are a compassionate life coach and Mahabharata scholar.

Rules:
- Speak directly to the person — warm, honest, like a trusted mentor
- MAXIMUM 6 lines
- Give 2 to 3 clear practical steps they can take RIGHT NOW
- End with a powerful truth from the character that applies directly
- Keep under 150 words in Telugu/Hindi/Kannada
- ALWAYS complete your last sentence
- Respond ONLY in the language specified`;

export interface MySituationRequest { characterName: string; storyContext: string; userSituation: string; language: Language; }

export async function generateMySituation(req: MySituationRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { story: "", error: "API key not configured." };

  const userMessage = `Character: ${req.characterName}
Character's story: ${req.storyContext}
The person's situation: "${req.userSituation}"

How does ${req.characterName}'s story mirror this person's struggle? What specific steps can they take?
Respond entirely in ${LANGUAGE_NAMES[req.language]}.`;

  try {
    return await callGemini(MY_SITUATION_PROMPT, userMessage, 0.82, apiKey);
  } catch (err: unknown) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}
