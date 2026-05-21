import { lazy, Suspense, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import FloatingStoryButton from "@/components/FloatingStoryButton";
import FirstVisitCard from "@/components/FirstVisitCard";
import { ThemeProvider } from "@/context/ThemeContext";

const Index       = lazy(() => import("./pages/Index.tsx"));
const Blog        = lazy(() => import("./pages/Blog.tsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const Characters  = lazy(() => import("./pages/Characters.tsx"));
const About       = lazy(() => import("./pages/About.tsx"));
const Quiz        = lazy(() => import("./pages/Quiz.tsx"));
const Wisdom      = lazy(() => import("./pages/Wisdom.tsx"));
const StoryTeller = lazy(() => import("./pages/StoryTeller.tsx"));
const NotFound    = lazy(() => import("./pages/NotFound.tsx"));

/* ── Page transition wrapper — fades + slides each route in ── */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const ref      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Restart animation on route change
    ref.current.style.animation = "none";
    void ref.current.offsetHeight; // reflow
    ref.current.style.animation = "";
    // Scroll to top instantly on every navigation
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div ref={ref} className="page-transition" key={location.pathname}>
      {children}
    </div>
  );
};

/* ── Ripple effect — attaches to any .btn-ripple element globally ── */
const RippleProvider = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".btn-ripple") as HTMLElement | null;
      if (!target) return;

      const rect   = target.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-circle";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    // Touch support
    const touchHandler = (e: TouchEvent) => {
      const target = (e.target as HTMLElement).closest(".btn-ripple") as HTMLElement | null;
      if (!target || !e.touches[0]) return;
      const touch  = e.touches[0];
      const rect   = target.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = touch.clientX - rect.left - size / 2;
      const y      = touch.clientY - rect.top  - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-circle";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", touchHandler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", touchHandler);
    };
  }, []);

  return null;
};

const PageLoader = () => (
  <div
    role="status"
    aria-label="Loading page"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "hsl(var(--background))",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <svg
        width="48" height="48" viewBox="0 0 48 48"
        style={{ animation: "spin 1.5s linear infinite", display: "block", margin: "0 auto 16px" }}
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="20"
          stroke="rgba(212,175,55,0.4)"
          strokeWidth="2.5" fill="none"
          strokeDasharray="62 30" strokeLinecap="round"
        />
      </svg>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "10px",
        letterSpacing: "0.35em",
        color: "rgba(212,175,55,0.6)",
        textTransform: "uppercase",
      }}>
        Loading…
      </span>
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          {/* Global ripple listener — zero re-renders */}
          <RippleProvider />
          <div id="main-content">
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Routes>
                  <Route path="/"            element={<Index />} />
                  <Route path="/blog"        element={<Blog />} />
                  <Route path="/blog/:slug"  element={<ArticlePage />} />
                  <Route path="/characters"  element={<Characters />} />
                  <Route path="/about"       element={<About />} />
                  <Route path="/quiz"        element={<Quiz />} />
                  <Route path="/wisdom"      element={<Wisdom />} />
                  <Route path="/storyteller" element={<StoryTeller />} />
                  <Route path="*"            element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </div>
          <BackToTop />
          <CookieConsent />
          <FloatingStoryButton />
          <FirstVisitCard />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
