import { createContext, useContext, useEffect } from "react";

/* ─────────────────────────────────────────────────────────
   Light-only theme.

   The site ships a single light palette (TTD's), so there is no
   dark mode and no toggle. `useTheme` is kept — a dozen components
   still branch on `isDark` — and always reports "light", so those
   branches resolve to their light values.

   To reintroduce dark mode: restore the .dark token block in
   index.css, make `theme` stateful again, and remount ThemeToggle
   in Navbar. The isDark branches in components are still intact.
───────────────────────────────────────────────────────── */

type Theme = "light" | "dark";   /* value is always "light" — union kept so existing isDark branches still typecheck */

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
    /* Sync background on html for the overscroll area and FOUC prevention */
    root.style.background = "#FDF1F4";
    /* Clear any dark preference saved before the theme was removed, so a
       returning visitor is not left with a stale value in storage. */
    try { localStorage.removeItem("mbd-theme"); } catch { /* private mode */ }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#6B2D8F");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
