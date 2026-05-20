/* ─────────────────────────────────────────────
   CharacterModal — Premium Cinematic Popup
   Fully responsive: mobile stacked / desktop side-by-side
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const accent  = GROUP_COLORS[char.group];
  const serif   = "'Cinzel', 'Playfair Display', serif";
  const body    = "'Lora', Georgia, serif";
  const charImg = CHARACTER_IMAGES[char.id] ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onResize = () => setIsMobile(window.innerWidth < 640);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [onClose]);

  const hasPrompt = selectedIdx !== null;
  const hasCustom = customPrompt.trim().length > 3;
  const isReady   = hasPrompt || hasCustom;

  const buttonLabel = hasCustom
    ? `✨ Ask: ${customPrompt.trim().slice(0, 28)}${customPrompt.trim().length > 28 ? "…" : ""}`
    : hasPrompt
      ? `✨ ${char.prompts[selectedIdx!].label}`
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
          from { opacity:0; transform:scale(0.9) translateY(24px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes char-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:0.9; transform:scale(1.1); }
        }
        @keyframes particle-rise {
          0%   { opacity:0; transform:translateY(0); }
          15%  { opacity:0.6; }
          85%  { opacity:0.2; }
          100% { opacity:0; transform:translateY(-160px); }
        }
        .cm-card {
          padding: 14px 16px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          transition: all 0.3s ease;
          width: 100%;
          font-family: inherit;
        }
        .cm-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,215,0,0.35) !important;
          box-shadow: 0 8px 24px rgba(255,215,0,0.1);
          background: rgba(255,255,255,0.07) !important;
        }
        .cm-card.sel {
          transform: translateY(-2px);
        }
        .cm-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "8px" : "16px",
        overflowY: "auto",
      }}>

        {/* ── MODAL ── */}
        <div onClick={e => e.stopPropagation()} style={{
          width: isMobile ? "100%" : "min(960px, 95vw)",
          maxHeight: isMobile ? "96vh" : "90vh",
          borderRadius: isMobile ? "20px" : "28px",
          background: "rgba(10,8,25,0.96)",
          backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 60px ${accent}18, 0 24px 70px rgba(0,0,0,0.75)`,
          animation: "modal-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          overflow: "hidden",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          position: "relative",
          margin: "auto",
        }}>

          {/* ══ MOBILE: Character banner at top ══ */}
          {isMobile && (
            <div style={{
              height: "220px",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
              background: "#080614",
            }}>
              {/* Scene fills ENTIRE banner */}
              {sceneImage && (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  backgroundImage: `url('${sceneImage}')`,
                  backgroundSize: "cover", backgroundPosition: "center top",
                  filter: "brightness(0.45) saturate(0.8)",
                }} />
              )}
              {/* Full overlay gradient — top dark, bottom very dark */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                background: "linear-gradient(to bottom, rgba(8,6,20,0.25) 0%, rgba(8,6,20,0.88) 80%, rgba(8,6,20,1) 100%)",
              }} />
              {/* Gold glow */}
              <div style={{
                position: "absolute", bottom: "14px", left: "50%",
                transform: "translateX(-50%)",
                width: "220px", height: "20px", borderRadius: "50%",
                background: `${accent}55`, filter: "blur(12px)", zIndex: 2,
                animation: "pulse-glow 3s ease-in-out infinite",
              }} />
              {/* Character — centred on top of full-width scene */}
              {charImg && (
                <img src={charImg} alt={char.name} style={{
                  position: "absolute", bottom: 0,
                  left: "50%", transform: "translateX(-50%)",
                  height: "215px", width: "auto", maxWidth: "none",
                  objectFit: "contain", objectPosition: "bottom center",
                  filter: `drop-shadow(0 0 22px ${accent}65) drop-shadow(0 6px 18px rgba(0,0,0,0.8))`,
                  animation: "char-float 4s ease-in-out infinite",
                  zIndex: 3,
                }} />
              )}
              {/* Close button */}
              <button onClick={onClose} style={{
                position: "absolute", top: "12px", right: "12px", zIndex: 10,
                width: "34px", height: "34px", borderRadius: "50%",
                background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer", color: "rgba(255,255,255,0.85)",
                fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
          )}

          {/* ══ LEFT PANEL — Prompts ══ */}
          <div className="cm-scroll" style={{
            flex: isMobile ? "1" : "0 0 60%",
            display: "flex", flexDirection: "column",
            overflowY: "auto", minWidth: 0, position: "relative", zIndex: 2,
          }}>
            {/* Header */}
            <div style={{
              padding: isMobile ? "20px 20px 16px" : "28px 28px 20px",
              background: `linear-gradient(135deg, ${accent}12 0%, transparent 50%)`,
              borderBottom: `1px solid ${accent}12`,
              position: "relative",
            }}>
              {/* Close — desktop only */}
              {!isMobile && (
                <button onClick={onClose} style={{
                  position: "absolute", top: "16px", right: "16px", zIndex: 5,
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer", color: "rgba(255,255,255,0.6)",
                  fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                >✕</button>
              )}

              {/* Badge row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                <div style={{
                  width: isMobile ? "48px" : "56px",
                  height: isMobile ? "48px" : "56px",
                  borderRadius: "50%",
                  border: `2px solid ${accent}`,
                  background: `radial-gradient(circle, ${accent}25, ${accent}08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isMobile ? "22px" : "26px", flexShrink: 0,
                  boxShadow: `0 0 18px ${accent}45`,
                }}>
                  {char.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    fontFamily: serif,
                    fontSize: isMobile ? "22px" : "clamp(22px,2.5vw,28px)",
                    fontWeight: 700, color: "#F5EEFF",
                    letterSpacing: "0.04em", margin: 0, lineHeight: 1.1,
                  }}>
                    {char.name}
                  </h2>
                  <div style={{
                    fontFamily: serif, fontSize: "10px",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: accent, marginTop: "4px", opacity: 0.85,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {char.title}
                  </div>
                </div>
              </div>
              <p style={{
                fontFamily: body, fontSize: isMobile ? "13px" : "14px",
                fontStyle: "italic", color: "rgba(210,190,255,0.55)",
                lineHeight: 1.5, margin: 0,
              }}>
                "{char.hook}"
              </p>
            </div>

            {/* Prompts body */}
            <div style={{ padding: isMobile ? "16px 20px" : "20px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{
                fontFamily: serif, fontSize: "10px",
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: `${accent}90`, marginBottom: "12px",
              }}>
                Choose a story
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {char.prompts.map((p, i) => (
                  <button
                    key={i}
                    className={`cm-card${selectedIdx === i ? " sel" : ""}`}
                    onClick={() => { setSelectedIdx(i); setCustomPrompt(""); }}
                    style={{
                      border: `1px solid ${selectedIdx === i ? accent : "rgba(255,255,255,0.07)"}`,
                      background: selectedIdx === i ? `${accent}18` : "rgba(255,255,255,0.04)",
                      boxShadow: selectedIdx === i ? `0 6px 20px ${accent}20` : "none",
                    }}
                  >
                    <div style={{
                      fontFamily: serif, fontSize: "10px",
                      letterSpacing: "0.13em", textTransform: "uppercase",
                      color: selectedIdx === i ? accent : "rgba(200,160,255,0.4)",
                      marginBottom: "4px",
                    }}>
                      {p.label}
                    </div>
                    <div style={{
                      fontFamily: body,
                      fontSize: isMobile ? "13px" : "13px",
                      lineHeight: 1.5,
                      color: selectedIdx === i ? "#EEE0FF" : "rgba(200,185,255,0.65)",
                    }}>
                      {p.request.slice(0, isMobile ? 70 : 90)}…
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div style={{
                fontFamily: serif, fontSize: "10px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: `${accent}70`, marginBottom: "8px",
              }}>
                Or ask your own
              </div>
              <textarea
                value={customPrompt}
                onChange={e => { setCustomPrompt(e.target.value); setSelectedIdx(null); }}
                placeholder={`Ask anything about ${char.name}…`}
                rows={2}
                style={{
                  width: "100%", fontFamily: body,
                  fontSize: isMobile ? "14px" : "13px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${customPrompt.trim() ? accent + "55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", padding: "10px 14px",
                  color: "rgba(240,230,255,0.9)",
                  resize: "none", outline: "none",
                  marginBottom: "16px", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />

              {/* CTA */}
              <button onClick={handleStart} disabled={!isReady} style={{
                width: "100%",
                padding: isMobile ? "15px 16px" : "15px 20px",
                borderRadius: "12px", border: "none",
                cursor: isReady ? "pointer" : "not-allowed",
                fontFamily: serif,
                fontSize: isMobile ? "14px" : "14px",
                fontWeight: 700, letterSpacing: "0.08em",
                background: isReady
                  ? `linear-gradient(135deg, ${accent}DD, ${accent})`
                  : "rgba(255,255,255,0.05)",
                color: isReady ? "#08040F" : "rgba(200,160,255,0.25)",
                border: isReady ? "none" : `1px dashed ${accent}25`,
                transition: "all 0.25s",
                boxShadow: isReady ? `0 8px 24px ${accent}45` : "none",
              }}>
                {buttonLabel}
              </button>
            </div>
          </div>

          {/* ══ DESKTOP: Right panel ══ */}
          {!isMobile && (
            <div style={{
              flex: "0 0 40%",
              position: "relative",
              overflow: "hidden",
              minHeight: "560px",
              background: "#080614",
            }}>
              {/* Scene bg */}
              {sceneImage && (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  backgroundImage: `url('${sceneImage}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  filter: "brightness(0.45) saturate(0.85)",
                }} />
              )}
              {/* Left fade */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                background: "linear-gradient(to right, rgba(10,8,25,0.98) 0%, rgba(10,8,25,0.35) 35%, transparent 65%)",
              }} />
              {/* Bottom fade */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", zIndex: 1, pointerEvents: "none",
                background: "linear-gradient(to top, rgba(10,8,25,0.98) 0%, transparent 100%)",
              }} />
              {/* Gold glow */}
              <div style={{
                position: "absolute", bottom: "20px", left: "50%",
                transform: "translateX(-50%)",
                width: "200px", height: "24px", borderRadius: "50%",
                background: `${accent}50`, filter: "blur(14px)",
                animation: "pulse-glow 3s ease-in-out infinite", zIndex: 2,
              }} />
              {/* Particles */}
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${15 + i * 17}%`,
                  bottom: `${8 + (i % 3) * 12}%`,
                  fontSize: "11px", opacity: 0, zIndex: 2, pointerEvents: "none",
                  animation: `particle-rise ${3 + i * 0.7}s ease-in ${i * 0.5}s infinite`,
                }}>
                  {["✨","⭐","✨","💫","⭐"][i]}
                </div>
              ))}
              {/* Character image */}
              {charImg && (
                <img src={charImg} alt={char.name} style={{
                  position: "absolute",
                  bottom: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter: `drop-shadow(0 0 28px ${accent}55) drop-shadow(0 16px 36px rgba(0,0,0,0.5))`,
                  animation: "char-float 4s ease-in-out infinite",
                  zIndex: 3,
                }} />
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CharacterModal;
