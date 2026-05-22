import { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroBgWebp from "@/assets/hero-bg.webp";
import heroBgJpg  from "@/assets/hero-bg.jpg";

/* Gold particles — varied sizes, drift angles, durations */
const GOLD_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  size:  Math.random() * 4 + 2,
  left:  Math.random() * 100,
  dur:   Math.random() * 14 + 10,
  del:   Math.random() * 10,
  dx:    (Math.random() - 0.5) * 120,
  opacity: Math.random() * 0.5 + 0.3,
}));

/* Ambient dust particles */
const DUST = Array.from({ length: 12 }, () => ({
  w:   Math.random() * 2 + 1,
  l:   Math.random() * 100,
  dur: Math.random() * 10 + 8,
  del: Math.random() * 6,
}));

const HeroSection = () => {
  const { t }   = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* Parallax scroll */
  useEffect(() => {
    const fn = () => {
      if (heroRef.current)
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      if (glowRef.current)
        glowRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Parallax background ── */}
      <div
        ref={heroRef}
        className="absolute will-change-transform"
        style={{ inset: "-15% 0", height: "130%" }}
      >
        <picture>
          <source srcSet={heroBgWebp} type="image/webp" />
          <img
            src={heroBgJpg}
            alt="Kurukshetra battlefield at dawn"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      {/* ── Cinematic overlay stack ── */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,4,17,0.72) 0%, rgba(6,4,17,0.65) 40%, rgba(6,4,17,0.92) 85%, rgba(6,4,17,1) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(251,191,36,0.12) 0%, transparent 65%)" }} />
      {/* Vignette edges */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(4,2,12,0.65) 100%)" }} />

      {/* ── Moving ambient glow ── */}
      <div
        ref={glowRef}
        className="absolute will-change-transform pointer-events-none"
        style={{
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "glow-pulse 6s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* ── Gold dust particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {GOLD_PARTICLES.map((p, i) => (
          <div
            key={`gp-${i}`}
            className="gold-particle"
            style={{
              width:  p.size + "px",
              height: p.size + "px",
              left:   p.left + "%",
              bottom: "-8px",
              opacity: p.opacity,
              animationDuration: p.dur + "s",
              animationDelay:    p.del + "s",
              "--dx": p.dx + "px",
            } as React.CSSProperties}
          />
        ))}
        {/* Fine dust */}
        {DUST.map((p, i) => (
          <div
            key={`d-${i}`}
            className="particle"
            style={{
              width: p.w + "px", height: p.w + "px",
              left: p.l + "%", bottom: "-10px",
              background: "rgba(212,175,55,0.25)",
              "--duration": p.dur + "s",
              "--delay":    p.del + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-28 pb-20">

        {/* Eyebrow */}
        <div className="mb-7 animate-fade-up">
          <span
            className="inline-block px-5 py-2 rounded-full border text-[11px] tracking-[0.32em] uppercase backdrop-blur-sm i18n-safe"
            style={{
              borderColor: "rgba(251,191,36,0.35)",
              color: "rgba(251,191,36,0.95)",
              background: "rgba(251,191,36,0.06)",
              fontFamily: "'Cinzel', serif",
            }}
          >
            {t("hero.eyebrow")}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-heading font-bold leading-[1.05] mb-8 animate-fade-up tracking-tight"
          style={{ fontSize: "clamp(48px, 8.5vw, 100px)" }}
        >
          <span className="block" style={{
            /* Warm gold shimmer — readable on dark overlay */
            background: "linear-gradient(135deg, #FDE68A 0%, #FBBF24 35%, #F59E0B 55%, #FDE68A 75%, #FBBF24 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 4s linear infinite",
            filter: "drop-shadow(0 2px 20px rgba(251,191,36,0.5))",
          }}>
            {t("hero.headline_gold")}
          </span>
          <span
            className="block"
            style={{
              fontSize: "0.65em",
              marginTop: "6px",
              color: "rgba(240,228,200,0.92)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            {t("hero.headline_white")}
          </span>
        </h1>

        {/* Gold divider */}
        <div className="gold-divider mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }} aria-hidden="true" />

        {/* Subtitle — Cormorant for literary feel */}
        <p
          className="max-w-xl mx-auto mb-14 animate-fade-up-delay-1 i18n-safe"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(17px, 2.1vw, 20px)",
            lineHeight: 1.8,
            color: "rgba(220,205,175,0.78)",
            letterSpacing: "0.015em",
          }}
        >
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-2">
          <Link
            to="/storyteller"
            className="btn-i18n i18n-safe"
            style={{
              padding: "14px 32px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #FBBF24, #34D399, #38BDF8)",
              backgroundSize: "200% auto",
              color: "#08040F",
              fontFamily: "'Cinzel', serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 32px rgba(251,191,36,0.4), 0 0 60px rgba(52,211,153,0.15)",
              transition: "all 0.35s ease",
              animation: "shimmer 4s linear infinite",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(212,175,55,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(212,175,55,0.45), 0 0 60px rgba(212,175,55,0.15)"; }}
          >
            ✨ Try Story Teller
          </Link>
          <Link
            to="/blog"
            className="btn-i18n i18n-safe"
            style={{
              padding: "14px 28px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #FBBF24 0%, #34D399 50%, #38BDF8 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 4s linear infinite",
              color: "#08040F",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 8px 28px rgba(52,211,153,0.40)",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px rgba(52,211,153,0.60)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(52,211,153,0.40)";
            }}
          >
            {t("hero.cta_primary")}
          </Link>
          <Link
            to="/characters"
            className="btn-i18n i18n-safe"
            style={{
              padding: "14px 28px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #34D399 0%, #38BDF8 50%, #A78BFA 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 4s linear infinite 1s",
              color: "#08040F",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 8px 28px rgba(56,189,248,0.35)",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px rgba(56,189,248,0.55)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(56,189,248,0.35)";
            }}
          >
            {t("hero.cta_secondary")}
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-44" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.5 }} aria-hidden="true">
        <span className="text-[9px] tracking-[0.35em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "rgba(212,175,55,0.8)" }}>
          {t("hero.scroll")}
        </span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.7), transparent)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
