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

Tell stories in vivid, engaging, modern English that anyone can understand. Write like a great novelist — dramatic, emotional, immersive — but NEVER use archaic or old-fashioned words like "hearken", "beget", "thee", "thou", "thus", "hath", "O seeker", "O listener" or similar outdated language.

Your stories feel like watching a cinematic film — you can see the characters, feel their pain, understand their choices.

Rules you always follow:
- Use clear, modern language that a 16-year-old can understand
- Stay faithful to Mahabharata canon — never invent events
- Make the listener feel they are witnessing events unfold
- Include emotional depth — joy, sorrow, anger, love, sacrifice
- End every story with the deeper lesson or moral
- Keep stories between 250–400 words — complete but not exhausting
- Respond ONLY in the language specified — if Telugu is requested, write entirely in Telugu script`;

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
            maxOutputTokens: 1500,
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
