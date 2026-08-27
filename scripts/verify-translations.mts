/**
 * Validates every committed translation against its English source.
 *
 * With 186 files written by hand, the failure that matters is not a clumsy
 * sentence — it is a structural one: a merged paragraph shifts every later
 * paragraph onto the wrong slot, and the page still renders, so nobody
 * notices. These checks are mechanical for exactly that reason.
 *
 * Run: npx vite-node scripts/verify-translations.mts
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { articles } from "../src/data/articles";
import { TRANSLATED_LOCALES, type TranslatedLocale } from "../src/data/translations/apply";

const ROOT = path.resolve(process.cwd(), "src/data/translations");

/* Unicode blocks per language: the cheapest way to catch a file that was
   written into the wrong folder, or prose left in English. */
const SCRIPT: Record<TranslatedLocale, RegExp> = {
  te: /[ఀ-౿]/,
  kn: /[ಀ-೿]/,
  hi: /[ऀ-ॿ]/,
};

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
const hashOf = (o: unknown) => crypto.createHash("sha256").update(JSON.stringify(o)).digest("hex").slice(0, 16);

const problems: string[] = [];
let checked = 0, present = 0;
const missing: Record<string, string[]> = { te: [], kn: [], hi: [] };

for (const a of articles as any[]) {
  const src = payloadFor(a);
  const srcHash = hashOf(src);

  for (const lang of TRANSLATED_LOCALES) {
    const file = path.join(ROOT, lang, `${a.slug}.json`);
    if (!fs.existsSync(file)) { missing[lang].push(a.slug); continue; }
    present++;

    let tx: any;
    try { tx = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e: any) { problems.push(`${lang}/${a.slug}: unparseable JSON — ${e.message}`); continue; }
    checked++;

    const id = `${lang}/${a.slug}`;
    if (tx.slug !== a.slug) problems.push(`${id}: slug mismatch (${tx.slug})`);
    if (tx.lang !== lang)   problems.push(`${id}: lang field says ${tx.lang}`);
    if (tx.sourceHash !== srcHash)
      problems.push(`${id}: STALE — English source changed since translation`);

    /* Structural alignment: the overlay is by index, so a length mismatch
       silently maps translated text onto the wrong paragraph. */
    for (const k of ["storyBlocks", "content", "lifeLessons", "keyLessons", "modernConnections", "faqs"] as const) {
      const want = (src as any)[k]?.length ?? 0;
      const got = tx[k]?.length ?? 0;
      if (want !== got) problems.push(`${id}: ${k} has ${got} items, source has ${want}`);
    }
    for (let i = 0; i < (src.storyBlocks?.length ?? 0); i++) {
      const want = src.storyBlocks[i].paragraphs?.length ?? 0;
      const got = tx.storyBlocks?.[i]?.paragraphs?.length ?? 0;
      if (want !== got) problems.push(`${id}: storyBlocks[${i}] has ${got} paragraphs, source has ${want}`);
    }

    if (!tx.title) problems.push(`${id}: missing title`);

    /* Prose that never left English, or landed in the wrong folder. */
    const prose: string[] = [
      tx.title, tx.subtitle, tx.description, tx.summary, tx.pullQuote,
      ...(tx.storyBlocks ?? []).flatMap((s: any) => [s.label, ...(s.paragraphs ?? [])]),
      ...(tx.content ?? []).map((c: any) => c.text),
      ...(tx.lifeLessons ?? []),
      ...(tx.keyLessons ?? []).flatMap((k: any) => [k.title, k.description]),
      ...(tx.faqs ?? []).flatMap((f: any) => [f.question, f.answer]),
    ].filter(Boolean);
    const untranslated = prose.filter(s => typeof s === "string" && s.trim().length > 12 && !SCRIPT[lang].test(s));
    if (untranslated.length)
      problems.push(`${id}: ${untranslated.length} field(s) carry no ${lang} script — e.g. ${JSON.stringify(untranslated[0].slice(0, 55))}`);

    /* Search-result truncation limits. */
    if ((tx.metaTitle ?? "").length > 60) problems.push(`${id}: metaTitle ${tx.metaTitle.length} chars (>60)`);
    if ((tx.metaDescription ?? "").length > 155) problems.push(`${id}: metaDescription ${tx.metaDescription.length} chars (>155)`);
  }
}

const total = (articles as any[]).length * TRANSLATED_LOCALES.length;
console.log(`translated ${present}/${total} files  (${((present / total) * 100).toFixed(0)}% complete)`);
for (const l of TRANSLATED_LOCALES)
  console.log(`  ${l}: ${(articles as any[]).length - missing[l].length}/${(articles as any[]).length}`);

if (problems.length) {
  console.log(`\n${problems.length} problem(s) in ${checked} checked files:`);
  problems.slice(0, 40).forEach(p => console.log("  " + p));
  if (problems.length > 40) console.log(`  ...and ${problems.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log(`\nno problems in ${checked} checked files`);
}

if (missing.te.length) {
  console.log(`\nnext up (te): ${missing.te.slice(0, 5).join(", ")}`);
}
