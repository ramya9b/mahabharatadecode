import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { to: "/storyteller", key: "nav.storyteller" },
  { to: "/wisdom",      key: "nav.wisdom"      },
  { to: "/characters",  key: "nav.characters"  },
  { to: "/blog",        key: "nav.blog"        },
  { to: "/about",       key: "nav.about"       },
];

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname }                = useLocation();
  const menuRef                     = useRef<HTMLDivElement>(null);
  const burgerRef                   = useRef<HTMLButtonElement>(null);

  const isSolid = ["/blog","/characters","/about","/quiz","/wisdom","/storyteller"].some(p => pathname.startsWith(p));
  const isQuiz  = pathname.startsWith("/quiz");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); burgerRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    first.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [mobileOpen]);

  const isActive = useCallback(
    (to: string) => to === "/blog" ? pathname.startsWith("/blog") : pathname.startsWith(to),
    [pathname]
  );
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <a href="#main-content" className="skip-to-main">{t("nav.skip_to_main")}</a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isSolid ? "glass-card py-3 shadow-2xl" : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="MahabharataDecoded — home">
            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#FBBF24,#34D399,#38BDF8)", display:"flex", alignItems:"center", justifyContent:"center" }} aria-hidden="true">
              <span className="text-xs font-bold text-primary-foreground" style={{ fontFamily: "'Cinzel', serif" }}>M</span>
            </div>
            <span className="text-sm tracking-[0.18em] gold-text hidden sm:block i18n-safe" style={{ fontFamily: "'Cinzel', serif" }}>
              MahabharataDecoded
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map(({ to, key }) => (
              <Link
                key={to}
                to={to}
                aria-current={isActive(to) ? "page" : undefined}
                className={`text-[13px] tracking-wide transition-colors duration-300 relative i18n-safe whitespace-nowrap ${
                  isActive(to) ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t(key)}
                {isActive(to) && <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary rounded-full" aria-hidden="true"/>}
              </Link>
            ))}

            <Link
              to="/quiz"
              aria-current={isQuiz ? "page" : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-300 whitespace-nowrap i18n-safe ${
                isQuiz ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary hover:bg-primary/10"
              }`}
            >
              <span aria-hidden="true">✦</span> {t("nav.quiz")}
            </Link>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <ThemeToggle />

            <Link
              to="/blog"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[12px] font-medium hover:bg-gold-light transition-colors duration-300 tracking-wide animate-pulse-glow whitespace-nowrap btn-i18n"
            >
              {t("nav.start_reading")}
            </Link>
          </div>

          {/* Mobile: theme toggle + language + burger */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              ref={burgerRef}
              className="text-foreground p-2 rounded-lg hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t("nav.close_menu") : t("nav.open_menu")}
            >
              {mobileOpen ? <X size={22} aria-hidden="true"/> : <Menu size={22} aria-hidden="true"/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          hidden={!mobileOpen}
          className={`lg:hidden glass-card mt-2 mx-4 p-5 rounded-2xl transition-all duration-300 ${
            mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {NAV_LINKS.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              className={`block py-3 text-base border-b border-border/30 i18n-safe transition-colors ${
                isActive(to) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={closeMobile}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            to="/quiz"
            className="block py-3 text-base border-b border-border/30 text-primary font-medium hover:text-gold-light transition-colors i18n-safe"
            onClick={closeMobile}
          >
            ✦ {t("nav.quiz")}
          </Link>
          <Link
            to="/blog"
            className="mt-4 block text-center px-5 py-3 rounded-full bg-primary text-primary-foreground text-base font-medium tracking-wide hover:bg-gold-light transition-colors i18n-safe"
            onClick={closeMobile}
          >
            {t("nav.start_reading")}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
