/* ─────────────────────────────────────────────
   QuizBanner — Homepage feature section
   Sits between LifeLessons and VideoSection.
   Drives engagement to the most viral feature.
───────────────────────────────────────────── */
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const QuizBanner = () => {
  const { t } = useTranslation();
  return (
    <section
      style={{
        margin: "0 auto",
        padding: "80px 24px",
        maxWidth: "1100px",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          padding: "56px 32px",
          textAlign: "center",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.3))",
          border: "1px solid rgba(194,65,12,0.18)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top hairline glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(194,65,12,0.55), transparent)",
          }}
        />
        {/* Ambient radial */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(194,65,12,0.10), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: "99px",
            border: "1px solid rgba(194,65,12,0.3)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--primary, #A07820)",
            fontFamily: "'Cinzel', serif",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          {t("home.quiz_banner.eyebrow")}
        </span>

        <h2
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            marginBottom: "12px",
            lineHeight: 1.2,
            position: "relative",
          }}
        >
          {t("home.quiz_banner.title")}
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "520px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
            position: "relative",
          }}
        >
          {t("home.quiz_banner.subtitle")}
        </p>

        <Link
          to="/quiz"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: "99px",
            background:
              "linear-gradient(135deg, #C2410C 0%, #C2410C 50%, #F5EBDA 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 4s linear infinite",
            color: "#08040F",
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(194,65,12,0.45)",
            transition: "all 0.35s ease",
            textTransform: "uppercase",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-3px) scale(1.02)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 12px 36px rgba(194,65,12,0.65)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 24px rgba(194,65,12,0.45)";
          }}
        >
          {t("home.quiz_banner.cta")} →
        </Link>

        <p
          style={{
            marginTop: "24px",
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "hsl(var(--muted-foreground))",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          {t("home.quiz_banner.footer_hint")}
        </p>
      </div>
    </section>
  );
};

export default QuizBanner;
