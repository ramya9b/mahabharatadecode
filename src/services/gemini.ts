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
            maxOutputTokens: 600,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const story = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!story) throw new Error("Empty response from Gemini");

    return { story };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { story: "", error: message };
  }
}
