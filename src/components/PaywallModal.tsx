import { useCallback, useEffect, useState } from "react";
import { X, Check, Loader, Sparkles } from "lucide-react";
import {
  PLANS, planExpiry, setSubscription, getStoredPhone, setStoredPhone,
  type PlanId,
} from "@/lib/subscription";

const PHONE_RE = /^[6-9]\d{9}$/;

/* Cashfree Checkout types — SDK attaches `Cashfree` to window via v3 script. */
interface CashfreeCheckoutResult {
  error?: { message: string };
  redirect?: boolean;
  paymentDetails?: { paymentMessage: string };
  order?: { orderId: string };
}
interface CashfreeInstance {
  checkout: (opts: {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
  }) => Promise<CashfreeCheckoutResult>;
}
interface CashfreeLoad {
  (opts: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
}
declare global {
  interface Window { Cashfree?: CashfreeLoad; }
}

const CASHFREE_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

function loadCashfreeSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CASHFREE_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = CASHFREE_SRC;
    s.async = true;
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Optional reason headline — e.g. "Your 14-day trial ended" */
  reason?: string;
}

type Status = "idle" | "loading" | "error" | "success";

const PaywallModal = ({ open, onClose, onSuccess, reason }: PaywallModalProps) => {
  const [selected, setSelected] = useState<PlanId>("yearly");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState<string>(() => getStoredPhone() ?? "");
  const [showRestore, setShowRestore] = useState(false);
  const [restorePhone, setRestorePhone] = useState<string>(() => getStoredPhone() ?? "");
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "loading">("idle");

  const phoneValid = PHONE_RE.test(phone);

  /* Lock body scroll while open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleUpgrade = useCallback(async () => {
    if (!PHONE_RE.test(phone)) {
      setError("Enter a valid 10-digit mobile number to continue.");
      return;
    }
    setStoredPhone(phone);
    setStatus("loading");
    setError("");
    try {
      /* 1. Create order on our backend — pass the real customer phone */
      const orderRes = await fetch("/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, customerPhone: phone }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || "Could not create order");
      }

      /* 2. Load Cashfree SDK */
      const sdkLoaded = await loadCashfreeSDK();
      if (!sdkLoaded || !window.Cashfree) throw new Error("Could not load Cashfree");

      /* 3. Initialise SDK for the right environment */
      const cashfree = await window.Cashfree({
        mode: orderData.mode === "live" ? "production" : "sandbox",
      });

      /* 4. Open Checkout (modal). SDK resolves with the result. */
      const result = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget:   "_modal",
      });

      if (result.error) {
        throw new Error(result.error.message || "Checkout failed");
      }
      /* If Cashfree redirected the user instead of completing inline,
         result.redirect will be true. In that case the verify will
         happen via return_url; nothing more to do here. */
      if (result.redirect) {
        setStatus("idle");
        return;
      }

      /* 5. Verify payment server-side using the order id */
      const verifyRes = await fetch("/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId, plan: selected }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      /* 6. Persist locally */
      setSubscription({
        plan:      selected,
        expiresAt: planExpiry(selected),
        paymentId: verifyData.paymentId,
        orderId:   verifyData.orderId,
      });
      setStatus("success");
      try {
        if (typeof window.gtag === "function") {
          window.gtag("event", "purchase", {
            transaction_id: verifyData.paymentId,
            value:          PLANS[selected].priceInr,
            currency:       "INR",
            items:          [{ item_id: selected, item_name: `MBD ${PLANS[selected].label}` }],
          });
        }
      } catch (_) { /* GA optional */ }
      onSuccess?.();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }, [selected, phone, onSuccess]);

  /* Restore a previous purchase on this device by phone number. */
  const handleRestore = useCallback(async () => {
    if (!PHONE_RE.test(restorePhone)) {
      setError("Enter the 10-digit mobile number you paid with.");
      return;
    }
    setRestoreStatus("loading");
    setError("");
    try {
      const res = await fetch("/payments/entitlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: restorePhone }),
      });
      const data = await res.json();
      if (res.ok && data.active) {
        setStoredPhone(restorePhone);
        setSubscription({
          plan:      data.plan,
          expiresAt: data.expiresAt,
          paymentId: data.paymentId || data.orderId,
          orderId:   data.orderId,
        });
        setStatus("success");
        onSuccess?.();
      } else {
        setError("No active subscription found for that number.");
      }
    } catch {
      setError("Could not check — please try again.");
    } finally {
      setRestoreStatus("idle");
    }
  }, [restorePhone, onSuccess]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          border: "1px solid rgba(194,65,12,0.25)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(194,65,12,0.1)",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary/10 transition"
        >
          <X size={18} />
        </button>

        <div className="p-7 pt-9">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: "hsl(var(--primary))" }} />
            <span
              className="font-heading text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(194,65,12,0.7)" }}
            >
              {reason || "Unlock Full Access"}
            </span>
          </div>

          <h2
            id="paywall-title"
            className="font-heading font-bold mb-3"
            style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
          >
            {reason?.includes("today") ? "Come back tomorrow — or go unlimited." : "Keep reading the epic."}
          </h2>
          <p
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "16px",
              color: "hsl(var(--muted-foreground))",
              lineHeight: 1.6,
            }}
          >
            {reason?.includes("today")
              ? "Free stories reset at midnight. Upgrade for unlimited stories, full articles, and everything else."
              : "Full articles and unlimited Story Teller — pick a pass to continue."
            }
          </p>

          {/* Plan cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(Object.keys(PLANS) as PlanId[]).map((id) => {
              const p = PLANS[id];
              const active = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  aria-pressed={active}
                  className="text-left rounded-xl p-4 transition-all"
                  style={{
                    border: active
                      ? "2px solid hsl(var(--primary))"
                      : "1px solid rgba(194,65,12,0.18)",
                    background: active
                      ? "rgba(194,65,12,0.08)"
                      : "rgba(194,65,12,0.02)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-heading text-[11px] tracking-[0.2em] uppercase"
                      style={{ color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                    >
                      {p.label}
                    </span>
                    {id === "yearly" && (
                      <span
                        className="font-heading text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(194,65,12,0.15)",
                          color: "hsl(var(--primary))",
                        }}
                      >
                        Best value
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-bold" style={{ fontSize: "26px" }}>
                      ₹{p.priceInr}
                    </span>
                    <span style={{ fontSize: "13px", color: "hsl(var(--muted-foreground))" }}>
                      /{id === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  <p
                    className="mt-1"
                    style={{
                      fontSize: "12px",
                      color: "hsl(var(--muted-foreground))",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {p.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Benefits */}
          <ul className="space-y-2 mb-6">
            {[
              "Unlimited Story Teller generations",
              "Every article in full — no previews",
              "All four languages (EN · TE · HI · KN)",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <Check size={14} style={{ color: "hsl(var(--primary))" }} />
                <span style={{ color: "hsl(var(--foreground))" }}>{b}</span>
              </li>
            ))}
          </ul>

          {status === "success" ? (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)" }}
            >
              <Check size={18} color="#27AE60" />
              <span style={{ color: "#27AE60", fontFamily: "'Cormorant Garamond',serif", fontSize: "15px" }}>
                Welcome! Your access is unlocked.
              </span>
            </div>
          ) : (
            <>
              {/* Mobile number — required by the payment gateway; also our
                  identity for restoring access on another device. */}
              <label
                htmlFor="mbd-phone"
                className="block font-heading text-[10px] tracking-[0.2em] uppercase mb-1.5"
                style={{ color: "rgba(194,65,12,0.7)" }}
              >
                Mobile number
              </label>
              <div className="flex items-stretch mb-4 rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(194,65,12,0.25)", background: "rgba(194,65,12,0.03)" }}>
                <span className="flex items-center px-3 text-sm"
                  style={{ color: "hsl(var(--muted-foreground))", borderRight: "1px solid rgba(194,65,12,0.18)" }}>
                  +91
                </span>
                <input
                  id="mbd-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                  style={{ color: "hsl(var(--foreground))" }}
                />
                {phoneValid && <Check size={16} className="self-center mr-3" style={{ color: "#27AE60" }} />}
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={status === "loading" || !phoneValid}
                className="btn-ripple w-full rounded-full font-heading font-bold tracking-[0.08em] uppercase text-sm py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                {status === "loading" ? (
                  <Loader size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block" }} />
                ) : (
                  <>Pay ₹{PLANS[selected].priceInr} · Continue</>
                )}
              </button>
            </>
          )}

          {error && (
            <p
              role="alert"
              style={{
                color: "#E24B4A",
                fontSize: "13px",
                fontFamily: "'Cormorant Garamond',serif",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <p
            className="text-center mt-4"
            style={{
              fontSize: "11px",
              color: "hsl(var(--muted-foreground))",
              opacity: 0.7,
              fontFamily: "'Cormorant Garamond',serif",
            }}
          >
            Secure payment via Cashfree · UPI · Cards · Net Banking
          </p>

          {/* Restore access on a new device by the phone you paid with */}
          {status !== "success" && (
            <div className="mt-3 text-center">
              {!showRestore ? (
                <button
                  type="button"
                  onClick={() => { setShowRestore(true); setError(""); }}
                  className="text-[12px] underline underline-offset-2"
                  style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'Cormorant Garamond',serif" }}
                >
                  Already paid? Restore access
                </button>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <div className="flex items-stretch rounded-lg overflow-hidden"
                    style={{ border: "1px solid rgba(194,65,12,0.25)", background: "rgba(194,65,12,0.03)" }}>
                    <span className="flex items-center px-2 text-[12px]"
                      style={{ color: "hsl(var(--muted-foreground))" }}>+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Paid mobile number"
                      value={restorePhone}
                      onChange={(e) => setRestorePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-40 bg-transparent px-2 py-2 text-[13px] outline-none"
                      style={{ color: "hsl(var(--foreground))" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRestore}
                    disabled={restoreStatus === "loading"}
                    className="rounded-lg px-3 py-2 text-[12px] font-heading uppercase tracking-[0.1em] disabled:opacity-60"
                    style={{ background: "rgba(194,65,12,0.15)", color: "hsl(var(--primary))" }}
                  >
                    {restoreStatus === "loading" ? "…" : "Restore"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PaywallModal;
