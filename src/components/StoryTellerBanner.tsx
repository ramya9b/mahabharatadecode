/* ─────────────────────────────────────────────
   StoryTellerBanner — Homepage feature section
   Placed between FeaturedStories & CharactersGrid
───────────────────────────────────────────── */
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StoryTellerBanner = () => {
  const { t } = useTranslation();
  const PREVIEWS = [
    { char: "⚔️", id: "karna",    nameKey: "home.characters.karna",    lineKey: "home.storyteller.preview_karna_line" },
    { char: "🪷", id: "krishna",  nameKey: "home.characters.krishna",  lineKey: "home.storyteller.preview_krishna_line" },
    { char: "🔥", id: "draupadi", nameKey: "home.characters.draupadi", lineKey: "home.storyteller.preview_draupadi_line" },
    { char: "🏔️", id: "bhishma", nameKey: "home.characters.bhishma",  lineKey: "home.storyteller.preview_bhishma_line" },
  ];
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
            border: "1px solid hsl(var(--ai-accent) / 0.35)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "hsl(var(--ai-accent))",
            fontFamily: "'Cinzel', serif",
            marginBottom: "16px",
          }}
        >
          ✨ {t("home.storyteller.eyebrow")}
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
          {t("home.storyteller.title")}
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
          {t("home.storyteller.subtitle")}
        </p>
        <Link
          to="/storyteller"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: "99px",
            background: "var(--ai-gradient)",
            backgroundSize: "200% auto",
            animation: "shimmer 4s linear infinite",
            color: "hsl(var(--ai-accent-foreground))",
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            boxShadow: "0 4px 24px hsl(var(--ai-accent) / 0.4)",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px hsl(var(--ai-accent) / 0.6)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px hsl(var(--ai-accent) / 0.4)";
          }}
        >
          ✨ {t("home.storyteller.cta")} →
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
            key={p.id}
            to={`/storyteller`}
            style={{
              display: "block",
              padding: "20px",
              borderRadius: "14px",
              background: "hsl(var(--ai-accent-soft))",
              border: "1px solid hsl(var(--ai-accent) / 0.2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "hsl(var(--ai-accent))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px hsl(var(--ai-accent) / 0.18)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "hsl(var(--ai-accent) / 0.2)";
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
                color: "hsl(var(--ai-accent))",
                marginBottom: "6px",
              }}
            >
              {t(p.nameKey)}
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
              "{t(p.lineKey)}"
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
        {t("home.storyteller.footer_hint")}
      </p>
    </section>
  );
};

export default StoryTellerBanner;
