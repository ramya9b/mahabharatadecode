import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
// useTranslation still used by WisdomHero below
import { Link } from "react-router-dom";
import { X, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSEO } from "@/hooks/useSEO";
import {
  getScenariosByDomain,
  getAllDomains,
  DOMAIN_META_KEYS,
  localizeScenario,
  localizedCoverage,
} from "@/data/wisdom";
import type { Domain, WisdomScenario } from "@/data/wisdom";

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
const WisdomHero = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
            "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(139,0,0,0.12) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Sanskrit character */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(200px, 35vw, 380px)",
          color: "rgba(34,197,94,0.04)",
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
          <span className="gold-text block">{t("wisdom.headline_gold")}</span>
          <span
            className="block"
            style={{ color: isDark ? "rgba(134,239,172,0.88)" : "rgba(42,31,14,0.90)", fontSize: "0.68em", marginTop: "6px" }}
          >
            {t("wisdom.headline_white")}
          </span>
        </h1>

        {/* Honest description — human voice */}
        <p
          className="leading-relaxed mx-auto mb-6 animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(18px, 2vw, 21px)",
            color: isDark ? "rgba(134,239,172,0.75)" : "rgba(42,31,14,0.78)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: 1.8,
            maxWidth: "560px",
          }}
        >
          {t("wisdom.subtitle")}
        </p>
        <p
          className="leading-relaxed mx-auto mb-14 animate-fade-up-delay-2"
          style={{
            fontSize: "17px",
            color: isDark ? "rgba(134,239,172,0.55)" : "rgba(42,31,14,0.58)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            maxWidth: "480px",
          }}
        >
          {t("wisdom.subtitle_2")}
        </p>

        {/* Domain count */}
        <div className="flex flex-wrap gap-6 justify-center animate-fade-up-delay-2">
          {getAllDomains().map((domain) => {
            const meta = DOMAIN_META_KEYS[domain];
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
                  style={{ color: isDark ? "rgba(134,239,172,0.70)" : "rgba(42,31,14,0.65)" }}
                >
                  {t(meta.labelKey).split(" ")[0]}
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
}) => {
  const { t } = useTranslation();
  const { theme: themeF } = useTheme();
  const isDarkF = themeF === "dark";
  return (
  <div
    className="sticky z-30 bg-background/90 backdrop-blur-md border-b border-border/30 py-4"
    style={{ top: "56px" }}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        role="tablist"
        aria-label={t("wisdom.aria.life_domains")}
      >
        {getAllDomains().map((domain) => {
          const meta = DOMAIN_META_KEYS[domain];
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
                  ? (isDarkF ? "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.08))" : "linear-gradient(135deg, rgba(21,128,61,0.15), rgba(21,128,61,0.06))")
                  : (isDarkF ? "rgba(22,11,0,0.60)" : "rgba(139,105,20,0.06)"),
                border: isActive
                  ? (isDarkF ? "1px solid rgba(34,197,94,0.40)" : "1px solid rgba(21,128,61,0.45)")
                  : (isDarkF ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(139,105,20,0.18)"),
                color: isActive
                  ? (isDarkF ? "#22C55E" : "#166534")
                  : (isDarkF ? "rgba(134,239,172,0.65)" : "rgba(80,50,10,0.70)"),
              }}
            >
              <span style={{ fontSize: "17px" }} aria-hidden="true">
                {meta.icon}
              </span>
              <span className="font-heading text-[12px] tracking-[0.08em] uppercase">
                {t(meta.labelKey)}
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
};

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
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLDivElement>();
  const { theme: ct } = useTheme();
  const isDarkC = ct === "dark";

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
        aria-label={t("wisdom.aria.read_scenario", { headline: scenario.headline })}
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
              color: isDarkC ? "rgba(134,239,172,0.92)" : "rgba(42,31,14,0.88)",
            }}
          >
            {scenario.headline}
          </h3>

          {/* Subline */}
          <p
            className="leading-relaxed mb-5"
            style={{
              fontSize: "14px",
              color: isDarkC ? "rgba(134,239,172,0.55)" : "rgba(42,31,14,0.60)",
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
            <span>{t("wisdom.read_story")}</span>
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
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme: themeM } = useTheme();
  const isDarkM = themeM === "dark";

  /* Theme-aware text colors — gold/cream on dark, dark brown on cream. */
  const bodyTextStrong = isDarkM ? "rgba(134,239,172,0.92)" : "rgba(42,31,14,0.90)";
  const bodyText       = isDarkM ? "rgba(134,239,172,0.82)" : "rgba(42,31,14,0.82)";
  const bodyTextMuted  = isDarkM ? "rgba(134,239,172,0.62)" : "rgba(42,31,14,0.58)";

  /* Accent-color label tints — low alpha on dark looks subtle, but on cream
     blends into the bg. Bump to ~0.95 in light mode so the brand colour
     still pops. */
  const accentLabelStrong = isDarkM
    ? `rgba(${scenario.accentRgb},0.70)`
    : `rgba(${scenario.accentRgb},0.95)`;
  const accentLabelMuted = isDarkM
    ? `rgba(${scenario.accentRgb},0.50)`
    : `rgba(${scenario.accentRgb},0.85)`;

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
          background: isDarkM ? "rgb(18,9,0)" : "hsl(38 55% 92%)",
          border: `1px solid rgba(${scenario.accentRgb},0.2)`,
          boxShadow: `0 0 80px rgba(${scenario.accentRgb},0.08)`,
          color: isDarkM ? "rgba(134,239,172,0.88)" : "rgba(42,31,14,0.88)",
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
          aria-label={t("common.close")}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          style={{
            background: "rgba(139,105,20,0.07)",
            border: "1px solid rgba(34,197,94,0.14)",
            color: isDarkM ? "rgba(134,239,172,0.65)" : "rgba(42,31,14,0.60)",
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
                style={{ color: accentLabelStrong }}
              >
                {scenario.characterName} · {t(DOMAIN_META_KEYS[scenario.domain].labelKey)}
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
                color: bodyTextMuted,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {scenario.subline}
            </p>
          </div>

          {/* Your situation */}
          <DetailSection label={t("wisdom.detail.your_situation")} accentRgb={scenario.accentRgb}>
            <div className="space-y-3">
              {scenario.yourSituation.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: i === 0 ? bodyTextStrong : bodyText,
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
            label={t("wisdom.detail.what_x_faced", { name: scenario.characterName })}
            accentRgb={scenario.accentRgb}
            accent
          >
            <div className="space-y-3">
              {scenario.epicMoment.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: bodyText,
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
          <DetailSection label={t("wisdom.detail.what_it_reveals")} accentRgb={scenario.accentRgb}>
            <div className="space-y-3">
              {scenario.whatItReveals.trim().split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    color: bodyText,
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
                color: bodyTextStrong,
              }}
            >
              "{scenario.theLesson}"
            </p>
          </div>

          {/* 3 Actions */}
          <DetailSection label={t("wisdom.detail.three_actions")} accentRgb={scenario.accentRgb}>
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
                      color: isDarkM ? "rgba(134,239,172,0.82)" : "rgba(42,31,14,0.75)",
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
                  style={{ color: accentLabelMuted }}
                >
                  {t("wisdom.go_deeper")}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: isDarkM ? "rgba(134,239,172,0.60)" : "rgba(42,31,14,0.58)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  {t("wisdom.detail.read_more_blurb", { name: scenario.characterName })}
                </p>
              </div>
              <Link
                to={`/blog/${scenario.articleSlug}`}
                onClick={onClose}
                className="flex items-center gap-2 flex-shrink-0 px-6 py-3 rounded-full font-heading text-[12px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{
                  background: `linear-gradient(135deg, rgba(${scenario.accentRgb},0.9), rgba(${scenario.accentRgb},0.7))`,
                  color: "#FFFFFF",
                  boxShadow: `0 0 20px rgba(${scenario.accentRgb},0.25)`,
                }}
              >
                <BookOpen size={13} aria-hidden="true" />
                {t("wisdom.detail.read_full_story")}
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
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // Section labels need higher contrast on cream than on dark.
  const labelColor = isDark ? `rgba(${accentRgb},0.55)` : `rgba(${accentRgb},0.90)`;
  return (
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
        style={{ color: labelColor }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};

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
  const { t, i18n } = useTranslation();
  const meta = DOMAIN_META_KEYS[domain];
  /* Scenarios for the active domain, localized to the current language where
     a translation exists. Untranslated scenarios fall back to English per-id. */
  const lang = i18n.language?.slice(0, 2) ?? "en";
  const domainScenarios = getScenariosByDomain(domain).map(s => localizeScenario(s, lang));
  const headerRef = useScrollReveal<HTMLDivElement>();
  /* Coverage disclaimer: shown only for non-English locales. Tells the
     reader how many of the 22 scenarios are available in their language
     so the English fallbacks aren't a silent surprise. */
  const isNonEnglish = lang !== "en";
  const coverage = localizedCoverage(lang);

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
              {t(meta.labelKey)}
            </h2>
            <p
              className="text-muted-foreground mt-0.5"
              style={{
                fontSize: "17px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {t(meta.descKey)}
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-border/20 mt-4" aria-hidden="true" />
      </div>

      {/* Coverage disclaimer for non-English locales. Two states:
          - 0 translated: full English-only note
          - some translated: "N of M in your language, others fall back" */}
      {isNonEnglish && (
        <div
          role="note"
          className="mb-8 px-4 py-3 rounded-lg flex items-start gap-3"
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.18)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "14px",
            color: "hsl(var(--muted-foreground))",
            lineHeight: 1.55,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "16px", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>ℹ️</span>
          <span>
            {coverage.translated === 0
              ? t("wisdom.english_only_note")
              : t("wisdom.partial_coverage_note", { translated: coverage.translated, total: coverage.total })}
          </span>
        </div>
      )}

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
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section
      className="py-20 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(34,197,94,0.04), transparent)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div ref={ref} className="reveal-element max-w-2xl mx-auto px-6 relative z-10">
        <span className="section-label block mb-4">{t("wisdom.go_deeper")}</span>
        <h2
          className="font-heading font-bold text-foreground mb-4 leading-tight"
          style={{ fontSize: "clamp(26px, 3.5vw, 40px)" }}
        >
          {t("wisdom.cta_title")}
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
          {t("wisdom.cta_desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow group"
          >
            <BookOpen size={15} aria-hidden="true" />
            {t("wisdom.read_articles")}
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
            ✦ {t("wisdom.find_character")}
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
