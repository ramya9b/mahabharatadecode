import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* Gold particles — varied sizes, drift angles, durations */
const GOLD_PARTICLES = Array.from({ length: 28 }, () => ({
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


/* ── Gopuram silhouette. Stepped tiers narrowing upward with a kalasham
      finial, echoing the temple towers on the TTD site. Drawn rather than
      photographed so it scales, recolours with the palette, and costs no
      network request. ── */
const Gopuram = ({ x, w, h, opacity }: { x: number; w: number; h: number; opacity: number }) => {
  const TIERS = 6;
  const tierH = h / TIERS;
  const tiers = Array.from({ length: TIERS }, (_, i) => {
    const tw = w * (1 - i * 0.115);
    return (
      <rect
        key={i}
        x={x + (w - tw) / 2}
        y={320 - (i + 1) * tierH}
        width={tw}
        height={tierH * 0.82}
        rx={1.5}
      />
    );
  });
  const cx = x + w / 2;
  const top = 320 - h;
  return (
    <g opacity={opacity}>
      {tiers}
      <rect x={cx - 1.4} y={top - 17} width={2.8} height={13} />
      <circle cx={cx} cy={top - 21} r={5.5} />
    </g>
  );
};

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

      {/* ── TTD gradient ground. Replaces the Kurukshetra photograph: the
             palette now carries the mood, and dropping the image removes a
             160KB render-blocking download from the largest paint. ── */}
      <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />

      {/* Sunrise behind the towers */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 72% 52% at 50% 80%, rgba(255,206,120,0.42) 0%, transparent 62%)" }} />

      {/* Soft light from above */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 55% at 50% 6%, rgba(255,255,255,0.18) 0%, transparent 58%)" }} />

      {/* ── Gopuram skyline, parallaxed ── */}
      <div
        ref={heroRef}
        className="absolute inset-x-0 bottom-0 will-change-transform pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="w-full" style={{ height: "46vh", display: "block" }}>
          <g fill="#3E1259">
            <Gopuram x={40}   w={150} h={150} opacity={0.28} />
            <Gopuram x={250}  w={210} h={232} opacity={0.38} />
            <Gopuram x={560}  w={300} h={300} opacity={0.5} />
            <Gopuram x={950}  w={205} h={225} opacity={0.38} />
            <Gopuram x={1230} w={155} h={158} opacity={0.28} />
          </g>
          {/* ground line the towers stand on */}
          <rect x="0" y="304" width="1440" height="16" fill="#3E1259" opacity="0.5" />
        </svg>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 45%, transparent 58%, rgba(62,18,89,0.42) 100%)" }} />

      {/* ── Moving ambient glow ── */}
      <div
        ref={glowRef}
        className="absolute will-change-transform pointer-events-none"
        style={{
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(255,214,138,0.22) 0%, transparent 70%)",
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
              background: "rgba(107,45,143,0.25)",
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
              borderColor: "rgba(255,255,255,0.42)",
              color: "rgba(255,246,232,0.96)",
              background: "rgba(255,255,255,0.10)",
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
            /* Gold shimmer on the purple ground — the TTD pairing */
            background: "linear-gradient(135deg, #FFF6E8 0%, #E4C04A 32%, #F0D67A 52%, #FFF6E8 72%, #E4C04A 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 4s linear infinite",
            filter: "drop-shadow(0 2px 18px rgba(62,18,89,0.55))",
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
              background: "linear-gradient(135deg, #6B2D8F 0%, #6B2D8F 50%, #F5E8EE 100%)",
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
              boxShadow: "0 8px 32px rgba(107,45,143,0.4), 0 0 60px rgba(107,45,143,0.15)",
              transition: "all 0.35s ease",
              animation: "shimmer 4s linear infinite",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(107,45,143,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(107,45,143,0.45), 0 0 60px rgba(107,45,143,0.15)"; }}
          >
            ✨ {t("hero.cta_try_story")}
          </Link>
          <Link
            to="/blog"
            className="btn-i18n i18n-safe"
            style={{
              padding: "14px 32px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #6B2D8F 0%, #6B2D8F 50%, #F5E8EE 100%)",
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
              boxShadow: "0 8px 32px rgba(107,45,143,0.4), 0 0 60px rgba(107,45,143,0.15)",
              transition: "all 0.35s ease",
              animation: "shimmer 4s linear infinite",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(107,45,143,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(107,45,143,0.45), 0 0 60px rgba(107,45,143,0.15)"; }}
          >
            {t("hero.cta_primary")}
          </Link>
          <Link
            to="/characters"
            className="btn-i18n i18n-safe"
            style={{
              padding: "14px 32px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #6B2D8F 0%, #6B2D8F 50%, #F5E8EE 100%)",
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
              boxShadow: "0 8px 32px rgba(107,45,143,0.4), 0 0 60px rgba(107,45,143,0.15)",
              transition: "all 0.35s ease",
              animation: "shimmer 4s linear infinite",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(107,45,143,0.6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(107,45,143,0.45), 0 0 60px rgba(107,45,143,0.15)"; }}
          >
            {t("hero.cta_secondary")}
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-44" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.5 }} aria-hidden="true">
        <span className="text-[9px] tracking-[0.35em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "rgba(107,45,143,0.8)" }}>
          {t("hero.scroll")}
        </span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(107,45,143,0.7), transparent)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
