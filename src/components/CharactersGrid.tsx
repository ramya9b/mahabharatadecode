import { Link } from "react-router-dom";

/* ── Use WebP public assets with JPEG srcSet fallback for performance ── */
const characters = [
  { name: "Krishna",  title: "The Divine Strategist", id: "krishna"  },
  { name: "Arjuna",   title: "The Supreme Archer",     id: "arjuna"   },
  { name: "Karna",    title: "The Tragic Hero",        id: "karna"    },
  { name: "Draupadi", title: "The Fire-Born Queen",    id: "draupadi" },
  { name: "Bhishma",  title: "The Grand Patriarch",    id: "bhishma"  },
];

/* Responsive srcSet: serve smallest needed per breakpoint
   Vite bundles src/assets — public/ images are served as-is at runtime */
const getAssetSrcSet = (id: string) =>
  `/characters/${id}.webp 900w, /characters/${id}.webp 450w`;

const CharactersGrid = () => (
  <section id="characters" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <div className="section-header">
        <span className="section-label">Closer Look</span>
        <h2 className="section-title">Meet the Five</h2>
        <div
          aria-hidden="true"
          style={{
            width: "48px", height: "1px", margin: "16px auto 0",
            background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.7),transparent)",
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {characters.map((char) => (
          <Link
            key={char.id}
            to={`/characters#char-${char.id}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer story-tap btn-ripple ripple-gold"
            style={{ display: "block" }}
          >
            {/* Responsive image — browser picks best size automatically */}
            <img
              src={`/characters/${char.id}.webp`}
              srcSet={getAssetSrcSet(char.id)}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              alt={char.name}
              loading="lazy"
              decoding="async"
              width={900}
              height={1216}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              style={{ imageRendering: "high-quality" as unknown as React.CSSProperties["imageRendering"] }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div
              className="absolute inset-0 rounded-2xl transition-all duration-500"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(212,175,55,0)",
                transition: "box-shadow 0.4s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(212,175,55,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(212,175,55,0)")}
            />

            {/* Name */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
              <h3
                className="font-heading text-base lg:text-lg text-foreground transition-colors duration-300 group-hover:text-primary"
              >
                {char.name}
              </h3>
              <p
                className="text-primary/80 text-[11px] tracking-wider mt-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "12px" }}
              >
                {char.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          to="/characters"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: "99px",
            background: "linear-gradient(135deg, #FBBF24 0%, #34D399 50%, #38BDF8 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 4s linear infinite",
            color: "#08040F",
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(52,211,153,0.40)",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px) scale(1.02)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 36px rgba(52,211,153,0.60)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(52,211,153,0.40)";
          }}
        >
          View Full Character Profiles →
        </Link>
      </div>
    </div>
  </section>
);

export default CharactersGrid;
