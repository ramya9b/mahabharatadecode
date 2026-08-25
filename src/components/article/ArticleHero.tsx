import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import type { Article } from "@/data/articles";
import { resolveImage } from "@/utils/images";

interface ArticleHeroProps {
  article: Article;
}


const CHAR_ACCENT_MAP: Record<string, string> = {
  karna:    "#C0392B",  /* Crimson — tragic */
  krishna:  "#2471A3",  /* Sapphire — divine */
  arjuna:   "#6E570A",  /* Emerald — warrior */
  draupadi: "#8E44AD",  /* Violet — fire */
  bhishma:  "#707B7C",  /* Silver — elder */
  drona:    "#784212",  /* Brown — guru */
  yudhishthira: "#6E570A",
  default:  "#6B2D8F",  /* Gold fallback */
};

const ArticleHero = ({ article }: ArticleHeroProps) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const image  = resolveImage(article.imageKey);
  const charId = article.character?.toLowerCase() ?? "";
  const accent = CHAR_ACCENT_MAP[charId] ?? CHAR_ACCENT_MAP.default;

  /* Parallax on scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (imgRef.current) {
        const scrollY = window.scrollY;
        imgRef.current.style.transform = `translateY(${scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categoryColorMap: Record<string, string> = {
    Characters: "from-amber-900/40 to-amber-700/20 border-amber-600/30 text-amber-300",
    "Life Lessons": "from-teal-900/40 to-teal-700/20 border-teal-600/30 text-teal-300",
    Slokas: "from-violet-900/40 to-violet-700/20 border-violet-600/30 text-violet-300",
    Philosophy: "from-slate-800/40 to-slate-700/20 border-slate-500/30 text-slate-300",
  };
  const catStyle = categoryColorMap[article.category] ?? categoryColorMap["Characters"];

  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Parallax image layer */}
      <div
        ref={imgRef}
        className="absolute inset-0 -top-[15%] will-change-transform"
        style={{ height: "115%" }}
      >
        <img
        loading="eager"
        fetchPriority="high"
        decoding="async"
          src={image}
          alt={article.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Multi-layer cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 60% 50% at 50% 100%, ${accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Particle dust layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle bg-primary/20"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              bottom: "-10px",
              "--duration": Math.random() * 10 + 8 + "s",
              "--delay": Math.random() * 6 + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm mb-10 group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to all stories
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium backdrop-blur-sm border bg-gradient-to-r ${catStyle}`}
          >
            <Tag size={10} />
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock size={13} />
            {article.readTime} min read
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Calendar size={13} />
            {article.publishDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-black text-foreground leading-[1.05] tracking-tight mb-5"
          style={{ fontSize: "clamp(36px, 5.5vw, 72px)", maxWidth: "820px" }}
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p
            className="font-heading text-primary/80 italic leading-relaxed"
            style={{ fontSize: "clamp(16px, 2vw, 22px)", maxWidth: "600px" }}
          >
            {article.subtitle}
          </p>
        )}

        {/* Decorative rule */}
        <div className="flex items-center gap-4 mt-8">
          <div className="h-px w-12 bg-primary/50 rounded-full" />
          <span className="text-primary/50 text-[11px] tracking-[0.3em] uppercase font-heading">
            Mahabharata Decoded
          </span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ArticleHero;
