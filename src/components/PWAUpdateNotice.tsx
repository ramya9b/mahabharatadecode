/* ─────────────────────────────────────────────
   PWAUpdateNotice — small toast that informs the user when
   the service worker has activated a new version of the site.
   Listens for SW controllerchange (fires when skipWaiting +
   clientsClaim hand off to the new SW).
───────────────────────────────────────────── */
import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

const PWAUpdateNotice = () => {
  const [updateReady, setUpdateReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    /* controllerchange fires once the new SW (with skipWaiting+clientsClaim)
       takes over the page. At that point the active SW is serving newer
       assets than what the page bundle was hashed against, so the user
       should refresh to actually see the new content. */
    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true; // guard against the double-fire some browsers do
      setUpdateReady(true);
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  if (!updateReady || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60]"
      style={{
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(420px, calc(100vw - 32px))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 14px",
          borderRadius: "14px",
          background: "rgb(20,10,0)",
          border: "1px solid rgba(194,65,12,0.35)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(194,65,12,0.10)",
        }}
      >
        <RefreshCw
          size={16}
          aria-hidden="true"
          style={{ color: "#C2410C", flexShrink: 0 }}
        />
        <p
          style={{
            flex: 1,
            margin: 0,
            fontSize: "14px",
            color: "rgba(245,235,218,0.92)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: 1.4,
          }}
        >
          New version available. Refresh to see the latest.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "6px 14px",
            borderRadius: "99px",
            background: "linear-gradient(135deg,#C2410C 0%,#C2410C 50%,#F5EBDA 100%)",
            color: "#08040F",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss update notice"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "rgba(245,235,218,0.55)",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default PWAUpdateNotice;
