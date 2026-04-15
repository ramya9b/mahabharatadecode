import { useState, useCallback } from "react";
import { Link2, Check, Twitter, MessageCircle, Linkedin, Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

type Platform = "twitter" | "whatsapp" | "linkedin" | "copy";
type CopyState = "idle" | "copying" | "success" | "error";

function buildShareUrl(platform: Platform, url: string, title: string, desc?: string): string {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}${desc ? ` — ${desc}` : ""}`);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedText}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}&title=${encodedTitle}`;
    default:
      return "";
  }
}

const ShareButtons = ({ url, title, description, compact = false }: ShareButtonsProps) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  /** Try Web Share API first (works on mobile), fall back to clipboard */
  const handleNativeShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title, text: description || title });
        return;
      }
    } catch {
      // User dismissed or API unavailable — fall through to clipboard
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

  const openShare = useCallback((platform: Platform) => {
    const shareUrl = buildShareUrl(platform, url, title, description);
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    }
  }, [url, title, description]);

  const copyIcon = copyState === "success"
    ? <Check size={14} aria-hidden="true" />
    : <Link2 size={14} aria-hidden="true" />;

  const copyLabel = copyState === "success" ? "Copied!" : copyState === "error" ? "Failed" : "Copy link";

  if (compact) {
    return (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }} aria-label="Share this article">
        {/* Native / copy button */}
        <button
          onClick={handleNativeShare}
          aria-label={typeof navigator !== "undefined" && navigator.share ? "Share this article" : "Copy link"}
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
      style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "'Playfair Display', 'Cinzel', serif",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(42,31,14,0.4)",
          flexShrink: 0,
        }}
      >
        Share
      </span>

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

      {/* WhatsApp */}
      <button
        onClick={() => openShare("whatsapp")}
        aria-label="Share on WhatsApp"
        data-testid="share-whatsapp-btn"
        title="Share on WhatsApp"
        style={iconBtnStyle()}
      >
        <MessageCircle size={14} aria-hidden="true" />
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

      {/* Copy Link */}
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
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(139,105,20,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    color: "rgba(42,31,14,0.65)",
    cursor: "pointer",
    transition: "all 0.2s",
    flexShrink: 0,
  };
}

function btnStyle(success: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "99px",
    background: success ? "rgba(76,175,80,0.12)" : "rgba(139,105,20,0.06)",
    border: success ? "1px solid rgba(76,175,80,0.3)" : "1px solid rgba(212,175,55,0.15)",
    color: success ? "rgba(76,175,80,0.9)" : "rgba(42,31,14,0.65)",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    transition: "all 0.2s",
    flexShrink: 0,
  };
}

export default ShareButtons;
export { buildShareUrl };
