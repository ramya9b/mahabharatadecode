import type { ReactNode } from "react";
import { SearchX, BookOpen, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

type EmptyVariant = "search" | "articles" | "generic";

interface CTAConfig {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  cta?: CTAConfig;
  icon?: ReactNode;
}

const VARIANT_DEFAULTS: Record<EmptyVariant, { title: string; description: string; icon: ReactNode }> = {
  search: {
    title: "No results found",
    description: "Try different keywords or browse all stories below.",
    icon: <SearchX size={28} style={{ color: "rgba(194,65,12,0.7)" }} aria-hidden="true" />,
  },
  articles: {
    title: "No articles yet",
    description: "New stories are being written. Subscribe to be notified when they arrive.",
    icon: <BookOpen size={28} style={{ color: "rgba(194,65,12,0.7)" }} aria-hidden="true" />,
  },
  generic: {
    title: "Nothing here yet",
    description: "Check back soon.",
    icon: <Inbox size={28} style={{ color: "rgba(194,65,12,0.7)" }} aria-hidden="true" />,
  },
};

const EmptyState = ({
  variant = "generic",
  title,
  description,
  cta,
  icon,
}: EmptyStateProps) => {
  const defaults = VARIANT_DEFAULTS[variant];
  const displayTitle = title ?? defaults.title;
  const displayDesc = description ?? defaults.description;
  const displayIcon = icon ?? defaults.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="empty-state"
      data-variant={variant}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        minHeight: "280px",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(194,65,12,0.08)",
          border: "1px solid rgba(194,65,12,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {displayIcon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "hsl(var(--foreground) / 0.92)",
          marginBottom: "8px",
        }}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "17px",
          color: "hsl(var(--foreground) / 0.60)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          lineHeight: 1.85,
          maxWidth: "380px",
          marginBottom: cta ? "28px" : 0,
        }}
      >
        {displayDesc}
      </p>

      {/* CTA */}
      {cta && (
        cta.to ? (
          <Link
            to={cta.to}
            style={{
              padding: "10px 24px",
              borderRadius: "99px",
              background: "linear-gradient(135deg, #E8C547, #C2410C)",
              color: "#08061A",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              display: "inline-block",
              transition: "opacity 0.2s",
            }}
          >
            {cta.label}
          </Link>
        ) : (
          <button
            onClick={cta.onClick}
            style={{
              padding: "10px 24px",
              borderRadius: "99px",
              background: "linear-gradient(135deg, #E8C547, #C2410C)",
              color: "#08061A",
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {cta.label}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
