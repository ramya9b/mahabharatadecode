/* MoodBackground — CSS particles, no external Lottie */
import { useEffect, useRef } from "react";
import type { MoodTheme } from "@/data/moodThemes";

interface Props { theme: MoodTheme; opacity?: number; }
type P = { char: string; count: number; size: string; duration: string };

const PARTICLES: Record<string, P[]> = {
  war:     [{ char:"🔥", count:6, size:"20px", duration:"4s" }, { char:"⚔️", count:4, size:"16px", duration:"6s" }],
  divine:  [{ char:"✨", count:8, size:"14px", duration:"5s" }, { char:"🪷", count:4, size:"18px", duration:"7s" }],
  forest:  [{ char:"🍃", count:8, size:"16px", duration:"6s" }, { char:"🌿", count:4, size:"20px", duration:"8s" }],
  tragic:  [{ char:"⭐", count:10, size:"12px", duration:"5s" }, { char:"🌙", count:3, size:"18px", duration:"9s" }],
  gita:    [{ char:"☸️", count:4, size:"22px", duration:"8s" }, { char:"✨", count:6, size:"12px", duration:"5s" }],
  default: [],
};

const MoodBackground = ({ theme, opacity = 0.18 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    (PARTICLES[theme] ?? []).forEach(({ char, count, size, duration }) => {
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.textContent = char;
        el.style.cssText = `position:absolute;left:${Math.random()*100}%;bottom:-40px;font-size:${size};opacity:0;transform:scale(${0.6+Math.random()*0.8});animation:mf ${duration} ease-in ${Math.random()*5}s infinite;pointer-events:none;user-select:none;`;
        ref.current!.appendChild(el);
      }
    });
  }, [theme]);

  if (theme === "default") return null;
  return (
    <>
      <style>{`@keyframes mf{0%{opacity:0;transform:translateY(0) rotate(0deg)}10%{opacity:.6}90%{opacity:.3}100%{opacity:0;transform:translateY(-100vh) rotate(180deg)}}`}</style>
      <div ref={ref} aria-hidden="true" style={{position:"fixed",inset:0,opacity,pointerEvents:"none",overflow:"hidden",zIndex:0}} />
    </>
  );
};
export default MoodBackground;
