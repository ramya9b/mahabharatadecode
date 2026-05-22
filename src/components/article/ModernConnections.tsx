import type { ModernConnection } from "@/data/articles";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

interface ModernConnectionsProps {
  connections: ModernConnection[];
}

const ConnectionCard = ({
  conn,
  index,
}: {
  conn: ModernConnection;
  index: number;
}) => {
  const colors = [
    { border: "rgba(212,175,55,0.3)", bg: "rgba(212,175,55,0.04)", accent: "#D4AF37", label: "text-primary" },
    { border: "rgba(139,0,0,0.4)", bg: "rgba(139,0,0,0.05)", accent: "#8B0000", label: "text-red-500" },
    { border: "rgba(20,184,166,0.3)", bg: "rgba(20,184,166,0.04)", accent: "#14B8A6", label: "text-teal-400" },
  ];
  const c = colors[index % colors.length];

  return (
    <div
      className="reveal-element group relative rounded-2xl overflow-hidden hover-lift"
      style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
    >
      <div className="p-7 md:p-8">
        {/* Context label */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.accent }}
          >
            {index + 1}
          </div>
          <h3
            className={`font-heading text-[11px] tracking-[0.25em] uppercase font-semibold ${c.label}`}
          >
            {conn.context}
          </h3>
        </div>

        {/* Insight headline */}
        <p
          className="text-foreground font-heading text-[18px] md:text-[20px] leading-snug mb-5 font-medium"
          style={{ fontStyle: "italic" }}
        >
          "{conn.insight}"
        </p>

        {/* Divider */}
        <div
          className="h-px w-12 mb-5 rounded-full"
          style={{ background: c.border }}
        />

        {/* Example */}
        <p
          className="text-muted-foreground leading-relaxed"
          style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {conn.example}
        </p>
      </div>
    </div>
  );
};

const ModernConnections = ({ connections }: ModernConnectionsProps) => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggeredReveal(connections.length);

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      {/* Background subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,0,0,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        ref={headerRef}
        className="reveal-element max-w-3xl mx-auto px-6 md:px-12 lg:px-20 mb-14"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px w-10 bg-primary/40" />
          <span className="section-label !mb-0">Modern Parallels</span>
        </div>
        <h2
          className="font-heading font-bold text-foreground leading-tight"
          style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
        >
          This Story Is{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #E8C547 0%, #D4AF37 45%, #B8922A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Story
          </span>
        </h2>
        <p
          className="text-muted-foreground mt-4 leading-relaxed"
          style={{ fontSize: "17px" }}
        >
          The Mahabharata was not written for ancient India. It was written for every human being
          who has ever faced an impossible choice. Here is where Karna's dilemma lives today.
        </p>
      </div>

      {/* Cards */}
      <div
        ref={cardsRef}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
      >
        {connections.map((conn, i) => (
          <ConnectionCard key={i} conn={conn} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ModernConnections;
