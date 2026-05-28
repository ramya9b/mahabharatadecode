/* ─────────────────────────────────────────────
   FirstVisitCard — shown once to new visitors
   Stored in sessionStorage — never shown again after dismiss
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "mbd_visited_v1";

const QUICK_PICKS = [
  { id: "karna",    icon: "⚔️", name: "Karna",    prompt: "Tell me about Karna's miraculous birth and why his mother Kunti abandoned him" },
  { id: "krishna",  icon: "🪷", name: "Krishna",   prompt: "Tell me what Krishna revealed to Arjuna on the battlefield of Kurukshetra" },
  { id: "draupadi", icon: "🔥", name: "Draupadi",  prompt: "Tell me about Draupadi's disrobing in the Kaurava court" },
];

const FirstVisitCard = () => {
  const [show, setShow]   = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      /* Show after 1.5s so page loads first */
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setLeaving(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setShow(false), 350);
  };

  const handlePick = (prompt: string) => {
    dismiss();
    /* Navigate with prompt pre-filled via state */
    navigate("/storyteller", { state: { quickPrompt: prompt } });
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translate(-50%, -44%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes card-out {
          from { opacity: 1; transform: translate(-50%, -50%); }
          to   { opacity: 0; transform: translate(-50%, -46%); }
        }
        @keyframes overlay-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlay-out { from { opacity: 1; } to { opacity: 0; } }
        .fvc-overlay { animation: ${leaving ? "overlay-out" : "overlay-in"} 0.35s ease forwards; }
        .fvc-card    { animation: ${leaving ? "card-out" : "card-in"} 0.35s cubic-bezier(.34,1.56,.64,1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fvc-overlay"
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(20,12,4,0.55)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Card */}
      <div
        className="fvc-card"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          zIndex: 1001,
          width: "min(480px, 92vw)",
          borderRadius: "20px",
          background: "linear-gradient(160deg, hsl(38 50% 96%) 0%, hsl(28 45% 93%) 100%)",
          border: "1px solid rgba(160,120,32,0.3)",
          boxShadow: "0 24px 64px rgba(20,12,4,0.35)",
          padding: "36px 32px 28px",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        {/* Close button — 44x44 tap target per Apple HIG */}
        <button
          onClick={dismiss}
          style={{
            position: "absolute", top: "8px", right: "8px",
            width: "44px", height: "44px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: "rgba(100,70,20,0.45)",
            lineHeight: 1, borderRadius: "50%",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(160,120,32,0.1)";
            e.currentTarget.style.color = "rgba(100,70,20,0.8)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "rgba(100,70,20,0.45)";
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>✨</div>
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontSize: "1.3rem",
            fontWeight: 700, color: "hsl(28 62% 12%)", marginBottom: "10px",
          }}>
            Welcome to Story Teller
          </h2>
          <p style={{
            fontSize: "14px", color: "hsl(28 30% 42%)",
            lineHeight: 1.6, margin: "0 auto", maxWidth: "340px",
          }}>
            Pick a character below and hear their story narrated dramatically — in English, Telugu, Hindi or Kannada. Takes just 10 seconds!
          </p>
        </div>

        {/* Quick pick characters */}
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: "10px",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(160,120,32,0.8)", marginBottom: "12px", textAlign: "center",
        }}>
          Start with a character
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {QUICK_PICKS.map(p => (
            <button
              key={p.id}
              onClick={() => handlePick(p.prompt)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "13px 16px", borderRadius: "12px",
                background: "rgba(160,120,32,0.05)",
                border: "1.5px solid rgba(160,120,32,0.18)",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(160,120,32,0.1)";
                e.currentTarget.style.borderColor = "rgba(160,120,32,0.45)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(160,120,32,0.05)";
                e.currentTarget.style.borderColor = "rgba(160,120,32,0.18)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: "13px",
                  fontWeight: 600, color: "hsl(28 62% 22%)", marginBottom: "2px",
                }}>
                  {p.name}
                </div>
                <div style={{ fontSize: "12px", color: "hsl(28 30% 48%)", lineHeight: 1.4 }}>
                  {p.prompt.slice(0, 55)}…
                </div>
              </div>
              <span style={{ marginLeft: "auto", color: "rgba(160,120,32,0.5)", fontSize: "16px" }}>→</span>
            </button>
          ))}
        </div>

        {/* Skip link */}
        <p style={{ textAlign: "center" }}>
          <button
            onClick={dismiss}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Cinzel', serif", fontSize: "11px",
              letterSpacing: "0.1em", color: "rgba(100,70,20,0.45)",
              textDecoration: "underline",
            }}
          >
            I'll explore on my own
          </button>
        </p>
      </div>
    </>
  );
};

export default FirstVisitCard;
