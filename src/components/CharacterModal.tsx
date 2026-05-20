/* ─────────────────────────────────────────────
   CharacterModal — Premium Cinematic Popup
   Epic Mahabharata fantasy UI — Phase 2 Week 3
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import type { StoryCharacter } from "@/data/storyCharacters";
import { GROUP_COLORS } from "@/data/storyCharacters";

interface Props {
  char: StoryCharacter;
  sceneImage?: string;
  onStart: (promptText: string, promptLabel: string) => void;
  onClose: () => void;
}

const CHARACTER_IMAGES: Record<string, string> = {
  yudhishthira:  "/characters/yudhishthira.webp",
  bhima:         "/characters/bhima.webp",
  arjuna:        "/characters/arjuna.webp",
  nakula:        "/characters/nakula.webp",
  sahadeva:      "/characters/sahadeva.webp",
  duryodhana:    "/characters/duryodhana.webp",
  dushasana:     "/characters/dushasana.webp",
  karna:         "/characters/karna.webp",
  shakuni:       "/characters/shakuni.webp",
  draupadi:      "/characters/draupadi.webp",
  gandhari:      "/characters/gandhari.webp",
  subhadra:      "/characters/subhadra.webp",
  hidimbi:       "/characters/hidimbi.webp",
  kunti:         "/characters/kunti.webp",
  bhishma:       "/characters/bhishma.webp",
  abhimanyu:     "/characters/abhimanyu.webp",
  krishna:       "/characters/krishna.webp",
  hanuman:       "/characters/hanuman.webp",
  vyasa:         "/characters/vyasa.webp",
  vidura:        "/characters/vidura.webp",
  parashurama:   "/characters/parashurama.webp",
  drona:         "/characters/drona.webp",
  ashwatthama:   "/characters/ashwatthama.webp",
  dhritarashtra: "/characters/dhritarashtra.webp",
  pandu:         "/characters/pandu.webp",
  drupada:       "/characters/drupada.webp",
  virata:        "/characters/virata.webp",
  shalya:        "/characters/shalya.webp",
};

const CharacterModal = ({ char, sceneImage, onStart, onClose }: Props) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const accent  = GROUP_COLORS[char.group];
  const serif   = "'Cinzel', 'Playfair Display', serif";
  const body    = "'Lora', Georgia, serif";
  const charImg = CHARACTER_IMAGES[char.id] ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasPrompt = selectedIdx !== null;
  const hasCustom = customPrompt.trim().length > 3;
  const isReady   = hasPrompt || hasCustom;

  const buttonLabel = hasCustom
    ? `✨ Ask: ${customPrompt.trim().slice(0, 30)}${customPrompt.trim().length > 30 ? "…" : ""}`
    : hasPrompt
      ? `✨ Tell me: ${char.prompts[selectedIdx!].label}`
      : "✨ Select a story above";

  const handleStart = () => {
    if (!isReady) return;
    const text  = hasCustom ? customPrompt.trim() : char.prompts[selectedIdx!].request;
    const label = hasCustom ? customPrompt.trim().slice(0, 40) : char.prompts[selectedIdx!].label;
    onStart(text, label);
  };

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.88) translateY(28px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes char-float {
          0%,100% { transform: translateY(0) scale(1.15); }
          50%      { transform: translateY(-14px) scale(1.17); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:0.9; transform:scale(1.08); }
        }
        @keyframes particle-rise {
          0%   { opacity:0; transform:translateY(0) rotate(0deg); }
          15%  { opacity:0.7; }
          85%  { opacity:0.3; }
          100% { opacity:0; transform:translateY(-200px) rotate(180deg); }
        }
        @keyframes border-shimmer {
          0%,100% { opacity:0.4; }
          50%      { opacity:1; }
        }
        .cm-story-card {
          padding: 14px 18px;
          border-radius: 14px;
          text-align: left;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          transition: all 0.35s ease;
          width: 100%;
          font-family: inherit;
        }
        .cm-story-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(255,215,0,0.35) !important;
          box-shadow: 0 10px 28px rgba(255,215,0,0.12);
          background: rgba(255,255,255,0.06) !important;
        }
        .cm-story-card.selected {
          border-color: var(--card-accent) !important;
          background: var(--card-accent-bg) !important;
          box-shadow: 0 8px 24px var(--card-shadow) !important;
        }
        .cm-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        .cm-cta:hover:not(:disabled) { transform: translateY(-3px); box-shadow: var(--cta-shadow-hover) !important; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}>
        {/* ── POPUP CONTAINER ── */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "min(1000px, 95vw)",
            minHeight: "600px",
            maxHeight: "92vh",
            borderRadius: "28px",
            background: "rgba(10,8,25,0.92)",
            backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
            border: `1px solid ${accent}40`,
            boxShadow: `0 0 60px ${accent}20, 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)`,
            animation: "modal-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
            overflow: "hidden",
            display: "flex",
            position: "relative",
          }}
        >
          {/* Animated border shimmer */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "28px",
            border: `1px solid ${accent}`,
            opacity: 0, animation: "border-shimmer 3s ease-in-out infinite",
            pointerEvents: "none", zIndex: 10,
          }} />

          {/* ── LEFT PANEL (60%) ── */}
          <div className="cm-scroll" style={{
            flex: "0 0 60%", display: "flex", flexDirection: "column",
            overflowY: "auto", minWidth: 0, position: "relative", zIndex: 2,
          }}>
            {/* Header */}
            <div style={{
              padding: "32px 32px 24px",
              background: `linear-gradient(135deg, ${accent}15 0%, transparent 50%)`,
              borderBottom: `1px solid ${accent}15`,
              position: "relative",
            }}>
              {/* Top glow blob */}
              <div style={{
                position: "absolute", top: "-20px", left: "40px",
                width: "200px", height: "120px", borderRadius: "50%",
                background: `radial-gradient(circle, ${accent}25, transparent 70%)`,
                filter: "blur(20px)", pointerEvents: "none",
              }} />

              {/* Close */}
              <button onClick={onClose} style={{
                position: "absolute", top: "18px", right: "18px",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer", color: "rgba(255,255,255,0.55)",
                fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", zIndex: 5,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >✕</button>

              {/* Character badge row */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 1, marginBottom: "12px" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  border: `2.5px solid ${accent}`,
                  background: `radial-gradient(circle, ${accent}30, ${accent}10)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px", flexShrink: 0,
                  boxShadow: `0 0 20px ${accent}50, 0 4px 16px rgba(0,0,0,0.4)`,
                }}>
                  {char.icon}
                </div>
                <div>
                  <h2 style={{
                    fontFamily: serif, fontSize: "clamp(22px, 3vw, 28px)",
                    fontWeight: 700, color: "#F5EEFF",
                    letterSpacing: "0.05em", margin: 0, lineHeight: 1.1,
                  }}>
                    {char.name}
                  </h2>
                  <div style={{
                    fontFamily: serif, fontSize: "11px", letterSpacing: "0.25em",
                    textTransform: "uppercase", color: accent,
                    marginTop: "5px", opacity: 0.9,
                  }}>
                    {char.title}
                  </div>
                </div>
              </div>

              <p style={{
                fontFamily: body, fontSize: "14px", fontStyle: "italic",
                color: "rgba(210,190,255,0.6)", lineHeight: 1.6,
                margin: 0, paddingLeft: "4px",
              }}>
                "{char.hook}"
              </p>
            </div>

            {/* Story prompts */}
            <div style={{ padding: "24px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{
                fontFamily: serif, fontSize: "10px", letterSpacing: "0.25em",
                textTransform: "uppercase", color: `${accent}90`,
                marginBottom: "14px",
              }}>
                Choose a story
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {char.prompts.map((p, i) => (
                  <button
                    key={i}
                    className={`cm-story-card${selectedIdx === i ? " selected" : ""}`}
                    onClick={() => { setSelectedIdx(i); setCustomPrompt(""); }}
                    style={{
                      "--card-accent": accent,
                      "--card-accent-bg": `${accent}20`,
                      "--card-shadow": `${accent}25`,
                    } as React.CSSProperties}
                  >
                    <div style={{
                      fontFamily: serif, fontSize: "10px", letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: selectedIdx === i ? accent : "rgba(200,160,255,0.45)",
                      marginBottom: "5px", transition: "color 0.2s",
                    }}>
                      {p.label}
                    </div>
                    <div style={{
                      fontFamily: body, fontSize: "13px", lineHeight: 1.5,
                      color: selectedIdx === i ? "#EEE0FF" : "rgba(200,185,255,0.65)",
                      transition: "color 0.2s",
                    }}>
                      {p.request.slice(0, 90)}…
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div style={{
                fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em",
                textTransform: "uppercase", color: `${accent}70`, marginBottom: "10px",
              }}>
                Or ask your own
              </div>
              <textarea
                value={customPrompt}
                onChange={e => { setCustomPrompt(e.target.value); setSelectedIdx(null); }}
                placeholder={`Ask anything about ${char.name}…`}
                rows={2}
                style={{
                  width: "100%", fontFamily: body, fontSize: "14px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${customPrompt.trim() ? accent + "60" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "12px", padding: "12px 16px",
                  color: "rgba(240,230,255,0.9)",
                  resize: "none", outline: "none",
                  marginBottom: "20px", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />

              {/* CTA */}
              <button
                className="cm-cta"
                onClick={handleStart}
                disabled={!isReady}
                style={{
                  width: "100%", padding: "16px 20px",
                  borderRadius: "14px", border: "none",
                  cursor: isReady ? "pointer" : "not-allowed",
                  fontFamily: serif, fontSize: "14px",
                  fontWeight: 700, letterSpacing: "0.1em",
                  background: isReady
                    ? `linear-gradient(135deg, ${accent}DD 0%, ${accent} 50%, ${accent}BB 100%)`
                    : "rgba(255,255,255,0.04)",
                  color: isReady ? "#08040F" : "rgba(200,160,255,0.25)",
                  border: isReady ? "none" : `1px dashed ${accent}25`,
                  transition: "all 0.3s ease",
                  boxShadow: isReady ? `0 8px 28px ${accent}50` : "none",
                  "--cta-shadow-hover": `0 12px 36px ${accent}70`,
                } as React.CSSProperties}
              >
                {buttonLabel}
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL (40%) — Scene + Character ── */}
          <div style={{
            flex: "0 0 40%",
            position: "relative",
            overflow: "visible",
            minHeight: "600px",
          }}>
            {/* Scene background */}
            {sceneImage && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: `url('${sceneImage}')`,
                backgroundSize: "cover", backgroundPosition: "center",
                filter: "brightness(0.45) saturate(0.9)",
              }} />
            )}
            {!sceneImage && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                background: `linear-gradient(160deg, ${accent}15, #0d0a1a)`,
              }} />
            )}

            {/* Left fade into left panel */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "linear-gradient(to right, rgba(10,8,25,0.98) 0%, rgba(10,8,25,0.4) 30%, transparent 65%)",
            }} />

            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "80px", zIndex: 1, pointerEvents: "none",
              background: "linear-gradient(to top, rgba(10,8,25,0.95) 0%, transparent 100%)",
            }} />

            {/* Radial glow behind character */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "320px", height: "320px", borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}40 0%, ${accent}18 40%, transparent 70%)`,
              filter: "blur(24px)",
              animation: "pulse-glow 4s ease-in-out infinite",
              zIndex: 2, pointerEvents: "none",
            }} />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${15 + i * 14}%`,
                bottom: `${10 + (i % 3) * 15}%`,
                fontSize: "12px",
                opacity: 0,
                zIndex: 2,
                pointerEvents: "none",
                animation: `particle-rise ${3 + i * 0.8}s ease-in ${i * 0.6}s infinite`,
              }}>
                {["✨", "⭐", "✨", "💫", "⭐", "✨"][i]}
              </div>
            ))}

            {/* Gold ground glow */}
            <div style={{
              position: "absolute", bottom: "20px", left: "50%",
              transform: "translateX(-50%)",
              width: "200px", height: "28px", borderRadius: "50%",
              background: `${accent}50`,
              filter: "blur(14px)",
              animation: "pulse-glow 3s ease-in-out infinite",
              zIndex: 2,
            }} />

            {/* Character image — pops out */}
            {charImg && (
              <img
                src={charImg}
                alt={char.name}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "115%",
                  maxWidth: "none",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter: `drop-shadow(0 0 30px ${accent}60) drop-shadow(0 20px 40px rgba(0,0,0,0.6))`,
                  animation: "char-float 4s ease-in-out infinite",
                  zIndex: 3,
                }}
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default CharacterModal;
