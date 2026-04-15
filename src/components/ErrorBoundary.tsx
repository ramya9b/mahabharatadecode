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
    // In production, you would send this to your error monitoring service (e.g. Sentry)
    if (import.meta.env.DEV) {
      console.group("🔴 ErrorBoundary caught an error");
      console.error("Error:", error);
      console.error("Component stack:", info.componentStack);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary-fallback"
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            textAlign: "center",
            background: "hsl(38 55% 91%)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(229,57,53,0.12)",
              border: "1px solid rgba(229,57,53,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <AlertTriangle size={28} style={{ color: "#E53935" }} aria-hidden="true" />
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Cinzel', serif",
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 700,
              color: "rgba(42,31,14,0.92)",
              marginBottom: "12px",
            }}
          >
            Something went wrong
          </h1>

          {/* Sub-text */}
          <p
            style={{
              fontSize: "17px",
              color: "rgba(42,31,14,0.55)",
              fontFamily: "'Lora', Georgia, serif",
              maxWidth: "420px",
              lineHeight: 1.85,
              marginBottom: "32px",
            }}
          >
            Even the Mahabharata has unexpected turns. This page encountered an error.
            Try refreshing — it usually resolves on its own.
          </p>

          {/* Error details (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                maxWidth: "600px",
                width: "100%",
                marginBottom: "32px",
                textAlign: "left",
                background: "rgba(229,57,53,0.06)",
                border: "1px solid rgba(229,57,53,0.15)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <summary
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "rgba(229,57,53,0.8)",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
              >
                Error details (development only)
              </summary>
              <pre
                style={{
                  fontSize: "11px",
                  color: "rgba(42,31,14,0.55)",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={this.handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "99px",
                background: "linear-gradient(135deg, #E8C547, #D4AF37)",
                border: "none",
                color: "#08061A",
                fontFamily: "'Playfair Display', 'Cinzel', serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} aria-hidden="true" />
              Try Again
            </button>

            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "99px",
                background: "rgba(139,105,20,0.06)",
                border: "1px solid rgba(212,175,55,0.2)",
                color: "rgba(42,31,14,0.72)",
                fontFamily: "'Playfair Display', 'Cinzel', serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
            >
              <Home size={14} aria-hidden="true" />
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
