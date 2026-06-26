import { useState, type ReactNode } from "react";
import { Lock, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import PaywallModal from "@/components/PaywallModal";

interface LockGateProps {
  /** Content shown only when the user has access. */
  children: ReactNode;
  /** Optional teaser content shown above the paywall when locked. */
  teaser?: ReactNode;
  /** Headline shown in the paywall (e.g. "Your 14-day trial ended"). */
  reason?: string;
  /** Title rendered in the locked card. */
  title?: string;
  /** Subtext rendered in the locked card. */
  description?: string;
}

const LockGate = ({
  children,
  teaser,
  reason,
  title = "Unlock the full story",
  description = "Your free 14 days have ended. Upgrade to keep reading.",
}: LockGateProps) => {
  const { access, inTrial, trialDays, refresh } = useSubscription();
  const [modalOpen, setModalOpen] = useState(false);

  if (access) {
    return (
      <>
        {inTrial && trialDays <= 3 && (
          <div
            role="status"
            className="sticky top-0 z-40 text-center py-2 px-4"
            style={{
              background: "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
              borderBottom: "1px solid rgba(212,175,55,0.18)",
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
        {children}
      </>
    );
  }

  /* ── LOCKED STATE ──
     The full article content is rendered in the DOM so search engine crawlers
     (Googlebot) can index the text. It is visually hidden behind a gradient
     overlay and the paywall card. Users see the teaser + paywall; crawlers
     see the full content.
  ── */
  return (
    <>
      {/* Visually hidden but DOM-present article content for SEO crawlers */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          /* Do NOT use display:none or visibility:hidden — Googlebot ignores those */
        }}
      >
        {children}
      </div>

      {/* Visual paywall UI for non-subscribed users */}
      <div style={{ position: "relative" }}>
        {/* Teaser: first story block faded out */}
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

        {/* Paywall card */}
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div
            className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
              border: "1px solid rgba(212,175,55,0.22)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
              }}
            />
            <div
              className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-5"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <Lock size={22} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <h2
              className="font-heading font-bold mb-3"
              style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
            >
              {title}
            </h2>
            <p
              className="mb-7 mx-auto"
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
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-ripple px-8 py-3 rounded-full font-heading font-bold tracking-[0.1em] uppercase text-sm transition-all"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 24px rgba(212,175,55,0.3)",
              }}
            >
              See plans
            </button>
          </div>
        </div>

        <PaywallModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={refresh} reason={reason} />
      </div>
    </>
  );
};

export default LockGate;
