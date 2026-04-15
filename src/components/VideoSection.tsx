import { Play } from "lucide-react";

const videos = [
  {
    id: "dQw4w9WgXcQ",
    title: "The Bhagavad Gita — A Visual Journey",
    duration: "12:34",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Why Karna is the Real Hero",
    duration: "18:22",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Krishna's 5 Life-Changing Lessons",
    duration: "15:08",
  },
];

const VideoSection = () => {
  return (
    <section id="videos" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-label">Watch</span>
          <h2 className="section-title">Video Stories</h2>
          <p className="section-subtitle">
            Cinematic storytelling of the greatest epic
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video, i) => (
            <div key={i} className="group glass-card overflow-hidden hover-lift cursor-pointer">
              <div className="relative aspect-video bg-secondary overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play size={20} className="text-primary-foreground ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-background/80 text-foreground text-[11px] backdrop-blur-sm font-medium">
                  {video.duration}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-sm lg:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
