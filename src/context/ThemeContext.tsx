import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("mbd-theme") as Theme | null;
    if (stored) return stored;
    /* Default to dark — site is optimised for dark mode */
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      /* Override any lingering anti-FOUC inline style */
      root.style.background = "#0C0900";
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      /* Must clear inline style — otherwise it overrides CSS variables */
      root.style.background = "#FAF5EC";
      root.style.colorScheme = "light";
    }
    localStorage.setItem("mbd-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0C0900" : "#D97706");
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
