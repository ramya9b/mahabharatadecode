import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { useSEO, buildArticleSchema, buildFAQSchema } from "@/hooks/useSEO";
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

  const article = slug ? getArticleBySlug(slug) : undefined;

  /* Track last-read for the homepage "Continue reading" card. Runs as an
     effect rather than during render so it stays a side effect, not a
     render-time mutation. */
  useEffect(() => {
    if (article) recordLastRead(article.slug, article.title);
  }, [article]);

  /* ── Translation state ── */
  const [currentLang, setCurrentLang] = React.useState<LangCode>("en");
  const [translatedContent, setTranslatedContent] = React.useState<string | null>(null);

  const plainText = React.useMemo(
    () => (article ? extractPlainText(article.title, article.content ?? [], article.lifeLessons) : ""),
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

  const ogImage = !article
    ? ""
    : article.imageKey === "hero"
      ? `https://mahabharatadecoded.com/og-default.jpg`
      : `https://mahabharatadecoded.com/characters/${article.imageKey}.webp`;

  useSEO({
    title: article ? article.metaTitle || article.title : "",
    description: article
      ? article.metaDescription || article.summary || article.description || ""
      : "",
    image: ogImage,
    path: article ? `/blog/${article.slug}` : "",
    type: "article",
    author: "MahabharataDecoded",
    publishedAt: article?.publishDate || "2026-01-01",
    schema: (() => {
      if (!article) return undefined;
      const articleSchema = buildArticleSchema({
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.summary || "",
        slug: article.slug,
        publishedAt: article.publishDate,
      });
      return article.faqs && article.faqs.length > 0
        ? [articleSchema, buildFAQSchema(article.faqs)]
        : articleSchema;
    })(),
  });

  /* Every hook above runs on all renders, so the redirects must come after
     them — otherwise the hook count changes between a valid and an unknown
     slug and React throws "rendered fewer hooks than expected". */
  if (!slug || !article) return <Navigate to="/blog" replace />;

  const related    = getRelatedArticles(article);
  const articleUrl = `https://mahabharatadecoded.com/blog/${article.slug}`;

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
        slug={article.slug}
        reason="Your 14-day trial ended"
        title="Read the rest of this story"
        description="Your free 14 days have ended. Upgrade for unlimited articles and Story Teller access."
        teaser={
          article.storyBlocks?.length > 0 ? (
            <StorySection storyBlocks={article.storyBlocks.slice(0, 1)} />
          ) : null
        }
      >
        {/* Personal note — human-written, in Ramya's voice (optional) */}
        {article.editorNote && (
          <div className="max-w-[680px] mx-auto px-6 md:px-8 pt-6 pb-2">
            <EditorNote note={article.editorNote} />
          </div>
        )}

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
          <LessonCards
            lessons={article.keyLessons}
            characterName={
              article.imageKey === "karna"    ? "Karna"     :
              article.imageKey === "krishna"  ? "Krishna"   :
              article.imageKey === "arjuna"   ? "Arjuna"    :
              article.imageKey === "draupadi" ? "Draupadi"  :
              article.imageKey === "bhishma"  ? "Bhishma"   :
              "the Mahabharata"
            }
          />
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

        {/* Frequently Asked Questions (also emitted as FAQPage schema for rich results) */}
        {article.faqs && article.faqs.length > 0 && (
          <FaqSection faqs={article.faqs} />
        )}
      </LockGate>

      {/* ── 10. Reply by email — for critical thinkers ── */}
      <section className="pb-2">
        <div className="max-w-[680px] mx-auto px-6 md:px-8">
          <a
            href={`mailto:hello@mahabharatadecoded.com?subject=On: ${encodeURIComponent(article.title)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "15px",
              color: "rgba(107,45,143,0.65)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(107,45,143,0.2)",
              paddingBottom: "2px",
              transition: "color 0.2s",
            }}
          >
            ✦ Disagree with something in this article? Reply and tell me why →
          </a>
        </div>
      </section>

      {/* ── 11. Share Buttons ── */}
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
          border: "1px solid rgba(107,45,143,0.14)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(107,45,143,0.35), transparent)",
          }}
        />
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(107,45,143,0.1)",
              border: "1px solid rgba(107,45,143,0.2)",
            }}
          >
            <BookOpen size={14} className="text-primary" />
          </div>
          <h3
            className="font-heading font-semibold"
            style={{
              fontSize: "17px",
              letterSpacing: "0.06em",
              color: "rgba(245,232,238,0.95)",
            }}
          >
            Take These With You
          </h3>
        </div>
        <ul className="space-y-3.5">
          {lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="font-heading text-[10px] mt-0.5 flex-shrink-0"
                style={{ letterSpacing: "0.2em", color: "rgba(107,45,143,0.55)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "17px",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "rgba(245,237,218,0.88)",
                  lineHeight: 1.75,
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

/* ── Frequently Asked Questions ── */
const FaqSection = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="pb-12" aria-label="Frequently asked questions">
      <div ref={ref} className="reveal-element max-w-[680px] mx-auto px-6 md:px-8">
        <h2
          className="font-heading font-semibold mb-6"
          style={{
            fontSize: "26px",
            letterSpacing: "0.02em",
            color: "hsl(var(--primary))",
          }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl px-5 py-4"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <summary
                className="cursor-pointer list-none font-heading font-medium flex items-start justify-between gap-4"
                style={{
                  fontSize: "18px",
                  color: "hsl(var(--foreground))",
                  lineHeight: 1.5,
                }}
              >
                <span>{f.question}</span>
                <span
                  className="text-primary/50 transition-transform group-open:rotate-45 flex-shrink-0"
                  style={{ fontSize: "22px", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p
                className="mt-3 text-muted-foreground"
                style={{
                  fontSize: "17px",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  lineHeight: 1.75,
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Personal note from Ramya — human voice, warm framing ── */
const EditorNote = ({ note }: { note: string }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal-element rounded-2xl px-6 py-5 md:px-7 md:py-6"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--primary) / 0.28)",
        borderLeft: "3px solid hsl(var(--primary))",
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="text-[10px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "'Cinzel', serif", color: "hsl(var(--primary))" }}
        >
          ✍️ A note from Ramya
        </span>
      </div>
      <p
        className="leading-relaxed"
        style={{
          fontSize: "17px",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "hsl(var(--foreground))",
          lineHeight: 1.75,
          whiteSpace: "pre-line",
        }}
      >
        {note}
      </p>
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
        borderLeft: "2px solid rgba(107,45,143,0.18)",
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
