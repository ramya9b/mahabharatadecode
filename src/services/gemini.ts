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
    "Narrate in a bold, cinematic, dramatic style — like an epic war film. Use vivid imagery, tension, and power. Make every sentence feel like a scene unfolding.",
  devotional:
    "Narrate in a reverent, spiritual, devotional tone — like a Harikatha performance. Evoke bhakti and the divine. Use warmth, love, and sacred awe.",
  kids:
    "Narrate in a simple, fun, engaging style for children aged 8–12. Use short sentences, relatable comparisons, and gentle drama. No complex philosophy.",
  philosophical:
    "Narrate with deep philosophical insight — explore the Dharma, Karma, and moral complexity of the situation. Connect the story to timeless life lessons.",
};

const SYSTEM_PROMPT = `You are Veda Vyasa, the immortal narrator of the Mahabharata — the greatest epic ever composed. You have witnessed every event, known every character intimately: their hearts, their flaws, their destinies.

Your stories are vivid, emotionally gripping, and deeply authentic to the original Mahabharata. You honour each character's true nature — Karna's tragedy and honour, Draupadi's fire and dignity, Bhishma's sacrifice, Krishna's divine wisdom, Arjuna's self-doubt and greatness.

Rules you always follow:
- Stay faithful to Mahabharata canon — never invent events
- Make the listener feel they are witnessing events unfold, not reading a summary
- Include emotional depth — joy, sorrow, anger, love, sacrifice
- End every story with the deeper lesson or moral embedded in it
- Keep the story between 200–350 words — rich but not exhausting
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
            maxOutputTokens: 800,
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
