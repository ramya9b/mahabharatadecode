/* ─────────────────────────────────────────────
   Google Cloud Text-to-Speech Service
   Supports: English (Indian), Telugu, Hindi, Kannada
   Free tier: 1 million chars/month (WaveNet)
   Works on ALL devices — no installs needed
───────────────────────────────────────────── */

export type Language = "en" | "te" | "hi" | "kn";

/* Best WaveNet voices per language */
const VOICE_CONFIG: Record<Language, { languageCode: string; name: string; ssmlGender: string }> = {
  en: { languageCode: "en-IN", name: "en-IN-Wavenet-D", ssmlGender: "MALE"   },
  te: { languageCode: "te-IN", name: "te-IN-Standard-A", ssmlGender: "FEMALE" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-D", ssmlGender: "MALE"   },
  kn: { languageCode: "kn-IN", name: "kn-IN-Standard-A", ssmlGender: "FEMALE" },
};

/* Simple in-memory cache — avoid re-fetching same text */
const audioCache = new Map<string, string>();

export async function synthesizeSpeech(
  text: string,
  language: Language
): Promise<{ audioUrl: string; error?: string }> {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;

  if (!apiKey) {
    return { audioUrl: "", error: "Google TTS API key not configured." };
  }

  /* Check cache first */
  const cacheKey = `${language}:${text.slice(0, 100)}`;
  if (audioCache.has(cacheKey)) {
    return { audioUrl: audioCache.get(cacheKey)! };
  }

  const voice = VOICE_CONFIG[language] ?? VOICE_CONFIG.en;

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
            ssmlGender: voice.ssmlGender,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: language === "te" || language === "kn" ? 0.9 : 0.95,
            pitch: 0.0,
            volumeGainDb: 2.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `TTS API error ${response.status}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    if (!audioContent) throw new Error("Empty audio response");

    /* Convert base64 to blob URL */
    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob     = new Blob([bytes], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);

    /* Cache it */
    audioCache.set(cacheKey, audioUrl);

    return { audioUrl };
  } catch (err) {
    return {
      audioUrl: "",
      error: err instanceof Error ? err.message : "TTS failed",
    };
  }
}
