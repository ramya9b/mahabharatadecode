import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Users, HelpCircle, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { articles } from "@/data/articles";

/* Show 3 random articles as suggestions */
const SUGGESTIONS = articles.slice(0, 3);

const QUICK_LINKS = [
  { to: "/",           icon: Home,       label: "Homepage",         desc: "Return to the beginning" },
  { to: "/blog",       icon: BookOpen,   label: "All Stories",      desc: "Browse every article"    },
  { to: "/characters", icon: Users,      label: "Characters",       desc: "Meet the epic's heroes"  },
  { to: "/quiz",       icon: HelpCircle, label: "Take the Quiz",    desc: "Discover your character" },
];

const NotFound = () => {
  useSEO({
    title: "Page Not Found",
    description: "The page you are looking for does not exist. Explore our Mahabharata stories instead.",
    path: "/404",
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      role="main"
      aria-labelledby="not-found-heading"
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(107,45,143,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20">

        {/* ── Hero ── */}
        <div className="text-center mb-16">
          <div
            className="font-heading font-black leading-none mb-0 select-none"
            aria-hidden="true"
            style={{
              fontSize: "clamp(96px, 18vw, 200px)",
              background: "linear-gradient(135deg, #E8C547 0%, #6B2D8F 40%, #B8922A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.18,
              lineHeight: 1,
            }}
          >
            404
          </div>

          <h1
            id="not-found-heading"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground -mt-4 mb-5 font-bold leading-tight"
          >
            Lost in the Epic
          </h1>

          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto mb-10 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
            Even the greatest warriors lose their way in the forest of life.
            This page has wandered beyond the known universe.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow group"
            >
              <Home size={15} aria-hidden="true" />
              Return Home
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-card text-foreground font-heading text-sm tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <BookOpen size={15} aria-hidden="true" />
              Browse Stories
            </Link>
          </div>
        </div>

        {/* ── Quick navigation ── */}
        <section aria-labelledby="quick-nav-heading" className="mb-14">
          <h2
            id="quick-nav-heading"
            className="font-heading text-[11px] tracking-[0.3em] uppercase text-primary/50 text-center mb-6"
          >
            Or go directly to
          </h2>
          <nav aria-label="Site sections">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="glass-card rounded-xl p-4 hover-lift group text-center hover:border-primary/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors group-hover:bg-primary/15"
                    style={{ background: "rgba(107,45,143,0.08)", border: "1px solid rgba(107,45,143,0.15)" }}
                  >
                    <Icon size={16} className="text-primary" aria-hidden="true" />
                  </div>
                  <p className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {label}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </Link>
              ))}
            </div>
          </nav>
        </section>

        {/* ── Story suggestions ── */}
        <section aria-labelledby="suggestions-heading">
          <div className="flex items-center gap-4 mb-6">
            <h2
              id="suggestions-heading"
              className="font-heading text-[11px] tracking-[0.3em] uppercase text-primary/50 whitespace-nowrap"
            >
              Start reading instead
            </h2>
            <div className="flex-1 h-px bg-border/30" aria-hidden="true" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {SUGGESTIONS.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="glass-card rounded-xl p-5 hover-lift group hover:border-primary/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span
                  className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-heading tracking-wider uppercase"
                  style={{
                    background: "rgba(107,45,143,0.1)",
                    border: "1px solid rgba(107,45,143,0.2)",
                    color: "rgba(107,45,143,0.8)",
                  }}
                >
                  {article.category}
                </span>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {article.summary || article.description}
                </p>
                <span className="text-primary text-[11px] font-medium tracking-wide group-hover:tracking-wider transition-all duration-300">
                  Read story →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotFound;
