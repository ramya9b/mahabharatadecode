/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "icons/*.png"],
      manifest: false, // we use our own manifest.json in /public
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.groq\.com\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Cloudflare Pages free plan: 25MB limit per file, 20K files max
    outDir: "dist",
    sourcemap: false,           // smaller build for CF
    chunkSizeWarningLimit: 600, // warn if chunks exceed 600kB
    rollupOptions: {
      output: {
        // Code-split heavy libraries so CF edge serves them fast
        manualChunks: {
          "react-vendor":  ["react", "react-dom"],
          "router":        ["react-router-dom"],
          "ui-radix":      [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
          ],
          "i18n":          ["i18next", "react-i18next"],
          "query":         ["@tanstack/react-query"],
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

