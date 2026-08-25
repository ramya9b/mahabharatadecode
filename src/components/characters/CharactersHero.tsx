import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp";
import type { Character } from "@/data/characters";
import { resolveImage } from "@/utils/images";
import { useTheme } from "@/context/ThemeContext";

interface CharactersHeroProps {
  characters: Character[];
}

const CharactersHero = ({ characters }: CharactersHeroProps) => {
  const { t } = useTranslation();
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* Theme-aware hero overlay — cinematic dark veil OR warm parchment veil. */
  const heroOverlay = isDark
    ? "linear-gradient(to bottom, rgba(8,6,26,0.6) 0%, rgba(8,6,26,0.4) 40%, rgba(8,6,26,0.85) 80%, rgba(8,6,26,1) 100%)"
    : "linear-gradient(to bottom, rgba(250,243,225,0.15) 0%, rgba(250,243,225,0.45) 40%, rgba(250,243,225,0.85) 80%, hsl(38 55% 92%) 100%)";

  const subtitleColor    = isDark ? "rgba(245,235,218,0.78)" : "rgba(42,31,14,0.85)";
  const heroParaColor    = isDark ? "rgba(245,235,218,0.68)" : "rgba(42,31,14,0.72)";
  const portraitLabel    = isDark ? "rgba(245,235,218,0.65)" : "rgba(42,31,14,0.65)";

  // rAF-throttled parallax + skip work while hero is offscreen
  useEffect(() => {
    let ticking = false;
    let inView = true;

    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    const handleScroll = () => {
      if (ticking || !inView) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.25}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
    };
  }, []);

  // Particles: random positions computed once, not on every render
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        w: Math.random() * 2 + 1,
        left: Math.random() * 100,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 7,
      })),
    []
  );

  const scrollToChar = (id: string) => {
    document.getElementById(`char-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute will-change-transform"
        style={{ inset: "-15% 0", height: "130%" }}
      >
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={heroBg}
          alt="Kurukshetra battlefield at dusk"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{ background: heroOverlay }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(194,65,12,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle bg-primary/20"
            style={{
              width: p.w + "px",
              height: p.w + "px",
              left: p.left + "%",
              bottom: "-6px",
              "--duration": p.duration + "s",
              "--delay": p.delay + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.32em] uppercase font-heading mb-8 animate-fade-up backdrop-blur-sm i18n-safe">
          <Users size={11} />
          {t("characters.eyebrow")}
        </div>

        {/* Title */}
        <h1
          className="font-heading font-black leading-[1] mb-6 animate-fade-up-delay-1 gold-text"
          style={{ fontSize: "clamp(46px, 8vw, 96px)", color: subtitleColor }}
        >
          {t("characters.headline")}
        </h1>

        <p
          className="animate-fade-up-delay-2 leading-relaxed mx-auto mb-12"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: heroParaColor,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            maxWidth: "540px",
          }}
        >
          {t("characters.subtitle")}
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
                style={{ color: portraitLabel }}
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
            {t("common.scroll_to_explore")}
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
