/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: { globPatterns: ["**/*.{js,css,html,webp,png,svg}"] },
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
          "lottie": ["lottie-web"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    esbuild: {
    pure: ["console.log", "console.warn", "console.debug"],
    legalComments: "none",
  },
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
