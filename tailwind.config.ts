import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "gold-light": "#D4AF37",
        "gold-dark": "#A07820",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        /* TOP 1%: Cormorant Garamond replaces Lora/Playfair for literary depth */
        sans:    ["'Cormorant Garamond'", "Georgia", "serif"],
        heading: ["'Cinzel'", "serif"],
        body:    ["'Cormorant Garamond'", "Georgia", "serif"],
        brand:   ["'Cinzel'", "serif"],
        display: ["'Cinzel Decorative'", "'Cinzel'", "serif"],
        /* Regional language fonts unchanged */
        telugu:  ["'Noto Serif Telugu'", "serif"],
        hindi:   ["'Tiro Devanagari Hindi'", "'Noto Serif Devanagari'", "serif"],
        kannada: ["'Noto Serif Kannada'", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":       { transform: "translateY(-8px) rotate(1deg)" },
          "66%":       { transform: "translateY(-4px) rotate(-1deg)" },
        },
        "particle-rise": {
          "0%":   { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "0.5" },
          "100%": { transform: "translateY(-700px) translateX(60px)", opacity: "0" },
        },
        "gold-drift": {
          "0%":   { transform: "translateY(0) translateX(0) scale(1)", opacity: "0" },
          "8%":   { opacity: "1" },
          "88%":  { opacity: "0.6" },
          "100%": { transform: "translateY(-800px) translateX(var(--dx,40px)) scale(0.4)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)" },
          "50%":       { boxShadow: "0 0 40px rgba(212, 175, 55, 0.7)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "char-enter": {
          "0%":   { opacity: "0", transform: "translateY(60px) scale(0.94)" },
          "60%":  { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":       { opacity: "0.85", transform: "scale(1.06)" },
        },
        "cinematic-reveal": {
          "0%":   { clipPath: "inset(0 100% 0 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0% 0 0)",   opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down":    "accordion-down 0.2s ease-out",
        "accordion-up":      "accordion-up 0.2s ease-out",
        "fade-up":           "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up-delay-1":   "fade-up 0.9s 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-up-delay-2":   "fade-up 0.9s 0.36s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-up-delay-3":   "fade-up 0.9s 0.54s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in":           "fade-in 0.7s ease-out forwards",
        "float":             "float 6s ease-in-out infinite",
        "float-slow":        "float-slow 8s ease-in-out infinite",
        "particle-rise":     "particle-rise linear infinite",
        "gold-drift":        "gold-drift linear infinite",
        "pulse-glow":        "pulse-glow 3s ease-in-out infinite",
        "shimmer":           "shimmer 3s linear infinite",
        "char-enter":        "char-enter 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "glow-pulse":        "glow-pulse 4s ease-in-out infinite",
        "cinematic-reveal":  "cinematic-reveal 1.2s cubic-bezier(0.77, 0, 0.18, 1) forwards",
        "spin-slow":         "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
