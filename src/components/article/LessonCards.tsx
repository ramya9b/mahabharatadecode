import type { KeyLesson } from "@/data/articles";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

interface LessonCardsProps {
  lessons: KeyLesson[];
  characterName?: string;
}

const accentStyles = {
  gold: {
    card: "border-primary/20 hover:border-primary/40",
    icon: "bg-primary/10 border-primary/20 text-primary",
    glow: "from-primary/8 to-transparent",
    num: "text-primary/50",
  },
  crimson: {
    card: "border-red-900/30 hover:border-red-700/40",
    icon: "bg-red-950/40 border-red-800/30 text-red-400",
    glow: "from-red-950/30 to-transparent",
    num: "text-red-700/50",
  },
  teal: {
    card: "border-teal-900/30 hover:border-teal-700/40",
    icon: "bg-teal-950/40 border-teal-800/30 text-teal-400",
    glow: "from-teal-950/30 to-transparent",
    num: "text-teal-700/50",
  },
};

const LessonCard = ({
  lesson,
  index,
}: {
  lesson: KeyLesson;
  index: number;
}) => {
  const accent = lesson.accent ?? "gold";
  const s = accentStyles[accent];

  return (
    <div
      className={`reveal-element group relative glass-card overflow-hidden hover-lift cursor-default transition-all duration-500 ${s.card}`}
    >
      {/* Gradient background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${s.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Top shimmer on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            accent === "gold"
              ? "linear-gradient(to right, transparent, rgba(107,45,143,0.4), transparent)"
              : accent === "crimson"
              ? "linear-gradient(to right, transparent, rgba(139,0,0,0.5), transparent)"
              : "linear-gradient(to right, transparent, rgba(20,184,166,0.4), transparent)",
        }}
      />

      <div className="relative z-10 p-6 md:p-7">
        {/* Number + Icon row */}
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl flex-shrink-0 ${s.icon} transition-transform duration-300 group-hover:scale-110`}
          >
            {lesson.icon}
          </div>
          <span
            className={`font-heading text-[11px] tracking-[0.2em] ${s.num} mt-1`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-heading text-foreground text-[17px] font-semibold mb-3 leading-snug group-hover:text-primary transition-colors duration-300"
        >
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {lesson.description}
        </p>
      </div>
    </div>
  );
};

const LessonCards = ({ lessons, characterName = "the Mahabharata" }: LessonCardsProps) => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useStaggeredReveal(lessons.length);

  return (
    <section
      className="py-20 md:py-24 relative"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(107,45,143,0.03) 30%, rgba(139,0,0,0.03) 70%, transparent 100%)",
      }}
    >
      {/* Section header */}
      <div
        ref={headerRef}
        className="reveal-element max-w-3xl mx-auto px-6 md:px-12 lg:px-20 mb-14"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px w-10 bg-primary/40" />
          <span className="section-label !mb-0">Key Lessons</span>
        </div>
        <h2
          className="font-heading font-bold text-foreground leading-tight"
          style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
        >
          What {characterName}'s Story
          <span className="gold-text"> Teaches Us</span>
        </h2>
        <p className="text-muted-foreground mt-4 leading-relaxed" style={{ fontSize: "17px" }}>
          Six timeless principles extracted from the epic — each one a mirror held up to modern life.
        </p>
      </div>

      {/* Cards grid */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        {lessons.map((lesson, i) => (
          <LessonCard key={i} lesson={lesson} index={i} />
        ))}
      </div>
    </section>
  );
};

export default LessonCards;
