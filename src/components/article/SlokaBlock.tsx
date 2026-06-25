import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SlokaBlockProps {
  sloka: {
    sanskrit: string;
    transliteration: string;
    translation: string;
  };
}

const SlokaBlock = ({ sloka }: SlokaBlockProps) => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="reveal-element relative rounded-3xl overflow-hidden my-16 md:my-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(11,15,26,0.9) 0%, rgba(20,16,8,0.95) 50%, rgba(11,15,26,0.9) 100%)",
        border: "1px solid rgba(212,175,55,0.2)",
        boxShadow:
          "0 0 60px rgba(212,175,55,0.05), inset 0 0 60px rgba(212,175,55,0.02)",
      }}
    >
      {/* Corner ornaments */}
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${pos}`}
          style={{ borderColor: "rgba(212,175,55,0.25)" }}
        />
      ))}

      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)",
        }}
      />

      <div className="px-8 md:px-14 py-12 md:py-14 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(212,175,55,0.3)" }} />
          <div className="flex items-center gap-2">
            <span className="text-primary/40 text-xs">✦</span>
            <span
              className="text-primary/70 tracking-[0.3em] text-[10px] uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Sacred Verse
            </span>
            <span className="text-primary/40 text-xs">✦</span>
          </div>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(212,175,55,0.3)" }} />
        </div>

        {/* Sanskrit text */}
        <div className="mb-6">
          {sloka.sanskrit.split("\n").map((line, i) => (
            <p
              key={i}
              className="leading-[1.8]"
              style={{
                fontFamily: "'Noto Serif Devanagari', 'Noto Sans Devanagari', 'Siddhanta', 'Sanskrit 2003', 'Cinzel', serif",
                fontSize: "clamp(18px, 2.5vw, 26px)",
                color: "rgba(139,98,8,0.9)",
                unicodeBidi: "normal",
                direction: "ltr",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Transliteration */}
        <div className="mb-8">
          {sloka.transliteration.split("\n").map((line, i) => (
            <p
              key={i}
              style={{
                fontSize: "clamp(13px, 1.4vw, 15px)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.04em",
                color: "rgba(245,237,218,0.65)",
                fontStyle: "italic",
                lineHeight: 1.75,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.2)" }} />
          <span className="text-primary/30 text-[8px] tracking-widest">✦</span>
          <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.2)" }} />
        </div>

        {/* Translation */}
        <p
          className="text-foreground/80 leading-relaxed max-w-xl mx-auto"
          style={{
            fontSize: "clamp(15px, 1.7vw, 18px)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
          }}
        >
          "{sloka.translation}"
        </p>
      </div>
    </div>
  );
};

export default SlokaBlock;
