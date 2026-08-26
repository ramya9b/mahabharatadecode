import { useEffect, useState } from "react";

/**
 * Pushpa vrishti — a slow fall of temple flowers over the whole site.
 *
 * The layout is a fixed table rather than Math.random(), for two reasons:
 * the pages are prerendered at build time, so a random layout would differ
 * between the served HTML and the hydrated one; and a hand-tuned spread
 * avoids the clumps and bald patches that random placement gives you.
 *
 * Everything animates on transform and opacity only, so it stays on the
 * compositor and never triggers layout — which is what keeps it off the
 * CLS and INP budgets.
 */

/* left% · delay s · duration s · size px · drift px · spin deg · colour · petals */
const FLOWERS: ReadonlyArray<[number, number, number, number, number, number, string, boolean]> = [
  [  4, 0.0, 15, 15, 42,  200, "#F5821F", true ],
  [ 12, 5.5, 19, 11, -34, -160, "#FFF6E4", false],
  [ 19, 2.2, 17, 13, 56,  240, "#E0574B", true ],
  [ 27, 9.0, 21, 10, -26, 180,  "#C9A227", false],
  [ 34, 1.1, 16, 14, 38, -220, "#F5821F", true ],
  [ 41, 12.4, 18, 9,  30,  150, "#E9A6C8", false],
  [ 48, 6.8, 20, 16, -48, 260,  "#C9A227", true ],
  [ 55, 3.4, 15, 11, 44, -190, "#FFF6E4", false],
  [ 62, 10.2, 22, 13, -30, 210, "#E0574B", true ],
  [ 69, 7.6, 17, 10, 36,  170, "#F5821F", false],
  [ 76, 0.8, 19, 15, -52, -240, "#E9A6C8", true ],
  [ 83, 13.1, 16, 12, 28, 200,  "#C9A227", false],
  [ 90, 4.3, 21, 14, -40, -180, "#FFF6E4", true ],
  [ 96, 8.7, 18, 11, 34,  230, "#E0574B", false],
];

const FallingFlowers = () => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    /* Falling petals are exactly the kind of drift this setting is for. */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlay(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!play) return null;

  return (
    <div className="flower-fall" aria-hidden="true">
      {FLOWERS.map(([left, delay, dur, size, drift, spin, colour, round], i) => (
        <span
          key={i}
          className={round ? "petal petal--round" : "petal"}
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle at 32% 28%, #FFF6E4 0%, ${colour} 62%, ${colour} 100%)`,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
            ["--drift" as string]: `${drift}px`,
            ["--spin" as string]: `${spin}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default FallingFlowers;
