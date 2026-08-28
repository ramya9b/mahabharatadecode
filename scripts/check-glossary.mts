/**
 * Cross-file consistency check for translated proper nouns.
 *
 * The verifier catches structural faults. This catches the thing a native
 * reader notices first and no length check ever will: the same name spelled
 * three different ways across three articles. With 63 files written over
 * many sittings, drift is the realistic failure — భీష్ముడు in one file and
 * భీష్మ in the next reads as carelessness even when both are defensible.
 *
 * Run: npx vite-node scripts/check-glossary.mts
 */
import fs from "node:fs";
import path from "node:path";
import { articles } from "../src/data/articles";
import { TRANSLATED_LOCALES, type TranslatedLocale } from "../src/data/translations/apply";

const ROOT = path.resolve(process.cwd(), "src/data/translations");

/** english source term -> the one form each language should use. */
const GLOSSARY: Record<string, Partial<Record<TranslatedLocale, string>>> = {
  Bhishma:      { te: "భీష్ముడు",     kn: "ಭೀಷ್ಮ" },
  Arjuna:       { te: "అర్జునుడు",    kn: "ಅರ್ಜುನ" },
  Krishna:      { te: "కృష్ణుడు",     kn: "ಕೃಷ್ಣ" },
  Karna:        { te: "కర్ణుడు",      kn: "ಕರ್ಣ" },
  Draupadi:     { te: "ద్రౌపది",      kn: "ದ್ರೌಪದಿ" },
  Duryodhana:   { te: "దుర్యోధనుడు",  kn: "ದುರ್ಯೋಧನ" },
  Yudhishthira: { te: "యుధిష్ఠిరుడు", kn: "ಯುಧಿಷ್ಠಿರ" },
  Bhima:        { te: "భీముడు",       kn: "ಭೀಮ" },
  Drona:        { te: "ద్రోణుడు",     kn: "ದ್ರೋಣ" },
  Gandhari:     { te: "గాంధారి",      kn: "ಗಾಂಧಾರಿ" },
  Kunti:        { te: "కుంతి",        kn: "ಕುಂತಿ" },
  Abhimanyu:    { te: "అభిమన్యుడు",   kn: "ಅಭಿಮನ್ಯು" },
  Kurukshetra:  { te: "కురుక్షేత్ర",  kn: "ಕುರುಕ್ಷೇತ್ರ" },
  Hastinapura:  { te: "హస్తినాపుర",   kn: "ಹಸ್ತಿನಾಪುರ" },
  dharma:       { te: "ధర్మ",         kn: "ಧರ್ಮ" },
  Parva:        { te: "పర్వ",         kn: "ಪರ್ವ" },
};

/* Latin-script leakage a reader notices instantly. Digits and the brand
   name are legitimate; anything else is a word that never got translated. */
const ALLOWED_LATIN = /^(MahabharataDecoded|[0-9.:,%-]+)$/;

const problems: string[] = [];
let checked = 0;

for (const a of articles as any[]) {
  const sourceBlob = JSON.stringify(a);

  for (const lang of TRANSLATED_LOCALES) {
    const file = path.join(ROOT, lang, `${a.slug}.json`);
    if (!fs.existsSync(file)) continue;
    checked++;

    let tx: any;
    try { tx = JSON.parse(fs.readFileSync(file, "utf8")); } catch { continue; }
    const prose: string[] = [
      tx.title, tx.subtitle, tx.description, tx.summary,
      tx.metaTitle, tx.metaDescription, tx.pullQuote, tx.slokaTranslation,
      ...(tx.storyBlocks ?? []).flatMap((s: any) => [s.label, ...(s.paragraphs ?? [])]),
      ...(tx.content ?? []).map((c: any) => c.text),
      ...(tx.lifeLessons ?? []),
      ...(tx.keyLessons ?? []).flatMap((k: any) => [k.title, k.description]),
      ...(tx.modernConnections ?? []).flatMap((m: any) => [m.context, m.insight, m.example]),
      ...(tx.faqs ?? []).flatMap((f: any) => [f.question, f.answer]),
    ].filter(Boolean);
    const blob = prose.join(" ");
    const id = `${lang}/${a.slug}`;

    /* If the English article names a figure, the translation should carry
       the agreed form for it. */
    for (const [term, forms] of Object.entries(GLOSSARY)) {
      const want = forms[lang];
      if (!want) continue;
      const inSource = new RegExp(`\b${term}\b`, "i").test(sourceBlob);
      if (inSource && !blob.includes(want))
        problems.push(`${id}: source mentions "${term}" but translation never uses ${want}`);
    }

    /* Stray English words left in the prose. */
    const latin = (blob.match(/[A-Za-z][A-Za-z'-]{2,}/g) ?? [])
      .filter(w => !ALLOWED_LATIN.test(w))
      ;
    const unique = [...new Set(latin)];
    if (unique.length)
      problems.push(`${id}: untranslated Latin-script word(s): ${unique.slice(0, 6).join(", ")}`);
  }
}

console.log(`glossary check over ${checked} translated files`);
if (problems.length) {
  console.log(`\n${problems.length} issue(s):`);
  problems.slice(0, 40).forEach(p => console.log("  " + p));
  if (problems.length > 40) console.log(`  ...and ${problems.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log("no naming drift, no untranslated words");
}
