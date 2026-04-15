import type { StoryBlock } from "@/data/articles";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StorySectionProps {
  storyBlocks: StoryBlock[];
}

const sectionMeta: Record<
  StoryBlock["section"],
  { numeral: string; color: string; border: string }
> = {
  introduction: {
    numeral: "I",
    color: "text-primary/60",
    border: "rgba(212,175,55,0.35)",
  },
  background: {
    numeral: "II",
    color: "text-muted-foreground/60",
    border: "rgba(139,105,20,0.22)",
  },
  turningPoint: {
    numeral: "III",
    color: "text-red-400/60",
    border: "rgba(139,0,0,0.45)",
  },
};

const StoryBlock = ({
  block,
  index,
}: {
  block: StoryBlock;
  index: number;
}) => {
  const ref = useScrollReveal<HTMLDivElement>();
  const meta = sectionMeta[block.section];

  return (
    <div
      ref={ref}
      className="reveal-element"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Roman numeral */}
        <span
          className={`font-heading text-[11px] tracking-[0.3em] ${meta.color} flex-shrink-0`}
          style={{ fontVariantNumeric: "oldstyle-nums" }}
        >
          {meta.numeral}
        </span>
        <div className="h-px flex-1" style={{ background: meta.border }} />
        <span
          className="font-heading text-[10px] tracking-[0.28em] uppercase flex-shrink-0"
          style={{ color: meta.border === "rgba(212,175,55,0.35)" ? "rgba(212,175,55,0.7)" : "rgba(255,255,255,0.25)" }}
        >
          {block.label}
        </span>
      </div>

      {/* Paragraphs */}
      <div className="space-y-4 mb-14">
        {block.paragraphs.map((para, i) => (
          <p
            key={i}
            className={`leading-[1.9] ${
              i === 0 && block.section === "introduction"
                ? "text-foreground/85 font-medium"
                : "text-foreground/72"
            }`}
            style={{
              fontSize: i === 0 && block.section === "introduction"
                ? "clamp(17px, 1.9vw, 21px)"
                : "clamp(16px, 1.8vw, 19px)",
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            {/* Italic direct speech detection */}
            {para.startsWith("I ") ||
            para.startsWith("You ") ||
            para.includes(" said:") ? (
              <span>{para}</span>
            ) : (
              para
            )}
          </p>
        ))}
      </div>
    </div>
  );
};

const StorySection = ({ storyBlocks }: StorySectionProps) => {
  if (!storyBlocks || storyBlocks.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div
        className="max-w-[680px] mx-auto px-6 md:px-8"
      >
        {storyBlocks.map((block, i) => (
          <StoryBlock key={block.section} block={block} index={i} />
        ))}
      </div>
    </section>
  );
};

export default StorySection;
