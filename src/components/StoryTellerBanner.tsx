/* ─────────────────────────────────────────────
   StoryTellerBanner — Homepage feature section
   Placed between FeaturedStories & CharactersGrid
───────────────────────────────────────────── */
import { Link } from "react-router-dom";

const PREVIEWS = [
  { char: "⚔️", name: "Karna",      line: "Born a king, raised a charioteer's son..." },
  { char: "🪷", name: "Krishna",    line: "He never raised a weapon — yet won the war..." },
  { char: "🔥", name: "Draupadi",   line: "Born from fire. Her humiliation ignited a war..." },
  { char: "🏔️", name: "Bhishma",   line: "His oath of celibacy destroyed generations..." },
];

const StoryTellerBanner = () => {
  return (
    <section
      style={{
        margin: "0 auto",
        padding: "80px 24px",
        maxWidth: "1100px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: "99px",
            border: "1px solid rgba(160,120,32,0.3)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--primary, #A07820)",
            fontFamily: "'Cinzel', serif",
            marginBottom: "16px",
          }}
        >
          New Feature
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          ✨ AI Story Teller
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "520px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Choose any character. Choose your story. Hear the Mahabharata come alive — narrated dramatically in English, Telugu, Hindi or Kannada.
        </p>
        <Link
          to="/storyteller"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: "99px",
            background: "linear-gradient(135deg, #FBBF24 0%, #34D399 50%, #38BDF8 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 4s linear infinite",
            color: "#08040F",
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(52,211,153,0.40)",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px rgba(52,211,153,0.60)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(52,211,153,0.40)";
          }}
        >
          ✨ Start Listening →
        </Link>
      </div>

      {/* Preview cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {PREVIEWS.map((p) => (
          <Link
            key={p.name}
            to={`/storyteller`}
            style={{
              display: "block",
              padding: "20px",
              borderRadius: "14px",
              background: "hsl(var(--card, 38 45% 94%))",
              border: "1px solid hsl(var(--border))",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "hsl(var(--primary))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(160,120,32,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "hsl(var(--border))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{p.char}</div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "hsl(var(--primary))",
                marginBottom: "6px",
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "12px",
                color: "hsl(var(--muted-foreground))",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              "{p.line}"
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom hint */}
      <p
        style={{
          textAlign: "center",
          marginTop: "32px",
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          color: "hsl(var(--muted-foreground))",
          textTransform: "uppercase",
        }}
      >
        25 characters · 4 languages · Voice narration · Free
      </p>
    </section>
  );
};

export default StoryTellerBanner;
