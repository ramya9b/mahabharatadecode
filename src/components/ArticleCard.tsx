import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import type { Article } from "@/data/articles";
import { resolveImage } from "@/utils/images";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  const image = resolveImage(article.imageKey);

  if (variant === "featured") {
    return (
      <Link
        to={`/blog/${article.slug}`}
        className="group relative block rounded-3xl overflow-hidden hover-lift"
        style={{ minHeight: "520px" }}
      >
        {/* Background image */}
        <div className="absolute inset-0 article-card-image-wrapper">
          <img
            loading="lazy"
            decoding="async"
            src={image}
            alt={article.title}
            className="article-card-image w-full h-full object-cover"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium shadow-lg">
            ✦ Featured
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 md:max-w-[65%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full glass-card text-primary text-[11px] tracking-wider border-primary/20">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[12px]">
              <Clock size={12} />
              {article.readTime} min read
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
            {article.summary || article.description}
          </p>

          <span className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-wide group-hover:gap-3 transition-all duration-300">
            Read Full Story
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/blog/${article.slug}`}
        className="group flex gap-4 glass-card p-4 rounded-2xl hover-lift"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 article-card-image-wrapper">
          <img
            loading="lazy"
            decoding="async"
            src={image}
            alt={article.title}
            className="article-card-image w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-primary text-[10px] tracking-wider uppercase">{article.category}</span>
          <h4 className="font-heading text-sm text-foreground mt-1 mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <Clock size={10} />
            {article.readTime} min
          </span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group glass-card overflow-hidden rounded-2xl hover-lift flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden article-card-image-wrapper">
        <img
            loading="lazy"
            decoding="async"
          src={image}
          alt={article.title}
          className="article-card-image w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Category tag */}
        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm text-primary text-[11px] tracking-wider border border-primary/20">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <Clock size={11} />
            {article.readTime} min read
          </span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground text-[11px]">{article.publishDate}</span>
        </div>

        <h3 className="font-heading text-lg text-foreground mb-2.5 leading-snug group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {article.summary || article.description}
        </p>

        <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
          <span className="text-primary text-[12px] tracking-wide font-medium group-hover:tracking-wider transition-all duration-300">
            Read More →
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <Tag size={11} />
            <span className="text-[10px] tracking-wide">{article.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
