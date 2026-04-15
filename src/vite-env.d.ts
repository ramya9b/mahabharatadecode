/// <reference types="vite/client" />

/* ── Image asset type declarations ───────────────────────────
   Tells TypeScript that importing image files returns a string
   (the resolved URL Vite provides at build time).
   Required for .webp imports added during the WebP conversion.
─────────────────────────────────────────────────────────────── */

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.avif" {
  const src: string;
  export default src;
}
