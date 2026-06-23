import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import type { Character } from "@/data/characters";
import { resolveImage } from "@/utils/images";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTheme } from "@/context/ThemeContext";
import CharacterStatBars from "./CharacterStatBars";

/* Characters whose result can come from the quiz */
const QUIZ_CHARACTER_IDS = new Set(["karna", "krishna", "arjuna", "draupadi", "bhishma"]);

interface CharacterProfileProps {
  character: Character;
  index: number;
}

const ARCHETYPE_COLORS_DARK: Record<string, string> = {
  Warrior: "rgba(212,175,55,0.15)",
  Divine:  "rgba(74,144,217,0.15)",
  Royalty: "rgba(229,57,53,0.15)",
  Elder:   "rgba(121,134,203,0.15)",
};

const ARCHETYPE_COLORS_LIGHT: Record<string, string> = {
  Warrior: "rgba(212,175,55,0.20)",
  Divine:  "rgba(74,144,217,0.18)",
  Royalty: "rgba(229,57,53,0.18)",
  Elder:   "rgba(121,134,203,0.18)",
};

const CharacterProfile = ({ character, index }: CharacterProfileProps) => {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const image = resolveImage(character.imageKey);
  const isEven = index % 2 === 0;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* Theme-aware palette — cinematic dark or warm parchment cream. */
  const sectionBg = isDark
    ? (isEven
        ? "linear-gradient(180deg, #0C0900, #160B00)"
        : "linear-gradient(180deg, #160B00, #0C0900)")
    : (isEven
        ? "linear-gradient(180deg, hsl(38 55% 92%), hsl(38 50% 89%))"
        : "linear-gradient(180deg, hsl(38 50% 89%), hsl(38 55% 92%))");

  const titleColor    = isDark ? "rgba(253,230,138,0.65)" : "rgba(42,31,14,0.65)";
  const bioColor      = isDark ? "rgba(253,230,138,0.82)" : "rgba(42,31,14,0.82)";
  const quoteColor    = isDark ? "rgba(253,230,138,0.92)" : "rgba(42,31,14,0.90)";
  const lessonColor   = isDark ? "rgba(253,230,138,0.90)" : "rgba(42,31,14,0.85)";
  const archetypeMap  = isDark ? ARCHETYPE_COLORS_DARK : ARCHETYPE_COLORS_LIGHT;
  const fallbackBg    = isDark ? "rgba(139,105,20,0.06)" : "rgba(139,105,20,0.10)";

  return (
    <section
      id={`char-${character.id}`}
      className="relative overflow-hidden"
      style={{
        padding: "96px 0",
        background: sectionBg,
      }}
    >
      {/* Ambient glow behind this character */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at ${isEven ? "20%" : "80%"} 50%, rgba(${character.accentRgb},0.07) 0%, transparent 65%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            isEven ? "" : "lg:grid-flow-dense"
          }`}
        >
          {/* ── Image side ── */}
          <div
            ref={sectionRef}
            className={`char-reveal ${isEven ? "" : "lg:col-start-2"}`}
          >
            <div
              className="relative rounded-3xl overflow-hidden group cinematic-frame char-glow"
              style={{
                aspectRatio: "4/5",
                boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(${character.accentRgb},0.15)`,
              }}
            >
              {/* Character image — onerror prevents layout collapse if asset fails */}
              <img
            loading="lazy"
            decoding="async"
                src={image}
                alt={`${character.name} — ${character.title}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.opacity = "0";
                  el.style.backgroundColor = "rgba(251,191,36,0.08)";
                }}
              />

              {/* Cinematic gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,15,26,0.85) 0%, rgba(11,15,26,0.2) 40%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to ${isEven ? "right" : "left"}, rgba(11,15,26,0.3), transparent 60%)`,
                }}
              />

              {/* Accent border glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 0 1px rgba(${character.accentRgb},0.35)` }}
              />

              {/* Alliance / Parva badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span
                  className="font-heading text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: `rgba(${character.accentRgb},0.2)`,
                    border: `1px solid rgba(${character.accentRgb},0.3)`,
                    color: character.accentHex,
                  }}
                >
                  {character.archetype}
                </span>
                <span
                  className="font-heading text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.18)",
                    color: "rgba(253,230,138,0.75)",
                  }}
                >
                  {character.alliance}
                </span>
              </div>
            </div>
          </div>

          {/* ── Content side ── */}
          <div
            
            className={`stagger-children ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* Index number */}
            <div className="flex items-center gap-4 mb-5">
              <span
                className="font-heading text-[11px] tracking-[0.3em]"
                style={{ color: `rgba(${character.accentRgb},0.45)` }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div
                className="h-px flex-1 max-w-[40px]"
                style={{ background: `rgba(${character.accentRgb},0.3)` }}
              />
              <span
                className="font-heading text-[10px] tracking-[0.3em] uppercase"
                style={{ color: `rgba(${character.accentRgb},0.6)` }}
              >
                {character.parva}
              </span>
            </div>

            {/* Name */}
            <h2
              className="font-heading font-black leading-[0.95] mb-3"
              style={{
                fontSize: "clamp(52px, 7vw, 88px)",
                background: `linear-gradient(135deg, rgba(${character.accentRgb},1) 0%, rgba(${character.accentRgb},0.6) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {character.name}
            </h2>

            {/* Title */}
            <p
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(18px, 2.1vw, 22px)",
                fontStyle: "italic",
                color: titleColor,
              }}
            >
              {character.title}
            </p>

            {/* Epithets */}
            <div className="flex flex-wrap gap-2 mb-7">
              {character.epithets.map((ep) => (
                <span
                  key={ep}
                  className="font-heading text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: archetypeMap[character.archetype] || fallbackBg,
                    border: `1px solid rgba(${character.accentRgb},0.2)`,
                    color: `rgba(${character.accentRgb},0.8)`,
                  }}
                >
                  {ep}
                </span>
              ))}
            </div>

            {/* Bio */}
            <div className="mb-7 space-y-3">
              {character.bio.map((para, i) => (
                <p
                  key={i}
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: bioColor,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Traits */}
            <div className="flex flex-wrap gap-2 mb-8">
              {character.traits.map((trait) => (
                <span
                  key={trait.label}
                  className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{ borderColor: `rgba(${character.accentRgb},0.2)` }}
                >
                  <span style={{ fontSize: "14px" }}>{trait.icon}</span>
                  <span
                    className="font-heading text-[11px] tracking-[0.12em] uppercase"
                    style={{ color: `rgba(${character.accentRgb},0.9)` }}
                  >
                    {trait.label}
                  </span>
                </span>
              ))}
            </div>

            {/* Famous quote */}
            <div
              className="relative mb-7 rounded-xl overflow-hidden"
              style={{
                borderLeft: `3px solid rgba(${character.accentRgb},0.5)`,
                background: `rgba(${character.accentRgb},0.04)`,
                padding: "18px 20px",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, rgba(${character.accentRgb},0.4), transparent)`,
                }}
              />
              <p
                className="italic leading-relaxed mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(17px, 1.8vw, 20px)",
                  color: quoteColor,
                  fontStyle: "italic",
                }}
              >
                "{character.quote}"
              </p>
              <span
                className="font-heading text-[10px] tracking-[0.25em] uppercase"
                style={{ color: `rgba(${character.accentRgb},0.5)` }}
              >
                — {character.quoteSource}
              </span>
            </div>

            {/* Stat bars */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={14} style={{ color: `rgba(${character.accentRgb},0.7)` }} />
                <span
                  className="font-heading text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: `rgba(${character.accentRgb},0.6)` }}
                >
                  {t("characters.profile")}
                </span>
              </div>
              <CharacterStatBars
                stats={character.stats}
                accentHex={character.accentHex}
                accentRgb={character.accentRgb}
              />
            </div>

            {/* Life lesson callout */}
            <div
              className="rounded-xl p-5 mb-8 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(${character.accentRgb},0.08), rgba(${character.accentRgb},0.03))`,
                border: `1px solid rgba(${character.accentRgb},0.18)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, rgba(${character.accentRgb},0.4), transparent)`,
                }}
              />
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-heading text-xs"
                  style={{
                    background: `rgba(${character.accentRgb},0.12)`,
                    border: `1px solid rgba(${character.accentRgb},0.25)`,
                    color: character.accentHex,
                  }}
                >
                  ✦
                </div>
                <p
                  className="italic leading-relaxed"
                  style={{
                    fontSize: "14px",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: lessonColor,
                  }}
                >
                  {character.lesson}
                </p>
              </div>
            </div>

            {/* ── Personality Insight ── */}
            {character.personalityInsight && (
              <div
                className="rounded-xl p-5 mb-8 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(${character.accentRgb},0.06), rgba(${character.accentRgb},0.02))`,
                  border: `1px solid rgba(${character.accentRgb},0.18)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, rgba(${character.accentRgb},0.5), transparent)`,
                  }}
                />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} style={{ color: character.accentHex }} />
                  <span
                    className="font-heading text-[10px] tracking-[0.28em] uppercase"
                    style={{ color: `rgba(${character.accentRgb},0.65)` }}
                  >
                    {QUIZ_CHARACTER_IDS.has(character.id)
                      ? "If you resonate with this character"
                      : "What this character reveals about you"}
                  </span>
                </div>
                <p
                  className="leading-relaxed mb-4"
                  style={{
                    fontSize: "clamp(15px, 1.7vw, 17px)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    color: isDark ? "rgba(253,230,138,0.82)" : "rgba(42,31,14,0.82)",
                  }}
                >
                  {character.personalityInsight}
                </p>
                {QUIZ_CHARACTER_IDS.has(character.id) && (
                  <Link
                    to="/quiz"
                    className="inline-flex items-center gap-2 font-heading text-[11px] tracking-[0.15em] uppercase transition-opacity hover:opacity-80"
                    style={{ color: character.accentHex }}
                  >
                    <Sparkles size={11} />
                    Take the quiz to confirm your match
                  </Link>
                )}
              </div>
            )}

            {/* CTA */}
            <Link
              to={`/blog/${character.articleSlug}`}
              className="inline-flex items-center gap-3 group"
            >
              <span
                className="px-7 py-3.5 rounded-full font-heading text-[12px] tracking-[0.1em] uppercase transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, rgba(${character.accentRgb},0.9), rgba(${character.accentRgb},0.7))`,
                  color: "#0C0900",
                  fontWeight: 700,
                  boxShadow: `0 0 24px rgba(${character.accentRgb},0.35)`,
                }}
              >
                {t("characters.read_story")}
              </span>
              <ArrowRight
                size={16}
                style={{ color: character.accentHex }}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CharacterProfile);
