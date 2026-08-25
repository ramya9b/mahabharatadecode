import { useState, useId } from "react";
import { Mail, ArrowRight, Check, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  variant?: "inline" | "banner" | "minimal";
  source?:  string;   /* GA4 event label — which page triggered signup */
}

/* ── Brevo (ex-Sendinblue) — 300 emails/day free tier; list ID is set server-side ── */

const NewsletterSignup = ({
  variant = "inline",
  source  = "unknown",
}: NewsletterSignupProps) => {
  const { t } = useTranslation();
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error,  setError]  = useState("");
  const inputId = useId();

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("loading");

    /* ── Fire GA4 event for newsletter signup ── */
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "newsletter_signup", {
          event_category: "engagement",
          event_label:    source,
          value:          1,
        });
      }
    } catch (_) { /* GA not loaded */ }

    /* ── Brevo via secure Cloudflare Pages Function (/subscribe) ─────────
       API key stored server-side in Cloudflare env vars — never exposed.
       ──────────────────────────────────────────────────────────────────── */
    try {
      const res = await fetch("/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), source }),
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (data.success) {
        setStatus("success");
        setEmail("");
        /* Also cache locally so we know this browser already subscribed */
        try {
          localStorage.setItem("mbd_subscribed", "1");
        } catch { /* private mode / quota — the signup already succeeded */ }
      } else {
        throw new Error(data.error || "Server error");
      }
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  /* ── MINIMAL variant — single line, used in navbar / footer ── */
  if (variant === "minimal") {
    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
        aria-label="Newsletter signup"
      >
        <label htmlFor={inputId} style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          Email address
        </label>
        {status === "success" ? (
          <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#27AE60", fontSize: "13px", fontFamily: "'Cormorant Garamond',serif" }}>
            <Check size={14} /> You're in!
          </span>
        ) : (
          <>
            <input
              id={inputId}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email"
              required
              style={{
                padding:     "7px 14px",
                borderRadius:"99px",
                border:      "1px solid rgba(194,65,12,0.25)",
                background:  "rgba(194,65,12,0.04)",
                color:       "hsl(var(--foreground))",
                fontSize:    "13px",
                fontFamily:  "'Cormorant Garamond',serif",
                outline:     "none",
                width:       "180px",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              aria-label="Subscribe"
              style={{
                padding: "7px 16px",
                borderRadius: "99px",
                background: "linear-gradient(135deg, #C2410C 0%, #34D399 50%, #38BDF8 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
                color: "#08040F",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 700,
                boxShadow: "0 2px 12px rgba(52,211,153,0.35)",
                transition: "all 0.2s",
              }}
            >
              {status === "loading" ? <Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> : <>Subscribe <ArrowRight size={12} /></>}
            </button>
          </>
        )}
      </form>
    );
  }

  /* ── BANNER variant — full-width section ── */
  if (variant === "banner") {
    return (
      <section
        aria-labelledby="newsletter-heading"
        style={{
          padding:    "64px 24px",
          background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          borderTop:  "1px solid rgba(194,65,12,0.12)",
          borderBottom:"1px solid rgba(194,65,12,0.12)",
          textAlign:  "center",
          position:   "relative",
          overflow:   "hidden",
        }}
      >
        {/* Gold glow */}
        <div aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"500px", height:"200px", background:"radial-gradient(ellipse, rgba(194,65,12,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:"520px", margin:"0 auto" }}>
          {/* Icon */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
            <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"rgba(194,65,12,0.1)", border:"1px solid rgba(194,65,12,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Mail size={20} color="hsl(var(--primary))" />
            </div>
          </div>

          <h2
            id="newsletter-heading"
            style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(20px,4vw,26px)", fontWeight:600, color:"hsl(var(--foreground))", marginBottom:"10px", letterSpacing:"0.04em" }}
          >
            {t("home.newsletter_banner.title")}
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", color:"hsl(var(--muted-foreground))", lineHeight:1.7, marginBottom:"28px" }}>
            {t("home.newsletter_banner.subtitle")}
          </p>

          {status === "success" ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", color:"#27AE60", fontSize:"16px", fontFamily:"'Cormorant Garamond',serif" }}>
                <Check size={20} /> {t("home.newsletter_banner.success")}
              </div>
              <p style={{ fontSize:"13px", color:"hsl(var(--muted-foreground))", fontFamily:"'Cormorant Garamond',serif" }}>{t("home.newsletter_banner.confirm_inbox")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Newsletter signup" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
              <div style={{ display:"flex", gap:"0", width:"100%", maxWidth:"400px", borderRadius:"99px", overflow:"hidden", border:"1px solid rgba(194,65,12,0.25)", background:"hsl(var(--card))" }}>
                <label htmlFor={inputId + "-banner"} style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)" }}>
                  Email address
                </label>
                <input
                  id={inputId + "-banner"}
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  required
                  style={{ flex:1, padding:"13px 20px", border:"none", background:"transparent", color:"hsl(var(--foreground))", fontSize:"15px", fontFamily:"'Cormorant Garamond',serif", outline:"none", minWidth:0 }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  className="btn-ripple"
                  style={{
                    padding: "13px 24px",
                    background: "linear-gradient(135deg, #C2410C 0%, #34D399 50%, #38BDF8 100%)",
                    backgroundSize: "200% auto",
                    animation: "shimmer 4s linear infinite",
                    color: "#08040F",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    boxShadow: "0 4px 20px rgba(52,211,153,0.40)",
                    transition: "all 0.35s ease",
                  }}
                >
                  {status === "loading"
                    ? <Loader size={14} style={{ animation:"spin 1s linear infinite" }} />
                    : <>Subscribe <ArrowRight size={13} /></>}
                </button>
              </div>
              {error && <p role="alert" style={{ color:"#E24B4A", fontSize:"13px", fontFamily:"'Cormorant Garamond',serif" }}>{error}</p>}
              <p style={{ fontSize:"12px", color:"hsl(var(--muted-foreground))", fontFamily:"'Cormorant Garamond',serif", opacity:0.7 }}>
                {t("home.newsletter_banner.no_spam")}
              </p>
            </form>
          )}
        </div>
        <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      </section>
    );
  }

  /* ── INLINE variant — inside article, after content ── */
  return (
    <div
      role="complementary"
      aria-labelledby={inputId + "-label"}
      style={{
        borderRadius:"16px",
        padding:     "28px 28px 24px",
        background:  "linear-gradient(135deg, rgba(194,65,12,0.06) 0%, rgba(194,65,12,0.02) 100%)",
        border:      "1px solid rgba(194,65,12,0.18)",
        margin:      "40px 0",
      }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom:"16px" }}>
        <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:"rgba(194,65,12,0.12)", border:"1px solid rgba(194,65,12,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
          <Mail size={16} color="hsl(var(--primary))" />
        </div>
        <div>
          <h3 id={inputId + "-label"} style={{ fontFamily:"'Cinzel',serif", fontSize:"15px", fontWeight:600, color:"hsl(var(--foreground))", marginBottom:"5px", letterSpacing:"0.04em" }}>
            Enjoyed this story?
          </h3>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", color:"hsl(var(--muted-foreground))", lineHeight:1.65, margin:0 }}>
            Get one decoded Mahabharata story in your inbox every Friday. Free, always.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"12px 16px", borderRadius:"10px", background:"rgba(39,174,96,0.1)", border:"1px solid rgba(39,174,96,0.2)" }}>
          <Check size={16} color="#27AE60" />
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", color:"#27AE60" }}>You're subscribed! Check your inbox to confirm.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-label="Newsletter signup" style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            <label htmlFor={inputId + "-inline"} style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)" }}>
              Email address
            </label>
            <input
              id={inputId + "-inline"}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              required
              style={{ flex:1, minWidth:"200px", padding:"10px 16px", borderRadius:"99px", border:"1px solid rgba(194,65,12,0.22)", background:"hsl(var(--background))", color:"hsl(var(--foreground))", fontSize:"15px", fontFamily:"'Cormorant Garamond',serif", outline:"none" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-ripple cta-magnetic"
              aria-label="Subscribe to newsletter"
              style={{
                padding: "10px 22px",
                borderRadius: "99px",
                background: "linear-gradient(135deg, #C2410C 0%, #34D399 50%, #38BDF8 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
                color: "#08040F",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(52,211,153,0.35)",
                transition: "all 0.35s ease",
              }}
            >
              {status === "loading"
                ? <Loader size={13} style={{ animation:"spin 1s linear infinite" }} />
                : <>Get Stories <ArrowRight size={12} /></>}
            </button>
          </div>
          {error && <p role="alert" style={{ color:"#E24B4A", fontSize:"13px", fontFamily:"'Cormorant Garamond',serif", margin:"0 0 0 4px" }}>{error}</p>}
          <p style={{ fontSize:"12px", color:"hsl(var(--muted-foreground))", fontFamily:"'Cormorant Garamond',serif", opacity:0.65, margin:"2px 0 0 4px" }}>
            No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default NewsletterSignup;
