import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  className?: string;
}

const ThemeToggle = ({ className = "" }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
      style={{
        background: isDark
          ? "rgba(194,65,12,0.12)"
          : "rgba(139,98,20,0.08)",
        border: isDark
          ? "1px solid rgba(194,65,12,0.35)"
          : "1px solid rgba(139,98,20,0.22)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.4s ease, opacity 0.3s ease",
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.8)",
          opacity: isDark ? 1 : 0,
          position: "absolute",
        }}
      >
        <Sun size={16} color="#4ADE80" />
      </span>
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.4s ease, opacity 0.3s ease",
          transform: isDark ? "rotate(-180deg) scale(0.8)" : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
          position: "absolute",
        }}
      >
        <Moon size={16} color="hsl(var(--primary))" />
      </span>
    </button>
  );
};

export default ThemeToggle;
