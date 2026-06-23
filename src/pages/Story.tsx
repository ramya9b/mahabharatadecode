import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, BookOpen, ArrowRight, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { useTheme } from "@/context/ThemeContext";
import { parvas } from "@/data/parvas";
import { characters } from "@/data/characters";
import { resolveCharacterImage } from "@/utils/images";

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
const StoryHero = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0C0900 0%, #160B00 100%)"
          : "linear-gradient(180deg, hsl(38 55% 92%) 0%, hsl(38 50% 89%) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Rainbow top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg,#FBBF24,#A3E635,#34D399,#38BDF8,#A78BFA,#F472B6)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-5 sm:px-6 pt-24 pb-16">
        {/* Eyebrow */}
        <p
          className="font-heading text-[11px] tracking-[0.4em] uppercase mb-6"
          style={{ color: "rgba(212,175,55,0.65)" }}
        >
          The Complete Story
        </p>

        {/* Title */}
        <h1
          className="font-heading font-black leading-[0.95] mb-6"
          style={{
            fontSize: "clamp(42px, 7vw, 80px)",
            background:
              "linear-gradient(135deg, rgba(212,175,55,1) 0%, rgba(212,175,55,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Mahabharata
          <span
            className="block"
            style={{
              WebkitTextFillColor: isDark
                ? "rgba(253,230,138,0.85)"
                : "rgba(42,31,14,0.85)",
              fontSize: "0.6em",
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              marginTop: "8px",
            }}
          >
            All 18 Parvas · The Complete Epic
          </span>
        </h1>

        {/* Description */}
        <p
          className="leading-relaxed mx-auto"
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: isDark ? "rgba(253,230,138,0.70)" : "rgba(42,31,14,0.70)",
            maxWidth: "540px",
          }}
        >
          The world's longest epic — 100,000 verses, 18 books, one impossible
          question about what it means to do the right thing. Read the whole
          story, in order, in plain language.
        </p>

        {/* Stats strip — 2×2 on mobile, 4-col on wider */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px 32px",
          marginTop: "40px",
          maxWidth: "320px",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          {[
            { value: "18",    label: "Parvas"   },
            { value: "100K+", label: "Verses"   },
            { value: "1.8M",  label: "Words"    },
            { value: "~60",   label: "Min read" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                className="font-heading font-black text-2xl mb-0.5"
                style={{ color: "hsl(var(--primary))" }}
              >
                {s.value}
              </div>
              <div
                className="font-heading text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   PARVA CARD
───────────────────────────────────────────────────────── */
interface ParvaCardProps {
  parva: (typeof parvas)[0];
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
}

const ParvaCard = ({ parva, isOpen, onToggle, isDark }: ParvaCardProps) => {
  /* Find character objects for this parva */
  const parvaChars = characters.filter((c) =>
    parva.characterIds.includes(c.id)
  );

  const cardBg = isDark
    ? `linear-gradient(135deg, rgba(${parva.accentRgb},0.06) 0%, rgba(${parva.accentRgb},0.02) 100%)`
    : `linear-gradient(135deg, rgba(${parva.accentRgb},0.07) 0%, rgba(${parva.accentRgb},0.02) 100%)`;

  return (
    <article
      id={parva.id}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: cardBg,
        border: `1px solid rgba(${parva.accentRgb},${isOpen ? "0.30" : "0.14"})`,
        boxShadow: isOpen
          ? `0 8px 40px rgba(${parva.accentRgb},0.08)`
          : "none",
      }}
    >
      {/* ── Header (always visible — tap to expand) ── */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`parva-body-${parva.id}`}
        className="w-full text-left p-5 md:p-6 flex items-start gap-4 group"
      >
        {/* Number */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-sm"
          style={{
            background: `rgba(${parva.accentRgb},0.12)`,
            border: `1px solid rgba(${parva.accentRgb},0.28)`,
            color: parva.accentHex,
          }}
        >
          {String(parva.number).padStart(2, "0")}
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: isDark ? "rgba(253,230,138,0.95)" : "rgba(42,31,14,0.95)",
              }}
            >
              {parva.name}
            </span>
            <span
              className="font-heading text-[11px] tracking-[0.15em] px-2.5 py-0.5 rounded-full"
              style={{
                background: `rgba(${parva.accentRgb},0.10)`,
                color: parva.accentHex,
                border: `1px solid rgba(${parva.accentRgb},0.22)`,
              }}
            >
              {parva.readTime} min
            </span>
          </div>
          <p
            className="leading-snug"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              fontStyle: "italic",
              color: isDark ? "rgba(253,230,138,0.60)" : "rgba(42,31,14,0.62)",
            }}
          >
            {parva.subtitle}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={18}
          className="flex-shrink-0 mt-1 transition-transform duration-300"
          style={{
            color: parva.accentHex,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* ── Expanded body ── */}
      {isOpen && (
        <div
          id={`parva-body-${parva.id}`}
          className="px-5 md:px-6 pb-6 space-y-5"
        >
          {/* Top accent line */}
          <div
            className="h-px"
            style={{
              background: `linear-gradient(to right, rgba(${parva.accentRgb},0.4), transparent)`,
            }}
          />

          {/* Sanskrit name */}
          <p
            className="font-heading text-[11px] tracking-[0.2em] uppercase"
            style={{ color: `rgba(${parva.accentRgb},0.55)` }}
          >
            {parva.sanskritName}
          </p>

          {/* Summary paragraphs */}
          <div className="space-y-3">
            {parva.summary.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(16px, 1.8vw, 18px)",
                  color: isDark
                    ? "rgba(253,230,138,0.82)"
                    : "rgba(42,31,14,0.82)",
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Key events */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `rgba(${parva.accentRgb},0.05)`,
              border: `1px solid rgba(${parva.accentRgb},0.14)`,
            }}
          >
            <p
              className="font-heading text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: `rgba(${parva.accentRgb},0.65)` }}
            >
              Key Events
            </p>
            <ul className="space-y-2">
              {parva.keyEvents.map((evt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: parva.accentHex }}
                  />
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(14px, 1.6vw, 16px)",
                      color: isDark
                        ? "rgba(253,230,138,0.75)"
                        : "rgba(42,31,14,0.75)",
                    }}
                  >
                    {evt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Characters in this parva */}
          {parvaChars.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={12} style={{ color: `rgba(${parva.accentRgb},0.65)` }} />
                <p
                  className="font-heading text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: `rgba(${parva.accentRgb},0.65)` }}
                >
                  Characters
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {parvaChars.map((char) => (
                  <Link
                    key={char.id}
                    to={`/characters#char-${char.id}`}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105"
                    style={{
                      background: `rgba(${char.accentRgb},0.10)`,
                      border: `1px solid rgba(${char.accentRgb},0.22)`,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={resolveCharacterImage(char.id).src}
                        alt={char.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span
                      className="font-heading text-[10px] tracking-[0.1em] uppercase"
                      style={{ color: char.accentHex }}
                    >
                      {char.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related articles */}
          {parva.relatedSlugs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={12} style={{ color: `rgba(${parva.accentRgb},0.65)` }} />
                <p
                  className="font-heading text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: `rgba(${parva.accentRgb},0.65)` }}
                >
                  Deep Dives
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {parva.relatedSlugs.map((slug) => (
                  <Link
                    key={slug}
                    to={`/blog/${slug}`}
                    className="flex items-center gap-2 group"
                    style={{ color: parva.accentHex }}
                  >
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                    <span
                      className="font-heading text-[11px] tracking-[0.1em] uppercase group-hover:opacity-80 transition-opacity"
                      style={{
                        color: isDark
                          ? "rgba(253,230,138,0.70)"
                          : "rgba(42,31,14,0.65)",
                      }}
                    >
                      {slug
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const Story = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["adi-parva"]));

  useSEO({
    title: "The Complete Mahabharata — All 18 Parvas",
    description:
      "Read the complete Mahabharata in order — all 18 parvas summarised in plain language. From Adi Parva's beginning to Svargarohana's ascent to heaven.",
    path: "/story",
  });

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenIds(new Set(parvas.map((p) => p.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenIds(new Set());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <StoryHero />

      {/* Controls */}
      <div
        className="sticky top-16 z-30 flex items-center justify-between px-4 md:px-6 py-3"
        style={{
          background: isDark
            ? "rgba(12,9,0,0.90)"
            : "rgba(250,245,236,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212,175,55,0.10)",
        }}
      >
        <p
          className="font-heading text-[10px] tracking-[0.20em] uppercase"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {openIds.size}/{parvas.length} open
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={expandAll}
            className="font-heading text-[10px] tracking-[0.12em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "hsl(var(--primary))" }}
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="font-heading text-[10px] tracking-[0.12em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Timeline */}
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        {/* Left timeline line */}
        <div className="relative">
          {/* Vertical gold line — desktop only */}
          <div
            className="hidden md:block absolute left-[-28px] top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 10%, rgba(212,175,55,0.25) 90%, transparent)",
            }}
            aria-hidden="true"
          />

          <div className="space-y-4">
            {parvas.map((parva) => (
              <ParvaCard
                key={parva.id}
                parva={parva}
                isOpen={openIds.has(parva.id)}
                onToggle={() => toggle(parva.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div
            className="h-px mb-10"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)",
            }}
          />
          <p
            className="font-heading text-[10px] tracking-[0.35em] uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
            Go deeper
          </p>
          <h2
            className="font-heading font-bold mb-6"
            style={{
              fontSize: "clamp(22px, 3vw, 30px)",
              color: "hsl(var(--foreground))",
            }}
          >
            Every parva has a lesson still relevant today
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/blog"
              className="px-6 py-3 rounded-full font-heading text-[12px] font-bold tracking-wide transition-all duration-300"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Read Deep-Dive Articles
            </Link>
            <Link
              to="/characters"
              className="glass-card px-6 py-3 rounded-full font-heading text-[12px] tracking-wide hover:border-primary/40 transition-all duration-300"
            >
              Explore Characters
            </Link>
            <Link
              to="/quiz"
              className="glass-card px-6 py-3 rounded-full font-heading text-[12px] tracking-wide hover:border-primary/40 transition-all duration-300"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Story;
