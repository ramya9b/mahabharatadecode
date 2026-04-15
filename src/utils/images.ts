/* ── WebP versions (primary — smaller, faster) ── */
import karnaWebp    from "@/assets/karna.webp";
import krishnaWebp  from "@/assets/krishna.webp";
import arjunaWebp   from "@/assets/arjuna.webp";
import draupadiWebp from "@/assets/draupadi.webp";
import bhishmaWebp  from "@/assets/bhishma.webp";
import heroBgWebp   from "@/assets/hero-bg.webp";

/* ── JPEG fallbacks (for browsers that don't support WebP) ── */
import karnaJpg    from "@/assets/karna.jpg";
import krishnaJpg  from "@/assets/krishna.jpg";
import arjunaJpg   from "@/assets/arjuna.jpg";
import draupadiJpg from "@/assets/draupadi.jpg";
import bhishmaJpg  from "@/assets/bhishma.jpg";
import heroBgJpg   from "@/assets/hero-bg.jpg";

export type ImageKey = "karna" | "krishna" | "arjuna" | "draupadi" | "bhishma" | "hero";

/** Primary WebP image map — 15-25% smaller than JPEG */
const webpMap: Record<ImageKey, string> = {
  karna:    karnaWebp,
  krishna:  krishnaWebp,
  arjuna:   arjunaWebp,
  draupadi: draupadiWebp,
  bhishma:  bhishmaWebp,
  hero:     heroBgWebp,
};

/** JPEG fallback map — for older browsers */
const jpgMap: Record<ImageKey, string> = {
  karna:    karnaJpg,
  krishna:  krishnaJpg,
  arjuna:   arjunaJpg,
  draupadi: draupadiJpg,
  bhishma:  bhishmaJpg,
  hero:     heroBgJpg,
};

/**
 * Returns the WebP URL for the given image key.
 * All modern browsers (Chrome 23+, Firefox 65+, Safari 14+, Edge 18+) support WebP.
 */
export const resolveImage = (key: ImageKey): string => webpMap[key];

/** Returns both WebP and JPEG URLs for use in <picture> srcSet */
export const resolveImageSrcSet = (key: ImageKey): { webp: string; jpg: string } => ({
  webp: webpMap[key],
  jpg:  jpgMap[key],
});
