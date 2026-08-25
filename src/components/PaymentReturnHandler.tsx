import { useEffect, useState } from "react";
import {
  getSubscription, setSubscription, setStoredPhone, planFromOrderId, planExpiry,
} from "@/lib/subscription";

/* ─────────────────────────────────────────────────────────────
   When Cashfree Checkout completes via a full-page REDIRECT
   (rather than the inline modal), the user lands back on the
   site at:  /?cf_order_id=<orderId>
   This component runs once on load, verifies that order
   server-side, unlocks access, then cleans the URL.

   Without this, redirect-flow payments would take the user's
   money but never grant access.
───────────────────────────────────────────────────────────── */
const PaymentReturnHandler = () => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const orderId = params.get("cf_order_id");
    if (!orderId) return;

    /* Strip the param immediately so a refresh can't re-trigger. */
    const stripUrl = () => {
      params.delete("cf_order_id");
      const qs = params.toString();
      const clean = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      window.history.replaceState({}, "", clean);
    };

    /* Already unlocked? Just clean up. */
    if (getSubscription()) { stripUrl(); return; }

    const plan = planFromOrderId(orderId);
    if (!plan) { stripUrl(); return; }

    let cancelled = false;
    setConfirming(true);
    (async () => {
      try {
        const res = await fetch("/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, plan }),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.verified) {
          if (data.phone) setStoredPhone(String(data.phone));
          setSubscription({
            plan:      data.plan || plan,
            expiresAt: planExpiry(data.plan || plan),
            paymentId: data.paymentId || orderId,
            orderId:   data.orderId || orderId,
          });
          try {
            if (typeof window.gtag === "function") {
              window.gtag("event", "purchase", {
                transaction_id: data.paymentId || orderId,
                value:          data.amount,
                currency:       "INR",
                items:          [{ item_id: data.plan || plan }],
              });
            }
          } catch (_) { /* GA optional */ }
          stripUrl();
          /* Re-render the whole app so gated content reflects new access. */
          window.location.reload();
          return;
        }
      } catch (_) { /* fall through to cleanup */ }
      if (!cancelled) { stripUrl(); setConfirming(false); }
    })();

    return () => { cancelled = true; };
  }, []);

  if (!confirming) return null;

  return (
    <div
      role="status"
      aria-label="Confirming payment"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(8,6,26,0.9)", backdropFilter: "blur(6px)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "rgba(245,237,218,0.92)", fontSize: "18px", textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            width: 40, height: 40, margin: "0 auto 16px",
            border: "3px solid rgba(107,45,143,0.3)", borderTopColor: "rgba(107,45,143,0.9)",
            borderRadius: "50%", animation: "spin 1s linear infinite",
          }}
        />
        Confirming your payment…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default PaymentReturnHandler;
