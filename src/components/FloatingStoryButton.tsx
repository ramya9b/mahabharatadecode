/* ─────────────────────────────────────────────
   FloatingStoryButton — always visible on every page
   Hides automatically on /storyteller page
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const FloatingStoryButton = () => {
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
          0%, 100% { box-shadow: 0 4px 24px rgba(52,211,153,0.35); }
          50%       { box-shadow: 0 4px 36px rgba(52,211,153,0.65), 0 0 0 8px rgba(52,211,153,0.10); }
        }
        .float-btn {
          animation: float-up 0.5s ease forwards;
        }
        .float-btn.pulse {
          animation: float-up 0.5s ease forwards, soft-pulse 2s ease-in-out 0.5s infinite;
        }
        .float-btn:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 0 8px 36px rgba(52,211,153,0.65), 0 0 0 8px rgba(52,211,153,0.10) !important;
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
          background: "linear-gradient(135deg, #FBBF24 0%, #34D399 50%, #38BDF8 100%)",
          backgroundSize: "200% auto",
          animation: "float-up 0.5s ease forwards, shimmer 4s linear infinite",
          color: "#08040F",
          fontWeight: 700,
          fontFamily: "'Cinzel', serif",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 24px rgba(52,211,153,0.40)",
          userSelect: "none",
        }}
        aria-label="Try Story Teller"
      >
        <span style={{ fontSize: "16px" }}>✨</span>
        <span>Story Teller</span>
      </Link>
    </>
  );
};

export default FloatingStoryButton;
