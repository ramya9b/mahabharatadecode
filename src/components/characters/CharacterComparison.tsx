import { Link } from "react-router-dom";
import type { Character } from "@/data/characters";
import { resolveImage } from "@/utils/images";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CharacterComparisonProps {
  characters: Character[];
}

const STAT_LABELS = ["Warrior Skill", "Wisdom", "Loyalty", "Sacrifice", "Dharma"];

const CharacterComparison = ({ characters }: CharacterComparisonProps) => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--parchment-2)), hsl(var(--parchment-1)))",
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20" ref={ref}>
        {/* Header */}
        <div className="reveal-element text-center mb-16">
          <span className="section-label">Side by Side</span>
          <h2 className="section-title">
            Five Warriors,{" "}
            <span className="gold-text">One Truth</span>
          </h2>
          <p
            className="mt-4 leading-relaxed mx-auto"
            style={{
              fontSize: "17px",
              color: "hsl(var(--foreground) / 0.65)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              maxWidth: "480px",
            }}
          >
            Every character in the Mahabharata is a different answer to the same question:
            what does it mean to live with integrity?
          </p>
        </div>

        {/* Comparison table */}
        <div className="reveal-element overflow-x-auto">
          <table
            className="w-full"
            style={{ minWidth: "640px", borderCollapse: "separate", borderSpacing: "0 8px" }}
          >
            <thead>
              <tr>
                <th
                  className="font-heading text-[10px] tracking-[0.25em] uppercase text-left pb-4 pr-4"
                  style={{ color: "hsl(var(--foreground) / 0.60)", width: "140px" }}
                >
                  Attribute
                </th>
                {characters.map((char) => (
                  <th key={char.id} className="pb-4 px-3" style={{ width: "120px" }}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="rounded-full overflow-hidden"
                        style={{
                          width: "44px",
                          height: "44px",
                          border: `2px solid rgba(${char.accentRgb},0.4)`,
                        }}
                      >
                        <img
            loading="lazy"
            decoding="async"
                          src={resolveImage(char.imageKey)}
                          alt={`${char.name} — character portrait`}
                          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span
                        className="font-heading text-[11px] tracking-[0.1em]"
                        style={{ color: char.accentHex }}
                      >
                        {char.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAT_LABELS.map((stat) => (
                <tr
                  key={stat}
                  className="group"
                >
                  <td
                    className="font-heading text-[11px] tracking-[0.12em] uppercase py-3 pr-4"
                    style={{
                      color: "hsl(var(--foreground) / 0.65)",
                      borderRadius: "8px 0 0 8px",
                    }}
                  >
                    {stat}
                  </td>
                  {characters.map((char) => {
                    const s = char.stats.find((st) => st.label === stat);
                    const val = s?.value ?? 0;
                    return (
                      <td key={char.id} className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex-1 rounded-full overflow-hidden"
                            style={{ height: "6px", background: "rgba(139,105,20,0.09)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: val + "%",
                                background: `linear-gradient(to right, rgba(${char.accentRgb},0.5), ${char.accentHex})`,
                              }}
                            />
                          </div>
                          <span
                            className="font-heading text-[10px] tabular-nums"
                            style={{ color: `rgba(${char.accentRgb},0.7)`, minWidth: "22px" }}
                          >
                            {val}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Character archetype legend */}
        <div className="reveal-element mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          {characters.map((char) => (
            <Link
              key={char.id}
              to={`/blog/${char.articleSlug}`}
              className="glass-card p-4 rounded-xl hover-lift text-center group"
              style={{ borderColor: `rgba(${char.accentRgb},0.15)` }}
            >
              <div
                className="font-heading text-[10px] tracking-[0.2em] uppercase mb-1"
                style={{ color: `rgba(${char.accentRgb},0.6)` }}
              >
                {char.archetype}
              </div>
              <div
                className="font-heading font-bold text-lg group-hover:text-primary transition-colors"
                style={{ color: char.accentHex }}
              >
                {char.name}
              </div>
              <div
                className="text-xs mt-1 italic"
                style={{
                  color: "hsl(var(--foreground) / 0.60)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {char.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CharacterComparison;
