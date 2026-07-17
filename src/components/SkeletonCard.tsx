/** Shimmer keyframes are already in index.css — we reuse them */
const shimmerStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg, rgba(139,105,20,0.05) 0%, rgba(34,197,94,0.06) 50%, rgba(139,105,20,0.05) 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.8s infinite",
  borderRadius: "8px",
};

interface SkeletonBlockProps {
  height?: string | number;
  width?: string;
  style?: React.CSSProperties;
}

const SkeletonBlock = ({ height = "16px", width = "100%", style }: SkeletonBlockProps) => (
  <div
    data-testid="skeleton-block"
    aria-hidden="true"
    style={{ ...shimmerStyle, height, width, ...style }}
  />
);

/** Single article card skeleton */
const SkeletonCard = () => (
  <article
    aria-hidden="true"
    data-testid="skeleton-card"
    style={{
      background: "rgba(139,105,20,0.05)",
      border: "1px solid rgba(139,105,20,0.09)",
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    {/* Image placeholder */}
    <SkeletonBlock height="200px" style={{ borderRadius: 0 }} />

    <div style={{ padding: "20px 22px 16px" }}>
      {/* Category tag */}
      <SkeletonBlock height="10px" width="60px" style={{ marginBottom: "12px" }} />
      {/* Title */}
      <SkeletonBlock height="18px" style={{ marginBottom: "8px" }} />
      <SkeletonBlock height="18px" width="75%" style={{ marginBottom: "12px" }} />
      {/* Excerpt */}
      <SkeletonBlock height="13px" style={{ marginBottom: "6px" }} />
      <SkeletonBlock height="13px" width="85%" style={{ marginBottom: "6px" }} />
      <SkeletonBlock height="13px" width="55%" />
    </div>

    {/* Footer */}
    <div
      style={{
        padding: "12px 22px",
        borderTop: "1px solid rgba(139,105,20,0.07)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <SkeletonBlock height="11px" width="80px" />
      <SkeletonBlock height="11px" width="55px" />
    </div>
  </article>
);

/** Featured card skeleton (wider) */
const SkeletonFeaturedCard = () => (
  <article
    aria-hidden="true"
    data-testid="skeleton-featured-card"
    style={{
      background: "rgba(139,105,20,0.05)",
      border: "1px solid rgba(139,105,20,0.09)",
      borderRadius: "20px",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}
  >
    <SkeletonBlock height="320px" style={{ borderRadius: 0 }} />
    <div style={{ padding: "36px" }}>
      <SkeletonBlock height="11px" width="70px" style={{ marginBottom: "16px" }} />
      <SkeletonBlock height="24px" style={{ marginBottom: "10px" }} />
      <SkeletonBlock height="24px" width="80%" style={{ marginBottom: "20px" }} />
      <SkeletonBlock height="14px" style={{ marginBottom: "8px" }} />
      <SkeletonBlock height="14px" width="90%" style={{ marginBottom: "8px" }} />
      <SkeletonBlock height="14px" width="60%" style={{ marginBottom: "28px" }} />
      <SkeletonBlock height="38px" width="140px" style={{ borderRadius: "99px" }} />
    </div>
  </article>
);

/** Grid of N skeleton cards */
interface SkeletonGridProps {
  count?: number;
  includeFeatured?: boolean;
}

const SkeletonGrid = ({ count = 6, includeFeatured = false }: SkeletonGridProps) => (
  <div>
    {includeFeatured && (
      <div style={{ marginBottom: "40px" }}>
        <SkeletonFeaturedCard />
      </div>
    )}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default SkeletonCard;
export { SkeletonGrid, SkeletonFeaturedCard, SkeletonBlock };
