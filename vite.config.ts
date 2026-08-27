/// <reference types="vitest" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from "node:fs";
import { articles } from "./src/data/articles";
import { toIsoDate } from "./src/utils/articleDate";
import { applyTranslation, TRANSLATED_LOCALES } from "./src/data/translations/apply";

/* The browser build discovers translations with import.meta.glob; here in
   the Node config we read the same files straight off disk. */
const TX_ROOT = path.resolve(__dirname, "src/data/translations");
function loadTranslation(slug: string, lang: string) {
  const file = path.join(TX_ROOT, lang, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return undefined; }
}
const hasTranslation = (slug: string, lang: string) => Boolean(loadTranslation(slug, lang));
function translatedArticle(a: unknown, lang: string) {
  if (!lang) return a;
  return applyTranslation(a as never, loadTranslation((a as { slug: string }).slug, lang));
}

const BASE_URL  = "https://mahabharatadecoded.com";
const SITE_NAME = "MahabharataDecoded";

const escHtml = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* The subset of an Article this prerenderer actually reads. Declared here so
   the build does not depend on `any` to reach into the data model. */
type PrerenderArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  editorNote?: string;
  summary?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageKey?: string;
  publishDate?: string;
  storyBlocks?: { label?: string; paragraphs?: string[] }[];
  content?: { type: string; text: string }[];
  lifeLessons?: string[];
  faqs?: { question: string; answer: string }[];
};

/* Build a crawlable static HTML representation of one article's body. */
function articleBody(a: PrerenderArticle): string {
  const out: string[] = [`<h1>${escHtml(a.title)}</h1>`];
  if (a.subtitle) out.push(`<p>${escHtml(a.subtitle)}</p>`);
  if (a.editorNote) out.push(`<aside><strong>A note from Ramya:</strong> ${escHtml(a.editorNote)}</aside>`);
  for (const sb of a.storyBlocks ?? []) {
    if (sb.label) out.push(`<h2>${escHtml(sb.label)}</h2>`);
    for (const p of sb.paragraphs ?? []) out.push(`<p>${escHtml(p)}</p>`);
  }
  for (const b of a.content ?? []) {
    if (b.type === "heading") out.push(`<h2>${escHtml(b.text)}</h2>`);
    else if (b.type === "quote") out.push(`<blockquote>${escHtml(b.text)}</blockquote>`);
    else if (b.type === "paragraph" || b.type === "lesson") out.push(`<p>${escHtml(b.text)}</p>`);
  }
  if (a.lifeLessons?.length) {
    out.push(`<h2>Key Takeaways</h2><ul>${a.lifeLessons.map((l: string) => `<li>${escHtml(l)}</li>`).join("")}</ul>`);
  }
  if (a.faqs?.length) {
    out.push(`<h2>Frequently Asked Questions</h2>`);
    for (const f of a.faqs) out.push(`<h3>${escHtml(f.question)}</h3><p>${escHtml(f.answer)}</p>`);
  }
  return out.join("\n");
}

/* Adds the translated article URLs to the sitemap at build time. The file in
   public/ stays the English source of truth that the daily routine appends
   to; this only ever adds, so the two never fight. */
function augmentSitemap(): Plugin {
  return {
    name: "augment-sitemap",
    apply: "build",
    closeBundle() {
      const file = path.resolve(__dirname, "dist/sitemap.xml");
      if (!fs.existsSync(file)) return;
      const xml = fs.readFileSync(file, "utf8");
      const rows: string[] = [];
      for (const a of articles as unknown as PrerenderArticle[]) {
        for (const l of TRANSLATED_LOCALES) {
          if (!hasTranslation(a.slug, l)) continue;
          const loc = `${BASE_URL}/${l}/blog/${a.slug}`;
          if (xml.includes(loc)) continue;
          rows.push(`  <url><loc>${loc}</loc><lastmod>${toIsoDate(a.publishDate) || "2026-01-01"}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>`);
        }
      }
      if (!rows.length) return;
      const NL = String.fromCharCode(10);
      fs.writeFileSync(file, xml.replace("</urlset>", rows.join(NL) + NL + "</urlset>"), "utf8");
      console.log(`[sitemap] added ${rows.length} translated URLs`);
    },
  };
}

function hreflangTags(slug: string): string {
  const langs = TRANSLATED_LOCALES.filter(l => hasTranslation(slug, l));
  if (!langs.length) return "";
  const tag = (hl: string, href: string) =>
    `<link rel="alternate" hreflang="${hl}" href="${href}" />`;
  return [
    tag("en", `${BASE_URL}/blog/${slug}`),
    ...langs.map(l => tag(l, `${BASE_URL}/${l}/blog/${slug}`)),
    tag("x-default", `${BASE_URL}/blog/${slug}`),
  ].join(String.fromCharCode(10));
}

function articleJsonLd(a: PrerenderArticle, lang = ""): string {
  const url   = `${BASE_URL}${lang ? "/" + lang : ""}/blog/${a.slug}`;
  const desc  = a.metaDescription || a.summary || a.description || "";
  const image = a.imageKey === "hero"
    ? `${BASE_URL}/og-default.jpg`
    : `${BASE_URL}/characters/${a.imageKey}.webp`;
  const schemas: Record<string, unknown>[] = [{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.metaTitle || a.title,
    description: desc,
    image, url,
    inLanguage: lang || "en",
    datePublished: toIsoDate(a.publishDate) || "2026-01-01",
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` } },
  }];
  if (a.faqs?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faqs.map((f: Record<string, string>) => ({
        "@type": "Question", name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  // Escape "<" so article text can't break out of the <script> tag.
  return schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, "\\u003c")}</script>`)
    .join("\n");
}

/* Prerender each article to dist/blog/<slug>.html with real per-article
   <head> (title/meta/OG/canonical + JSON-LD) and a crawlable body, so search
   engines, AI crawlers, and social unfurlers get full HTML without running JS.
   The SPA (createRoot) replaces #root on mount, so users get the React app. */
function prerenderArticles(): Plugin {
  return {
    name: "prerender-articles",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const templatePath = path.join(distDir, "index.html");
      if (!fs.existsSync(templatePath)) return;
      const template = fs.readFileSync(templatePath, "utf8");
      const blogDir = path.join(distDir, "blog");
      fs.mkdirSync(blogDir, { recursive: true });

      let count = 0;
      /* One render per (article, language). The translated pages are the
         entire point of pre-translating: a crawler gets Telugu HTML at a
         Telugu URL, which the runtime translate button could never give it. */
      const jobs: { a: PrerenderArticle; lang: string }[] = [];
      for (const a of articles as unknown as PrerenderArticle[]) {
        jobs.push({ a, lang: "" });
        for (const l of TRANSLATED_LOCALES) {
          if (hasTranslation(a.slug, l)) jobs.push({ a, lang: l });
        }
      }

      for (const job of jobs) {
        const a = translatedArticle(job.a, job.lang) as PrerenderArticle;
        const prefix = job.lang ? `/${job.lang}` : "";
        const url   = `${BASE_URL}${prefix}/blog/${a.slug}`;
        const title = a.metaTitle || `${a.title} | ${SITE_NAME}`;
        const desc  = a.metaDescription || a.summary || a.description || "";
        const image = a.imageKey === "hero"
          ? `${BASE_URL}/og-default.jpg`
          : `${BASE_URL}/characters/${a.imageKey}.webp`;

        const fallback =
          `<div style="max-width:720px;margin:0 auto;padding:24px;font-family:Georgia,serif;line-height:1.7;color:#F5EDDA;">${articleBody(a)}</div>`;

        const html = template
          .replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${job.lang || "en"}"`)
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(title)}</title>`)
          .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escHtml(desc)}" />`)
          .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
          .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article" />`)
          .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escHtml(title)}" />`)
          .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escHtml(desc)}" />`)
          .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escHtml(image)}" />`)
          .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
          .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escHtml(title)}" />`)
          .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escHtml(desc)}" />`)
          .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escHtml(image)}" />`)
          .replace("</head>", `${articleJsonLd(a, job.lang)}\n${hreflangTags(a.slug)}\n</head>`)
          .replace(/<div id="root">\s*<\/div>/, `<div id="root">${fallback}</div>`);

        const outDir = job.lang ? path.join(distDir, job.lang, "blog") : blogDir;
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, `${a.slug}.html`), html, "utf8");
        count++;
      }
      const tx = jobs.filter(j => j.lang).length;
      console.log(`[prerender] wrote ${count} article pages (${count - tx} en, ${tx} translated)`);
    },
  };
}

/* Injects <link rel="preload"> for the hashed hero-bg.webp so the LCP image
   starts downloading before the JS bundle even parses. Build-time only. */
function preloadHero(): Plugin {
  return {
    name: "preload-hero",
    apply: "build",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      const heroKey = Object.keys(ctx.bundle).find((k) =>
        /assets\/hero-bg-[^/]+\.webp$/.test(k)
      );
      if (!heroKey) return html;
      const tag = `<link rel="preload" as="image" href="/${heroKey}" fetchpriority="high" type="image/webp" />`;
      return html.replace("</head>", `    ${tag}\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    preloadHero(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,webp,png,svg}"],
        // Take control immediately — no waiting for old SW to release
        skipWaiting: true,
        clientsClaim: true,
        // Never cache the HTML shell — always fetch fresh so new deploys appear instantly
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // HTML documents: always go to network first
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
    /* Runs last: emit prerendered dist/blog/<slug>.html after the bundle. */
    prerenderArticles(),
    augmentSitemap(),
  ],
  esbuild: {
    pure: ["console.log", "console.warn", "console.debug"],
    legalComments: "none",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    minify: "esbuild",
    // Strip console.logs in production
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router":       ["react-router-dom"],
          "ui-radix":     [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
          ],
          "i18n":   ["i18next", "react-i18next"],
          "query":  ["@tanstack/react-query"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
