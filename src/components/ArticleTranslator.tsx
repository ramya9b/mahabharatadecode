import { useState, useCallback, useRef } from "react";
import { Languages, Loader, ChevronDown, Check } from "lucide-react";

/* ── Supported languages ─────────────────────────────────────────── */
export type LangCode = "en" | "te" | "hi" | "kn";

export const LANGUAGES: Record<LangCode, { label: string; native: string; flag: string }> = {
  en: { label: "English",  native: "English",  flag: "🇬🇧" },
  te: { label: "Telugu",   native: "తెలుగు",    flag: "🟡" },
  hi: { label: "Hindi",    native: "हिन्दी",    flag: "🇮🇳" },
  kn: { label: "Kannada",  native: "ಕನ್ನಡ",    flag: "🟠" },
};

/* ── Cache key per article+language ─────────────────────────────── */
const cacheKey = (slug: string, lang: LangCode) => `mbd_tx_${slug}_${lang}`;

/* ── System prompt for natural translations ──────────────────────── */
const buildPrompt = (lang: LangCode, title: string, content: string) => `
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

interface ArticleTranslatorProps {
  slug:    string;
  title:   string;
  content: string;           /* plain text version of article for translation */
  onTranslated: (lang: LangCode, translatedText: string) => void;
  currentLang:  LangCode;
  onLangChange: (lang: LangCode) => void;
}

const ArticleTranslator = ({
  slug,
  title,
  content,
  onTranslated,
  currentLang,
  onLangChange,
}: ArticleTranslatorProps) => {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState<LangCode | null>(null);
  const dropRef               = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(async (lang: LangCode) => {
    setOpen(false);

    if (lang === "en") {
      onLangChange("en");
      return;
    }

    /* Check localStorage cache first */
    try {
      const cached = localStorage.getItem(cacheKey(slug, lang));
      if (cached) {
        onTranslated(lang, cached);
        onLangChange(lang);
        return;
      }
    } catch (_) { /* localStorage unavailable */ }

    setLoading(lang);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [
            {
              role:    "user",
              content: buildPrompt(lang, title, content),
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const data       = await response.json();
      const translated = data?.content?.[0]?.text ?? "";

      if (!translated) throw new Error("Empty translation");

      /* Cache in localStorage — survives page refresh */
      try {
        localStorage.setItem(cacheKey(slug, lang), translated);
      } catch (_) { /* storage full */ }

      onTranslated(lang, translated);
      onLangChange(lang);
    } catch (err) {
      console.error("Translation failed:", err);
      /* Graceful fallback — stay on current language */
      alert(`Translation to ${LANGUAGES[lang].label} failed. Please try again.`);
    } finally {
      setLoading(null);
    }
  }, [slug, title, content, onTranslated, onLangChange]);

  const current = LANGUAGES[currentLang];

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Article language: ${current.label}. Click to change.`}
        className="btn-ripple"
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "7px",
          padding:        "8px 14px",
          borderRadius:   "99px",
          border:         "1px solid rgba(34,197,94,0.25)",
          background:     "rgba(34,197,94,0.06)",
          color:          "hsl(var(--foreground))",
          cursor:         "pointer",
          fontFamily:     "'Cinzel', serif",
          fontSize:       "12px",
          letterSpacing:  "0.06em",
          transition:     "all 0.2s",
          backdropFilter: "blur(8px)",
        }}
      >
        {loading ? (
          <Loader size={13} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} aria-hidden="true" />
        ) : (
          <Languages size={13} aria-hidden="true" style={{ flexShrink: 0 }} />
        )}
        <span>{current.flag} {current.native}</span>
        <ChevronDown
          size={11}
          aria-hidden="true"
          style={{
            transition: "transform 0.2s",
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Select article language"
          style={{
            position:     "absolute",
            top:          "calc(100% + 6px)",
            left:         0,
            minWidth:     "160px",
            borderRadius: "12px",
            border:       "1px solid rgba(34,197,94,0.2)",
            background:   "hsl(var(--card))",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.2)",
            zIndex:       100,
            overflow:     "hidden",
            animation:    "fade-in 0.15s ease",
          }}
        >
          {(Object.entries(LANGUAGES) as [LangCode, typeof LANGUAGES[LangCode]][]).map(
            ([code, meta]) => (
              <button
                key={code}
                role="option"
                aria-selected={currentLang === code}
                onClick={() => handleSelect(code)}
                disabled={loading !== null}
                style={{
                  width:          "100%",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  gap:            "8px",
                  padding:        "11px 16px",
                  border:         "none",
                  background:     currentLang === code
                    ? "rgba(34,197,94,0.1)"
                    : "transparent",
                  cursor:         loading !== null ? "wait" : "pointer",
                  transition:     "background 0.15s",
                  textAlign:      "left",
                }}
                onMouseEnter={e => {
                  if (currentLang !== code)
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.06)";
                }}
                onMouseLeave={e => {
                  if (currentLang !== code)
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{meta.flag}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: "11px", color: "hsl(var(--foreground))", letterSpacing: "0.06em" }}>
                      {meta.label}
                    </span>
                    <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
                      {meta.native}
                    </span>
                  </span>
                </span>
                {loading === code ? (
                  <Loader size={12} style={{ animation: "spin 1s linear infinite", color: "hsl(var(--primary))", flexShrink: 0 }} />
                ) : currentLang === code ? (
                  <Check size={12} style={{ color: "hsl(var(--primary))", flexShrink: 0 }} aria-hidden="true" />
                ) : null}
              </button>
            )
          )}
          <div style={{ padding: "8px 16px 10px", borderTop: "1px solid rgba(34,197,94,0.1)" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "11px", color: "hsl(var(--muted-foreground))", margin: 0, lineHeight: 1.5 }}>
              Translations are AI-powered and cached locally.
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default ArticleTranslator;

/* ── Helper: extract plain text from article content blocks ──────── */
export const extractPlainText = (
  title: string,
  content: Array<{ type: string; text: string }>,
  lifeLessons?: string[],
): string => {
  const parts: string[] = [`# ${title}\n`];
  content.forEach(block => {
    if (block.type === "heading")   parts.push(`\n## ${block.text}\n`);
    else if (block.text)            parts.push(block.text);
  });
  if (lifeLessons?.length) {
    parts.push("\n## Key Lessons");
    lifeLessons.forEach(l => parts.push(`- ${l}`));
  }
  return parts.join("\n");
};
