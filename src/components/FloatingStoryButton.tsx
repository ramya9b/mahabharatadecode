/* ─────────────────────────────────────────────
   FloatingStoryButton — always visible on every page
   Hides automatically on /storyteller page
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const FloatingStoryButton = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [visible, setVisible]   = useState(false);
  const [pulsing, setPulsing]   = useState(true);

  /* Show after 3 seconds, hide on storyteller page */
  useEffect(() => {
    if (pathname === "/storyteller") { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, [pathname]);

  /* Stop pulsing after 8 seconds */
  useEffect(() => {
    const t = setTimeout(() => setPulsing(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes float-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes soft-pulse {
          0%, 100% { box-shadow: 0 4px 24px hsl(var(--ai-accent) / 0.35); }
          50%       { box-shadow: 0 4px 36px hsl(var(--ai-accent) / 0.55), 0 0 0 8px hsl(var(--ai-accent) / 0.12); }
        }
        .float-btn {
          animation: float-up 0.5s ease forwards;
        }
        .float-btn.pulse {
          animation: float-up 0.5s ease forwards, soft-pulse 2s ease-in-out 0.5s infinite;
        }
        .float-btn:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 0 8px 36px hsl(var(--ai-accent) / 0.55), 0 0 0 8px hsl(var(--ai-accent) / 0.12) !important;
        }
      `}</style>

      <Link
        to="/storyteller"
        className={`float-btn${pulsing ? " pulse" : ""}`}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "24px",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "13px 22px",
          borderRadius: "99px",
          background: "var(--ai-gradient)",
          backgroundSize: "200% auto",
          animation: "float-up 0.5s ease forwards, shimmer 4s linear infinite",
          color: "hsl(var(--ai-accent-foreground))",
          fontWeight: 700,
          fontFamily: "'Cinzel', serif",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 24px hsl(var(--ai-accent) / 0.4)",
          userSelect: "none",
        }}
        aria-label={t("hero.cta_try_story")}
      >
        <span style={{ fontSize: "16px" }}>✨</span>
        <span>{t("nav.storyteller")}</span>
      </Link>
    </>
  );
};

export default FloatingStoryButton;
