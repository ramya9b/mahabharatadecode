/// <reference types="vitest" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

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
