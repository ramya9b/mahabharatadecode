import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { canRing, ringBells } from "@/lib/bell";

const PREF = "mbd-bells";        /* persists across visits */
const RUNG = "mbd-bells-rung";   /* this tab only — ring once per visit */

/**
 * Bells on arrival, as at the temple door.
 *
 * Every browser blocks audio until the visitor has interacted with the page,
 * so "on launch" cannot mean "on load" — there is no flag that changes this.
 * What we can do is try immediately (which succeeds for returning visitors
 * whose engagement is already recorded for the origin) and otherwise wait
 * for the very first touch, key, or scroll. In practice that is under a
 * second, and it still reads as arrival.
 *
 * It rings once per visit, never on internal navigation, and the toggle
 * silences it for good.
 */
const TempleBells = () => {
  const { t } = useTranslation();
  const [on, setOn] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!canRing()) return;
    setShow(true);

    let pref = "on";
    try { pref = localStorage.getItem(PREF) ?? "on"; } catch { /* private mode */ }
    setOn(pref !== "off");
    if (pref === "off") return;

    try { if (sessionStorage.getItem(RUNG)) return; } catch { /* ignore */ }

    let done = false;
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

    const cleanup = () => events.forEach(e => window.removeEventListener(e, fire));

    function fire() {
      if (done) return;
      done = true;
      cleanup();
      try { sessionStorage.setItem(RUNG, "1"); } catch { /* ignore */ }
      void ringBells();
    }

    /* Returning visitors often clear the gesture requirement already. */
    void ringBells().then(played => {
      if (played) { done = true; try { sessionStorage.setItem(RUNG, "1"); } catch { /* ignore */ } }
      else events.forEach(e => window.addEventListener(e, fire, { once: true, passive: true }));
    });

    return cleanup;
  }, []);

  const toggle = useCallback(() => {
    setOn(prev => {
      const next = !prev;
      try { localStorage.setItem(PREF, next ? "on" : "off"); } catch { /* ignore */ }
      /* Turning them on is itself a gesture, so this always sounds. */
      if (next) void ringBells();
      return next;
    });
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      title={on ? t("bells.mute") : t("bells.unmute")}
      aria-label={on ? t("bells.mute") : t("bells.unmute")}
      className="flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      style={{
        width: "32px",
        height: "32px",
        flexShrink: 0,
        background: "rgba(255,246,228,0.92)",
        border: "1px solid rgba(201,162,39,0.45)",
        color: on ? "#6B2D8F" : "rgba(107,45,143,0.38)",
        cursor: "pointer",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 15V10a6 6 0 1 1 12 0v5l1.6 2.4a.6.6 0 0 1-.5.93H4.9a.6.6 0 0 1-.5-.93Z" />
        <path d="M10.4 21.2a2.2 2.2 0 0 0 3.2 0" />
        {on
          ? <><path d="M19.6 5.4a5.6 5.6 0 0 1 1.5 3.1" opacity="0.55" />
              <path d="M4.4 5.4a5.6 5.6 0 0 0-1.5 3.1" opacity="0.55" /></>
          : <path d="M3.2 3.2 20.8 20.8" />}
      </svg>
    </button>
  );
};

export default TempleBells;
