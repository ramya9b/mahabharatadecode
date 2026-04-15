import { useEffect, useState } from "react";
import type { Character } from "@/data/characters";

interface CharacterNavProps {
  characters: Character[];
}

const CharacterNav = ({ characters }: CharacterNavProps) => {
  const [active, setActive] = useState<string>(characters[0]?.id ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after hero
      setVisible(window.scrollY > window.innerHeight * 0.5);

      // Detect which character is in view
      for (const char of [...characters].reverse()) {
        const el = document.getElementById(`char-${char.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActive(char.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [characters]);

  const scrollTo = (id: string) => {
    document.getElementById(`char-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 flex flex-col items-end gap-2"
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
                color: isActive ? char.accentHex : "rgba(42,31,14,0.5)",
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
