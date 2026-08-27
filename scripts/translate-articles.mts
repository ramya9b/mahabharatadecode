/**
 * Batch-translates every article into Telugu, Kannada and Hindi and writes
 * one JSON file per article per language under src/data/translations/.
 *
 * Run:  ANTHROPIC_API_KEY=... npx vite-node scripts/translate-articles.mts
 * Flags: --lang=te,kn   --slug=some-slug   --force   --limit=5   --dry
 *
 * Translations are committed to the repo rather than fetched at runtime,
 * which is the whole point: a committed translation is a real page that
 * Google can index, costs nothing per visitor, and cannot fail at load.
 *
 * Re-running is cheap — an article whose English source is unchanged is
 * skipped by hash, so this is safe to run after every content update.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { articles } from "../src/data/articles";
import { TRANSLATED_LOCALES, type TranslatedLocale } from "../src/data/translations";

const MODEL = "claude-opus-5";
const OUT_ROOT = path.resolve(process.cwd(), "src/data/translations");

const LANG_NAME: Record<TranslatedLocale, string> = {
  te: "Telugu (తెలుగు)", kn: "Kannada (ಕನ್ನಡ)", hi: "Hindi (हिन्दी)",
};

const arg = (k: string) => {
  const hit = process.argv.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.split("=")[1] : undefined;
};
const has = (k: string) => process.argv.includes(`--${k}`);

const langs = (arg("lang")?.split(",") as TranslatedLocale[]) ?? [...TRANSLATED_LOCALES];
const onlySlug = arg("slug");
const limit = Number(arg("limit") ?? 0);
const force = has("force");
const dry = has("dry");

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY && !dry) {
  console.error("ANTHROPIC_API_KEY is not set. Export it, or pass --dry to preview the plan.");
  process.exit(1);
}

/** Only the fields a reader sees. Indices are the contract — the model is
    told to preserve array lengths so the overlay lines up. */
function payloadFor(a: any) {
  return {
    title: a.title,
    subtitle: a.subtitle,
    description: a.description,
    summary: a.summary,
    metaTitle: a.metaTitle,
    metaDescription: a.metaDescription,
    pullQuote: a.pullQuote,
    storyBlocks: (a.storyBlocks ?? []).map((s: any) => ({ label: s.label, paragraphs: s.paragraphs })),
    content: (a.content ?? []).map((c: any) => ({ text: c.text })),
    lifeLessons: a.lifeLessons ?? [],
    keyLessons: (a.keyLessons ?? []).map((k: any) => ({ title: k.title, description: k.description })),
    modernConnections: (a.modernConnections ?? []).map((m: any) => ({ context: m.context, insight: m.insight, example: m.example })),
    faqs: (a.faqs ?? []).map((f: any) => ({ question: f.question, answer: f.answer })),
    slokaTranslation: a.sloka?.translation,
  };
}

const hashOf = (o: unknown) =>
  crypto.createHash("sha256").update(JSON.stringify(o)).digest("hex").slice(0, 16);

const SYSTEM = (lang: TranslatedLocale) => `You are translating a devotional/literary article about the Mahabharata into ${LANG_NAME[lang]} for an Indian readership that knows the epic.

Rules:
- Return ONLY a JSON object with exactly the same keys and the same array lengths as the input. No commentary, no markdown fence.
- Translate meaning and register, not words. This is essayistic prose, not documentation — keep its rhythm and restraint.
- Keep Sanskrit proper nouns (Karna, Draupadi, dharma, Kurukshetra) in the natural ${LANG_NAME[lang]} rendering readers expect, not transliterated English spelling.
- Do not add, remove, merge or reorder any array element. An empty string in means an empty string out.
- Leave any English brand name (MahabharataDecoded) untranslated.
- metaTitle must stay under 60 characters and metaDescription under 155, since they are search-result text.`;

async function translateOne(a: any, lang: TranslatedLocale) {
  const body = payloadFor(a);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM(lang),
      messages: [{ role: "user", content: JSON.stringify(body) }],
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data: any = await res.json();
  if (data.stop_reason === "max_tokens") throw new Error("output hit max_tokens — article too long");

  const text = (data.content ?? []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("").trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < 0) throw new Error("no JSON in response");
  const out = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

  /* Length mismatches would silently misalign the overlay, so refuse them. */
  for (const k of ["storyBlocks", "content", "lifeLessons", "keyLessons", "modernConnections", "faqs"] as const) {
    const want = (body as any)[k]?.length ?? 0;
    const got = out[k]?.length ?? 0;
    if (want !== got) throw new Error(`${k}: expected ${want} items, got ${got}`);
  }
  if (!out.title) throw new Error("missing title");
  return out;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let done = 0, skipped = 0, failed = 0, processed = 0;
const failures: string[] = [];

for (const lang of langs) {
  fs.mkdirSync(path.join(OUT_ROOT, lang), { recursive: true });
  for (const a of articles as any[]) {
    if (onlySlug && a.slug !== onlySlug) continue;
    if (limit && processed >= limit) break;

    const file = path.join(OUT_ROOT, lang, `${a.slug}.json`);
    const srcHash = hashOf(payloadFor(a));

    if (!force && fs.existsSync(file)) {
      try {
        if (JSON.parse(fs.readFileSync(file, "utf8")).sourceHash === srcHash) { skipped++; continue; }
      } catch { /* unreadable — regenerate */ }
    }

    processed++;
    if (dry) { console.log(`  would translate  ${lang}/${a.slug}`); continue; }

    let lastErr = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const out = await translateOne(a, lang);
        fs.writeFileSync(file, JSON.stringify({
          slug: a.slug, lang, sourceHash: srcHash,
          translatedAt: new Date().toISOString().slice(0, 10),
          ...out,
        }, null, 2) + "\n", "utf8");
        console.log(`  ok  ${lang}/${a.slug}`);
        done++;
        lastErr = "";
        break;
      } catch (e: any) {
        lastErr = e.message;
        if (attempt < 3) await sleep(2000 * attempt);
      }
    }
    if (lastErr) { failed++; failures.push(`${lang}/${a.slug}: ${lastErr}`); console.error(`  FAIL ${lang}/${a.slug} — ${lastErr}`); }
    await sleep(400);
  }
}

console.log(`\ntranslated ${done}, skipped ${skipped} (unchanged), failed ${failed}`);
if (failures.length) { console.log("failures:"); failures.forEach(f => console.log("  " + f)); process.exitCode = 1; }
