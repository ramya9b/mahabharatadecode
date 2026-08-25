import { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    this.props.onError?.(error, info);
    // Always log to console so runtime errors are diagnosable in production
    console.error("[MahabharataDecoded] Runtime error:", error);
    console.error("[MahabharataDecoded] Component stack:", info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const showDetails = import.meta.env.DEV;

      return (
        <div
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary-fallback"
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            textAlign: "center",
            background:
              "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)",
            color: "hsl(var(--foreground))",
          }}
        >
          {/* Decorative rainbow bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background:
                "linear-gradient(90deg,#6B2D8F,#E4C04A,#6B2D8F,#38BDF8,#A78BFA,#F472B6)",
            }}
            aria-hidden="true"
          />

          {/* Icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(229,57,53,0.10)",
              border: "1px solid rgba(229,57,53,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <AlertTriangle size={30} style={{ color: "#E53935" }} aria-hidden="true" />
          </div>

          {/* Heading — uses theme foreground for guaranteed contrast */}
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
              marginBottom: "14px",
              letterSpacing: "0.01em",
            }}
          >
            Something went wrong
          </h1>

          {/* Sub-text — muted foreground, readable in both themes */}
          <p
            style={{
              fontSize: "18px",
              color: "hsl(var(--muted-foreground))",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              maxWidth: "440px",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            Even the Mahabharata has unexpected turns. This page hit an error —
            try again, and if it persists, head back home.
          </p>

          {/* Error details — dev only, high contrast */}
          {showDetails && this.state.error && (
            <details
              style={{
                maxWidth: "640px",
                width: "100%",
                marginBottom: "36px",
                textAlign: "left",
                background: "rgba(229,57,53,0.06)",
                border: "1px solid rgba(229,57,53,0.18)",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <summary
                style={{
                  fontSize: "13px",
                  fontFamily: "monospace",
                  color: "#E53935",
                  cursor: "pointer",
                  marginBottom: "10px",
                  fontWeight: 700,
                }}
              >
                Error details
              </summary>
              <pre
                style={{
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={this.handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "99px",
                background: "linear-gradient(135deg, #6B2D8F, #6B2D8F)",
                border: "none",
                color: "#1A0A00",
                fontFamily: "'Cinzel', serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(107,45,143,0.30)",
              }}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Try Again
            </button>

            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "99px",
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
                fontFamily: "'Cinzel', serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              <Home size={15} aria-hidden="true" />
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
