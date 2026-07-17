import { useEffect, useRef } from "react";
import type { CharacterStat } from "@/data/characters";
import { useTheme } from "@/context/ThemeContext";

interface CharacterStatBarsProps {
  stats: CharacterStat[];
  accentHex: string;
  accentRgb: string;
}

const CharacterStatBars = ({ stats, accentHex, accentRgb }: CharacterStatBarsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const labelColor = isDark ? "rgba(134,239,172,0.72)" : "rgba(42,31,14,0.65)";

  useEffect(() => {
    const bars = containerRef.current?.querySelectorAll<HTMLDivElement>(".stat-fill");
    if (!bars) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.value + "%";
            }, i * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [stats]);

  return (
    <div ref={containerRef} className="space-y-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="font-heading text-[11px] tracking-[0.18em] uppercase"
              style={{ color: labelColor }}
            >
              {stat.label}
            </span>
            <span
              className="font-heading text-[11px]"
              style={{ color: accentHex }}
            >
              {stat.value}
            </span>
          </div>
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(139,105,20,0.1)" }}
          >
            <div
              className="stat-fill h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: "0%",
                background: `linear-gradient(to right, rgba(${accentRgb},0.6), ${accentHex})`,
              }}
              data-value={stat.value}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterStatBars;
