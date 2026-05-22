import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { X, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSEO } from "@/hooks/useSEO";
import {
  scenarios,
  getScenariosByDomain,
  getAllDomains,
  DOMAIN_META,
} from "@/data/wisdom";
import type { Domain, WisdomScenario } from "@/data/wisdom";

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
const WisdomHero = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      if (ref.current)
        ref.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div
        ref={ref}
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(139,0,0,0.12) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Sanskrit character */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(200px, 35vw, 380px)",
          color: "rgba(212,175,55,0.04)",
          lineHeight: 1,
          fontWeight: 900,
        }}
        aria-hidden="true"
      >
        ॐ
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="particle bg-primary/20"
            style={{
              width: "1.5px",
              height: "1.5px",
              left: (i * 7.2) + "%",
              bottom: "-6px",
              "--duration": (10 + i * 0.8) + "s",
              "--delay": (i * 0.6) + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-24 pb-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.35em] uppercase font-heading mb-10 animate-fade-up backdrop-blur-sm">
          {t("wisdom.eyebrow")}
        </div>

        {/* Heading */}
        <h1
          className="font-heading font-black leading-[0.95] mb-8 animate-fade-up-delay-1"
          style={{ fontSize: "clamp(42px, 8vw, 92px)" }}
        >
          <span className="gold-text block">Your life.</span>
          <span
            className="block"
            style={{ color: "rgba(42,31,14,0.9)", fontSize: "0.68em", marginTop: "6px" }}
          >
            Their story.
          </span>
        </h1>

        {/* Honest description — human voice */}
        <p
          className="leading-relaxed mx-auto mb-6 animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(18px, 2vw, 21px)",
            color: "rgba(253,230,138,0.68)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: 1.8,
            maxWidth: "560px",
          }}
        >
          Every difficult thing you are going through right now has already been
          lived — with more weight, higher stakes, and no playbook — by someone
          in the Mahabharata.
        </p>
        <p
          className="leading-relaxed mx-auto mb-14 animate-fade-up-delay-2"
          style={{
            fontSize: "17px",
            color: "rgba(253,230,138,0.50)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            maxWidth: "480px",
          }}
        >
          Find your situation. Read their story. Take what is useful.
        </p>

        {/* Domain count */}
        <div className="flex flex-wrap gap-6 justify-center animate-fade-up-delay-2">
          {getAllDomains().map((domain) => {
            const meta = DOMAIN_META[domain];
            const count = getScenariosByDomain(domain).length;
            return (
              <div key={domain} className="text-center">
                <div
                  className="font-heading font-black gold-text"
                  style={{ fontSize: "28px", lineHeight: 1 }}
                >
                  {count}
                </div>
                <div
                  className="font-heading text-[9px] tracking-[0.22em] uppercase mt-1"
                  style={{ color: "rgba(42,31,14,0.4)" }}
                >
                  {meta.label.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-36"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        aria-hidden="true"
      />

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        style={{ opacity: 0.3 }}
        aria-hidden="true"
      >
        <ChevronDown size={18} className="text-primary" />
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────
   DOMAIN TABS
────────────────────────────────────────────── */
const DomainTabs = ({

  active,
  onChange,
}: {
  active: Domain;
  onChange: (d: Domain) => void;
}) => (
  <div
    className="sticky z-30 bg-background/90 backdrop-blur-md border-b border-border/30 py-4"
    style={{ top: "56px" }}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        role="tablist"
        aria-label="Life domains"
      >
        {getAllDomains().map((domain) => {
          const meta = DOMAIN_META[domain];
          const isActive = active === domain;
          return (
            <button
              key={domain}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${domain}`}
              id={`tab-${domain}`}
              onClick={() => onChange(domain)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 flex-shrink-0"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08))"
                  : "rgba(139,105,20,0.05)",
                border: isActive
                  ? "1px solid rgba(212,175,55,0.35)"
                  : "1px solid rgba(139,105,20,0.09)",
                color: isActive ? "rgba(212,175,55,0.95)" : "rgba(253,230,138,0.60)",
              }}
            >
              <span style={{ fontSize: "17px" }} aria-hidden="true">
                {meta.icon}
              </span>
              <span className="font-heading text-[12px] tracking-[0.08em] uppercase">
                {meta.label}
              </span>
              <span
                className="font-heading text-[10px] ml-1"
                style={{ opacity: 0.55 }}
              >
                {getScenariosByDomain(domain).length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────────────
   SCENARIO CARD (grid item)
────────────────────────────────────────────── */
const ScenarioCard = ({
  scenario,
  index,
  onOpen,
}: {
  scenario: WisdomScenario;
  index: number;
  onOpen: (s: WisdomScenario) => void;
}) => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="reveal-element"
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <button
        onClick={() => onOpen(scenario)}
        className="w-full text-left glass-card rounded-2xl overflow-hidden hover-lift group transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        style={{ borderColor: `rgba(${scenario.accentRgb},0.12)` }}
        aria-label={`Read: ${scenario.headline}`}
      >
        {/* Accent top line */}
        <div
          className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${scenario.accentRgb},0.5), transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="p-6">
          {/* Character badge */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: scenario.accentHex }}
              aria-hidden="true"
            />
            <span
              className="font-heading text-[10px] tracking-[0.22em] uppercase"
              style={{ color: `rgba(${scenario.accentRgb},0.7)` }}
            >
              {scenario.characterName}
            </span>
          </div>

          {/* Headline */}
          <h3
            className="font-heading font-semibold leading-snug mb-3 group-hover:text-primary transition-colors duration-300"
            style={{
              fontSize: "clamp(15px, 1.8vw, 17px)",
              color: "rgba(253,230,138,0.92)",
            }}
          >
            {scenario.headline}
          </h3>

          {/* Subline */}
          <p
            className="leading-relaxed mb-5"
            style={{
              fontSize: "14px",
              color: "rgba(42,31,14,0.5)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              lineHeight: 1.85,
            }}
          >
            {scenario.subline}
          </p>

          {/* Read CTA */}
          <div
            className="flex items-center gap-2 font-heading text-[11px] tracking-[0.12em] uppercase transition-all duration-300"
            style={{ color: scenario.accentHex }}
          >
            <span>Read the story</span>
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform duration-300"
              aria-hidden="true"
            />
          </div>
        </div>
      </button>
    </div>
  );
};

/* ──────────────────────────────────────────────
   SCENARIO DETAIL PANEL (full content)
────────────────────────────────────────────── */
const ScenarioDetail = ({
  scenario,
  onClose,
}: {
  scenario: WisdomScenario;
  onClose: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  /* Scroll to top of panel on open */
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: "instant" });
    panelRef.current?.focus();
  }, [scenario.id]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scenario-detail-title"
    >
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[92vh] md:max-h-[88vh] overflow-y-auto rounded-t-3xl md:rounded-3xl outline-none"
        style={{
          background: "hsl(38 55% 91%)",
          border: `1px solid rgba(${scenario.accentRgb},0.2)`,
          boxShadow: `0 0 80px rgba(${scenario.accentRgb},0.08)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-0.5 w-full rounded-t-3xl"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${scenario.accentRgb},0.6), transparent)`,
          }}
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          style={{
            background: "rgba(139,105,20,0.07)",
            border: "1px solid rgba(251,191,36,0.14)",
            color: "rgba(42,31,14,0.5)",
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="px-7 md:px-10 pb-10 pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: scenario.accentHex }}
                aria-hidden="true"
              />
              <span
                className="font-heading text-[10px] tracking-[0.25em] uppercase"
                style={{ color: `rgba(${scenario.accentRgb},0.7)` }}
              >
                {scenario.characterName} · {DOMAIN_META[scenario.domain].label}
              </span>
            </div>

            <h2
              id="scenario-detail-title"
              className="font-heading font-bold leading-snug text-foreground mb-3"
              style={{ fontSize: "clamp(20px, 3vw, 28px)" }}
            >
              {scenario.headline}
            </h2>

            <p
              style={{
                fontSize: "17px",
                color: "rgba(42,31,14,0.5)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {scenario.subline}
            </p>
          </div>

          {/* Your situation */}
          <DetailSection label="Your situation" accentRgb={scenario.accentRgb}>
            <div className="space-y-3">
              {scenario.yourSituation.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: i === 0 ? "rgba(253,230,138,0.90)" : "rgba(42,31,14,0.7)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    lineHeight: 1.8,
                    fontWeight: i === 0 ? 500 : 400,
                    fontStyle: i === 0 ? "italic" : "normal",
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>
          </DetailSection>

          {/* The Mahabharata moment */}
          <DetailSection
            label={`What ${scenario.characterName} faced`}
            accentRgb={scenario.accentRgb}
            accent
          >
            <div className="space-y-3">
              {scenario.epicMoment.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: "rgba(253,230,138,0.80)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    lineHeight: 1.8,
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>
          </DetailSection>

          {/* What it reveals */}
          <DetailSection label="What it reveals" accentRgb={scenario.accentRgb}>
            <div className="space-y-3">
              {scenario.whatItReveals.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: "rgba(253,230,138,0.80)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    lineHeight: 1.8,
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>
          </DetailSection>

          {/* The lesson — big pull quote */}
          <div
            className="my-8 px-6 py-6 rounded-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${scenario.accentRgb},0.1), rgba(${scenario.accentRgb},0.04))`,
              border: `1px solid rgba(${scenario.accentRgb},0.2)`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, rgba(${scenario.accentRgb},0.5), transparent)`,
              }}
              aria-hidden="true"
            />
            <p
              className="font-heading italic font-semibold leading-relaxed text-center"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "rgba(253,230,138,0.92)",
              }}
            >
              "{scenario.theLesson}"
            </p>
          </div>

          {/* 3 Actions */}
          <DetailSection label="Three things you can do" accentRgb={scenario.accentRgb}>
            <div className="space-y-5">
              {scenario.actions.map((action, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-heading text-xs mt-0.5"
                    style={{
                      background: `rgba(${scenario.accentRgb},0.12)`,
                      border: `1px solid rgba(${scenario.accentRgb},0.25)`,
                      color: scenario.accentHex,
                    }}
                    aria-label={`Action ${i + 1}`}
                  >
                    {i + 1}
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(14px, 1.6vw, 16px)",
                      color: "rgba(253,230,138,0.82)",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      lineHeight: 1.855,
                    }}
                  >
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          {/* Read more CTA */}
          {scenario.articleSlug && (
            <div className="mt-8 pt-6 border-t border-border/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p
                  className="font-heading text-[10px] tracking-[0.22em] uppercase mb-1"
                  style={{ color: `rgba(${scenario.accentRgb},0.5)` }}
                >
                  Go deeper
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(253,230,138,0.60)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  Read the full {scenario.characterName} article — the complete story,
                  life lessons, and modern parallels.
                </p>
              </div>
              <Link
                to={`/blog/${scenario.articleSlug}`}
                onClick={onClose}
                className="flex items-center gap-2 flex-shrink-0 px-6 py-3 rounded-full font-heading text-[12px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                  background: `linear-gradient(135deg, rgba(${scenario.accentRgb},0.9), rgba(${scenario.accentRgb},0.7))`,
                  color: "#0B0F1A",
                  boxShadow: `0 0 20px rgba(${scenario.accentRgb},0.25)`,
                }}
              >
                <BookOpen size={13} aria-hidden="true" />
                Read Full Story
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Sub-component: detail section */
const DetailSection = ({
  label,
  children,
  accentRgb,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accentRgb: string;
  accent?: boolean;
}) => (
  <div
    className="mb-7 rounded-xl overflow-hidden"
    style={
      accent
        ? {
            background: `rgba(${accentRgb},0.05)`,
            border: `1px solid rgba(${accentRgb},0.14)`,
            padding: "18px 20px",
          }
        : { padding: "0" }
    }
  >
    <div
      className="font-heading text-[10px] tracking-[0.28em] uppercase mb-3"
      style={{ color: `rgba(${accentRgb},0.55)` }}
    >
      {label}
    </div>
    {children}
  </div>
);

/* ──────────────────────────────────────────────
   DOMAIN PANEL
────────────────────────────────────────────── */
const DomainPanel = ({
  domain,
  onOpenScenario,
}: {
  domain: Domain;
  onOpenScenario: (s: WisdomScenario) => void;
}) => {
  const meta = DOMAIN_META[domain];
  const domainScenarios = getScenariosByDomain(domain);
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <div
      id={`panel-${domain}`}
      role="tabpanel"
      aria-labelledby={`tab-${domain}`}
    >
      {/* Domain header */}
      <div ref={headerRef} className="reveal-element mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span style={{ fontSize: "24px" }} aria-hidden="true">{meta.icon}</span>
          <div>
            <h2
              className="font-heading font-bold text-foreground"
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            >
              {meta.label}
            </h2>
            <p
              className="text-muted-foreground mt-0.5"
              style={{
                fontSize: "17px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {meta.description}
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-border/20 mt-4" aria-hidden="true" />
      </div>

      {/* Scenarios grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {domainScenarios.map((scenario, i) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={i}
            onOpen={onOpenScenario}
          />
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   BOTTOM CTA
────────────────────────────────────────────── */
const BottomCTA = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section
      className="py-20 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.04), transparent)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div ref={ref} className="reveal-element max-w-2xl mx-auto px-6 relative z-10">
        <span className="section-label block mb-4">Go Deeper</span>
        <h2
          className="font-heading font-bold text-foreground mb-4 leading-tight"
          style={{ fontSize: "clamp(26px, 3.5vw, 40px)" }}
        >
          The full story is in the articles
        </h2>
        <p
          className="text-muted-foreground leading-relaxed mb-10 mx-auto"
          style={{
            fontSize: "17px",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            maxWidth: "480px",
            lineHeight: 1.8,
          }}
        >
          Each scenario above is a door. The full character articles go deeper —
          the complete story, every turning point, and what it means for the way
          you live now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow group"
          >
            <BookOpen size={15} aria-hidden="true" />
            Read the Full Stories
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-card font-heading text-sm tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            ✦ Find Your Character
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────── */
const Wisdom = () => {
  const { t } = useTranslation();
  const [activeDomain, setActiveDomain] = useState<Domain>("family");
  const [openScenario, setOpenScenario] = useState<WisdomScenario | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: "Life Wisdom — Real Problems, Mahabharata Mirrors",
    description:
      "Find your situation — in family, career, duty, or identity — and see how a Mahabharata character faced the same challenge. Real, honest, actionable.",
    path: "/wisdom",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleDomainChange = useCallback((domain: Domain) => {
    setActiveDomain(domain);
    // Smooth scroll to content area after tab switch
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <WisdomHero />

      {/* ── Domain Tabs ── */}
      <DomainTabs active={activeDomain} onChange={handleDomainChange} />

      {/* ── Main content ── */}
      <main
        ref={contentRef}
        id="main-content"
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-14 md:py-18"
      >
        <DomainPanel
          domain={activeDomain}
          onOpenScenario={setOpenScenario}
        />
      </main>

      {/* ── Bottom CTA ── */}
      <BottomCTA />

      {/* ── Scenario Detail Panel ── */}
      {openScenario && (
        <ScenarioDetail
          scenario={openScenario}
          onClose={() => setOpenScenario(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Wisdom;
