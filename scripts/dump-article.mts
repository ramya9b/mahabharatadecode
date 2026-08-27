/**
 * Prints an article's translatable payload plus the source hash a
 * translation file must carry. Used when translating by hand.
 *
 * Run: npx vite-node scripts/dump-article.mts -- <slug> [<slug>...]
 */
import crypto from "node:crypto";
import { articles } from "../src/data/articles";

function payloadFor(a: any) {
  return {
    title: a.title, subtitle: a.subtitle, description: a.description, summary: a.summary,
    metaTitle: a.metaTitle, metaDescription: a.metaDescription, pullQuote: a.pullQuote,
    storyBlocks: (a.storyBlocks ?? []).map((s: any) => ({ label: s.label, paragraphs: s.paragraphs })),
    content: (a.content ?? []).map((c: any) => ({ text: c.text })),
    lifeLessons: a.lifeLessons ?? [],
    keyLessons: (a.keyLessons ?? []).map((k: any) => ({ title: k.title, description: k.description })),
    modernConnections: (a.modernConnections ?? []).map((m: any) => ({ context: m.context, insight: m.insight, example: m.example })),
    faqs: (a.faqs ?? []).map((f: any) => ({ question: f.question, answer: f.answer })),
    slokaTranslation: a.sloka?.translation,
  };
}

const slugs = process.argv.slice(2).filter(s => !s.startsWith("-"));
for (const slug of slugs) {
  const a: any = (articles as any[]).find(x => x.slug === slug);
  if (!a) { console.log(`!! no article ${slug}`); continue; }
  const p = payloadFor(a);
  console.log(`===== ${slug}`);
  console.log(`hash: ${crypto.createHash("sha256").update(JSON.stringify(p)).digest("hex").slice(0, 16)}`);
  console.log(JSON.stringify(p, null, 1));
}
