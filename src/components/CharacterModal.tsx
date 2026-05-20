/* ─────────────────────────────────────────────
   CharacterModal — Cinematic popup with
   3D character image on right side
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import type { StoryCharacter } from "@/data/storyCharacters";
import { GROUP_COLORS } from "@/data/storyCharacters";

interface Props {
  char: StoryCharacter;
  onStart: (promptText: string, promptLabel: string) => void;
  onClose: () => void;
}

/* Characters with available portrait images */
const CHARACTER_IMAGES: Record<string, string> = {
  /* Pandavas */
  yudhishthira: "/characters/yudhishthira.webp",
  bhima:        "/characters/bhima.webp",
  arjuna:       "/characters/arjuna.webp",
  nakula:       "/characters/nakula.webp",
  sahadeva:     "/characters/sahadeva.webp",
  /* Kauravas */
  duryodhana:   "/characters/duryodhana.webp",
  dushasana:    "/characters/dushasana.webp",
  karna:        "/characters/karna.webp",
  shakuni:      "/characters/shakuni.webp",
  /* Divine & Sages */
  krishna:      "/characters/krishna.webp",
  drona:        "/characters/drona.webp",
  ashwatthama:  "/characters/ashwatthama.webp",
  /* Women */
  draupadi:     "/characters/draupadi.webp",
  gandhari:     "/characters/gandhari.webp",
  subhadra:     "/characters/subhadra.webp",
  hidimbi:      "/characters/hidimbi.webp",
  /* Warriors */
  bhishma:      "/characters/bhishma.webp",
  abhimanyu:    "/characters/abhimanyu.webp",
};

const CharacterModal = ({ char, onStart, onClose }: Props) => {
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);
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

  const hasPrompt   = selectedIdx !== null;
  const hasCustom   = customPrompt.trim().length > 3;
  const isReady     = hasPrompt || hasCustom;
  const buttonLabel = hasCustom
    ? `✨ Ask: ${customPrompt.trim().slice(0, 35)}${customPrompt.trim().length > 35 ? "…" : ""}`
    : hasPrompt
      ? `✨ Tell me about: ${char.prompts[selectedIdx!].label}`
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
          from { opacity:0; transform:scale(0.88) translateY(24px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes char-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity:0.4; transform:scaleX(1); }
          50%      { opacity:0.7; transform:scaleX(1.1); }
        }
        .cm-prompt:hover { background: rgba(255,255,255,0.08) !important; }
        .cm-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:"fixed", inset:0, zIndex:100,
        background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)",
        WebkitBackdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"16px",
      }}>
        {/* Modal */}
        <div onClick={e => e.stopPropagation()} style={{
          width:"100%", maxWidth: charImg ? "660px" : "500px",
          borderRadius:"20px",
          background:"linear-gradient(160deg, #0d0a1a 0%, #1a1025 60%, #0d0a1a 100%)",
          border:`1px solid ${accent}40`,
          boxShadow:`0 32px 80px rgba(0,0,0,0.85), 0 0 0 0.5px ${accent}25`,
          animation:"modal-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          overflow:"hidden",
          display:"flex",
          maxHeight:"92vh",
        }}>

          {/* ── LEFT — prompts ── */}
          <div className="cm-scroll" style={{
            flex:1, display:"flex", flexDirection:"column",
            overflowY:"auto", minWidth:0,
          }}>
            {/* Header */}
            <div style={{
              padding:"24px 20px 16px",
              background:`linear-gradient(135deg, ${accent}18 0%, transparent 60%)`,
              borderBottom:`1px solid ${accent}18`,
              position:"relative",
            }}>
              {/* Glow blob */}
              <div style={{
                position:"absolute", top:"-30px", right:"10px",
                width:"140px", height:"140px", borderRadius:"50%",
                background:`radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />

              {/* Close */}
              <button onClick={onClose} style={{
                position:"absolute", top:"12px", right:"12px",
                width:"28px", height:"28px", borderRadius:"50%",
                background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.15)",
                cursor:"pointer", color:"rgba(255,255,255,0.6)",
                fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>

              {/* Name + icon */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px", position:"relative", zIndex:1 }}>
                <div style={{
                  width:"52px", height:"52px", borderRadius:"50%",
                  border:`2px solid ${accent}`,
                  background:`${accent}20`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"26px", flexShrink:0,
                  boxShadow:`0 4px 20px ${accent}40`,
                  animation:"char-float 3s ease-in-out infinite",
                }}>
                  {char.icon}
                </div>
                <div>
                  <div style={{ fontFamily:serif, fontSize:"20px", fontWeight:700, color:"#F5EEFF", letterSpacing:"0.04em" }}>
                    {char.name}
                  </div>
                  <div style={{ fontFamily:serif, fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", color:accent, marginTop:"3px", opacity:0.85 }}>
                    {char.title}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily:body, fontSize:"12px", color:"rgba(200,180,255,0.55)", marginTop:"10px", lineHeight:1.5, fontStyle:"italic", paddingLeft:"4px", position:"relative", zIndex:1 }}>
                {char.hook}
              </div>
            </div>

            {/* Prompts */}
            <div style={{ padding:"16px 20px", flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ fontFamily:serif, fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", color:`${accent}90`, marginBottom:"10px" }}>
                Choose a story
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"7px", marginBottom:"14px" }}>
                {char.prompts.map((p, i) => (
                  <button key={i} className="cm-prompt" onClick={() => { setSelectedIdx(i); setCustomPrompt(""); }} style={{
                    padding:"10px 14px", borderRadius:"10px", textAlign:"left", cursor:"pointer",
                    background: selectedIdx === i ? `${accent}25` : "rgba(255,255,255,0.04)",
                    border:`1.5px solid ${selectedIdx === i ? accent : "rgba(255,255,255,0.08)"}`,
                    transition:"all 0.15s", fontFamily:body,
                  }}>
                    <div style={{ fontFamily:serif, fontSize:"10px", letterSpacing:"0.12em", textTransform:"uppercase", color: selectedIdx === i ? accent : "rgba(200,160,255,0.5)", marginBottom:"3px" }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize:"12px", color: selectedIdx === i ? "#EEE0FF" : "rgba(200,185,255,0.7)", lineHeight:1.45 }}>
                      {p.request.slice(0, 85)}…
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div style={{ fontFamily:serif, fontSize:"10px", letterSpacing:"0.18em", textTransform:"uppercase", color:`${accent}80`, marginBottom:"7px" }}>
                Or ask your own
              </div>
              <textarea
                value={customPrompt}
                onChange={e => { setCustomPrompt(e.target.value); setSelectedIdx(null); }}
                placeholder={`Ask anything about ${char.name}…`}
                rows={2}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.05)",
                  border:`1px solid ${customPrompt.trim() ? accent + "60" : "rgba(255,255,255,0.1)"}`,
                  borderRadius:"10px", padding:"10px 12px",
                  color:"rgba(240,230,255,0.9)", fontSize:"13px",
                  resize:"none", outline:"none", fontFamily:body,
                  marginBottom:"14px", transition:"border-color 0.2s",
                }}
              />

              {/* CTA Button */}
              <button onClick={handleStart} disabled={!isReady} style={{
                width:"100%", padding:"14px 16px", borderRadius:"12px", border:"none",
                cursor: isReady ? "pointer" : "not-allowed",
                fontFamily:serif, fontSize:"13px", fontWeight:700, letterSpacing:"0.08em",
                background: isReady
                  ? `linear-gradient(135deg, ${accent}CC, ${accent})`
                  : "rgba(255,255,255,0.05)",
                color: isReady ? "#0A0500" : "rgba(200,160,255,0.3)",
                border: isReady ? "none" : `1px dashed ${accent}30`,
                transition:"all 0.2s",
                boxShadow: isReady ? `0 6px 20px ${accent}45` : "none",
              }}
              onMouseEnter={e => { if (isReady) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                {buttonLabel}
              </button>
            </div>
          </div>

          {/* ── RIGHT — Character standing image ── */}
          {charImg && (
            <div style={{
              width:"200px", flexShrink:0,
              position:"relative", overflow:"hidden",
              background:`linear-gradient(to right, transparent, ${accent}08)`,
              borderLeft:`1px solid ${accent}15`,
            }}>
              {/* Gradient fade on left edge so it blends */}
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(to right, #0d0a1a 0%, transparent 25%)",
                zIndex:2, pointerEvents:"none",
              }} />

              {/* Ground glow */}
              <div style={{
                position:"absolute", bottom:"10px", left:"50%",
                transform:"translateX(-50%)",
                width:"160px", height:"30px", borderRadius:"50%",
                background:`${accent}30`,
                filter:"blur(12px)",
                animation:"glow-pulse 3s ease-in-out infinite",
                zIndex:1,
              }} />

              {/* Character image */}
              <div style={{
                position:"absolute", inset:0,
                display:"flex", alignItems:"flex-end", justifyContent:"center",
                padding:"0 8px 4px",
                zIndex:3,
              }}>
                <img
                  src={charImg}
                  alt={char.name}
                  style={{
                    maxHeight:"100%",
                    maxWidth:"190px",
                    objectFit:"contain",
                    objectPosition:"bottom center",
                    filter:`drop-shadow(0 0 20px ${accent}50) drop-shadow(0 8px 24px rgba(0,0,0,0.5))`,
                    animation:"char-float 4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CharacterModal;
