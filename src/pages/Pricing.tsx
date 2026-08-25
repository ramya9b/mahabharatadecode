import { useState } from "react";
import { Check, Unlock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaywallModal from "@/components/PaywallModal";
import { useSEO } from "@/hooks/useSEO";
import { PLANS, FREE_ARTICLE_SLUGS, type PlanId } from "@/lib/subscription";
import { getArticleBySlug } from "@/data/articles";
import { useSubscription } from "@/hooks/useSubscription";

const FREE_BENEFITS = [
  "5 articles — permanently free, no account needed",
  "Daily Wisdom quotes",
  "Character profiles",
  "Quiz access",
  "14-day free trial of all premium content",
];

const PAID_BENEFITS = [
  "All 29 articles in full",
  "Unlimited Story Teller — AI narration in 4 languages",
  "New articles as they publish",
  "Hindi, Telugu, Kannada translations",
  "Ad-free reading experience",
];

export default function Pricing() {
  const [selected, setSelected] = useState<PlanId>("yearly");
  const [modalOpen, setModalOpen] = useState(false);
  const { access, inTrial, trialDays, refresh } = useSubscription();

  useSEO({
    title: "Plans & Pricing",
    description: "5 Mahabharata articles free forever. Upgrade from ₹99/month for full access to all 29 articles and unlimited AI Story Teller in English, Telugu, Hindi and Kannada.",
    path: "/pricing",
    type: "website",
  });

  const freeArticles = FREE_ARTICLE_SLUGS
    .map(slug => getArticleBySlug(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block mb-4 text-[11px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "rgba(194,65,12,0.7)" }}
          >
            Simple, honest pricing
          </span>
          <h1
            className="font-heading font-bold mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
          >
            Start free.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #E8C547 0%, #C2410C 55%, #B8922A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Upgrade when ready.
            </span>
          </h1>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(17px, 2vw, 20px)",
              color: "hsl(var(--muted-foreground))",
              lineHeight: 1.7,
            }}
          >
            5 articles are free forever — no account, no email, no payment.
            Upgrade only when you want more.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Free card */}
          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: "rgba(194,65,12,0.03)",
              border: "1px solid rgba(194,65,12,0.15)",
            }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Unlock size={16} style={{ color: "rgba(39,174,96,0.8)" }} />
                <span
                  className="text-[11px] tracking-[0.25em] uppercase"
                  style={{ fontFamily: "'Cinzel', serif", color: "rgba(39,174,96,0.8)" }}
                >
                  Always Free
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading font-bold" style={{ fontSize: "42px" }}>₹0</span>
                <span style={{ fontSize: "15px", color: "hsl(var(--muted-foreground))" }}>/forever</span>
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "15px",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                No account needed
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={15} style={{ color: "rgba(39,174,96,0.8)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "15px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground))", lineHeight: 1.5 }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="/blog"
              className="block text-center w-full rounded-full py-3 font-heading font-semibold tracking-wide text-sm transition-all"
              style={{
                border: "1px solid rgba(194,65,12,0.3)",
                color: "rgba(245,237,218,0.8)",
                fontSize: "13px",
                letterSpacing: "0.1em",
              }}
            >
              Start Reading Free
            </a>
          </div>

          {/* Paid card */}
          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: "linear-gradient(135deg, rgba(194,65,12,0.08) 0%, rgba(194,65,12,0.03) 100%)",
              border: "2px solid rgba(194,65,12,0.35)",
              boxShadow: "0 0 40px rgba(194,65,12,0.08)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(194,65,12,0.6), transparent)" }}
            />

            {/* Plan toggle */}
            <div className="flex gap-2 mb-6">
              {(Object.keys(PLANS) as PlanId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  className="flex-1 rounded-full py-2 text-sm font-heading tracking-wide transition-all"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    fontFamily: "'Cinzel', serif",
                    background: selected === id ? "hsl(var(--primary))" : "transparent",
                    color: selected === id ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                    border: selected === id ? "none" : "1px solid rgba(194,65,12,0.2)",
                  }}
                >
                  {PLANS[id].label}
                  {id === "yearly" && " ✦"}
                </button>
              ))}
            </div>

            <div className="mb-2">
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold" style={{ fontSize: "42px" }}>
                  ₹{PLANS[selected].priceInr}
                </span>
                <span style={{ fontSize: "15px", color: "hsl(var(--muted-foreground))" }}>
                  /{selected === "monthly" ? "month" : "year"}
                </span>
              </div>
              {selected === "yearly" && (
                <p style={{ fontSize: "13px", color: "rgba(194,65,12,0.8)", fontFamily: "'Cormorant Garamond', serif" }}>
                  ₹83/month · Save ₹189
                </p>
              )}
            </div>

            <p
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "15px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {PLANS[selected].tagline}
            </p>

            <ul className="space-y-3 mb-8">
              {PAID_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={15} style={{ color: "hsl(var(--primary))", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "15px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "hsl(var(--foreground))", lineHeight: 1.5 }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {access ? (
              <div
                className="flex items-center justify-center gap-2 rounded-full py-3"
                style={{ background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)" }}
              >
                <Check size={15} color="#27AE60" />
                <span style={{ color: "#27AE60", fontFamily: "'Cinzel', serif", fontSize: "12px", letterSpacing: "0.1em" }}>
                  {inTrial ? `Trial active — ${trialDays} days left` : "Access active"}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-ripple w-full rounded-full py-3.5 font-heading font-bold tracking-[0.1em] uppercase text-sm transition-all"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 24px rgba(194,65,12,0.3)",
                }}
              >
                Get Full Access — ₹{PLANS[selected].priceInr}
              </button>
            )}
          </div>
        </div>

        {/* Free articles list */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ background: "rgba(194,65,12,0.15)" }} />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: "rgba(194,65,12,0.6)" }}
            >
              5 Free Articles
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(194,65,12,0.15)" }} />
          </div>
          <div className="grid md:grid-cols-1 gap-3">
            {freeArticles.map((article) => article && (
              <a
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="flex items-center gap-4 rounded-xl px-5 py-4 group transition-all"
                style={{
                  background: "rgba(194,65,12,0.03)",
                  border: "1px solid rgba(194,65,12,0.1)",
                }}
              >
                <Unlock size={14} style={{ color: "rgba(39,174,96,0.7)", flexShrink: 0 }} />
                <span
                  className="flex-1 group-hover:text-primary transition-colors"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "17px",
                    color: "rgba(245,237,218,0.88)",
                    lineHeight: 1.4,
                  }}
                >
                  {article.title}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "'Cinzel', serif",
                    color: "rgba(39,174,96,0.6)",
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                  }}
                >
                  FREE
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ — simple, honest */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(194,65,12,0.15)" }} />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: "rgba(194,65,12,0.6)" }}
            >
              Questions
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(194,65,12,0.15)" }} />
          </div>
          <div className="space-y-6">
            {[
              {
                q: "Do I need to create an account?",
                a: "No. The 5 free articles and the 14-day trial both work without any account or email. Payment is only needed after the trial ends.",
              },
              {
                q: "What happens after the 14-day trial?",
                a: "You keep permanent access to the 5 free articles. To read the remaining 24 articles and use Story Teller without limits, you upgrade to monthly (₹99) or yearly (₹999).",
              },
              {
                q: "Can I cancel?",
                a: "Monthly plan can be cancelled anytime — no questions asked. Yearly plan is valid for 365 days from payment date.",
              },
              {
                q: "What payment methods work?",
                a: "UPI, all major credit and debit cards, and net banking via Cashfree — a trusted Indian payment gateway.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderBottom: "1px solid rgba(194,65,12,0.1)", paddingBottom: "20px" }}>
                <h3
                  className="font-heading font-semibold mb-2"
                  style={{ fontSize: "16px", color: "rgba(245,237,218,0.9)" }}
                >
                  {q}
                </h3>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "16px",
                    color: "hsl(var(--muted-foreground))",
                    lineHeight: 1.7,
                  }}
                >
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
      <PaywallModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={refresh} />
    </div>
  );
}
