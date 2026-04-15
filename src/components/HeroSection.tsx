import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroBgWebp from "@/assets/hero-bg.webp";
import heroBgJpg  from "@/assets/hero-bg.jpg";

const PARTICLE_DATA = Array.from({ length: 15 }, () => ({
  w: Math.random() * 2.5 + 1,
  l: Math.random() * 100,
  dur: Math.random() * 10 + 8,
  del: Math.random() * 6,
}));

const HeroSection = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => {
      if (heroRef.current)
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background — eager loaded, explicit dims prevent CLS */}
      <div
        ref={heroRef}
        className="absolute will-change-transform"
        style={{ inset: "-15% 0", height: "130%" }}
      >
        {/* <picture> gives WebP to modern browsers, JPEG to older ones — no JS needed */}
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

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(245,237,218,0.1) 0%, rgba(245,237,218,0.05) 50%, rgba(245,237,218,0.92) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(139,105,20,0.06) 0%, transparent 65%)" }} />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLE_DATA.map((p, i) => (
          <div
            key={i}
            className="particle bg-primary/20"
            style={{
              width: p.w + "px", height: p.w + "px",
              left: p.l + "%", bottom: "-10px",
              "--duration": p.dur + "s", "--delay": p.del + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* Eyebrow */}
        <div className="mb-6 animate-fade-up">
          <span className="inline-block px-5 py-2 rounded-full border border-primary/25 text-primary text-[11px] tracking-[0.3em] uppercase backdrop-blur-sm i18n-safe">
            {t("hero.eyebrow")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-bold leading-[1.05] mb-8 animate-fade-up tracking-tight" style={{ fontSize: "clamp(46px, 8vw, 96px)" }}>
          <span className="gold-text block">{t("hero.headline_gold")}</span>
          <span className="text-foreground/90 block" style={{ fontSize: "0.68em", marginTop: "4px" }}>
            {t("hero.headline_white")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-xl mx-auto mb-14 animate-fade-up-delay-1 leading-relaxed i18n-safe" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-2">
          <Link
            to="/blog"
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-base tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow btn-i18n i18n-safe"
          >
            {t("hero.cta_primary")}
          </Link>
          <Link
            to="/characters"
            className="px-8 py-3.5 rounded-full glass-card text-foreground font-medium text-base tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300 btn-i18n i18n-safe"
          >
            {t("hero.cta_secondary")}
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.4 }} aria-hidden="true">
        <span className="text-primary text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
          {t("hero.scroll")}
        </span>
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, hsl(var(--primary)), transparent)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
