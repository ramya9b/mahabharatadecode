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
  const [customPrompt, setCustomPrompt]  = useState("");
  const [isMobile, setIsMobile]          = useState(window.innerWidth < 640);
  const accent  = GROUP_COLORS[char.group];
  const serif   = "'Cinzel','Playfair Display',serif";
  const body    = "'Lora',Georgia,serif";
  const charImg = CHARACTER_IMAGES[char.id] ?? null;

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const resize = () => setIsMobile(window.innerWidth < 640);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => { document.removeEventListener("keydown", key); window.removeEventListener("resize", resize); };
  }, [onClose]);

  const hasPrompt = selectedIdx !== null;
  const hasCustom = customPrompt.trim().length > 3;
  const isReady   = hasPrompt || hasCustom;

  const btnLabel = hasCustom
    ? `✨ Ask: ${customPrompt.trim().slice(0,28)}${customPrompt.trim().length>28?"…":""}`
    : hasPrompt ? `✨ ${char.prompts[selectedIdx!].label}` : "✨ Select a story above";

  const handleStart = () => {
    if (!isReady) return;
    const text  = hasCustom ? customPrompt.trim() : char.prompts[selectedIdx!].request;
    const label = hasCustom ? customPrompt.trim().slice(0,40) : char.prompts[selectedIdx!].label;
    onStart(text, label);
  };

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.88) translateY(28px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes float-char {
          0%,100% { transform: translateX(5%) scale(1.18) translateY(0px); }
          50%      { transform: translateX(5%) scale(1.18) translateY(-14px); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity:0.55; transform:scale(1); }
          50%      { opacity:0.85; transform:scale(1.08); }
        }
        @keyframes rise {
          0%   { opacity:0; transform:translateY(0); }
          15%  { opacity:0.6; }
          85%  { opacity:0.2; }
          100% { opacity:0; transform:translateY(-180px); }
        }
        @keyframes shimmer {
          0%,100% { opacity:0.3; }
          50%      { opacity:0.8; }
        }
        .cm-card {
          padding:14px 16px; border-radius:12px; text-align:left;
          cursor:pointer; width:100%; font-family:inherit;
          transition: all 0.3s ease;
        }
        .cm-card:hover {
          transform:translateY(-4px) scale(1.01);
          box-shadow: 0 10px 28px rgba(255,215,0,0.12);
        }
        .cm-scroll { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.08) transparent; }
        .cm-cta:hover:not(:disabled) { transform:translateY(-3px); filter:brightness(1.1); }
      `}</style>

      {/* ── BACKDROP ── */}
      <div onClick={onClose} style={{
        position:"fixed", inset:0, zIndex:100,
        background:"rgba(0,0,0,0.88)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding: isMobile ? "8px" : "16px", overflowY:"auto",
      }}>

        {/* ── MODAL SHELL ── */}
        <div onClick={e => e.stopPropagation()} style={{
          width: isMobile ? "100%" : "min(980px, 95vw)",
          maxHeight: isMobile ? "96vh" : "90vh",
          borderRadius: isMobile ? "20px" : "24px",
          background:"rgba(8,6,20,0.95)",
          backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          border:`1px solid ${accent}45`,
          boxShadow:`0 0 80px ${accent}18, 0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)`,
          animation:"modal-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          display:"flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: isMobile ? "hidden" : "visible",  /* visible → character overflows */
          position:"relative",
          margin:"auto",
        }}>

          {/* ── MOBILE: banner on top ── */}
          {isMobile && (
            <div style={{
              height:"220px", position:"relative",
              overflow:"hidden", flexShrink:0, background:"#050510",
              borderRadius:"20px 20px 0 0",
            }}>
              {sceneImage && (
                <div style={{
                  position:"absolute", inset:0,
                  backgroundImage:`url('${sceneImage}')`,
                  backgroundSize:"cover", backgroundPosition:"center top",
                  filter:"brightness(0.5) saturate(0.85)",
                }} />
              )}
              <div style={{
                position:"absolute", inset:0, zIndex:1,
                background:"linear-gradient(to bottom, rgba(5,5,16,0.15) 0%, rgba(5,5,16,0.92) 90%, rgba(5,5,16,1) 100%)",
                pointerEvents:"none",
              }} />
              <div style={{
                position:"absolute", bottom:"12px", left:"50%",
                transform:"translateX(-50%)",
                width:"200px", height:"22px", borderRadius:"50%",
                background:`${accent}55`, filter:"blur(12px)", zIndex:2,
                animation:"pulse-glow 3s ease-in-out infinite",
              }} />
              {charImg && (
                <img src={charImg} alt={char.name} style={{
                  position:"absolute", bottom:0, left:"50%",
                  transform:"translateX(-50%)",
                  height:"215px", width:"auto", maxWidth:"none",
                  objectFit:"contain", objectPosition:"bottom center",
                  filter:`drop-shadow(0 0 24px ${accent}70) drop-shadow(0 8px 20px rgba(0,0,0,0.7))`,
                  animation:"float-char 4s ease-in-out infinite",
                  zIndex:3,
                }} />
              )}
              <button onClick={onClose} style={{
                position:"absolute", top:"12px", right:"12px", zIndex:10,
                width:"34px", height:"34px", borderRadius:"50%",
                background:"rgba(0,0,0,0.65)", border:"1px solid rgba(255,255,255,0.25)",
                cursor:"pointer", color:"rgba(255,255,255,0.85)",
                fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            </div>
          )}

          {/* ── LEFT PANEL 58% ── */}
          <div className="cm-scroll" style={{
            flex: isMobile ? "1" : "0 0 58%",
            display:"flex", flexDirection:"column",
            overflowY:"auto", minWidth:0,
            position:"relative", zIndex:2,
            borderRadius: isMobile ? "0" : "24px 0 0 24px",
          }}>
            {/* Header */}
            <div style={{
              padding: isMobile ? "20px 20px 16px" : "28px 32px 22px",
              background:`linear-gradient(135deg, ${accent}12 0%, transparent 55%)`,
              borderBottom:`1px solid ${accent}12`,
              position:"relative",
            }}>
              {!isMobile && (
                <button onClick={onClose} style={{
                  position:"absolute", top:"16px", right:"18px", zIndex:5,
                  width:"30px", height:"30px", borderRadius:"50%",
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                  cursor:"pointer", color:"rgba(255,255,255,0.6)",
                  fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s",
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.14)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.06)";}}
                >✕</button>
              )}
              <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"10px"}}>
                <div style={{
                  width: isMobile?"48px":"56px", height: isMobile?"48px":"56px",
                  borderRadius:"50%", border:`2px solid ${accent}`,
                  background:`radial-gradient(circle, ${accent}28, ${accent}08)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: isMobile?"22px":"26px", flexShrink:0,
                  boxShadow:`0 0 18px ${accent}50`,
                }}>
                  {char.icon}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <h2 style={{
                    fontFamily:serif, fontSize: isMobile?"22px":"clamp(22px,2.4vw,27px)",
                    fontWeight:700, color:"#F5EEFF", letterSpacing:"0.04em",
                    margin:0, lineHeight:1.1,
                  }}>
                    {char.name}
                  </h2>
                  <div style={{
                    fontFamily:serif, fontSize:"10px", letterSpacing:"0.22em",
                    textTransform:"uppercase", color:accent, marginTop:"4px", opacity:0.9,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                  }}>
                    {char.title}
                  </div>
                </div>
              </div>
              <p style={{
                fontFamily:body, fontSize: isMobile?"13px":"14px",
                fontStyle:"italic", color:"rgba(210,190,255,0.55)",
                lineHeight:1.5, margin:0,
              }}>
                "{char.hook}"
              </p>
            </div>

            {/* Prompts */}
            <div style={{padding: isMobile?"16px 20px":"20px 32px", flex:1, display:"flex", flexDirection:"column"}}>
              <div style={{
                fontFamily:serif, fontSize:"10px", letterSpacing:"0.22em",
                textTransform:"uppercase", color:`${accent}90`, marginBottom:"12px",
              }}>
                Choose a story
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"8px", marginBottom:"16px"}}>
                {char.prompts.map((p, i) => (
                  <button key={i} className="cm-card"
                    onClick={() => { setSelectedIdx(i); setCustomPrompt(""); }}
                    style={{
                      border:`1px solid ${selectedIdx===i ? accent : "rgba(255,255,255,0.08)"}`,
                      background: selectedIdx===i ? `${accent}20` : "rgba(255,255,255,0.04)",
                      boxShadow: selectedIdx===i ? `0 4px 20px ${accent}22` : "none",
                    }}>
                    <div style={{
                      fontFamily:serif, fontSize:"10px", letterSpacing:"0.13em",
                      textTransform:"uppercase",
                      color: selectedIdx===i ? accent : "rgba(200,160,255,0.4)",
                      marginBottom:"4px",
                    }}>{p.label}</div>
                    <div style={{
                      fontFamily:body, fontSize:"13px", lineHeight:1.5,
                      color: selectedIdx===i ? "#EEE0FF" : "rgba(200,185,255,0.65)",
                    }}>
                      {p.request.slice(0, isMobile?72:90)}…
                    </div>
                  </button>
                ))}
              </div>
              <div style={{
                fontFamily:serif, fontSize:"10px", letterSpacing:"0.2em",
                textTransform:"uppercase", color:`${accent}70`, marginBottom:"8px",
              }}>
                Or ask your own
              </div>
              <textarea
                value={customPrompt}
                onChange={e=>{setCustomPrompt(e.target.value);setSelectedIdx(null);}}
                placeholder={`Ask anything about ${char.name}…`}
                rows={2}
                style={{
                  width:"100%", fontFamily:body, fontSize:"14px",
                  background:"rgba(255,255,255,0.04)",
                  border:`1px solid ${customPrompt.trim()?accent+"55":"rgba(255,255,255,0.08)"}`,
                  borderRadius:"10px", padding:"10px 14px",
                  color:"rgba(240,230,255,0.9)", resize:"none", outline:"none",
                  marginBottom:"16px", transition:"border-color 0.2s", boxSizing:"border-box",
                }}
              />
              <button className="cm-cta" onClick={handleStart} disabled={!isReady} style={{
                width:"100%", padding:"15px 20px", borderRadius:"12px", border:"none",
                cursor: isReady?"pointer":"not-allowed",
                fontFamily:serif, fontSize:"14px", fontWeight:700, letterSpacing:"0.08em",
                background: isReady ? `linear-gradient(135deg, ${accent}DD, ${accent})` : "rgba(255,255,255,0.05)",
                color: isReady ? "#08040F" : "rgba(200,160,255,0.25)",
                border: isReady ? "none" : `1px dashed ${accent}25`,
                transition:"all 0.25s",
                boxShadow: isReady ? `0 8px 28px ${accent}50` : "none",
              }}>
                {btnLabel}
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL 42% — CHARACTER SHOWCASE ── */}
          {!isMobile && (
            <div style={{
              flex:"0 0 42%",
              position:"relative",
              overflow:"visible",   /* CHARACTER OVERFLOWS for cinematic pop-out */
              minHeight:"560px",
              isolation:"isolate",
            }}>
              {/* Scene image — dimmed */}
              <div style={{
                position:"absolute", inset:0, zIndex:0,
                borderRadius:"0 24px 24px 0",
                overflow:"hidden",
                background:"#050510",
              }}>
                {sceneImage && (
                  <div style={{
                    position:"absolute", inset:0,
                    backgroundImage:`url('${sceneImage}')`,
                    backgroundSize:"cover", backgroundPosition:"center right",
                    filter:"brightness(0.25) saturate(0.5)",
                  }} />
                )}
              </div>

              {/* Subtle left fade — blends panels */}
              <div style={{
                position:"absolute", top:0, left:0, bottom:0, width:"60px",
                background:`linear-gradient(to right, rgba(8,6,20,1) 0%, transparent 100%)`,
                zIndex:1, pointerEvents:"none",
              }} />

              {/* Radial glow BEHIND character */}
              <div style={{
                position:"absolute", top:"50%", left:"55%",
                transform:"translate(-50%,-50%)",
                width:"380px", height:"420px", borderRadius:"50%",
                background:`radial-gradient(circle, ${accent}38 0%, ${accent}18 40%, transparent 70%)`,
                filter:"blur(28px)",
                animation:"pulse-glow 4s ease-in-out infinite",
                zIndex:2, pointerEvents:"none",
              }} />

              {/* Ground glow */}
              <div style={{
                position:"absolute", bottom:"18px", left:"55%",
                transform:"translateX(-50%)",
                width:"220px", height:"22px", borderRadius:"50%",
                background:`${accent}60`, filter:"blur(14px)",
                animation:"pulse-glow 3s ease-in-out infinite",
                zIndex:2,
              }} />

              {/* Particles */}
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{
                  position:"absolute",
                  left:`${20+i*13}%`,
                  bottom:`${6+(i%3)*14}%`,
                  fontSize:"11px", opacity:0, zIndex:2, pointerEvents:"none",
                  animation:`rise ${3+i*0.6}s ease-in ${i*0.5}s infinite`,
                }}>
                  {["✨","⭐","✨","💫","⭐","✨"][i]}
                </div>
              ))}

              {/* ── CHARACTER IMAGE — FULLY VISIBLE, POPS OUT ── */}
              {charImg && (
                <img
                  src={charImg}
                  alt={char.name}
                  style={{
                    position:"absolute",
                    bottom:0,
                    left:"50%",
                    /* Pop out above modal top — cinematic overflow */
                    height:"115%",
                    maxHeight:"820px",
                    width:"auto",
                    maxWidth:"none",
                    objectFit:"contain",
                    objectPosition:"bottom center",
                    /* Shift right slightly for balance */
                    transform:"translateX(-45%) scale(1.0)",
                    filter:`drop-shadow(0 0 32px ${accent}65) drop-shadow(0 20px 45px rgba(0,0,0,0.65))`,
                    animation:"float-char 5s ease-in-out infinite",
                    mixBlendMode: "screen" as const,
                    zIndex:5,   /* ABOVE all overlays */
                  }}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CharacterModal;
