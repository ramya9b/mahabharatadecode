import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

/* ── Lazy-loaded page routes (code-split per route) ── */
const Index       = lazy(() => import("./pages/Index.tsx"));
const Blog        = lazy(() => import("./pages/Blog.tsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const Characters  = lazy(() => import("./pages/Characters.tsx"));
const About       = lazy(() => import("./pages/About.tsx"));
const Quiz        = lazy(() => import("./pages/Quiz.tsx"));
const Wisdom      = lazy(() => import("./pages/Wisdom.tsx"));
const NotFound    = lazy(() => import("./pages/NotFound.tsx"));

/* ── Route-level loading fallback ── */
const PageLoader = () => (
  <div
    role="status"
    aria-label="Loading page"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "hsl(38 52% 91%)",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{ animation: "spin 1.5s linear infinite", display: "block", margin: "0 auto 16px" }}
        aria-hidden="true"
      >
        <circle
          cx="24" cy="24" r="20"
          stroke="rgba(139,105,20,0.35)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="62 30"
          strokeLinecap="round"
        />
      </svg>
      <span style={{
        fontFamily: "'Playfair Display', 'Cinzel', serif",
        fontSize: "11px",
        letterSpacing: "0.3em",
        color: "rgba(107,84,48,0.6)",
        textTransform: "uppercase",
      }}>
        Loading…
      </span>
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ErrorBoundary>
        <div id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"            element={<Index />} />
              <Route path="/blog"        element={<Blog />} />
              <Route path="/blog/:slug"  element={<ArticlePage />} />
              <Route path="/characters"  element={<Characters />} />
              <Route path="/about"       element={<About />} />
              <Route path="/quiz"        element={<Quiz />} />
              <Route path="/wisdom"      element={<Wisdom />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <BackToTop />
        <CookieConsent />
      </ErrorBoundary>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
