import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "md_cookie_consent";
type ConsentValue = "accepted" | "declined" | null;

function getStoredConsent(): ConsentValue {
  try { return (localStorage.getItem(STORAGE_KEY) as ConsentValue) || null; }
  catch { return null; }
}
function storeConsent(v: "accepted" | "declined") {
  try { localStorage.setItem(STORAGE_KEY, v); } catch { /* private mode / quota — consent is best-effort */ }
}

const CookieConsent = () => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) { setConsent(stored); }
    else { const timer = setTimeout(() => setVisible(true), 1500); return () => clearTimeout(timer); }
  }, []);

  const handleAccept = () => { storeConsent("accepted"); setConsent("accepted"); setVisible(false); };
  const handleDecline = () => { storeConsent("declined"); setConsent("declined"); setVisible(false); };

  if (consent || !visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      data-testid="cookie-consent"
      className="fixed z-50"
      style={{ bottom: "24px", left: "50%", transform: "translateX(-50%)", width: "min(520px, calc(100vw - 32px))" }}
    >
      <div
        className="rounded-2xl px-5 py-4 flex items-start gap-4"
        style={{ background: "rgb(20,10,0)", border: "1px solid rgba(107,45,143,0.35)", boxShadow: "0 12px 40px rgba(0,0,0,0.80), 0 0 0 1px rgba(107,45,143,0.10)" }}
      >
        <p className="flex-1 text-sm leading-relaxed i18n-safe" style={{ fontSize: "15px", color: "rgba(245,232,238,0.80)", fontFamily: "'Cormorant Garamond', serif" }}>
          {t("cookie.message")}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-gold-light transition-colors btn-i18n"
          >
            {t("cookie.accept")}
          </button>
          <button
            onClick={handleDecline}
            className="p-2 rounded-full hover:text-primary hover:bg-primary/10 transition-colors"
            style={{ color: "rgba(245,237,218,0.55)" }}
            aria-label={t("cookie.decline")}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
export { STORAGE_KEY, getStoredConsent };
