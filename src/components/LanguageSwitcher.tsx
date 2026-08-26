import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLocale } from "@/i18n";

interface LanguageSwitcherProps {
  variant?: "compact" | "full";
}

const LanguageSwitcher = (_: LanguageSwitcherProps = {}) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const optionRefs   = useRef<(HTMLButtonElement | null)[]>([]);

  const currentCode = (i18n.language?.substring(0, 2) || "en") as SupportedLocale;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) ?? SUPPORTED_LANGUAGES[0];

  /* ── Close on outside click ── */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    if (open) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  /* ── Full keyboard navigation (WCAG 2.1 — DEF-006 fix) ── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const last = SUPPORTED_LANGUAGES.length - 1;
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((i) => (i < last ? i + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((i) => (i > 0 ? i - 1 : last));
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(last);
          break;
        case "Tab":
          setOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ── Move DOM focus when focusedIndex changes ── */
  useEffect(() => {
    if (focusedIndex >= 0) optionRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  /* ── Move focus to first item when dropdown opens ── */
  useEffect(() => {
    if (open) {
      const activeIndex = SUPPORTED_LANGUAGES.findIndex((l) => l.code === currentCode);
      setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
    }
  }, [open, currentCode]);

  const handleSelect = useCallback(
    (code: SupportedLocale) => {
      i18n.changeLanguage(code);
      setOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    },
    [i18n]
  );

  const handleToggle = useCallback(() => {
    setOpen((v) => {
      if (v) setFocusedIndex(-1);
      return !v;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      data-testid="language-switcher"
    >
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.select")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{
          background: open ? "rgba(247,231,184,0.98)" : "rgba(255,246,228,0.92)",
          border: "1px solid rgba(201,162,39,0.45)",
          color: "hsl(var(--primary))",
        }}
      >
        {/* Globe icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        {/* Current language native label */}
        <span
          className="text-[13px] font-medium"
          style={{
            fontFamily:
              currentCode === "en" ? "'Cormorant Garamond', Georgia, serif"
              : currentCode === "hi" ? "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif"
              : currentCode === "te" ? "'Noto Serif Telugu', serif"
              : "'Noto Serif Kannada', serif",
          }}
        >
          {currentLang.nativeLabel}
        </span>

        <ChevronDown
          size={12}
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      </button>

      {/* ── Dropdown — mobile-safe positioning ── */}
      {open && (
        <div
          role="listbox"
          aria-label={t("lang.select")}
          className="absolute mt-2 rounded-xl overflow-hidden z-50"
          style={{
            /* Clamp to viewport on mobile — fixes DEF-003 */
            right: 0,
            maxWidth: "min(200px, calc(100vw - 2rem))",
            minWidth: "160px",
            background: "hsl(38 52% 93%)",
            border: "1px solid rgba(107,45,143,0.25)",
            boxShadow: "0 8px 32px rgba(42,31,14,0.15)",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang, idx) => {
            const isActive = lang.code === currentCode;
            return (
              <button
                key={lang.code}
                ref={(el) => { optionRefs.current[idx] = el; }}
                role="option"
                aria-selected={isActive}
                tabIndex={-1}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 focus-visible:outline-none"
                style={{
                  background: isActive ? "rgba(139,105,20,0.1)" : "transparent",
                  borderBottom: "1px solid rgba(139,105,20,0.1)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(107,45,143,0.08)";
                }}
                onBlur={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive && document.activeElement !== e.currentTarget)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Code badge */}
                <span
                  className="w-8 h-6 flex items-center justify-center rounded text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: isActive ? "rgba(139,105,20,0.2)" : "rgba(107,45,143,0.08)",
                    color: "hsl(var(--primary))",
                    fontFamily: "monospace",
                  }}
                >
                  {lang.code.toUpperCase()}
                </span>

                {/* Native label */}
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                    fontWeight: isActive ? 600 : 400,
                    fontFamily:
                      lang.code === "en" ? "'Cormorant Garamond', Georgia, serif"
                      : lang.code === "hi" ? "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif"
                      : lang.code === "te" ? "'Noto Serif Telugu', serif"
                      : "'Noto Serif Kannada', serif",
                  }}
                >
                  {lang.nativeLabel}
                </span>

                {isActive && (
                  <Check size={13} aria-hidden="true" style={{ color: "hsl(var(--primary))", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
