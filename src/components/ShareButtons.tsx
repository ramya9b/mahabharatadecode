import { useState, useCallback } from "react";
import { Link2, Check, Twitter, MessageCircle, Linkedin, Share2 } from "lucide-react";

interface ShareButtonsProps {
  url:         string;
  title:       string;
  description?: string;
  compact?:    boolean;
}

type Platform  = "twitter" | "whatsapp" | "linkedin" | "copy";
type CopyState = "idle" | "copying" | "success" | "error";

/* ── Build share URLs ─────────────────────────────────────────────── */
function buildShareUrl(
  platform: Platform,
  url:      string,
  title:    string,
  desc?:    string
): string {
  const encoded      = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  /* WhatsApp — crafted message optimised for Indian family groups */
  if (platform === "whatsapp") {
    const waText = encodeURIComponent(
      `📖 *${title}*\n\n${desc ? desc + "\n\n" : ""}Read the full story here 👇\n${url}\n\n_MahabharataDecoded — Ancient Wisdom for Modern Life_`
    );
    /* wa.me opens WhatsApp directly on mobile; web.whatsapp.com on desktop */
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isMobile
      ? `https://wa.me/?text=${waText}`
      : `https://web.whatsapp.com/send?text=${waText}`;
  }

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(`${title}${desc ? ` — ${desc}` : ""}`)}&via=MBDStories`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}&title=${encodedTitle}`;
    default:
      return "";
  }
}

/* ── Floating WhatsApp CTA — bottom-right corner on article pages ── */
export const WhatsAppFloat = ({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  const waUrl = buildShareUrl("whatsapp", url, title, description);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share this article on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "fixed",
        bottom:         "88px",           /* above BackToTop button */
        right:          "20px",
        zIndex:         49,
        display:        "flex",
        alignItems:     "center",
        gap:            "8px",
        padding:        hovered ? "10px 18px 10px 14px" : "12px",
        borderRadius:   "9999px",
        background:     "#25D366",
        boxShadow:      hovered
          ? "0 8px 32px rgba(37,211,102,0.55)"
          : "0 4px 20px rgba(37,211,102,0.35)",
        transition:     "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform:      hovered ? "scale(1.06)" : "scale(1)",
        textDecoration: "none",
        overflow:       "hidden",
        maxWidth:       hovered ? "200px" : "48px",
        whiteSpace:     "nowrap",
      }}
    >
      {/* WhatsApp SVG — more recognisable than lucide MessageCircle */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

      {/* Expanded label — only visible on hover */}
      <span
        style={{
          color:        "white",
          fontSize:     "13px",
          fontFamily:   "'Cinzel', serif",
          fontWeight:   600,
          letterSpacing:"0.05em",
          opacity:      hovered ? 1 : 0,
          maxWidth:     hovered ? "140px" : "0",
          transition:   "opacity 0.2s ease, max-width 0.3s ease",
          overflow:     "hidden",
        }}
      >
        Share on WhatsApp
      </span>
    </a>
  );
};

/* ── Inline share bar (existing + improved WhatsApp) ──────────────── */
const ShareButtons = ({
  url,
  title,
  description,
  compact = false,
}: ShareButtonsProps) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleNativeShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title, text: description || title });
        return;
      }
    } catch {
      // dismissed — fall through
    }
    handleCopy();
  }, [url, title, description]);

  const handleCopy = useCallback(async () => {
    if (copyState === "copying") return;
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("success");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [url, copyState]);

  const openShare = useCallback(
    (platform: Platform) => {
      const shareUrl = buildShareUrl(platform, url, title, description);
      if (shareUrl)
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
    },
    [url, title, description]
  );

  const copyIcon =
    copyState === "success" ? (
      <Check size={14} aria-hidden="true" />
    ) : (
      <Link2 size={14} aria-hidden="true" />
    );
  const copyLabel =
    copyState === "success"
      ? "Copied!"
      : copyState === "error"
      ? "Failed"
      : "Copy link";

  if (compact) {
    return (
      <div
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
        aria-label="Share this article"
      >
        <button
          onClick={handleNativeShare}
          aria-label={
            typeof navigator !== "undefined" && typeof navigator.share === "function"
              ? "Share this article"
              : "Copy link"
          }
          data-testid="share-native-btn"
          style={btnStyle(copyState === "success")}
        >
          <Share2 size={14} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Share this article"
      data-testid="share-buttons"
      style={{
        display:    "flex",
        gap:        "8px",
        flexWrap:   "wrap",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontFamily:    "'Cinzel', serif",
          fontSize:      "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color:         "rgba(42,31,14,0.4)",
          flexShrink:    0,
        }}
      >
        Share
      </span>

      {/* WhatsApp — prominent green */}
      <button
        onClick={() => openShare("whatsapp")}
        aria-label="Share on WhatsApp"
        data-testid="share-whatsapp-btn"
        title="Share on WhatsApp"
        style={{
          ...iconBtnStyle(),
          background: "rgba(37,211,102,0.1)",
          border:     "1px solid rgba(37,211,102,0.3)",
          color:      "#128C7E",
        }}
      >
        <MessageCircle size={14} aria-hidden="true" />
      </button>

      {/* Twitter */}
      <button
        onClick={() => openShare("twitter")}
        aria-label="Share on Twitter/X"
        data-testid="share-twitter-btn"
        title="Share on Twitter / X"
        style={iconBtnStyle()}
      >
        <Twitter size={14} aria-hidden="true" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => openShare("linkedin")}
        aria-label="Share on LinkedIn"
        data-testid="share-linkedin-btn"
        title="Share on LinkedIn"
        style={iconBtnStyle()}
      >
        <Linkedin size={14} aria-hidden="true" />
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        aria-label={copyLabel}
        aria-live="polite"
        data-testid="share-copy-btn"
        title={copyLabel}
        style={btnStyle(copyState === "success")}
        disabled={copyState === "copying"}
      >
        {copyIcon}
        <span style={{ marginLeft: "6px", fontSize: "11px" }}>{copyLabel}</span>
      </button>
    </div>
  );
};

function iconBtnStyle(): React.CSSProperties {
  return {
    width:          "32px",
    height:         "32px",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     "rgba(139,105,20,0.06)",
    border:         "1px solid rgba(212,175,55,0.15)",
    color:          "rgba(253,230,138,0.68)",
    cursor:         "pointer",
    transition:     "all 0.2s",
    flexShrink:     0,
  };
}

function btnStyle(success: boolean): React.CSSProperties {
  return {
    display:     "flex",
    alignItems:  "center",
    padding:     "6px 12px",
    borderRadius:"99px",
    background:  success ? "rgba(76,175,80,0.12)" : "rgba(139,105,20,0.06)",
    border:      success
      ? "1px solid rgba(76,175,80,0.3)"
      : "1px solid rgba(212,175,55,0.15)",
    color:       success ? "rgba(76,175,80,0.9)" : "rgba(253,230,138,0.68)",
    cursor:      "pointer",
    fontSize:    "12px",
    fontFamily:  "'Cinzel', serif",
    transition:  "all 0.2s",
    flexShrink:  0,
  };
}

export default ShareButtons;
export { buildShareUrl };
