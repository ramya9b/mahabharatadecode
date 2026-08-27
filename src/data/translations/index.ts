export * from "./apply";
import { TRANSLATED_LOCALES, type ArticleTranslation, type TranslatedLocale } from "./apply";

/* Built at compile time from whatever JSON is committed. An empty folder
   yields empty maps, which is what lets the site build before any
   translation has been generated. */
const FILES = import.meta.glob<ArticleTranslation>(
  "./*/*.json",
  { eager: true, import: "default" },
);

const BY_LANG: Record<string, Map<string, ArticleTranslation>> = {
  te: new Map(), kn: new Map(), hi: new Map(),
};

for (const [file, data] of Object.entries(FILES)) {
  const lang = file.split("/")[1] as TranslatedLocale;
  if (BY_LANG[lang] && data?.slug) BY_LANG[lang].set(data.slug, data);
}

export function getTranslation(slug: string, lang: string): ArticleTranslation | undefined {
  return BY_LANG[lang]?.get(slug);
}

/** Which languages this article actually exists in — the basis for hreflang,
    so we never advertise a page that was never generated. */
export function translatedLocalesFor(slug: string): TranslatedLocale[] {
  return TRANSLATED_LOCALES.filter(l => BY_LANG[l].has(slug));
}

export function translatedSlugs(lang: TranslatedLocale): string[] {
  return [...(BY_LANG[lang]?.keys() ?? [])];
}
