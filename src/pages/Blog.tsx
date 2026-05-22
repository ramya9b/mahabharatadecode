import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Mail, ChevronDown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { articles, getFeaturedArticle, getArticlesByCategory } from "@/data/articles";
import type { Article } from "@/data/articles";
import { useSEO } from "@/hooks/useSEO";
import { useDebounce } from "@/hooks/useDebounce";

const CATEGORY_KEYS = ["all","characters","life_lessons","slokas","philosophy"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];
const CATEGORY_API: Record<CategoryKey, string> = { all:"All", characters:"Characters", life_lessons:"Life Lessons", slokas:"Slokas", philosophy:"Philosophy" };

const ARTICLES_PER_PAGE = 6;

/* ── Floating particles (memoised — stable between renders) ── */
const PARTICLE_DATA = Array.from({ length: 20 }, () => ({
  w: Math.random() * 2 + 1,
  l: Math.random() * 100,
  dur: Math.random() * 12 + 10,
  del: Math.random() * 8,
}));

const BlogParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {PARTICLE_DATA.map((p, i) => (
      <div
        key={i}
        className="particle bg-primary/20"
        style={{
          width: p.w + "px",
          height: p.w + "px",
          left: p.l + "%",
          bottom: "-10px",
          "--duration": p.dur + "s",
          "--delay": p.del + "s",
        } as React.CSSProperties}
      />
    ))}
  </div>
));

/* ── Stats strip ── */
const StatsStrip = () => (
  <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
    {[
      { value: "8+", label: "Deep Articles" },
      { value: "5", label: "Epic Characters" },
      { value: "18", label: "Parvas Decoded" },
      { value: "∞", label: "Wisdom Unveiled" },
    ].map((s) => (
      <div key={s.label} className="text-center">
        <div className="font-heading text-3xl gold-text mb-1">{s.value}</div>
        <div className="text-muted-foreground text-[11px] tracking-widest uppercase">{s.label}</div>
      </div>
    ))}
  </div>
);

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const filterBarRef = useRef<HTMLDivElement>(null);

  /* Debounce search — only recalculate after 300ms of typing inactivity */
  const debouncedQuery = useDebounce(searchQuery, 300);

  /* SEO meta */
  useSEO({
    title: "Stories & Insights",
    description: "Deep-dive articles decoding the Mahabharata's greatest stories, characters, and lessons for modern living.",
    path: "/blog",
  });

  /* Simulate loading state (real apps would use React Query here) */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const featured = getFeaturedArticle();

  /* Filter logic — memoised, uses debounced query to prevent per-keystroke recalc
     BUG FIX: was `a.summary?.toLowerCase()` (returns string, always truthy)
              now: `a.summary?.toLowerCase().includes(q)` (returns boolean)       */
  const filtered = useMemo(() => {
    const base = getArticlesByCategory(CATEGORY_API[activeCategory]);
    if (!debouncedQuery.trim()) return base;
    const q = debouncedQuery.toLowerCase();
    return base.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      (a.summary?.toLowerCase().includes(q) ?? false) ||
      (a.description?.toLowerCase().includes(q) ?? false) ||
      a.category.toLowerCase().includes(q)
    );
  }, [activeCategory, debouncedQuery]);

  /* Non-featured grid articles — memoised */
  const gridArticles: Article[] = useMemo(
    () => filtered.filter((a) => !a.featured || activeCategory !== "all" || !!debouncedQuery),
    [filtered, activeCategory, debouncedQuery]
  );
  const visibleArticles = gridArticles.slice(0, visibleCount);
  const hasMore = visibleCount < gridArticles.length;

  /* Reset pagination on filter change */
  useEffect(() => {
    setVisibleCount(ARTICLES_PER_PAGE);
  }, [activeCategory, debouncedQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ────────────────── HERO ────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden blog-hero-gradient pt-24 pb-10">
        <BlogParticles />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-primary/3 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Eyebrow label */}
          <div className="mb-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.35em] uppercase">
              <Sparkles size={11} />
              Ancient Wisdom · Modern Clarity
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 animate-fade-up-delay-1">
            <span className="shimmer-gold">Mahabharata</span>
            <br />
            <span className="text-foreground/90 text-4xl sm:text-5xl lg:text-6xl">Insights</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 animate-fade-up-delay-2 leading-relaxed">
            Stories, Characters &amp; Life Lessons from the greatest epic ever told
          </p>

          {/* Stats */}
          <div className="animate-fade-up-delay-2">
            <StatsStrip />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ────────────────── STICKY FILTER + SEARCH ────────────────── */}
      <div ref={filterBarRef} className="sticky-filter-bar bg-background/90 border-b border-border/30 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col sm:flex-row items-center gap-4">

          {/* Search */}
          <div
            className={`relative flex items-center gap-3 glass-card px-5 py-3 rounded-full flex-1 max-w-sm transition-all duration-300 ${
              isSearchFocused ? "border-primary/40 shadow-[0_0_20px_rgba(251,191,36,0.20)]" : ""
            }`}
          >
            <Search size={15} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder={t("blog.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground text-[11px] flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_KEYS.map((key) => (
              <button
                key={t(`blog.categories.${key}`)}
                onClick={() => setActiveCategory(key)}
                className={`filter-pill ${
                  activeCategory === key ? "filter-pill-active" : "filter-pill-inactive"
                }`}
              >
                {t(`blog.categories.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────── MAIN CONTENT ────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">

        {/* ── Featured Article (only show on "All" with no search) ── */}
        {activeCategory === "all" && !debouncedQuery && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="section-label">{t("blog.featured_label")}</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <ArticleCard article={featured} variant="featured" />
          </section>
        )}

        {/* ── Articles Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="section-label block mb-1">
                {t("blog.all_stories")}
              </span>
              <p className="text-muted-foreground text-sm">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {debouncedQuery && ` matching "${debouncedQuery}"`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : visibleArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" role="list" aria-label="Article list">
                {visibleArticles.map((article) => (
                  <div
                    key={article.slug}
                    className="animate-fade-up"
                    style={{ animationFillMode: "both" }}
                    role="listitem"
                  >
                    <ArticleCard article={article} variant="default" />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-14">
                  <button
                    onClick={() => setVisibleCount((c) => c + ARTICLES_PER_PAGE)}
                    aria-label={`Load more stories. Showing ${visibleCount} of ${filtered.length}`}
                    className="group px-10 py-3.5 rounded-full flex items-center gap-3 text-sm font-medium tracking-wide transition-all duration-300"
                    style={{
                      background: "rgba(22,11,0,0.85)",
                      border: "1px solid rgba(251,191,36,0.30)",
                      color: "rgba(253,230,138,0.88)",
                      fontFamily: "'Cinzel',serif",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,191,36,0.15)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(251,191,36,0.60)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#FBBF24";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(22,11,0,0.85)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(251,191,36,0.30)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(253,230,138,0.88)";
                    }}
                  >
                    {t("common.load_more")}
                    <ChevronDown
                      size={16}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-y-0.5 transition-all duration-300"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              variant={debouncedQuery.trim() ? "search" : "articles"}
              description={debouncedQuery.trim() ? `No results for "${debouncedQuery}". Try different keywords or browse all categories.` : undefined}
              cta={{ label: t("common.clear_filters"), onClick: () => { setSearchQuery(""); setActiveCategory("all"); } }}
            />
          )}
        </section>
      </main>

      {/* ────────────────── NEWSLETTER ────────────────── */}
      <section className="section-padding bg-gradient-to-b from-transparent via-card/20 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-label">Stay Connected</span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Get{" "}
            <span className="gold-text">Daily Wisdom</span>
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            One timeless insight from the Mahabharata, delivered to your inbox every morning.
            Ancient knowledge for the modern mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 flex items-center gap-3 glass-card px-5 py-3.5 rounded-full">
              <Mail size={15} className="text-muted-foreground flex-shrink-0" />
              <input
                type="email"
                placeholder={t("blog.email_placeholder")}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
            </div>
            <button className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-gold-light transition-all duration-300 animate-pulse-glow whitespace-nowrap tracking-wide">
              {t("common.subscribe")}
            </button>
          </div>

          <p className="text-muted-foreground/40 text-xs mt-5 tracking-wide">
            No spam. Unsubscribe anytime. ✦ 12,000+ readers
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
