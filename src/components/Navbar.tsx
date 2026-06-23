import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { to: "/story",       key: "nav.story"       },
  { to: "/storyteller", key: "nav.storyteller" },
  { to: "/wisdom",      key: "nav.wisdom"      },
  { to: "/characters",  key: "nav.characters"  },
  { to: "/blog",        key: "nav.blog"        },
  { to: "/about",       key: "nav.about"       },
];

/* ── Floating Pill Sacred Island Navbar ── */
const Navbar = () => {
  const { t }                       = useTranslation();
  const { theme }                   = useTheme();
  const isDark                      = theme === "dark";
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname }                = useLocation();
  const menuRef                     = useRef<HTMLDivElement>(null);
  const burgerRef                   = useRef<HTMLButtonElement>(null);
  const isQuiz                      = pathname.startsWith("/quiz");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
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

  /* ── Styles ── */
  const wrapBg = isDark
    ? "rgba(6,3,14,0)"
    : "rgba(250,246,238,0)";

  const wrapBgScrolled = isDark
    ? "rgba(6,3,14,0.7)"
    : "rgba(250,246,238,0.85)";

  const pillBg     = "rgba(10,6,20,0.92)";
  const pillBorder = "rgba(212,175,55,0.22)";
  const pillShadow = "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.12)";

  const linkColor  = "rgba(232,210,160,0.78)";
  const linkActive = "#FBBF24";

  const ctaBg      = "linear-gradient(90deg,#FBBF24 0%,#F97316 35%,#EC4899 65%,#A78BFA 100%)";
  const ctaColor   = "#06030E";

  return (
    <>
      <a href="#main-content" className="skip-to-main">{t("nav.skip_to_main")}</a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          padding: scrolled ? "10px 24px" : "14px 24px",
          background: scrolled ? wrapBgScrolled : wrapBg,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid rgba(212,175,55,0.1)` : "none",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Desktop ── */}
        <div
          className="hidden lg:flex"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo — left */}
          <Link
            to="/"
            aria-label="MahabharataDecoded — go to homepage"
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              textDecoration: "none", flexShrink: 0,
            }}
          >
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "#0E0900",
              boxShadow: "0 0 0 2px #FBBF24, 0 0 0 4px rgba(167,139,250,0.4), 0 0 16px rgba(251,191,36,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'Cinzel',serif", fontSize: "14px",
                fontWeight: 700,
                background: "linear-gradient(135deg,#FBBF24,#F472B6,#A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>M</span>
            </div>
            <span style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#FBBF24",
              whiteSpace: "nowrap",
              textShadow: "0 0 20px rgba(251,191,36,0.80), 0 2px 10px rgba(251,191,36,0.60)",
            }}
              className="hidden xs:inline sm:inline"
            >
              MahabharataDecoded
            </span>
          </Link>

          {/* Floating Pill — centre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              background: pillBg,
              borderRadius: "100px",
              padding: "5px 6px",
              border: `1px solid ${pillBorder}`,
              boxShadow: pillShadow,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {NAV_LINKS.map(({ to, key }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={active ? "page" : undefined}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "100px",
                    fontFamily: "'Cinzel',serif",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.25s",
                    background: active
                      ? "linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(251,191,36,0.28)"
                      : "1px solid transparent",
                    color: active ? linkActive : linkColor,
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(251,191,36,0.15)"
                      : "none",
                  }}
                  onMouseEnter={e => {
                    if (!active)
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(220,195,140,0.9)";
                  }}
                  onMouseLeave={e => {
                    if (!active)
                      (e.currentTarget as HTMLAnchorElement).style.color = linkColor;
                  }}
                >
                  {t(key)}
                </Link>
              );
            })}

            {/* Divider */}
            <div style={{
              width: "1px", height: "20px",
              background: "rgba(212,175,55,0.18)",
              margin: "0 4px",
              flexShrink: 0,
            }} aria-hidden="true" />

            {/* Quiz pill inside the island */}
            <Link
              to="/quiz"
              aria-current={isQuiz ? "page" : undefined}
              style={{
                padding: "6px 14px",
                borderRadius: "100px",
                fontFamily: "'Cinzel',serif",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid rgba(212,175,55,0.28)",
                color: "rgba(212,175,55,0.75)",
                background: "transparent",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#FBBF24";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.75)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.28)";
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "9px" }}>✦</span>
              {t("nav.quiz")}
            </Link>
          </div>

          {/* Right — language, theme, CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/blog"
              style={{
                padding: "9px 22px",
                borderRadius: "100px",
                background: ctaBg,
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
                color: ctaColor,
                fontFamily: "'Cinzel', serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textDecoration: "none",
                textTransform: "uppercase",
                boxShadow: "0 4px 24px rgba(251,191,36,0.5), 0 0 0 1px rgba(251,191,36,0.15)",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 36px rgba(251,191,36,0.65), 0 0 0 1px rgba(251,191,36,0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(251,191,36,0.3)";
              }}
            >
              {t("nav.start_reading")}
            </Link>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div
          className="lg:hidden flex items-center justify-between"
          style={{ maxWidth: "100%" }}
        >
          {/* Mobile logo */}
          <Link
            to="/"
            aria-label="MahabharataDecoded homepage"
            style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}
          >
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "#0E0900",
              boxShadow: "0 0 0 2px #FBBF24, 0 0 0 3.5px rgba(167,139,250,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "'Cinzel',serif", fontSize: "12px", fontWeight: 700,
                background: "linear-gradient(135deg,#FBBF24,#A78BFA)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>M</span>
            </div>
            <span style={{
              fontFamily: "'Cinzel',serif", fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#FBBF24",
            }}>MahabharataDecoded</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              ref={burgerRef}
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t("nav.close_menu") : t("nav.open_menu")}
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FBBF24", cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={18} aria-hidden="true"/> : <Menu size={18} aria-hidden="true"/>}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          hidden={!mobileOpen}
          style={{
            margin: "10px 0 0",
            padding: "16px",
            background: "rgba(10,6,20,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
            border: "1px solid rgba(212,175,55,0.18)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: mobileOpen ? "auto" : "none",
          }}
        >
          {NAV_LINKS.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              onClick={closeMobile}
              style={{
                display: "block",
                padding: "14px 10px",
                fontFamily: "'Cinzel',serif",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212,175,55,0.1)",
                color: isActive(to) ? "#FBBF24" : "rgba(220,195,140,0.60)",
                transition: "color 0.2s",
              }}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            to="/quiz"
            onClick={closeMobile}
            style={{
              display: "block", padding: "12px 8px",
              fontFamily: "'Cinzel',serif", fontSize: "11px",
              letterSpacing: "0.14em", textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid rgba(212,175,55,0.1)",
              color: "rgba(212,175,55,0.8)",
            }}
          >
            ✦ {t("nav.quiz")}
          </Link>
          <Link
            to="/blog"
            onClick={closeMobile}
            style={{
              display: "block",
              marginTop: "14px",
              padding: "12px 20px",
              borderRadius: "100px",
              background: "linear-gradient(90deg,#FBBF24 0%,#F97316 35%,#EC4899 65%,#A78BFA 100%)",
              color: "#06030E",
              fontFamily: "'Cinzel',serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {t("nav.start_reading")}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
