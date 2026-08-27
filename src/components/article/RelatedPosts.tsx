import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";
import { resolveImage } from "@/utils/images";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

interface RelatedPostsProps {
  articles: Article[];
}

const RelatedCard = ({ article }: { article: Article }) => {
  const { t } = useTranslation();
  const image = resolveImage(article.imageKey);

  const categoryColor: Record<string, string> = {
    Characters: "text-amber-400/80 border-amber-700/30 bg-amber-950/30",
    "Life Lessons": "text-teal-400/80 border-teal-700/30 bg-teal-950/30",
    Slokas: "text-violet-400/80 border-violet-700/30 bg-violet-950/30",
    Philosophy: "text-slate-400/80 border-slate-600/30 bg-slate-800/30",
  };
  const catCls = categoryColor[article.category] ?? categoryColor["Characters"];

  return (
    <Link
      to={`/blog/${article.slug}`}
      className="reveal-element group glass-card overflow-hidden hover-lift block"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
            loading="lazy"
            decoding="async"
          src={image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Category badge */}
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium border backdrop-blur-sm ${catCls}`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock size={11} />
            {article.readTime} min read
          </span>
          <span className="text-border text-xs">·</span>
          <span className="text-muted-foreground text-xs">{article.publishDate}</span>
        </div>

        {/* Title */}
        <h3
          className="font-heading text-foreground font-semibold leading-snug mb-3 group-hover:text-primary transition-colors duration-300"
          style={{ fontSize: "clamp(15px, 1.7vw, 18px)" }}
        >
          {article.title}
        </h3>

        {/* Description */}
        <p
          className="text-muted-foreground leading-relaxed line-clamp-2 mb-4"
          style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {article.description}
        </p>

        {/* Read link */}
        <span className="flex items-center gap-2 text-primary text-xs font-medium tracking-wide group-hover:gap-3 transition-all duration-300">
          <span style={{ fontFamily: "'Cinzel', serif" }}>{t("article.read_story")}</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
};

const RelatedPosts = ({ articles }: RelatedPostsProps) => {
  const { t } = useTranslation();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useStaggeredReveal(articles.length);

  if (articles.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div
          ref={headerRef}
          className="reveal-element flex items-center justify-between mb-12"
        >
          <div>
            <span className="section-label block mb-2">{t("article.related_label")}</span>
            <h2
              className="font-heading font-bold text-foreground"
              style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
            >
              {t("article.related_heading")}
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-primary text-sm hover:text-gold-light transition-colors duration-200 group"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {t("article.related_view_all")}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article) => (
            <RelatedCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="flex justify-center mt-10 sm:hidden">
          <Link
            to="/blog"
            className="px-8 py-3 rounded-full glass-card text-foreground text-sm font-medium tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            View All Stories →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
