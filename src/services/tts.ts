/* ─────────────────────────────────────────────
   Text-to-Speech client — MahabharataDecoded
   Supports: English (Indian), Telugu, Hindi, Kannada

   Synthesis runs in the /api/tts function, which holds the Google
   key and picks the voice. The browser sends text plus a language
   and gets back base64 MP3 to play.
───────────────────────────────────────────── */

export type Language = "en" | "te" | "hi" | "kn";

const TTS_ENDPOINT = "/api/tts";

/* Simple in-memory cache — avoid re-fetching same text */
const audioCache = new Map<string, string>();

export async function synthesizeSpeech(
  text: string,
  language: Language
): Promise<{ audioUrl: string; error?: string }> {
  /* Check cache first */
  const cacheKey = `${language}:${text.slice(0, 100)}`;
  if (audioCache.has(cacheKey)) {
    return { audioUrl: audioCache.get(cacheKey)! };
  }

  try {
    const response = await fetch(TTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success) {
      throw new Error(data?.error || `TTS failed (${response.status})`);
    }

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
