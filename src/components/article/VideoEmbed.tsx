import { useState } from "react";
import { Play } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface VideoEmbedProps {
  youtubeId: string;
  title: string;
}

const VideoEmbed = ({ youtubeId, title }: VideoEmbedProps) => {
  const [playing, setPlaying] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>();

  const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <section
      ref={ref}
      className="reveal-element py-20 md:py-24"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(11,15,26,0.6) 50%, transparent 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-label">Watch the Story</span>
          <h2
            className="font-heading font-bold text-foreground mt-2"
            style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
          >
            Watch the Story Explained
          </h2>
          <p className="text-muted-foreground mt-3" style={{ fontSize: "17px" }}>
            A visual journey through Karna's life, choices, and legacy
          </p>
        </div>

        {/* Video container */}
        <div
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
          style={{
            border: "1px solid rgba(34,197,94,0.15)",
            boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          }}
          onClick={() => setPlaying(true)}
        >
          {!playing ? (
            <>
              {/* Thumbnail */}
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <img
                  src={thumbUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,15,26,0.7) 0%, rgba(11,15,26,0.2) 60%, rgba(11,15,26,0.1) 100%)",
                  }}
                />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{
                      width: "72px",
                      height: "72px",
                      background: "rgba(34,197,94,0.92)",
                      boxShadow: "0 0 30px rgba(34,197,94,0.4), 0 0 0 1px rgba(34,197,94,0.3)",
                    }}
                  >
                    <Play
                      size={28}
                      className="ml-1.5"
                      style={{ color: "#0B0F1A", fill: "#0B0F1A" }}
                    />
                  </div>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p
                    className="text-foreground font-heading text-sm tracking-wide"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {title}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div style={{ paddingBottom: "56.25%", position: "relative" }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoEmbed;
