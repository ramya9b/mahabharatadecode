import { useEffect, useRef } from "react";
import { Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import type { Character } from "@/data/characters";
import { resolveImage } from "@/utils/images";

interface CharactersHeroProps {
  characters: Character[];
}

const CharactersHero = ({ characters }: CharactersHeroProps) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChar = (id: string) => {
    document.getElementById(`char-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute will-change-transform"
        style={{ inset: "-15% 0", height: "130%" }}
      >
        <img
            loading="lazy"
            decoding="async"
          src={heroBg}
          alt="Kurukshetra"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,6,26,0.6) 0%, rgba(8,6,26,0.4) 40%, rgba(8,6,26,0.85) 80%, rgba(8,6,26,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="particle bg-primary/20"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              bottom: "-6px",
              "--duration": Math.random() * 10 + 8 + "s",
              "--delay": Math.random() * 7 + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.32em] uppercase font-heading mb-8 animate-fade-up backdrop-blur-sm">
          <Users size={11} />
          The Epic's Greatest Souls
        </div>

        {/* Title */}
        <h1
          className="font-heading font-black leading-[1] mb-6 animate-fade-up-delay-1"
          style={{ fontSize: "clamp(46px, 8vw, 96px)" }}
        >
          <span className="gold-text block">Legendary</span>
          <span
            className="block"
            style={{ color: "rgba(42,31,14,0.9)", fontSize: "0.68em" }}
          >
            Characters
          </span>
        </h1>

        <p
          className="animate-fade-up-delay-2 leading-relaxed mx-auto mb-12"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "rgba(42,31,14,0.65)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            maxWidth: "540px",
          }}
        >
          Five warriors. Five destinies. Five mirrors held up to the human soul.
          The Mahabharata is not a story about ancient India — it is a story about you.
        </p>

        {/* Character portrait strip */}
        <div className="flex justify-center gap-3 flex-wrap animate-fade-up-delay-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => scrollToChar(char.id)}
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              {/* Portrait circle */}
              <div
                className="relative rounded-full overflow-hidden transition-all duration-400 group-hover:scale-110"
                style={{
                  width: "64px",
                  height: "64px",
                  border: `2px solid rgba(${char.accentRgb},0.3)`,
                  boxShadow: `0 0 0 0 rgba(${char.accentRgb},0)`,
                  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = char.accentHex;
                  el.style.boxShadow = `0 0 18px rgba(${char.accentRgb},0.5)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `rgba(${char.accentRgb},0.3)`;
                  el.style.boxShadow = `0 0 0 0 rgba(${char.accentRgb},0)`;
                }}
              >
                <img
            loading="lazy"
            decoding="async"
                  src={resolveImage(char.imageKey)}
                  alt={char.name}
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,6,26,0.5), transparent)",
                  }}
                />
              </div>
              {/* Name label */}
              <span
                className="font-heading text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 group-hover:text-primary"
                style={{ color: "rgba(42,31,14,0.5)" }}
              >
                {char.name}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="flex flex-col items-center gap-2 mt-10"
          style={{ opacity: 0.35 }}
        >
          <span
            className="font-heading text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            Scroll to explore
          </span>
          <div
            className="w-px h-8"
            style={{
              background: "linear-gradient(to bottom, var(--gold), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CharactersHero;
