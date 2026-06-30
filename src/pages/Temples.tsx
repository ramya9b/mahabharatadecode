import { useState, useEffect, useRef } from "react";
import { MapPin, Shield, BookOpen, Users, Filter, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import {
  TEMPLES,
  UNIQUE_STATES,
  TIER_LABELS,
  TIER_COLORS,
  type MahabharataTemple,
} from "@/data/temples";

/* ── Tier badge ───────────────────────────────────────────────────── */
const TierBadge = ({ tier }: { tier: 1 | 2 | 3 }) => {
  const color = TIER_COLORS[tier];
  const label = TIER_LABELS[tier];
  const icon = tier === 1 ? <Shield size={10} /> : tier === 2 ? <BookOpen size={10} /> : <Users size={10} />;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] tracking-[0.12em] uppercase font-heading"
      style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}
    >
      {icon} {label}
    </span>
  );
};

/* ── India SVG Map with temple pins ──────────────────────────────── */
const STATE_COORDS: Record<string, { x: number; y: number }> = {
  "Karnataka":       { x: 220, y: 420 },
  "Haryana":         { x: 230, y: 160 },
  "Assam":           { x: 480, y: 195 },
  "Maharashtra":     { x: 190, y: 340 },
  "Kerala":          { x: 215, y: 490 },
  "Tamil Nadu":      { x: 255, y: 480 },
  "Uttar Pradesh":   { x: 295, y: 215 },
  "Gujarat":         { x: 130, y: 265 },
  "West Bengal":     { x: 390, y: 270 },
};

const IndiaMap = ({
  temples,
  selected,
  onSelect,
}: {
  temples: MahabharataTemple[];
  selected: string | null;
  onSelect: (id: string) => void;
}) => {
  /* Group temples by state position */
  const byState: Record<string, MahabharataTemple[]> = {};
  temples.forEach(t => {
    if (!byState[t.state]) byState[t.state] = [];
    byState[t.state].push(t);
  });

  return (
    <div className="relative w-full" style={{ background: "hsl(var(--temple-card))", border: "1px solid hsl(var(--temple-card-border))", borderRadius: "16px", padding: "16px" }}>
      <p className="text-center text-[10px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.6)" }}>
        Temple Locations Across India
      </p>
      {/* Simplified India outline SVG */}
      <svg viewBox="0 0 560 580" className="w-full" style={{ maxHeight: "400px" }}>
        {/* India outline path — simplified */}
        <path
          d="M 130 60 L 180 45 L 240 50 L 300 40 L 360 55 L 420 70 L 460 100 L 490 140 L 500 180 L 510 220 L 490 260 L 480 300 L 460 330 L 440 360 L 420 390 L 400 420 L 380 450 L 360 470 L 340 490 L 320 510 L 300 525 L 280 515 L 260 500 L 240 480 L 220 460 L 200 440 L 185 415 L 170 390 L 155 360 L 140 330 L 125 300 L 110 270 L 105 235 L 100 200 L 108 165 L 115 130 L 120 100 Z"
          fill="hsl(var(--primary) / 0.06)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1.5"
        />
        {/* State label areas */}
        {Object.entries(byState).map(([state, ts]) => {
          const pos = STATE_COORDS[state];
          if (!pos) return null;
          const hasSelected = ts.some(t => t.id === selected);
          return (
            <g key={state}>
              {/* Cluster indicator */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={ts.length > 1 ? 14 : 8}
                fill={hasSelected ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))"}
                stroke={hasSelected ? "#D4AF37" : "hsl(var(--primary) / 0.6)"}
                strokeWidth="1.5"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(ts[0].id)}
              />
              {ts.length > 1 && (
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#D4AF37"
                  fontSize="10"
                  fontFamily="serif"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {ts.length}
                </text>
              )}
              {ts.length === 1 && (
                <circle cx={pos.x} cy={pos.y} r={3} fill="#D4AF37" style={{ pointerEvents: "none" }} />
              )}
              {/* State label */}
              <text
                x={pos.x}
                y={pos.y + (ts.length > 1 ? 26 : 20)}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="8"
                fontFamily="serif"
                style={{ pointerEvents: "none" }}
              >
                {state}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-center mt-2 text-[9px]" style={{ color: "hsl(var(--primary) / 0.5)", fontFamily: "'Cormorant Garamond', serif" }}>
        Tap a pin to jump to that state's temples
      </p>
    </div>
  );
};

/* ── Temple card ──────────────────────────────────────────────────── */
const TempleCard = ({
  temple,
  isSelected,
  onSelect,
}: {
  temple: MahabharataTemple;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tier = temple.mahabharataConnection.tier;
  const color = TIER_COLORS[tier];

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "hsl(var(--temple-card))",
        border: isSelected
          ? `2px solid ${temple.specialDisplay?.borderColor ?? color}`
          : `1px solid hsl(var(--temple-card-border))`,
        boxShadow: isSelected ? `0 0 24px ${color}22` : "none",
      }}
    >
      {/* Special display label */}
      {temple.specialDisplay?.label && (
        <div
          className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase text-center"
          style={{
            fontFamily: "'Cinzel', serif",
            background: `${temple.specialDisplay.borderColor ?? color}22`,
            borderBottom: `1px solid ${temple.specialDisplay.borderColor ?? color}44`,
            color: temple.specialDisplay.borderColor ?? color,
          }}
        >
          {temple.specialDisplay.label}
        </div>
      )}

      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 cursor-pointer"
        onClick={() => { onSelect(); setExpanded(e => !e); }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <TierBadge tier={tier} />
              {temple.isUNESCO && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] tracking-[0.1em] uppercase" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}>
                  UNESCO
                </span>
              )}
              {temple.isASIProtected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] tracking-[0.1em] uppercase" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ADE80" }}>
                  ASI
                </span>
              )}
            </div>
            <h3
              className="font-heading font-bold leading-snug mb-1"
              style={{ fontSize: "clamp(16px, 1.8vw, 19px)", color: "hsl(var(--foreground))" }}
            >
              {temple.name}
            </h3>
            <p className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "hsl(var(--primary))", fontFamily: "'Cinzel', serif" }}>
              <MapPin size={11} />
              {temple.city}, {temple.state}
            </p>
          </div>
          <div className="flex-shrink-0 mt-1">
            {expanded ? <ChevronUp size={16} style={{ color: "hsl(var(--primary) / 0.6)" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--primary) / 0.6)" }} />}
          </div>
        </div>

        {/* Summary */}
        <p style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>
          {temple.verifiedSignificance.slice(0, 120)}...
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-6 border-t" style={{ borderColor: "hsl(var(--primary) / 0.1)" }}>
          <div className="pt-4 space-y-5">

            {/* Mahabharata connection */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif", color }}>
                Mahabharata Connection
              </p>
              <TierBadge tier={tier} />
              <p className="mt-2" style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground) / 0.85)", lineHeight: 1.7 }}>
                {temple.mahabharataConnection.detail}
              </p>
            </div>

            {/* Historical debate */}
            <div className="rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.1)" }}>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.7)" }}>
                What Is Actually Known
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#4ADE80", fontFamily: "'Cinzel', serif" }}>Verified Fact</p>
                  <p style={{ fontSize: "13px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground) / 0.85)", lineHeight: 1.6 }}>
                    {temple.historicalDebate.verifiedFact}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Cinzel', serif" }}>Tradition</p>
                  <p style={{ fontSize: "13px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground) / 0.85)", lineHeight: 1.6 }}>
                    {temple.historicalDebate.tradition}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#A78BFA", fontFamily: "'Cinzel', serif" }}>Scholarly Note</p>
                  <p style={{ fontSize: "13px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground) / 0.85)", lineHeight: 1.6 }}>
                    {temple.historicalDebate.scholarlyNote}
                  </p>
                </div>
                <div className="pt-1">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[9px] tracking-widest uppercase"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      background: temple.historicalDebate.verdict === "archaeologically-confirmed"
                        ? "rgba(34,197,94,0.1)" : "hsl(var(--primary) / 0.08)",
                      border: `1px solid ${temple.historicalDebate.verdict === "archaeologically-confirmed" ? "rgba(34,197,94,0.3)" : "hsl(var(--primary) / 0.25)"}`,
                      color: temple.historicalDebate.verdict === "archaeologically-confirmed" ? "#4ADE80" : "hsl(var(--primary))",
                    }}
                  >
                    {temple.historicalDebate.verdict.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Critical question */}
            <div
              className="rounded-xl p-5 relative"
              style={{
                background: `${color}08`,
                border: `1px solid ${color}25`,
              }}
            >
              <div
                className="absolute -top-3 left-5 px-3 py-0.5 rounded-full text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", background: "hsl(var(--background))", border: `1px solid ${color}40`, color }}
              >
                The Question Worth Asking
              </div>
              <p
                className="italic leading-relaxed"
                style={{ fontSize: "clamp(14px, 1.6vw, 16px)", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground))" }}
              >
                "{temple.criticalQuestion}"
              </p>
            </div>

            {/* Visit info */}
            <div className="flex items-start gap-3">
              <MapPin size={13} style={{ color: "hsl(var(--primary) / 0.6)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: "13px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>
                {temple.visitInfo}
              </p>
            </div>

            {/* Primary sources */}
            {temple.primarySources.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.6)" }}>
                  Primary Sources
                </p>
                {temple.primarySources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-1 hover:opacity-80 transition-opacity"
                    style={{ fontSize: "12px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--primary))", textDecoration: "none" }}
                  >
                    <ExternalLink size={10} style={{ flexShrink: 0 }} />
                    {src.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main page ────────────────────────────────────────────────────── */
export default function Temples() {
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<"all" | 1 | 2 | 3>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useSEO({
    title: "Temples of the Mahabharata — State by State",
    description: "20 temples across India connected to the Mahabharata — with verified facts, classical text sources, and the critical questions each site raises. Hoysaleshwara, Kurukshetra, Dwarka, Ellora, and more.",
    path: "/temples",
    type: "website",
  });

  const filtered = TEMPLES.filter(t => {
    if (selectedState !== "All" && t.state !== selectedState) return false;
    if (selectedTier !== "all" && t.mahabharataConnection.tier !== selectedTier) return false;
    return true;
  });

  const handleMapSelect = (id: string) => {
    const temple = TEMPLES.find(t => t.id === id);
    if (temple) {
      setSelectedState(temple.state);
      setSelectedId(id);
    }
  };

  const tierCounts = {
    1: TEMPLES.filter(t => t.mahabharataConnection.tier === 1).length,
    2: TEMPLES.filter(t => t.mahabharataConnection.tier === 2).length,
    3: TEMPLES.filter(t => t.mahabharataConnection.tier === 3).length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 px-6 text-center max-w-4xl mx-auto">
          <span
            className="inline-block mb-4 text-[11px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary))" }}
          >
            Sacred Geography
          </span>
          <h1
            className="font-heading font-bold mb-5 leading-tight"
            style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
          >
            Temples of the Mahabharata
            <span
              className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #E8C547 0%, #D4AF37 55%, #B8922A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              State by State
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px, 1.9vw, 19px)", color: "hsl(var(--muted-foreground))" }}
          >
            20 temples across India connected to the Mahabharata. Each entry separates
            verified archaeological fact from classical text tradition from regional legend —
            and asks the question the site itself raises.
          </p>

          {/* Source tier legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {([1, 2, 3] as const).map(tier => (
              <div key={tier} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: TIER_COLORS[tier] }} />
                <span style={{ fontSize: "12px", fontFamily: "'Cinzel', serif", color: "hsl(var(--muted-foreground))", letterSpacing: "0.05em" }}>
                  Tier {tier}: {TIER_LABELS[tier]} ({tierCounts[tier]})
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">

            {/* Left sidebar — map + filters */}
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Map */}
              <IndiaMap
                temples={filtered}
                selected={selectedId}
                onSelect={handleMapSelect}
              />

              {/* Filters */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--temple-card-border))" }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  style={{ background: "hsl(var(--temple-card))" }}
                  onClick={() => setShowFilters(f => !f)}
                >
                  <span className="flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif", fontSize: "12px", letterSpacing: "0.15em", color: "hsl(var(--primary))" }}>
                    <Filter size={13} />
                    Filter Temples
                  </span>
                  {showFilters ? <ChevronUp size={14} style={{ color: "hsl(var(--primary) / 0.6)" }} /> : <ChevronDown size={14} style={{ color: "hsl(var(--primary) / 0.6)" }} />}
                </button>

                {showFilters && (
                  <div className="px-5 pb-5 pt-3 space-y-5" style={{ background: "hsl(var(--temple-card))" }}>
                    {/* State filter */}
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.6)" }}>
                        By State
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["All", ...UNIQUE_STATES].map(state => (
                          <button
                            key={state}
                            onClick={() => { setSelectedState(state); setSelectedId(null); }}
                            className="px-3 py-1 rounded-full text-[10px] tracking-wide transition-all"
                            style={{
                              fontFamily: "'Cinzel', serif",
                              background: selectedState === state ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.08)",
                              color: selectedState === state ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))",
                              border: selectedState === state ? "none" : "1px solid hsl(var(--primary) / 0.25)",
                            }}
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tier filter */}
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.6)" }}>
                        By Source Tier
                      </p>
                      <div className="space-y-2">
                        {([["all", "All Tiers", "#D4AF37"], [1, TIER_LABELS[1], TIER_COLORS[1]], [2, TIER_LABELS[2], TIER_COLORS[2]], [3, TIER_LABELS[3], TIER_COLORS[3]]] as const).map(([val, label, color]) => (
                          <button
                            key={String(val)}
                            onClick={() => { setSelectedTier(val as "all" | 1 | 2 | 3); setSelectedId(null); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                            style={{
                              background: selectedTier === val ? `${color}15` : "transparent",
                              border: selectedTier === val ? `1px solid ${color}40` : "1px solid transparent",
                            }}
                          >
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span style={{ fontSize: "11px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: selectedTier === val ? color : "hsl(var(--muted-foreground))" }}>
                              {String(label)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Count */}
              <p className="text-center text-[11px]" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.5)", letterSpacing: "0.15em" }}>
                Showing {filtered.length} of {TEMPLES.length} temples
              </p>
            </div>

            {/* Right — temple cards */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "hsl(var(--muted-foreground) / 0.8)" }}>
                    No temples match these filters.
                  </p>
                </div>
              ) : (
                filtered.map(temple => (
                  <TempleCard
                    key={temple.id}
                    temple={temple}
                    isSelected={selectedId === temple.id}
                    onSelect={() => setSelectedId(temple.id === selectedId ? null : temple.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Source integrity notice */}
          <div
            className="mt-16 rounded-2xl p-6 md:p-8"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary) / 0.7)" }}>
                Source Integrity Notice
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "hsl(var(--muted-foreground))", lineHeight: 1.8 }}>
                Every claim on this page is classified by source tier. Tier 1 entries are confirmed by ASI excavations,
                UNESCO records, surviving inscriptions, or peer-reviewed findings — and are stated as fact.
                Tier 2 entries appear in named, dated classical texts — and are always prefixed with the text name.
                Tier 3 entries are regional or oral traditions — and are always written as "regional tradition holds."
              </p>
              <p className="mt-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "hsl(var(--muted-foreground))", lineHeight: 1.8 }}>
                We never write "the Pandavas built this" without an ASI inscription confirming it.
                We never write "this temple dates to the Mahabharata era" without carbon dating confirming pre-500 BCE.
                We never conflate the age of a worship site with the age of its current structure.
              </p>
              <p className="mt-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14px", color: "hsl(var(--muted-foreground) / 0.8)", lineHeight: 1.8 }}>
                Primary sources linked in each entry. Last verified: June 2026.
                Errors or corrections: <a href="mailto:hello@mahabharatadecoded.com?subject=Temple data correction" style={{ color: "hsl(var(--primary))" }}>hello@mahabharatadecoded.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
