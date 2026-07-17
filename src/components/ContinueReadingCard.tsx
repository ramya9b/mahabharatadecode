/* ─────────────────────────────────────────────
   ContinueReadingCard — Homepage card for returning visitors
   Shows the last article they were reading and offers
   a one-click jump back. Renders nothing for first-time
   visitors or after the entry is dismissed/expired.
───────────────────────────────────────────── */
import { Link } from "react-router-dom";
import { BookmarkCheck, X, ArrowRight } from "lucide-react";
import { useLastRead } from "@/hooks/useLastRead";

const ContinueReadingCard = () => {
  const { entry, dismiss } = useLastRead();
  if (!entry) return null;

  return (
    <section
      aria-label="Continue reading"
      style={{
        margin: "0 auto",
        padding: "24px 24px 0",
        maxWidth: "1100px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "14px 18px",
          borderRadius: "12px",
          background: "hsl(var(--card) / 0.6)",
          border: "1px solid rgba(34,197,94,0.22)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >
        <BookmarkCheck
          size={18}
          aria-hidden="true"
          style={{ color: "hsl(var(--primary))", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "hsl(var(--muted-foreground))",
              marginBottom: "2px",
            }}
          >
            Welcome back · Continue reading
          </div>
          <Link
            to={`/blog/${entry.slug}`}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: "hsl(var(--foreground))",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "hsl(var(--primary))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "hsl(var(--foreground))";
            }}
          >
            {entry.title}
            <ArrowRight size={13} style={{ opacity: 0.7 }} aria-hidden="true" />
          </Link>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "50%",
            color: "hsl(var(--muted-foreground))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, color 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "hsl(var(--foreground) / 0.08)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "hsl(var(--foreground))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "hsl(var(--muted-foreground))";
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default ContinueReadingCard;
