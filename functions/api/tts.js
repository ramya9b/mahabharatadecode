/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — /api/tts
   Google Cloud Text-to-Speech, server-side.
   API key never exposed to browser.

   Returns base64 MP3; the browser turns it into a blob URL. Voice
   selection happens here so the caller can't request arbitrary
   voices or drive up cost with unbounded text.
───────────────────────────────────────────────────────────── */

/* Best WaveNet voices per language */
const VOICE_CONFIG = {
  en: { languageCode: "en-IN", name: "en-IN-Wavenet-D", ssmlGender: "MALE" },
  te: { languageCode: "te-IN", name: "te-IN-Standard-A", ssmlGender: "FEMALE" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-D", ssmlGender: "MALE" },
  kn: { languageCode: "kn-IN", name: "kn-IN-Standard-A", ssmlGender: "FEMALE" },
};

/* Google caps a single synthesize call at 5000 characters. */
const MAX_TEXT_CHARS = 5000;

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

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin") || "";
  const cors = corsFor(origin);

  try {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ success: false, error: "Forbidden" }, 403, cors);
    }

    const { text, language } = await context.request.json();

    if (typeof text !== "string" || !text.trim()) {
      return json({ success: false, error: "Missing text" }, 400, cors);
    }
    if (text.length > MAX_TEXT_CHARS) {
      return json({ success: false, error: "Text too long to speak" }, 413, cors);
    }

    const voice = VOICE_CONFIG[language] ?? VOICE_CONFIG.en;

    const GOOGLE_TTS_KEY = context.env.GOOGLE_TTS_KEY;
    if (!GOOGLE_TTS_KEY) {
      return json({ success: false, error: "Speech not configured" }, 500, cors);
    }

    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
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

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`Google TTS ${res.status}: ${detail.slice(0, 500)}`);
      return json({ success: false, error: "Speech service error" }, 502, cors);
    }

    const data = await res.json();
    if (!data.audioContent) {
      return json({ success: false, error: "Empty audio response" }, 502, cors);
    }

    return json({ success: true, audioContent: data.audioContent }, 200, cors);

  } catch (err) {
    console.error("tts failed:", err);
    return json({ success: false, error: "Server error" }, 500, cors);
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  return new Response(null, { status: 204, headers: corsFor(origin) });
}
