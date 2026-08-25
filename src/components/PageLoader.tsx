const PageLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "hsl(var(--background))",
    }}
  >
    <div style={{ textAlign: "center" }}>
      {/* Animated golden M */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #C2410C, #34D399, #38BDF8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          animation: "spin 1.2s linear infinite",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#08040F",
          }}
        >
          M
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          letterSpacing: "0.28em",
          color: "hsl(var(--muted-foreground))",
          textTransform: "uppercase",
        }}
      >
        Loading
      </p>
    </div>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default PageLoader;
