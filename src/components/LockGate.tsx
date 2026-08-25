import { useState, type ReactNode } from "react";
import { Lock, Sparkles, Unlock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { isArticleFree, PAYWALL_ENABLED } from "@/lib/subscription";
import PaywallModal from "@/components/PaywallModal";

interface LockGateProps {
  children: ReactNode;
  teaser?: ReactNode;
  reason?: string;
  title?: string;
  description?: string;
  /** Article slug — if provided and slug is in FREE_ARTICLE_SLUGS, content is always shown */
  slug?: string;
}

const LockGate = ({
  children,
  teaser,
  reason,
  title = "Unlock the full story",
  description = "Your free 14 days have ended. Upgrade to keep reading.",
  slug,
}: LockGateProps) => {
  const { access, inTrial, trialDays, refresh } = useSubscription();
  const [modalOpen, setModalOpen] = useState(false);

  /* Free articles — always show full content, no paywall ever */
  const permanentlyFree = slug ? isArticleFree(slug) : false;

  if (permanentlyFree || access) {
    return (
      <>
        {/* Trial expiry warning — only for trial users, not free articles */}
        {PAYWALL_ENABLED && !permanentlyFree && inTrial && trialDays <= 3 && (
          <div
            role="status"
            className="sticky top-0 z-40 text-center py-2 px-4"
            style={{
              background: "linear-gradient(90deg, rgba(107,45,143,0.12), rgba(107,45,143,0.04))",
              borderBottom: "1px solid rgba(107,45,143,0.18)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "13px",
              color: "hsl(var(--foreground))",
            }}
          >
            <Sparkles size={12} style={{ display: "inline", marginRight: 6, color: "hsl(var(--primary))" }} />
            {trialDays} {trialDays === 1 ? "day" : "days"} left in your free trial.{" "}
            <button
              onClick={() => setModalOpen(true)}
              className="underline hover:no-underline"
              style={{ color: "hsl(var(--primary))", fontWeight: 600 }}
            >
              Upgrade now
            </button>
            <PaywallModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={refresh} reason={reason} />
          </div>
        )}

        {/* Free article badge */}
        {permanentlyFree && (
          <div
            className="flex items-center justify-center gap-2 py-2 px-4 mb-2"
            style={{
              background: "rgba(107,45,143,0.06)",
              borderBottom: "1px solid rgba(107,45,143,0.15)",
              fontSize: "11px",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.2em",
              color: "rgba(107,45,143,0.8)",
            }}
          >
            <Unlock size={11} />
            FREE ARTICLE — No account needed
          </div>
        )}

        {children}
      </>
    );
  }

  /* ── LOCKED STATE ──
     Full article content rendered in DOM for SEO crawlers.
     Users see teaser + paywall card only.
  ── */
  return (
    <>
      {/* DOM-present content for Googlebot — visually hidden */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>

      {/* Visual paywall for users */}
      <div style={{ position: "relative" }}>
        {teaser && (
          <div
            className="relative"
            style={{
              maxHeight: "320px",
              overflow: "hidden",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)",
              maskImage: "linear-gradient(to bottom, black 60%, transparent)",
            }}
          >
            {teaser}
          </div>
        )}

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div
            className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
              border: "1px solid rgba(107,45,143,0.22)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(107,45,143,0.6), transparent)" }}
            />
            <div
              className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-5"
              style={{ background: "rgba(107,45,143,0.1)", border: "1px solid rgba(107,45,143,0.25)" }}
            >
              <Lock size={22} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <h2 className="font-heading font-bold mb-3" style={{ fontSize: "clamp(22px, 3vw, 28px)" }}>
              {title}
            </h2>
            <p
              className="mb-4 mx-auto"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "17px",
                color: "hsl(var(--muted-foreground))",
                lineHeight: 1.6,
                maxWidth: "440px",
              }}
            >
              {description}
            </p>

            {/* Free articles reminder */}
            <p
              className="mb-6 mx-auto"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "14px",
                color: "rgba(107,45,143,0.7)",
                lineHeight: 1.6,
                maxWidth: "400px",
              }}
            >
              5 articles are always free — no account needed.{" "}
              <a
                href="/pricing"
                style={{ color: "hsl(var(--primary))", textDecoration: "underline" }}
              >
                See what's included
              </a>
            </p>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-ripple px-8 py-3 rounded-full font-heading font-bold tracking-[0.1em] uppercase text-sm transition-all"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 24px rgba(107,45,143,0.3)",
              }}
            >
              See plans — from ₹99/month
            </button>
          </div>
        </div>

        <PaywallModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={refresh} reason={reason} />
      </div>
    </>
  );
};

export default LockGate;
