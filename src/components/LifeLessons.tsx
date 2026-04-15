import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const lessons = [
  {
    title: "Dharma Over Desire",
    insight: "Krishna teaches that true fulfillment comes not from chasing desire, but from aligning with your dharma — your sacred duty.",
    chapter: "Bhagavad Gita 2.47",
  },
  {
    title: "The Power of Detachment",
    insight: "Act without attachment to results. Excellence emerges when ego dissolves and purpose takes its place.",
    chapter: "Bhagavad Gita 2.48",
  },
  {
    title: "Loyalty Has Limits",
    insight: "Bhishma's unwavering oath teaches us that blind loyalty without wisdom becomes the greatest weakness.",
    chapter: "Adi Parva",
  },
  {
    title: "Silence is Strategy",
    insight: "Krishna's silence in the court of Hastinapura shows that sometimes the greatest power lies in restraint.",
    chapter: "Udyoga Parva",
  },
  {
    title: "Truth Beyond Morality",
    insight: "The epic reveals that truth isn't always comfortable — and sometimes dharma demands uncomfortable choices.",
    chapter: "Shanti Parva",
  },
  {
    title: "Rise After Every Fall",
    insight: "The Pandavas lost everything — kingdom, dignity, freedom. Yet they rose. Resilience is the ultimate dharma.",
    chapter: "Vana Parva",
  },
];

const LifeLessons = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
            <span className="section-label">Wisdom</span>
            <h2 className="section-title !text-left">Life Lessons</h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full glass-card hover:border-primary/40 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full glass-card hover:border-primary/40 transition-colors"
              aria-label="Scroll right"
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
              className="flex-shrink-0 w-72 lg:w-80 glass-card p-7 snap-start hover-lift group"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mb-6">
                <span className="text-primary font-heading text-xs">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-heading text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {lesson.insight}
              </p>
              <span className="text-primary/50 text-[11px] tracking-wider">{lesson.chapter}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeLessons;
