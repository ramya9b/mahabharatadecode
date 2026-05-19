/* ─────────────────────────────────────────────
   Gemini Story Service — MahabharataDecoded
   Uses gemini-1.5-flash free tier
───────────────────────────────────────────── */

export type Tone = "epic" | "devotional" | "kids" | "philosophical";
export type Language = "en" | "te" | "hi" | "kn";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  te: "Telugu",
  hi: "Hindi",
  kn: "Kannada",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  epic:
    "Narrate in a bold, cinematic, dramatic style using clear modern English — like a blockbuster film narration. Use vivid imagery and tension. NO archaic words like 'hearken', 'beget', 'thee', 'thus' or 'O seeker'. Speak directly to the reader.",
  devotional:
    "Narrate in a warm, spiritual, devotional tone — like a loving Harikatha performance. Use simple heartfelt language. Evoke bhakti and divine love. Accessible to everyone.",
  kids:
    "Narrate in a simple, fun, engaging style for children aged 8–12. Use very short sentences, relatable comparisons, and gentle drama. No complex words at all.",
  philosophical:
    "Narrate with deep philosophical insight in clear modern English. Explore the Dharma, Karma, and moral complexity. Connect the story to everyday life lessons people can relate to.",
};

const SYSTEM_PROMPT = `You are a master storyteller of the Mahabharata — you know every character, every event, every emotion of this great epic intimately.

Write like a master poet. Every line must pierce the heart. Be dramatic, cinematic, emotionally devastating — but NEVER use archaic words like "hearken", "beget", "thee", "thou", "thus", "hath", "O seeker", "O listener".

Rules you MUST follow:
- Write EXACTLY 5 to 6 lines — no more, no less
- Every single line must be emotionally powerful and unforgettable
- Make the reader feel something deep — sorrow, awe, pride, heartbreak, wonder
- Use vivid imagery — paint a picture in the reader's mind
- The LAST line must be the most powerful — a truth or moral that stays forever
- Use clear modern language a 16-year-old instantly understands
- NO filler lines — every line earns its place
- Stay faithful to Mahabharata canon — never invent events
- CRITICAL: Keep total response under 120 words in English, under 100 words in Telugu/Hindi/Kannada
- CRITICAL: ALWAYS complete the last sentence fully — never stop mid-sentence
- Respond ONLY in the language specified — Telugu story in Telugu script, Hindi in Hindi script`;

export interface StoryRequest {
  characterName: string;
  prompt: string;
  tone: Tone;
  language: Language;
}

export interface StoryResponse {
  story: string;
  error?: string;
}

export async function generateStory(req: StoryRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      story: "",
      error: "Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.",
    };
  }

  const langName = LANGUAGE_NAMES[req.language];
  const toneInstr = TONE_INSTRUCTIONS[req.tone];

  const userMessage = `Character: ${req.characterName}
Story Request: ${req.prompt}
Tone: ${toneInstr}
Language: Respond entirely in ${langName}. Do not mix languages.

Now narrate this story.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 8000,
            topP: 0.95,
          },
          thinkingConfig: { thinkingBudget: 0 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const story = candidate?.content?.parts?.[0]?.text ?? "";
    const finishReason = candidate?.finishReason ?? "";

    if (!story) throw new Error("Empty response from Gemini");

    // Detect truncation — if stopped due to MAX_TOKENS, append ellipsis
    if (finishReason === "MAX_TOKENS") {
      // Find last complete sentence
      const lastPunct = Math.max(
        story.lastIndexOf("।"), story.lastIndexOf("."),
        story.lastIndexOf("!"), story.lastIndexOf("?")
      );
      const cleanStory = lastPunct > story.length * 0.5
        ? story.slice(0, lastPunct + 1)
        : story;
      return { story: cleanStory };
    }

    return { story };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { story: "", error: message };
  }
}

/* ─────────────────────────────────────────────
   Life Lesson — Generic (Approach A)
   How this character's struggle applies to any
   person's life today
───────────────────────────────────────────── */

const LIFE_LESSON_PROMPT = `You are a life coach and Mahabharata scholar who helps people find meaning in ancient stories for their modern lives.

When given a character and their story, explain:
1. What universal human struggle this character represents
2. What kind of person today would face the same struggle
3. The ONE powerful lesson from this character's life that anyone can apply TODAY

Rules:
- Write in clear, warm, modern language — like a wise friend talking to you
- MAXIMUM 5 lines — powerful and concise, no padding
- Make it deeply relatable — the reader must feel "this is about ME"
- End with one actionable truth the person can carry with them today
- NO mythology jargon — connect it directly to modern life
- CRITICAL: Keep total response under 100 words in Telugu/Hindi/Kannada, under 120 words in English
- CRITICAL: ALWAYS complete your last sentence — never stop mid-word or mid-sentence
- Respond ONLY in the language specified`;

export interface LifeLessonRequest {
  characterName: string;
  storyContext: string;
  language: Language;
}

export async function generateLifeLesson(req: LifeLessonRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { story: "", error: "API key not configured." };

  const langName = LANGUAGE_NAMES[req.language];

  const userMessage = `Character: ${req.characterName}
Story context: ${req.storyContext}

Based on this story, what universal life lesson does ${req.characterName}'s struggle teach anyone facing a similar situation in modern life today?
Respond entirely in ${langName}.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: LIFE_LESSON_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 8000, topP: 0.95 },
          thinkingConfig: { thinkingBudget: 0 },
        }),
      }
    );
    const data = await response.json();
    const story = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!story) throw new Error("Empty response");
    return { story };
  } catch (err: unknown) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ─────────────────────────────────────────────
   My Situation — Personalised (Approach B)
   User describes their struggle → AI connects
   it to the character's story + gives guidance
───────────────────────────────────────────── */

const MY_SITUATION_PROMPT = `You are a compassionate life coach and Mahabharata scholar who helps people navigate their personal struggles using the wisdom of the epic.

When a person shares their current life situation, you:
1. Show them how their struggle mirrors a character's journey in the Mahabharata
2. Tell them what that character did — and what it cost them when they ignored their dharma
3. Give them 2 to 3 clear, practical steps they can take RIGHT NOW
4. End with a powerful truth from the character's life that directly applies to their situation

Rules:
- Speak directly to the person — warm, honest, like a trusted mentor
- Never be preachy or lecture-like
- Be specific — address THEIR exact situation, not generic advice
- MAXIMUM 6 lines — enough to feel complete but not overwhelming
- Make them feel understood, not judged
- CRITICAL: Keep total response under 150 words in Telugu/Hindi/Kannada
- CRITICAL: ALWAYS complete your last sentence — never stop mid-word or mid-sentence
- Respond ONLY in the language specified`;

export interface MySituationRequest {
  characterName: string;
  storyContext: string;
  userSituation: string;
  language: Language;
}

export async function generateMySituation(req: MySituationRequest): Promise<StoryResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { story: "", error: "API key not configured." };

  const langName = LANGUAGE_NAMES[req.language];

  const userMessage = `Character: ${req.characterName}
Character's story: ${req.storyContext}

The person's current situation: "${req.userSituation}"

How does ${req.characterName}'s story directly mirror this person's struggle? What can they learn and what specific steps can they take?
Respond entirely in ${langName}.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: MY_SITUATION_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.82, maxOutputTokens: 8000, topP: 0.95 },
          thinkingConfig: { thinkingBudget: 0 },
        }),
      }
    );
    const data = await response.json();
    const story = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!story) throw new Error("Empty response");
    return { story };
  } catch (err: unknown) {
    return { story: "", error: err instanceof Error ? err.message : "Unknown error" };
  }
}
