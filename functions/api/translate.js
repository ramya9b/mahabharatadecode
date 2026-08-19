/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — /translate
   Proxies article translation to the Anthropic API server-side.
   API key never exposed to browser.

   The prompt is built here rather than accepted from the client:
   a caller who can supply arbitrary prompt text can use this
   endpoint as a free LLM billed to us. The client sends only the
   article to translate and the target language.
───────────────────────────────────────────────────────────── */

const MODEL = "claude-opus-5";

/* Only these may be requested; "en" is the source and never translated. */
const LANGUAGES = {
  te: { label: "Telugu",  native: "తెలుగు" },
  hi: { label: "Hindi",   native: "हिन्दी" },
  kn: { label: "Kannada", native: "ಕನ್ನಡ" },
};

/* Roughly 3000 words of article plus headroom. Anything larger is not
   one of our articles, so reject rather than pay to translate it. */
const MAX_CONTENT_CHARS = 40000;
const MAX_TITLE_CHARS = 300;

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

const buildPrompt = (lang, title, content) => `
You are a skilled literary translator specialising in Indian mythology and philosophy.

Translate the following Mahabharata article into ${LANGUAGES[lang].label} (${LANGUAGES[lang].native}).

CRITICAL RULES:
- Translate naturally — as if a native ${LANGUAGES[lang].label} speaker wrote this originally
- Do NOT translate word-for-word — translate meaning and tone
- Keep Sanskrit terms (dharma, karma, yoga, arjuna, krishna etc.) in their original form
- Keep the same emotional register — conversational, direct, human
- Keep all paragraph breaks exactly as in the original
- Do not add any preamble like "Here is the translation" — just give the translated text

Article title: ${title}

Article content:
${content}
`.trim();

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin") || "";
  const cors = corsFor(origin);

  try {
    /* Reject cross-site callers outright — this endpoint costs money per
       request, so it is not open the way /subscribe is. */
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { status: 403, headers: cors }
      );
    }

    const { lang, title, content } = await context.request.json();

    if (!lang || !Object.prototype.hasOwnProperty.call(LANGUAGES, lang)) {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported language" }),
        { status: 400, headers: cors }
      );
    }

    if (typeof content !== "string" || !content.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing content" }),
        { status: 400, headers: cors }
      );
    }

    if (content.length > MAX_CONTENT_CHARS || (title || "").length > MAX_TITLE_CHARS) {
      return new Response(
        JSON.stringify({ success: false, error: "Content too long" }),
        { status: 413, headers: cors }
      );
    }

    const ANTHROPIC_API_KEY = context.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Translation not configured" }),
        { status: 500, headers: cors }
      );
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        /* Translation is mechanical; low effort keeps latency and cost down.
           Thinking is left on (the default) — disabling it on this model can
           leak <thinking> tags into the visible text, which would end up in
           the translated article. */
        output_config: { effort: "low" },
        messages: [
          { role: "user", content: buildPrompt(lang, String(title || "").trim(), content) },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`Anthropic API ${res.status}: ${detail.slice(0, 500)}`);
      return new Response(
        JSON.stringify({ success: false, error: "Translation service error" }),
        { status: 502, headers: cors }
      );
    }

    const data = await res.json();

    /* Safety classifiers can decline a request: HTTP 200 with an empty or
       partial content array. Check before reading content. */
    if (data.stop_reason === "refusal") {
      return new Response(
        JSON.stringify({ success: false, error: "Translation declined" }),
        { status: 422, headers: cors }
      );
    }

    const translated = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!translated) {
      return new Response(
        JSON.stringify({ success: false, error: "Empty translation" }),
        { status: 502, headers: cors }
      );
    }

    /* stop_reason "max_tokens" means the article outgrew the output budget;
       a silently truncated translation would look like a complete one. */
    if (data.stop_reason === "max_tokens") {
      return new Response(
        JSON.stringify({ success: false, error: "Article too long to translate" }),
        { status: 502, headers: cors }
      );
    }

    return new Response(
      JSON.stringify({ success: true, translated }),
      { status: 200, headers: cors }
    );

  } catch (err) {
    console.error("translate failed:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: cors }
    );
  }
}

/* Handle CORS preflight */
export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  return new Response(null, { status: 204, headers: corsFor(origin) });
}
