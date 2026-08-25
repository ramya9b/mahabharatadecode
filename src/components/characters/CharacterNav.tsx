import { useEffect, useState } from "react";
import type { Character } from "@/data/characters";
import { useTheme } from "@/context/ThemeContext";

interface CharacterNavProps {
  characters: Character[];
}

const CharacterNav = ({ characters }: CharacterNavProps) => {
  const [active, setActive] = useState<string>(characters[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const inactiveColor = isDark ? "rgba(245,235,218,0.65)" : "rgba(42,31,14,0.65)";

  // Visibility toggle — rAF-throttled, single boolean comparison per frame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.5);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active-section detection via IntersectionObserver — no layout reads per scroll
  useEffect(() => {
    const elements = characters
      .map((c) => document.getElementById(`char-${c.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose top is closest to 40% of viewport (intersecting only)
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        const best = intersecting.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b
        );
        const id = best.target.id.replace(/^char-/, "");
        setActive(id);
      },
      {
        // 40% from top, 50% from bottom => band roughly centered on upper-third
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.01, 0.1, 0.5, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [characters]);

  const scrollTo = (id: string) => {
    document.getElementById(`char-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 flex-col items-end gap-2"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      {characters.map((char) => {
        const isActive = active === char.id;
        return (
          <button
            key={char.id}
            onClick={() => scrollTo(char.id)}
            className="group flex items-center gap-2 transition-all duration-300"
            title={char.name}
          >
            {/* Label — shows on hover */}
            <span
              className="font-heading text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap"
              style={{
                color: isActive ? char.accentHex : inactiveColor,
                fontSize: "10px",
                transform: isActive ? "translateX(0)" : "translateX(6px)",
              }}
            >
              {char.name}
            </span>
            {/* Dot */}
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? "10px" : "6px",
                height: isActive ? "10px" : "6px",
                background: isActive ? char.accentHex : "rgba(237,232,216,0.25)",
                boxShadow: isActive ? `0 0 8px rgba(${char.accentRgb},0.7)` : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default CharacterNav;
