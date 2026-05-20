/* ─────────────────────────────────────────────
   LottieBackground — Phase 2
   Renders a looping Lottie animation as a
   full-bleed background behind the story card
───────────────────────────────────────────── */
import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface Props {
  url: string;
  opacity?: number;
}

const LottieBackground = ({ url, opacity = 0.18 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef      = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!url || !containerRef.current) return;

    let destroyed = false;

    /* Dynamic import so lottie-web is only loaded when needed */
    import("lottie-web").then(({ default: lottie }) => {
      if (destroyed || !containerRef.current) return;

      /* Destroy previous instance */
      animRef.current?.destroy();

      animRef.current = lottie.loadAnimation({
        container:    containerRef.current,
        renderer:     "svg",
        loop:         true,
        autoplay:     true,
        path:         url,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
    });

    return () => {
      destroyed = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [url]);

  if (!url) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        opacity,
        pointerEvents: "none",
        overflow:      "hidden",
        borderRadius:  "inherit",
      }}
    />
  );
};

export default LottieBackground;
