import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ReelHookProps {
  hook: string;
  supporting: string;
}

const ReelHook = ({ hook, supporting }: ReelHookProps) => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="reveal-element py-20 md:py-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden px-8 md:px-14 py-14 md:py-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,0,0,0.07) 0%, rgba(11,15,26,0.97) 40%, rgba(107,45,143,0.06) 100%)",
            border: "1px solid rgba(107,45,143,0.14)",
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(107,45,143,0.5), transparent)",
            }}
          />

          {/* Reel label */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-primary/30" />
            <span
              className="text-primary/60 text-[10px] tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Share This Story
            </span>
            <div className="h-px w-8 bg-primary/30" />
          </div>

          {/* Hook */}
          <p
            className="font-heading font-semibold leading-snug mb-6"
            style={{
              fontSize: "clamp(20px, 2.8vw, 30px)",
              fontStyle: "italic",
              color: "rgba(245,232,238,0.95)",
            }}
          >
            "{hook}"
          </p>

          {/* Supporting */}
          <p
            style={{
              fontSize: "clamp(17px, 1.9vw, 19px)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "rgba(245,237,218,0.72)",
              lineHeight: 1.75,
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            {supporting}
          </p>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-8 bg-primary/20" />
            <span className="text-primary/25 text-[10px] tracking-widest">✦</span>
            <div className="h-px w-8 bg-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReelHook;
