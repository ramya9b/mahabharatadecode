/* ─────────────────────────────────────────────
   CharacterModal — Cinematic 3D popup
   Shows on character click with dynamic story button
───────────────────────────────────────────── */
import { useState, useEffect } from "react";
import type { StoryCharacter } from "@/data/storyCharacters";
import { GROUP_COLORS } from "@/data/storyCharacters";

interface Props {
  char: StoryCharacter;
  onStart: (promptText: string, promptLabel: string) => void;
  onClose: () => void;
}

const CharacterModal = ({ char, onStart, onClose }: Props) => {
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const accent = GROUP_COLORS[char.group];
  const serif  = "'Cinzel', 'Playfair Display', serif";
  const body   = "'Lora', Georgia, serif";

  /* Close on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Derive button label */
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
    const text = hasCustom
      ? customPrompt.trim()
      : char.prompts[selectedIdx!].request;
    const label = hasCustom
      ? customPrompt.trim().slice(0, 40)
      : char.prompts[selectedIdx!].label;
    onStart(text, label);
  };

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes avatar-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .cm-prompt:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Modal — stop propagation so clicking modal doesn't close */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: "520px",
            borderRadius: "20px",
            background: "linear-gradient(160deg, #0d0d1a 0%, #1a1025 60%, #0d0d1a 100%)",
            border: `1px solid ${accent}40`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 0.5px ${accent}30`,
            animation: "modal-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* ── Hero section ── */}
          <div style={{
            position: "relative",
            padding: "28px 24px 24px",
            background: `linear-gradient(135deg, ${accent}20 0%, transparent 60%)`,
            borderBottom: `1px solid ${accent}20`,
            display: "flex", gap: "20px", alignItems: "center",
          }}>
            {/* Glow blob */}
            <div style={{
              position: "absolute", top: "-20px", right: "20px",
              width: "160px", height: "160px", borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* Floating avatar */}
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              border: `2.5px solid ${accent}`,
              background: `${accent}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "36px", flexShrink: 0,
              animation: "avatar-float 3s ease-in-out infinite",
              boxShadow: `0 8px 32px ${accent}40`,
              position: "relative", zIndex: 1,
            }}>
              {char.icon}
            </div>

            {/* Character info */}
            <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: "#F5EEFF", letterSpacing: "0.03em", lineHeight: 1.1 }}>
                {char.name}
              </div>
              <div style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginTop: "5px", opacity: 0.85 }}>
                {char.title}
              </div>
              <div style={{ fontFamily: body, fontSize: "12px", color: "rgba(220,200,255,0.6)", marginTop: "7px", lineHeight: 1.5, fontStyle: "italic" }}>
                {char.hook}
              </div>
            </div>

            {/* Close button */}
            <button onClick={onClose} style={{
              position: "absolute", top: "12px", right: "12px",
              width: "28px", height: "28px", borderRadius: "50%",
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer", color: "rgba(255,255,255,0.6)",
              fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "20px 24px" }}>

            {/* Section label */}
            <div style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: `${accent}99`, marginBottom: "12px" }}>
              Choose a story
            </div>

            {/* Story prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {char.prompts.map((p, i) => (
                <button
                  key={i}
                  className="cm-prompt"
                  onClick={() => { setSelectedIdx(i); setCustomPrompt(""); }}
                  style={{
                    padding: "12px 16px", borderRadius: "12px",
                    textAlign: "left", cursor: "pointer",
                    background: selectedIdx === i ? `${accent}25` : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${selectedIdx === i ? accent : "rgba(255,255,255,0.08)"}`,
                    transition: "all 0.18s",
                    fontFamily: body,
                  }}
                >
                  <div style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: selectedIdx === i ? accent : "rgba(200,160,255,0.5)", marginBottom: "3px" }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: "13px", color: selectedIdx === i ? "#EEE0FF" : "rgba(220,200,255,0.75)", lineHeight: 1.45 }}>
                    {p.request.slice(0, 90)}…
                  </div>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: `${accent}80`, marginBottom: "8px" }}>
              Or ask your own
            </div>
            <textarea
              value={customPrompt}
              onChange={e => { setCustomPrompt(e.target.value); setSelectedIdx(null); }}
              placeholder={`Ask anything about ${char.name}…`}
              rows={2}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: `1px solid ${customPrompt.trim() ? accent + "60" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px", padding: "10px 14px",
                color: "rgba(240,230,255,0.9)", fontSize: "13px",
                resize: "vertical", outline: "none", fontFamily: body,
                marginBottom: "16px",
                transition: "border-color 0.2s",
              }}
            />

            {/* Dynamic CTA button */}
            <button
              onClick={handleStart}
              disabled={!isReady}
              style={{
                width: "100%", padding: "15px 20px",
                borderRadius: "12px", border: "none",
                cursor: isReady ? "pointer" : "not-allowed",
                fontFamily: serif, fontSize: "14px", fontWeight: 700,
                letterSpacing: "0.08em",
                background: isReady
                  ? `linear-gradient(135deg, ${accent}CC, ${accent})`
                  : "rgba(255,255,255,0.06)",
                color: isReady ? "white" : "rgba(200,160,255,0.35)",
                border: isReady ? "none" : `1px dashed ${accent}35`,
                transition: "all 0.25s",
                transform: isReady ? "translateY(0)" : undefined,
                boxShadow: isReady ? `0 8px 24px ${accent}40` : "none",
              }}
              onMouseEnter={e => { if (isReady) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterModal;
