/* ─────────────────────────────────────────────
   Mood Themes — MahabharataDecoded Phase 2
   5 cinematic themes mapped to character groups
───────────────────────────────────────────── */

export type MoodTheme = "war" | "divine" | "forest" | "tragic" | "gita" | "default";

export interface ThemeConfig {
  id: MoodTheme;
  label: string;
  /* Backgrounds */
  bgGradient: string;
  cardBg: string;
  /* Text */
  textPrimary: string;
  textMuted: string;
  /* Accent */
  accentColor: string;
  borderColor: string;
  /* Lottie animation CDN URL */
  lottieUrl: string;
  /* Tab underline + button color */
  highlightColor: string;
}

export const MOOD_THEMES: Record<MoodTheme, ThemeConfig> = {
  war: {
    id: "war",
    label: "War",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "rgba(60,10,10,0.85)",
    textPrimary: "hsl(30 80% 90%)",
    textMuted: "hsl(20 40% 65%)",
    accentColor: "#C0392B",
    borderColor: "rgba(192,57,43,0.3)",
    highlightColor: "#E74C3C",
    lottieUrl: "https://assets3.lottiefiles.com/packages/lf20_jmasizn.json",
  },
  divine: {
    id: "divine",
    label: "Divine",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "rgba(10,20,60,0.85)",
    textPrimary: "hsl(45 90% 92%)",
    textMuted: "hsl(200 50% 72%)",
    accentColor: "#2471A3",
    borderColor: "rgba(36,113,163,0.3)",
    highlightColor: "#3498DB",
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json",
  },
  forest: {
    id: "forest",
    label: "Forest",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "rgba(10,35,15,0.85)",
    textPrimary: "hsl(60 60% 88%)",
    textMuted: "hsl(120 30% 65%)",
    accentColor: "#1E8449",
    borderColor: "rgba(30,132,73,0.3)",
    highlightColor: "#27AE60",
    lottieUrl: "https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json",
  },
  tragic: {
    id: "tragic",
    label: "Tragic",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "rgba(35,20,10,0.85)",
    textPrimary: "hsl(35 60% 85%)",
    textMuted: "hsl(30 25% 58%)",
    accentColor: "#BA7517",
    borderColor: "rgba(186,117,23,0.3)",
    highlightColor: "#D4AC0D",
    lottieUrl: "https://assets9.lottiefiles.com/packages/lf20_ystsffqy.json",
  },
  gita: {
    id: "gita",
    label: "Gita",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "rgba(50,35,10,0.85)",
    textPrimary: "hsl(45 90% 94%)",
    textMuted: "hsl(40 50% 70%)",
    accentColor: "#D4AF37",
    borderColor: "rgba(212,175,55,0.3)",
    highlightColor: "#F0C030",
    lottieUrl: "https://assets4.lottiefiles.com/packages/lf20_obhph3iy.json",
  },
  default: {
    id: "default",
    label: "Default",
    bgGradient: "linear-gradient(145deg, #0C0900 0%, #100A00 25%, #080A18 55%, #060410 80%, #0C0900 100%)",
    cardBg: "hsl(38 45% 94%)",
    textPrimary: "hsl(28 62% 12%)",
    textMuted: "hsl(28 30% 42%)",
    accentColor: "#A07820",
    borderColor: "rgba(160,120,32,0.25)",
    highlightColor: "#A07820",
    lottieUrl: "",
  },
};

/* Map character group → mood theme */
import type { CharacterGroup } from "./storyCharacters";

export const GROUP_THEME_MAP: Record<CharacterGroup, MoodTheme> = {
  pandavas:  "gita",
  kauravas:  "war",
  women:     "tragic",
  warriors:  "war",
  divine:    "divine",
  kings:     "forest",
};
