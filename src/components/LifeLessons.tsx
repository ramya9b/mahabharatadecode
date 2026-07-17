import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const LESSON_KEYS = [
  { id: "dharma",      chapter: "Bhagavad Gita 2.47" },
  { id: "detachment",  chapter: "Bhagavad Gita 2.48" },
  { id: "loyalty",     chapter: "Adi Parva" },
  { id: "silence",     chapter: "Udyoga Parva" },
  { id: "truth",       chapter: "Shanti Parva" },
  { id: "rise",        chapter: "Vana Parva" },
] as const;

const LifeLessons = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lessons = LESSON_KEYS.map(l => ({
    title:   t(`home.life_lessons.${l.id}_title`),
    insight: t(`home.life_lessons.${l.id}_insight`),
    chapter: l.chapter,
  }));

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -360 : 360,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="lessons" className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <div>
            <span className="section-label">{t("home.life_lessons.eyebrow")}</span>
            <h2 className="section-title !text-left">{t("home.life_lessons.title")}</h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full glass-card hover:border-primary/40 transition-colors"
              aria-label={t("home.life_lessons.scroll_left")}
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full glass-card hover:border-primary/40 transition-colors"
              aria-label={t("home.life_lessons.scroll_right")}
            >
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {lessons.map((lesson, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start premium-card"
              style={{
                width: "300px",
                background: "rgba(22,11,0,0.85)",
                border: "1px solid rgba(34,197,94,0.22)",
                borderRadius: "16px",
                padding: "28px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(34,197,94,0.55)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(34,197,94,0.22)";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              {/* Number badge */}
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.30)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                <span style={{
                  fontFamily: "'Cinzel',serif", fontSize: "11px",
                  color: "#22C55E", fontWeight: 600,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {/* Title */}
              <h3 style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "17px",
                fontWeight: 600,
                color: "#86EFAC",
                marginBottom: "12px",
                lineHeight: 1.3,
              }}>
                {lesson.title}
              </h3>
              {/* Insight */}
              <p style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: "16px",
                lineHeight: 1.8,
                color: "rgba(134,239,172,0.75)",
                marginBottom: "20px",
              }}>
                {lesson.insight}
              </p>
              {/* Chapter reference */}
              <span style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                color: "rgba(34,197,94,0.70)",
                textTransform: "uppercase",
              }}>
                {lesson.chapter}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeLessons;
