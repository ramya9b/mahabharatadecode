/* Pure translation types and overlay. No Vite-only syntax here, so the
   build config can import this from plain Node just as the browser does. */
import type { Article } from "@/data/articles";

export const TRANSLATED_LOCALES = ["te", "kn", "hi"] as const;
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];

export const LOCALE_LABEL: Record<TranslatedLocale, string> = {
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  hi: "हिन्दी",
};

/**
 * A translated article. Only reader-facing prose is carried — slugs, dates,
 * images and related-article wiring stay on the English record, so a
 * translation can never drift structurally from its source.
 */
export interface ArticleTranslation {
  slug: string;
  lang: TranslatedLocale;
  /** Hash of the English source when this was produced, so the batch script
      re-translates only what actually changed. */
  sourceHash: string;
  translatedAt: string;

  title: string;
  subtitle?: string;
  description?: string;
  summary?: string;
  metaTitle?: string;
  metaDescription?: string;
  pullQuote?: string;
  storyBlocks?: { label: string; paragraphs: string[] }[];
  content?: { text: string }[];
  lifeLessons?: string[];
  keyLessons?: { title: string; description: string }[];
  modernConnections?: { context: string; insight: string; example: string }[];
  faqs?: { question: string; answer: string }[];
  slokaTranslation?: string;
}

/**
 * Overlays a translation onto its English article. Anything the translator
 * did not return falls back to English rather than rendering blank, so a
 * partial translation degrades to a mixed page instead of a broken one.
 */
export function applyTranslation(article: Article, tx?: ArticleTranslation): Article {
  if (!tx) return article;
  return {
    ...article,
    title: tx.title || article.title,
    subtitle: tx.subtitle || article.subtitle,
    description: tx.description || article.description,
    summary: tx.summary || article.summary,
    metaTitle: tx.metaTitle || article.metaTitle,
    metaDescription: tx.metaDescription || article.metaDescription,
    pullQuote: tx.pullQuote || article.pullQuote,
    storyBlocks: article.storyBlocks?.map((sb, i) => ({
      ...sb,
      label: tx.storyBlocks?.[i]?.label || sb.label,
      paragraphs: tx.storyBlocks?.[i]?.paragraphs?.length
        ? tx.storyBlocks[i].paragraphs
        : sb.paragraphs,
    })),
    /* Indexed overlay: block type and links stay English-side, only text moves. */
    content: article.content?.map((b, i) => ({ ...b, text: tx.content?.[i]?.text || b.text })),
    lifeLessons: tx.lifeLessons?.length ? tx.lifeLessons : article.lifeLessons,
    keyLessons: article.keyLessons?.map((k, i) => ({
      ...k,
      title: tx.keyLessons?.[i]?.title || k.title,
      description: tx.keyLessons?.[i]?.description || k.description,
    })),
    modernConnections: article.modernConnections?.map((m, i) => ({
      ...m,
      context: tx.modernConnections?.[i]?.context || m.context,
      insight: tx.modernConnections?.[i]?.insight || m.insight,
      example: tx.modernConnections?.[i]?.example || m.example,
    })),
    faqs: article.faqs?.map((f, i) => ({
      question: tx.faqs?.[i]?.question || f.question,
      answer: tx.faqs?.[i]?.answer || f.answer,
    })),
    sloka: article.sloka
      ? { ...article.sloka, translation: tx.slokaTranslation || article.sloka.translation }
      : article.sloka,
  } as Article;
}
