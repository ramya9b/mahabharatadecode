import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";
import hi from "./locales/hi.json";

export type SupportedLocale = "en" | "te" | "kn" | "hi";

export const SUPPORTED_LANGUAGES: Array<{
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  dir: "ltr";
  fontClass: string;
}> = [
  { code: "en", label: "English",  nativeLabel: "English",  dir: "ltr", fontClass: "font-en" },
  { code: "te", label: "Telugu",   nativeLabel: "తెలుగు",   dir: "ltr", fontClass: "font-te" },
  { code: "kn", label: "Kannada",  nativeLabel: "ಕನ್ನಡ",   dir: "ltr", fontClass: "font-kn" },
  { code: "hi", label: "Hindi",    nativeLabel: "हिन्दी",   dir: "ltr", fontClass: "font-hi" },
];

/* ── Apply language-specific font class to <html> ── */
export function applyLangFont(locale: SupportedLocale) {
  const html = document.documentElement;
  // Remove all existing lang font classes
  html.classList.remove("font-en", "font-te", "font-kn", "font-hi");
  // Set lang attribute for accessibility & font CSS targeting
  html.setAttribute("lang", locale);
  html.setAttribute("data-lang", locale);
  // Add the new font class
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === locale);
  if (lang) html.classList.add(lang.fontClass);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // Cast to bypass library type drift between i18next versions; runtime shape is correct.
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      kn: { translation: kn },
      hi: { translation: hi },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "te", "kn", "hi"],
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "md_language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

/* Apply font immediately on init */
applyLangFont((i18n.language?.substring(0, 2) as SupportedLocale) || "en");

/* Re-apply font whenever language changes */
i18n.on("languageChanged", (lng) => {
  applyLangFont((lng?.substring(0, 2) as SupportedLocale) || "en");
});

export default i18n;
