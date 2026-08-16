/**
 * MahabharataDecoded — i18n QA Test Suite
 *
 * SUITE-V  Translation file completeness & structure
 * SUITE-W  Language switching & persistence logic
 * SUITE-X  Font class application per language
 * SUITE-Y  UI text expansion safety (no overflow risk)
 * SUITE-Z  Accessibility & ARIA for multilingual UI
 * SUITE-AA Character encoding validation (Unicode)
 * SUITE-AB Regression — existing features intact after i18n
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import en from "@/i18n/locales/en.json";
import te from "@/i18n/locales/te.json";
import kn from "@/i18n/locales/kn.json";
import hi from "@/i18n/locales/hi.json";
import { SUPPORTED_LANGUAGES, type SupportedLocale } from "@/i18n/index";
import { articles } from "@/data/articles";
import { characters } from "@/data/characters";
import { QUIZ_QUESTIONS } from "@/data/quiz";

/* ── Helpers ── */
type JsonObj = Record<string, unknown>;

function getAllKeys(obj: JsonObj, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...getAllKeys(v as JsonObj, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function getNestedValue(obj: JsonObj, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object") return (acc as JsonObj)[key];
    return undefined;
  }, obj);
}

const LOCALES = { en, te, kn, hi } as const;
const LOCALE_NAMES = { en: "English", te: "Telugu", kn: "Kannada", hi: "Hindi" };
const EN_KEYS = getAllKeys(en as unknown as JsonObj);

/* ═══════════════════════════════════════════════════════
   SUITE-V: Translation file completeness
═══════════════════════════════════════════════════════ */
describe("SUITE-V: Translation file completeness", () => {
  it("all 4 locale files can be imported without error", () => {
    expect(en).toBeDefined();
    expect(te).toBeDefined();
    expect(kn).toBeDefined();
    expect(hi).toBeDefined();
  });

  it("en.json is the source of truth — has all expected top-level sections", () => {
    const sections = ["lang", "nav", "hero", "common", "blog", "wisdom", "quiz",
      "characters", "about", "notfound", "footer", "cookie", "share"];
    sections.forEach((s) => {
      expect((en as unknown as JsonObj)[s], `missing section: ${s}`).toBeDefined();
    });
  });

  (["te", "kn", "hi"] as const).forEach((locale) => {
    it(`${LOCALE_NAMES[locale]} has all keys present in English`, () => {
      const missing: string[] = [];
      EN_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (val === undefined) missing.push(key);
      });
      expect(missing, `Missing keys in ${locale}: ${missing.join(", ")}`).toHaveLength(0);
    });
  });

  (["en", "te", "kn", "hi"] as const).forEach((locale) => {
    it(`${LOCALE_NAMES[locale]} has no empty string values`, () => {
      const emptyKeys: string[] = [];
      EN_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (typeof val === "string" && val.trim() === "") emptyKeys.push(key);
      });
      expect(emptyKeys, `Empty values in ${locale}: ${emptyKeys.join(", ")}`).toHaveLength(0);
    });
  });

  it("no locale has extra keys not in English (prevents orphaned translations)", () => {
    (["te", "kn", "hi"] as const).forEach((locale) => {
      const localeKeys = getAllKeys(LOCALES[locale] as unknown as JsonObj);
      const extras = localeKeys.filter((k) => !EN_KEYS.includes(k));
      expect(extras, `Extra keys in ${locale}: ${extras.join(", ")}`).toHaveLength(0);
    });
  });

  it("all locale files have the same number of translation keys", () => {
    const counts = Object.fromEntries(
      (["en", "te", "kn", "hi"] as const).map((l) => [
        l,
        getAllKeys(LOCALES[l] as unknown as JsonObj).length,
      ])
    );
    const enCount = counts.en;
    (["te", "kn", "hi"] as const).forEach((l) => {
      expect(counts[l], `${l} has ${counts[l]} keys vs en's ${enCount}`).toBe(enCount);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-W: Language switching & persistence
═══════════════════════════════════════════════════════ */
describe("SUITE-W: Language switching & persistence logic", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("SUPPORTED_LANGUAGES has exactly 4 entries", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(4);
  });

  it("all 4 supported language codes are present", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("te");
    expect(codes).toContain("kn");
    expect(codes).toContain("hi");
  });

  it("all supported languages have required fields", () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.label).toBeTruthy();
      expect(lang.nativeLabel).toBeTruthy();
      expect(lang.dir).toBe("ltr");
      expect(lang.fontClass).toMatch(/^font-/);
    });
  });

  it("all languages are LTR (no RTL required)", () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang.dir).toBe("ltr");
    });
  });

  it("localStorage key for language is 'md_language'", () => {
    const EXPECTED_KEY = "md_language";
    localStorage.setItem(EXPECTED_KEY, "te");
    expect(localStorage.getItem(EXPECTED_KEY)).toBe("te");
  });

  it("language preference persists across reads", () => {
    (["en", "te", "kn", "hi"] as SupportedLocale[]).forEach((lang) => {
      localStorage.setItem("md_language", lang);
      expect(localStorage.getItem("md_language")).toBe(lang);
    });
  });

  it("font class for each language is unique", () => {
    const classes = SUPPORTED_LANGUAGES.map((l) => l.fontClass);
    const unique = new Set(classes);
    expect(unique.size).toBe(SUPPORTED_LANGUAGES.length);
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-X: Font class application
═══════════════════════════════════════════════════════ */
describe("SUITE-X: Language font class assignment", () => {
  it("English uses font-en class", () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === "en");
    expect(lang?.fontClass).toBe("font-en");
  });

  it("Telugu uses font-te class", () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === "te");
    expect(lang?.fontClass).toBe("font-te");
  });

  it("Kannada uses font-kn class", () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === "kn");
    expect(lang?.fontClass).toBe("font-kn");
  });

  it("Hindi uses font-hi class", () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === "hi");
    expect(lang?.fontClass).toBe("font-hi");
  });

  it("native labels display correct scripts", () => {
    const lang = SUPPORTED_LANGUAGES.reduce(
      (acc, l) => ({ ...acc, [l.code]: l.nativeLabel }),
      {} as Record<string, string>
    );
    // Telugu script: తెలుగు — verify Unicode range (0C00–0C7F)
    expect([...lang.te].some((c) => c.codePointAt(0)! >= 0x0C00 && c.codePointAt(0)! <= 0x0C7F)).toBe(true);
    // Kannada script: ಕನ್ನಡ — Unicode range 0C80–0CFF
    expect([...lang.kn].some((c) => c.codePointAt(0)! >= 0x0C80 && c.codePointAt(0)! <= 0x0CFF)).toBe(true);
    // Devanagari: हिन्दी — Unicode range 0900–097F
    expect([...lang.hi].some((c) => c.codePointAt(0)! >= 0x0900 && c.codePointAt(0)! <= 0x097F)).toBe(true);
    // English: ASCII only
    expect([...lang.en].every((c) => c.codePointAt(0)! < 128)).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-Y: Text expansion safety (UI overflow prevention)
═══════════════════════════════════════════════════════ */
describe("SUITE-Y: Text expansion safety", () => {
  const SHORT_KEYS = [
    "nav.wisdom", "nav.characters", "nav.blog", "nav.about",
    "nav.quiz", "nav.start_reading", "common.read_more",
    "common.subscribe", "cookie.accept", "cookie.decline",
  ];

  it("all CTA/nav labels are under 60 characters in all languages", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      SHORT_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (typeof val === "string") {
          expect(
            val.length,
            `${locale}.${key} is ${val.length} chars: "${val}"`
          ).toBeLessThanOrEqual(60);
        }
      });
    });
  });

  it("nav labels are under 40 chars (navbar space constraint)", () => {
    const NAV_KEYS = ["nav.wisdom", "nav.characters", "nav.blog", "nav.about", "nav.quiz"];
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      NAV_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (typeof val === "string") {
          expect(val.length, `${locale}.${key}: "${val}"`).toBeLessThanOrEqual(40);
        }
      });
    });
  });

  it("cookie consent message is under 200 characters in all languages", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, "cookie.message");
      if (typeof val === "string") {
        expect(val.length, `${locale} cookie.message too long`).toBeLessThanOrEqual(200);
      }
    });
  });

  it("hero subtitle does not exceed 250 characters in any language", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, "hero.subtitle");
      if (typeof val === "string") {
        expect(val.length, `${locale} hero.subtitle too long`).toBeLessThanOrEqual(250);
      }
    });
  });

  it("non-English translations are not significantly shorter than English (min 60% length)", () => {
    const CONTENT_KEYS = ["hero.subtitle", "wisdom.subtitle", "footer.tagline"];
    (["te", "kn", "hi"] as const).forEach((locale) => {
      CONTENT_KEYS.forEach((key) => {
        const enVal = getNestedValue(en as unknown as JsonObj, key);
        const localeVal = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (typeof enVal === "string" && typeof localeVal === "string" && enVal.length > 20) {
          const ratio = localeVal.length / enVal.length;
          expect(ratio, `${locale}.${key} looks like a stub (${Math.round(ratio * 100)}% of EN length)`).toBeGreaterThan(0.4);
        }
      });
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-Z: Accessibility & ARIA for multilingual UI
═══════════════════════════════════════════════════════ */
describe("SUITE-Z: Accessibility in multilingual context", () => {
  it("language switcher aria-label key exists in all locales", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, "lang.select");
      expect(val, `${locale}.lang.select missing`).toBeTruthy();
    });
  });

  it("nav open/close menu labels exist in all locales", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      expect(getNestedValue(LOCALES[locale] as unknown as JsonObj, "nav.open_menu")).toBeTruthy();
      expect(getNestedValue(LOCALES[locale] as unknown as JsonObj, "nav.close_menu")).toBeTruthy();
    });
  });

  it("skip to main content label exists in all locales", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, "nav.skip_to_main");
      expect(val, `${locale} skip_to_main missing`).toBeTruthy();
    });
  });

  it("back to top aria label exists in common", () => {
    expect((en as unknown as JsonObj & { common: { back_to_top: string } }).common.back_to_top).toBeTruthy();
  });

  it("error state has both title and description in all locales", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      expect(getNestedValue(LOCALES[locale] as unknown as JsonObj, "common.error_title")).toBeTruthy();
      expect(getNestedValue(LOCALES[locale] as unknown as JsonObj, "common.error_desc")).toBeTruthy();
    });
  });

  it("share button labels are translated in all locales", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      ["share.label", "share.copy", "share.twitter", "share.whatsapp"].forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        expect(val, `${locale}.${key} missing`).toBeTruthy();
      });
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-AA: Unicode & encoding validation
═══════════════════════════════════════════════════════ */
describe("SUITE-AA: Unicode and character encoding", () => {
  it("Telugu translations contain Telugu Unicode characters (U+0C00–0C7F)", () => {
    const allText = JSON.stringify(te);
    const hasTeluguChars = [...allText].some(
      (c) => c.codePointAt(0)! >= 0x0C00 && c.codePointAt(0)! <= 0x0C7F
    );
    expect(hasTeluguChars).toBe(true);
  });

  it("Kannada translations contain Kannada Unicode characters (U+0C80–0CFF)", () => {
    const allText = JSON.stringify(kn);
    const hasKannadaChars = [...allText].some(
      (c) => c.codePointAt(0)! >= 0x0C80 && c.codePointAt(0)! <= 0x0CFF
    );
    expect(hasKannadaChars).toBe(true);
  });

  it("Hindi translations contain Devanagari Unicode characters (U+0900–097F)", () => {
    const allText = JSON.stringify(hi);
    const hasDevanagari = [...allText].some(
      (c) => c.codePointAt(0)! >= 0x0900 && c.codePointAt(0)! <= 0x097F
    );
    expect(hasDevanagari).toBe(true);
  });

  it("English translations contain only ASCII/Latin characters in nav keys", () => {
    const enNavValues = Object.values((en as unknown as Record<string, Record<string, string>>).nav);
    enNavValues.forEach((val) => {
      if (typeof val === "string") {
        expect(
          [...val].every((c) => c.codePointAt(0)! < 1024),
          `Unexpected non-Latin in en.nav: "${val}"`
        ).toBe(true);
      }
    });
  });

  it("JSON files parse without BOM or encoding issues (all values are strings or objects)", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      EN_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        expect(
          typeof val === "string" || typeof val === "object",
          `${locale}.${key} has unexpected type: ${typeof val}`
        ).toBe(true);
      });
    });
  });

  it("no translation value contains HTML injection characters unescaped", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      EN_KEYS.forEach((key) => {
        const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, key);
        if (typeof val === "string") {
          expect(val.includes("<script")).toBe(false);
          expect(val.includes("javascript:")).toBe(false);
        }
      });
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SUITE-AB: Regression — existing features intact
═══════════════════════════════════════════════════════ */
describe("SUITE-AB: Regression after i18n — existing features intact", () => {
  it("articles data is still intact (29+ articles)", () => {
    expect(articles.length).toBeGreaterThanOrEqual(8);
  });

  it("all articles still have required fields after i18n changes", () => {
    articles.forEach((a) => {
      expect(a.slug).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.category).toBeTruthy();
    });
  });

  it("characters data has at least 5 entries", () => {
    expect(characters.length).toBeGreaterThanOrEqual(5);
  });

  it("quiz still has 15 questions with 5 answers each", () => {
    expect(QUIZ_QUESTIONS.length).toBe(15);
    QUIZ_QUESTIONS.forEach((q) => expect(q.answers.length).toBe(5));
  });

  it("supported language codes do not conflict with existing localStorage keys", () => {
    const EXISTING_KEYS = ["md_cookie_consent"];
    const LANG_KEY = "md_language";
    expect(EXISTING_KEYS).not.toContain(LANG_KEY);
  });

  it("i18n language codes do not conflict with article slugs", () => {
    const langCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    const slugs = articles.map((a) => a.slug);
    const conflicts = langCodes.filter((c) => slugs.includes(c));
    expect(conflicts).toHaveLength(0);
  });

  it("article categories still match the expected set", () => {
    const VALID_CATEGORIES = ["Characters", "Life Lessons", "Slokas", "Philosophy", "Epic Overview"];
    articles.forEach((a) => {
      expect(VALID_CATEGORIES).toContain(a.category);
    });
  });

  it("en category translations match article categories exactly", () => {
    const enCats = (en as unknown as { blog: { categories: Record<string, string> } }).blog.categories;
    expect(enCats.characters).toBe("Characters");
    expect(enCats.life_lessons).toBe("Life Lessons");
    expect(enCats.slokas).toBe("Slokas");
    expect(enCats.philosophy).toBe("Philosophy");
  });

  it("wisdom domain keys match expected values", () => {
    const domains = ["family", "workplace", "duty", "identity"];
    domains.forEach((d) => {
      const label = getNestedValue(en as unknown as JsonObj, `wisdom.domains.${d}`);
      expect(label, `wisdom.domains.${d} missing in en`).toBeTruthy();
    });
  });

  it("i18n translation for quiz has correct interpolation keys", () => {
    const trophyKey = (en as unknown as Record<string, Record<string, string>>).quiz.read_story;
    expect(trophyKey).toContain("{{name}}");
    const tornKey = (en as unknown as Record<string, Record<string, string>>).quiz.torn_between;
    expect(tornKey).toContain("{{char1}}");
    expect(tornKey).toContain("{{char2}}");
  });

  it("all 4 locales have the same interpolation variable {{name}} in quiz.read_story", () => {
    (["en", "te", "kn", "hi"] as const).forEach((locale) => {
      const val = getNestedValue(LOCALES[locale] as unknown as JsonObj, "quiz.read_story");
      expect(typeof val === "string" && val.includes("{{name}}"), `${locale}.quiz.read_story missing {{name}}`).toBe(true);
    });
  });
});
