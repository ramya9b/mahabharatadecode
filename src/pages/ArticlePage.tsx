import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { useSEO, buildArticleSchema } from "@/hooks/useSEO";
import ArticleHero from "@/components/article/ArticleHero";
import ReadingProgress from "@/components/article/ReadingProgress";
import StorySection from "@/components/article/StorySection";
import ContentRenderer from "@/components/article/ContentRenderer";
import LessonCards from "@/components/article/LessonCards";
import ModernConnections from "@/components/article/ModernConnections";
import SlokaBlock from "@/components/article/SlokaBlock";
import ReelHook from "@/components/article/ReelHook";
import ArticleCTA from "@/components/article/ArticleCTA";
import RelatedPosts from "@/components/article/RelatedPosts";
import { getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BookOpen } from "lucide-react";
import ArticleTranslator, { extractPlainText, type LangCode } from "@/components/ArticleTranslator";
import LockGate from "@/components/LockGate";
import { recordLastRead } from "@/hooks/useLastRead";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const article = getArticleBySlug(slug);
  if (!article) return <Navigate to="/blog" replace />;

  /* Track last-read for the homepage "Continue reading" card */
  recordLastRead(article.slug, article.title);

  const related    = getRelatedArticles(article);
  const articleUrl = `https://mahabharatadecoded.com/blog/${article.slug}`;

  /* ── Translation state ── */
  const [currentLang, setCurrentLang] = React.useState<LangCode>("en");
  const [translatedContent, setTranslatedContent] = React.useState<string | null>(null);

  const plainText = React.useMemo(
    () => extractPlainText(article.title, article.content ?? [], article.lifeLessons),
    [article]
  );

  const handleTranslated = React.useCallback((lang: LangCode, text: string) => {
    setTranslatedContent(text);
    setCurrentLang(lang);
  }, []);

  const handleLangChange = React.useCallback((lang: LangCode) => {
    if (lang === "en") {
      setTranslatedContent(null);
    }
    setCurrentLang(lang);
  }, []);

  const ogImage = article.imageKey === "hero"
    ? `https://mahabharatadecoded.com/og-default.jpg`
    : `https://mahabharatadecoded.com/characters/${article.imageKey}.webp`;

  useSEO({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary || article.description || "",
    image: ogImage,
    path: `/blog/${article.slug}`,
    type: "article",
    author: "MahabharataDecoded",
    publishedAt: article.publishDate || "2026-01-01",
    schema: buildArticleSchema({
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.summary || "",
      slug: article.slug,
      publishedAt: article.publishDate,
    }),
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Gold reading progress bar ── */}
      <ReadingProgress />
      <Navbar />

      {/* ── 1. Cinematic Hero ── */}
      <ArticleHero article={article} />

      {/* ── Language selector — sticky below hero ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 24px 0",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        <ArticleTranslator
          slug={article.slug}
          title={article.title}
          content={plainText}
          currentLang={currentLang}
          onTranslated={handleTranslated}
          onLangChange={handleLangChange}
        />
      </div>

      {/* ── 2-9. Article body — gated behind subscription after 14-day trial ── */}
      <LockGate
        reason="Your 14-day trial ended"
        title="Read the rest of this story"
        description="Your free 14 days have ended. Upgrade for unlimited articles and Story Teller access."
        teaser={
          article.storyBlocks?.length > 0 ? (
            <StorySection storyBlocks={article.storyBlocks.slice(0, 1)} />
          ) : null
        }
      >
        {/* Named Story Sections (Introduction / Background / Turning Point) */}
        {article.storyBlocks?.length > 0 && (
          <StorySection storyBlocks={article.storyBlocks} />
        )}

        {/* Additional prose — shows translation if selected */}
        {article.content?.length > 0 && (
          <section className="pb-8">
            <div className="max-w-[680px] mx-auto px-6 md:px-8">
              {translatedContent && currentLang !== "en" ? (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "19px",
                    lineHeight: "1.85",
                    color: "hsl(var(--foreground))",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {translatedContent}
                </div>
              ) : (
                <ContentRenderer
                  blocks={article.content}
                  pullQuote={article.pullQuote}
                />
              )}
            </div>
          </section>
        )}

        {/* Life lessons compact list */}
        {article.lifeLessons?.length > 0 && (
          <LifeLessonsList lessons={article.lifeLessons} />
        )}

        {/* Key Lesson Cards */}
        {article.keyLessons && article.keyLessons.length > 0 && (
          <LessonCards lessons={article.keyLessons} />
        )}

        {/* Modern Relevance */}
        {article.modernConnections && article.modernConnections.length > 0 && (
          <ModernConnections connections={article.modernConnections} />
        )}

        {/* Sacred Sloka */}
        {article.sloka && (
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <SlokaBlock sloka={article.sloka} />
          </div>
        )}

        {/* Reel Hook (replaces video gap) */}
        {article.reelHook && (
          <ReelHook
            hook={article.reelHook.hook}
            supporting={article.reelHook.supporting}
          />
        )}

        {/* Author Note */}
        {article.authorNote && (
          <div className="max-w-[680px] mx-auto px-6 md:px-8 pb-12">
            <AuthorNote note={article.authorNote} />
          </div>
        )}
      </LockGate>

      {/* ── 10. Share Buttons ── */}
      <section className="pb-8" aria-label="Share this article">
        <div className="max-w-[680px] mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-border/30">
            <ShareButtons url={articleUrl} title={article.title} description={article.summary || article.description || ""} />
          </div>
        </div>
      </section>

      {/* ── 11. CTA ── */}
      <ArticleCTA />

      {/* ── 12. Related Posts ── */}
      <RelatedPosts articles={related} />

      <Footer />
    </div>
  );
};

/* ── Life Lessons compact list ── */
const LifeLessonsList = ({ lessons }: { lessons: string[] }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div className="max-w-[680px] mx-auto px-6 md:px-8 pb-4">
      <div
        ref={ref}
        className="reveal-element rounded-2xl p-7 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,18,30,0.85) 0%, rgba(20,14,8,0.85) 100%)",
          border: "1px solid rgba(212,175,55,0.14)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(212,175,55,0.35), transparent)",
          }}
        />
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <BookOpen size={14} className="text-primary" />
          </div>
          <h3
            className="font-heading text-foreground font-semibold"
            style={{ fontSize: "17px", letterSpacing: "0.06em" }}
          >
            Take These With You
          </h3>
        </div>
        <ul className="space-y-3.5">
          {lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="font-heading text-[10px] text-primary/45 mt-0.5 flex-shrink-0"
                style={{ letterSpacing: "0.2em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-muted-foreground leading-relaxed"
                style={{
                  fontSize: "17px",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {lesson}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ── Author/editorial note ── */
const AuthorNote = ({ note }: { note: string }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal-element rounded-xl px-6 py-5"
      style={{
        borderLeft: "2px solid rgba(212,175,55,0.18)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <span
        className="block text-primary/45 text-[10px] tracking-[0.32em] uppercase mb-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Editorial Note
      </span>
      <p
        className="text-muted-foreground leading-relaxed italic"
        style={{
          fontSize: "14px",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        {note}
      </p>
    </div>
  );
};

export default ArticlePage;
