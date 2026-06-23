/* ── WebP versions (primary) ── */
import karnaWebp    from "@/assets/karna.webp";
import krishnaWebp  from "@/assets/krishna.webp";
import arjunaWebp   from "@/assets/arjuna.webp";
import draupadiWebp from "@/assets/draupadi.webp";
import bhishmaWebp  from "@/assets/bhishma.webp";
import heroBgWebp   from "@/assets/hero-bg.webp";

/* ── JPEG fallbacks ── */
import karnaJpg    from "@/assets/karna.jpg";
import krishnaJpg  from "@/assets/krishna.jpg";
import arjunaJpg   from "@/assets/arjuna.jpg";
import draupadiJpg from "@/assets/draupadi.jpg";
import bhishmaJpg  from "@/assets/bhishma.jpg";
import heroBgJpg   from "@/assets/hero-bg.jpg";

export type ImageKey =
  | "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma" | "hero"
  | "yudhishthira" | "duryodhana" | "abhimanyu" | "gandhari";

const webpMap: Partial<Record<ImageKey, string>> = {
  karna:    karnaWebp,
  krishna:  krishnaWebp,
  arjuna:   arjunaWebp,
  draupadi: draupadiWebp,
  bhishma:  bhishmaWebp,
  hero:     heroBgWebp,
};

const jpgMap: Partial<Record<ImageKey, string>> = {
  karna:    karnaJpg,
  krishna:  krishnaJpg,
  arjuna:   arjunaJpg,
  draupadi: draupadiJpg,
  bhishma:  bhishmaJpg,
  hero:     heroBgJpg,
};

/** Primary WebP URL — bundled for original 5, public/characters/ for new keys */
export const resolveImage = (key: ImageKey): string =>
  webpMap[key] ?? `/characters/${key}.webp`;

/** WebP + JPEG pair for <picture> */
export const resolveImageSrcSet = (key: ImageKey): { webp: string; jpg: string } => ({
  webp: webpMap[key] ?? `/characters/${key}.webp`,
  jpg:  jpgMap[key]  ?? `/characters/${key}.webp`,
});

/**
 * Responsive sizes string for <img sizes="...">
 * Tells the browser which breakpoint renders this image at what width
 */
export const resolveImageSizes = (layout: "card" | "hero" | "full" = "card"): string => {
  switch (layout) {
    case "hero":
      return "100vw";
    case "full":
      return "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 60vw";
    case "card":
    default:
      return "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw";
  }
};

/**
 * Character image URL from public/characters/ with srcSet for responsive loading.
 * Mobile gets served smaller images automatically.
 */
export const resolveCharacterImage = (id: string): {
  src: string;
  srcSet: string;
  sizes: string;
} => ({
  src:    `/characters/${id}.webp`,
  srcSet: `/characters/${id}.webp`,
  sizes:  "(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 30vw",
});
