/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
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

