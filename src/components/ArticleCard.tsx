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

  // Default card — gradient border + refined hover
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group hover-lift flex flex-col"
      style={{
        background:     "linear-gradient(160deg, rgba(28,14,2,1) 0%, rgba(18,9,0,1) 100%)",
        border:         "1px solid rgba(212,175,55,0.18)",
        borderRadius:   "18px",
        overflow:       "hidden",
        textDecoration: "none",
        transition:     "border-color 0.35s ease, transform 0.4s ease, box-shadow 0.35s ease",
        position:       "relative",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "rgba(212,175,55,0.50)";
        el.style.boxShadow   = "0 20px 50px rgba(212,175,55,0.14), inset 0 1px 0 rgba(212,175,55,0.12)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = "rgba(212,175,55,0.18)";
        el.style.boxShadow   = "none";
      }}
    >
      {/* Gradient accent line — top of card */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Image */}
      <div style={{ position:"relative", height:"210px", overflow:"hidden" }}>
        <img
          loading="lazy"
          decoding="async"
          src={image}
          alt={article.title}
          style={{ width:"100%", height:"100%", objectFit:"cover",
                   transition:"transform 0.7s ease" }}
          className="group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to top, rgba(18,9,0,1) 0%, rgba(18,9,0,0.35) 55%, transparent 100%)",
        }} />
        {/* Category tag */}
        <span style={{
          position:"absolute", top:"14px", left:"14px",
          padding:"4px 12px", borderRadius:"99px",
          background:"rgba(10,5,0,0.80)",
          border:"1px solid rgba(212,175,55,0.28)",
          color:"#FBBF24",
          fontFamily:"'Cinzel',serif",
          fontSize:"10px", letterSpacing:"0.16em",
          backdropFilter:"blur(8px)",
        }}>
          {article.category}
        </span>
      </div>

      {/* Text content */}
      <div style={{ padding:"20px 22px 18px", display:"flex", flexDirection:"column", flex:1 }}>
        {/* Meta row */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"5px",
                         color:"rgba(253,230,138,0.50)", fontSize:"11px",
                         fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>
            <Clock size={11} />
            {article.readTime} min read
          </span>
          <span style={{ color:"rgba(253,230,138,0.25)", fontSize:"12px" }}>·</span>
          <span style={{ color:"rgba(253,230,138,0.45)", fontSize:"11px",
                         fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>
            {article.publishDate}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:"'Cinzel',serif",
          fontSize:"15px", fontWeight:600,
          color:"#FDE68A",
          marginBottom:"10px", lineHeight:1.35,
          transition:"color 0.2s",
        }}
        className="group-hover:text-amber-300"
        >
          {article.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"15px", lineHeight:1.75,
          color:"rgba(253,230,138,0.62)",
          flex:1,
          display:"-webkit-box",
          WebkitLineClamp:3,
          WebkitBoxOrient:"vertical" as const,
          overflow:"hidden",
        }}>
          {article.summary || article.description}
        </p>

        {/* Footer */}
        <div style={{
          marginTop:"16px", paddingTop:"14px",
          borderTop:"1px solid rgba(251,191,36,0.12)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <span style={{
            color:"#FBBF24", fontSize:"12px",
            fontFamily:"'Cinzel',serif", letterSpacing:"0.10em",
            fontWeight:500, transition:"letter-spacing 0.3s",
          }}>
            Read More →
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:"5px",
                        color:"rgba(253,230,138,0.35)" }}>
            <Tag size={11} />
            <span style={{ fontSize:"10px", letterSpacing:"0.08em",
                           fontFamily:"'Cinzel',serif" }}>
              {article.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
