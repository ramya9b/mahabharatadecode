import { useEffect, useRef } from "react";

const ReadingProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.width = `${Math.min(progress, 100)}%`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ background: "rgba(139,105,20,0.07)" }}
    >
      <div
        ref={barRef}
        className="h-full transition-none"
        style={{
          width: "0%",
          background:
            "linear-gradient(to right, #B8922A, #22C55E, #E8C547, #22C55E)",
        }}
      />
    </div>
  );
};

export default ReadingProgress;
