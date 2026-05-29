/* ─────────────────────────────────────────────
   SocialProofBar — Homepage trust strip
   Sits between HeroSection and StoryTellerBanner.
   Quick visual proof that the site is real and active.
   Uses CSS variables so it works in both themes.
───────────────────────────────────────────── */
import { useTranslation } from "react-i18next";

interface Stat {
  value: string;
  label: string;
}

const SocialProofBar = () => {
  const { t } = useTranslation();
  /* All four stats are verifiable from the codebase:
     - AI Story Teller: real Gemini-powered feature (src/pages/StoryTeller.tsx)
     - 25 Characters:   src/data/storyCharacters.ts
     - 4 Languages:     EN / TE / HI / KN (src/i18n/index.ts)
     - Free Always:     no paywall on free trial; subscription is optional
     Note: "AI" + "25" + "4" stay as-is (initialism + numerals are universal). */
  const STATS: Stat[] = [
    { value: "AI",                       label: t("home.social_proof.story_teller") },
    { value: "25",                       label: t("home.social_proof.characters") },
    { value: "4",                        label: t("home.social_proof.languages") },
    { value: t("home.social_proof.free"), label: t("home.social_proof.always") },
  ];
  return (
    <section
      aria-label="Site at a glance"
      style={{
        position: "relative",
        padding: "36px 24px",
        background: "hsl(var(--card) / 0.4)",
        borderTop:    "1px solid rgba(212,175,55,0.10)",
        borderBottom: "1px solid rgba(212,175,55,0.10)",
      }}
    >
      {/* Top hairline glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(212,175,55,0.45), transparent)",
        }}
      />

      <ul
        style={{
          listStyle: "none",
          margin: "0 auto",
          padding: 0,
          maxWidth: "880px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px 0",
        }}
      >
        {STATS.map((stat, i) => (
          <li
            key={stat.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "1 1 auto",
              minWidth: "140px",
              justifyContent: "center",
            }}
          >
            {/* Stat block */}
            <div style={{ textAlign: "center", padding: "0 16px" }}>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 700,
                  color: "hsl(var(--primary))",
                  lineHeight: 1,
                  marginBottom: "6px",
                  letterSpacing: "0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {stat.label}
              </div>
            </div>

            {/* Gold dot divider — hidden after the last stat */}
            {i < STATS.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "rgba(212,175,55,0.45)",
                  flexShrink: 0,
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SocialProofBar;
