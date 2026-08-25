import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const VideoSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [playing, setPlaying] = useState(false);

  const video = {
    id:       "bwswZT0IhjM",
    title:    "Karna: The Man Who Chose Honour Over Everything",
    subtitle: "He knew exactly what he was giving up. He gave it away anyway.",
    url:      "https://youtu.be/bwswZT0IhjM",
    embed:    "https://www.youtube.com/embed/bwswZT0IhjM?rel=0&modestbranding=1&color=white",
  };

  return (
    <section style={{
      padding: "60px 24px",
      background: isDark
        ? "linear-gradient(180deg,#130717 0%,#140919 100%)"
        : "linear-gradient(180deg,hsl(38 52% 91%) 0%,hsl(38 48% 88%) 100%)",
    }}>
      {/* Rainbow top bar */}
      <div style={{ height:"2px", background:"linear-gradient(90deg,#6B2D8F,#E4C04A,#6B2D8F,#38BDF8,#A78BFA,#F472B6)", marginBottom:"48px" }} />

      <div style={{ maxWidth:"900px", margin:"0 auto" }}>

        {/* Section label */}
        <p style={{
          textAlign:"center", fontSize:"11px", letterSpacing:"0.3em",
          color: isDark ? "rgba(107,45,143,0.55)" : "rgba(146,64,14,0.6)",
          marginBottom:"12px", textTransform:"uppercase",
          fontFamily:"'Cinzel',serif",
        }}>MahabharataDecoded Presents</p>

        {/* Title */}
        <h2 style={{
          textAlign:"center", fontFamily:"'Cinzel',serif",
          fontSize:"clamp(1.4rem,4vw,2.2rem)", fontWeight:700,
          color: isDark ? "#F5E8EE" : "#2A1506",
          marginBottom:"10px", lineHeight:1.3,
        }}>{video.title}</h2>

        {/* Subtitle */}
        <p style={{
          textAlign:"center", fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(1rem,2.5vw,1.15rem)", fontStyle:"italic",
          color: isDark ? "rgba(245,232,238,0.65)" : "rgba(42,31,14,0.65)",
          marginBottom:"36px",
        }}>{video.subtitle}</p>

        {/* Video embed */}
        <div style={{
          position:"relative", paddingBottom:"56.25%", height:0,
          borderRadius:"16px", overflow:"hidden",
          boxShadow: isDark
            ? "0 8px 48px rgba(107,45,143,0.15), 0 2px 8px rgba(0,0,0,0.6)"
            : "0 8px 48px rgba(0,0,0,0.15)",
          border: isDark ? "1px solid rgba(107,45,143,0.18)" : "1px solid rgba(107,45,143,0.2)",
        }}>
          {playing ? (
            <iframe
              src={video.embed + "&autoplay=1"}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position:"absolute", top:0, left:0,
                width:"100%", height:"100%", border:"none",
              }}
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${video.title}`}
              style={{
                position:"absolute", top:0, left:0,
                width:"100%", height:"100%", border:"none", padding:0,
                cursor:"pointer", background:"#000",
                backgroundImage:`url(https://i.ytimg.com/vi/${video.id}/hqdefault.jpg)`,
                backgroundSize:"cover", backgroundPosition:"center",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}
            >
              <span style={{
                width:"68px", height:"48px", borderRadius:"14px",
                background:"rgba(212,32,32,0.92)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
              }}>
                <span style={{
                  width:0, height:0,
                  borderTop:"11px solid transparent",
                  borderBottom:"11px solid transparent",
                  borderLeft:"18px solid #fff",
                  marginLeft:"4px",
                }} />
              </span>
            </button>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:"32px" }}>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"12px 28px", borderRadius:"99px",
              background:"linear-gradient(135deg,#6B2D8F,#6B2D8F,#38BDF8)",
              color:"#08040F", fontFamily:"'Cinzel',serif",
              fontSize:"13px", fontWeight:700, letterSpacing:"0.1em",
              textDecoration:"none",
              boxShadow:"0 4px 20px rgba(107,45,143,0.35)",
            }}
          >
            ▶ Watch on YouTube
          </a>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;
