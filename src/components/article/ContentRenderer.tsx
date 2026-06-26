import { Link } from "react-router-dom";
import type { ContentBlock } from "@/data/articles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";

/* ── Individual block types ── */

const Para = ({ text }: { text: string }) => (
  <p
    className="text-foreground/85 leading-[1.95] mb-7"
    style={{ fontSize: "clamp(16px, 1.8vw, 19px)", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
  >
    {text}
  </p>
);

const Heading = ({ text }: { text: string }) => (
  <h2
    className="font-heading font-bold mt-14 mb-6 leading-tight"
    style={{
      fontSize: "clamp(22px, 2.5vw, 30px)",
      background: "linear-gradient(135deg, #E8C547 0%, #D4AF37 55%, #B8922A 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    {text}
  </h2>
);

const Quote = ({ text }: { text: string }) => (
  <blockquote className="relative my-12 md:my-14">
    {/* Left accent bar */}
    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/70 to-transparent rounded-full" />

    {/* Decorative open-quote */}
    <div
      className="absolute -top-4 -left-2 font-heading select-none pointer-events-none"
      style={{
        fontSize: "80px",
        lineHeight: 1,
        color: "rgba(212,175,55,0.12)",
        fontStyle: "normal",
      }}
    >
      "
    </div>

    <p
      className="pl-8 text-foreground/85 italic leading-relaxed"
      style={{
        fontSize: "clamp(18px, 2.2vw, 24px)",
        fontFamily: "'Cinzel', serif",
        fontStyle: "italic",
      }}
    >
      {text}
    </p>
  </blockquote>
);

const LessonCallout = ({ text }: { text: string }) => (
  <div
    className="relative my-10 rounded-2xl overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.03) 100%)",
      border: "1px solid rgba(212,175,55,0.18)",
    }}
  >
    {/* Top shimmer line */}
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
      }}
    />
    <div className="flex items-start gap-4 p-6 md:p-7">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: "rgba(212,175,55,0.12)",
          border: "1px solid rgba(212,175,55,0.22)",
        }}
      >
        <span className="text-primary text-sm">✦</span>
      </div>
      <p
        className="text-foreground/85 italic leading-relaxed flex-1"
        style={{ fontSize: "clamp(15px, 1.6vw, 17px)", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {text}
      </p>
    </div>
  </div>
);

/* ── Internal links block — SEO contextual links ── */
const RelatedLinks = ({ links }: { links: { slug: string; label: string }[] }) => (
  <nav
    aria-label="Related articles"
    className="my-10 rounded-2xl overflow-hidden"
    style={{
      background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 100%)",
      border: "1px solid rgba(212,175,55,0.15)",
    }}
  >
    <div
      className="px-6 py-4 border-b"
      style={{ borderColor: "rgba(212,175,55,0.1)" }}
    >
      <span
        className="text-[10px] tracking-[0.3em] uppercase"
        style={{ fontFamily: "'Cinzel', serif", color: "rgba(212,175,55,0.6)" }}
      >
        Continue Reading
      </span>
    </div>
    <ul className="divide-y" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
      {links.map((link) => (
        <li key={link.slug}>
          <Link
            to={`/blog/${link.slug}`}
            className="flex items-center justify-between gap-4 px-6 py-4 group transition-colors duration-200"
            style={{ color: "rgba(245,237,218,0.85)" }}
          >
            <span
              className="leading-snug group-hover:text-primary transition-colors duration-200"
              style={{
                fontSize: "clamp(14px, 1.6vw, 16px)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              {link.label}
            </span>
            <ArrowRight
              size={14}
              className="flex-shrink-0 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
            />
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

/* ── Full-width pull quote (appears once, mid-article) ── */
export const PullQuote = ({ text }: { text: string }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal-element my-16 md:my-20 py-14 md:py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,0,0,0.06) 0%, rgba(212,175,55,0.06) 50%, rgba(139,0,0,0.04) 100%)",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      {/* Decorative quote mark */}
      <div
        className="absolute top-4 left-8 font-heading select-none pointer-events-none"
        style={{ fontSize: "120px", lineHeight: 1, color: "rgba(212,175,55,0.06)" }}
      >
        "
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-10 bg-primary/30" />
          <span
            className="text-primary/60 text-[10px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Key Insight
          </span>
          <div className="h-px w-10 bg-primary/30" />
        </div>
        <p
          className="text-foreground/90 italic leading-relaxed"
          style={{
            fontSize: "clamp(20px, 2.8vw, 30px)",
            fontFamily: "'Cinzel', serif",
            fontStyle: "italic",
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

/* ── Main renderer ── */
interface ContentRendererProps {
  blocks: ContentBlock[];
  pullQuote?: string;
}

const ContentRenderer = ({ blocks, pullQuote }: ContentRendererProps) => {
  // Inject pull quote after the 4th paragraph
  let paraCount = 0;
  let pullInserted = false;

  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === "paragraph") paraCount++;

        const insertPull = pullQuote && !pullInserted && paraCount === 4;
        if (insertPull) pullInserted = true;

        return (
          <div key={i}>
            {insertPull && <PullQuote text={pullQuote!} />}
            {block.type === "paragraph" && <Para text={block.text} />}
            {block.type === "heading" && <Heading text={block.text} />}
            {block.type === "quote" && <Quote text={block.text} />}
            {block.type === "lesson" && <LessonCallout text={block.text} />}
            {block.type === "related_links" && block.links && (
              <RelatedLinks links={block.links} />
            )}
            {block.type === "divider" && (
              <div className="flex items-center gap-4 my-12">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-primary/30 text-[10px] tracking-widest">✦ ✦ ✦</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContentRenderer;
