/* ─────────────────────────────────────────────────────────
   StoryBanner — Homepage entry point for /story
   Sits between ExploreCharactersBanner and QuizBanner
───────────────────────────────────────────────────────── */
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const PARVA_PREVIEWS = [
  { number: "01", name: "Adi Parva",   subtitle: "Bhishma's oath. Karna set adrift. The seeds of war.",    accentHex: "#22C55E", accentRgb: "34,197,94" },
  { number: "02", name: "Sabha Parva", subtitle: "The dice game. Draupadi's question. Everything breaks.", accentHex: "#E53935", accentRgb: "229,57,53" },
  { number: "06", name: "Bhishma Parva", subtitle: "The Bhagavad Gita is spoken. The war begins.",         accentHex: "#7986CB", accentRgb: "121,134,203" },
  { number: "08", name: "Karna Parva", subtitle: "The final battle. The rivalry nobody could resolve.",     accentHex: "#22C55E", accentRgb: "34,197,94" },
];

const StoryBanner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
            border: "1px solid rgba(34,197,94,0.3)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "hsl(var(--primary))",
            fontFamily: "'Cinzel', serif",
            marginBottom: "16px",
          }}
        >
          The Complete Epic
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
          All 18 Parvas.
          <span
            style={{
              display: "block",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "0.7em",
              color: "hsl(var(--muted-foreground))",
              marginTop: "6px",
            }}
          >
            The whole Mahabharata, in order, in plain language.
          </span>
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "500px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          From Bhishma's terrible oath in Adi Parva to the final ascent in
          Svargarohana — one page, all 18 books, every major event explained.
        </p>

        <Link
          to="/story"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: "99px",
            background:
              "linear-gradient(135deg, #22C55E 0%, #22C55E 50%, #86EFAC 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 4s linear infinite",
            color: "#08040F",
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(34,197,94,0.45)",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-3px) scale(1.02)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 12px 36px rgba(34,197,94,0.65)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 24px rgba(34,197,94,0.45)";
          }}
        >
          📜 Read the Full Story →
        </Link>
      </div>

      {/* Parva preview cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "14px",
        }}
      >
        {PARVA_PREVIEWS.map((p) => (
          <Link
            key={p.number}
            to={`/story`}
            style={{
              display: "block",
              padding: "20px",
              borderRadius: "16px",
              background: isDark
                ? `linear-gradient(145deg, rgba(${p.accentRgb},0.08) 0%, rgba(${p.accentRgb},0.02) 100%)`
                : `linear-gradient(145deg, rgba(${p.accentRgb},0.09) 0%, rgba(${p.accentRgb},0.02) 100%)`,
              border: `1px solid rgba(${p.accentRgb},0.18)`,
              textDecoration: "none",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = `rgba(${p.accentRgb},0.45)`;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = `0 12px 32px rgba(${p.accentRgb},0.15), inset 0 1px 0 rgba(${p.accentRgb},0.14)`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = `rgba(${p.accentRgb},0.18)`;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, transparent, rgba(${p.accentRgb},0.7), transparent)`,
            }} />

            {/* Parva number */}
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: "11px",
              letterSpacing: "0.2em", color: p.accentHex,
              marginBottom: "8px", opacity: 0.7,
            }}>
              PARVA {p.number}
            </div>

            {/* Parva name */}
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: "14px", fontWeight: 700,
              color: "hsl(var(--foreground))", marginBottom: "8px",
            }}>
              {p.name}
            </div>

            {/* Subtitle */}
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "13px", color: "hsl(var(--muted-foreground))",
              lineHeight: 1.55, fontStyle: "italic",
            }}>
              {p.subtitle}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer hint */}
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
        18 Parvas · Tap any card to read the full story in order
      </p>
    </section>
  );
};

export default StoryBanner;
