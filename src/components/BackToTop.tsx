import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 400;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check immediately
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fixed z-50"
      style={{
        bottom: "86px",   /* sits above FloatingStoryButton (28px + 44px pill + 14px gap) */
        right: "26px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered
          ? "linear-gradient(135deg, #F5D76E, #6B2D8F)"
          : "linear-gradient(135deg, #E8C547, #B8922A)",
        boxShadow: hovered
          ? "0 8px 24px rgba(107,45,143,0.55)"
          : "0 4px 16px rgba(107,45,143,0.35)",
        color: "#130717",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.9)",
        transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.25s ease, background 0.25s ease",
        willChange: "transform, opacity",
      }}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
};

export default BackToTop;
