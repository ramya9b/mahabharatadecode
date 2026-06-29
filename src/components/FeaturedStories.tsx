import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import krishnaImg from "@/assets/krishna.webp";
import karnaImg   from "@/assets/karna.webp";
import arjunaImg  from "@/assets/arjuna.webp";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STORY_META = [
  { id: "karna",   image: karnaImg,   tagKey: "home.featured.tag_characters",   slug: "karna-loyalty-vs-self-respect",    accent: "#D4AF37" },
  { id: "krishna", image: krishnaImg, tagKey: "home.featured.tag_life_lessons", slug: "krishna-leadership-secrets",       accent: "#4A90D9" },
  { id: "arjuna",  image: arjunaImg,  tagKey: "home.featured.tag_life_lessons", slug: "arjuna-confusion-moment-of-doubt", accent: "#27AE60" },
] as const;

const FeaturedStories = () => {
  const { t } = useTranslation();
  const headRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const stories = STORY_META.map(s => ({
    ...s,
    title:       t(`home.featured.${s.id}_title`),
    description: t(`home.featured.${s.id}_desc`),
    tag:         t(s.tagKey),
  }));

  return (
    <section id="stories" className="section-padding">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headRef} className="reveal-element section-header">
          <span className="section-label">{t("home.featured.eyebrow")}</span>
          <h2 className="section-title">{t("home.featured.title")}</h2>
          <div className="gold-divider mt-5 mb-5" aria-hidden="true" />
          <p className="section-subtitle" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", lineHeight: 1.75 }}>
            {t("home.featured.subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/blog/${story.slug}`}
              className="group glass-card overflow-hidden premium-card cursor-pointer block"
              style={{ borderRadius: "16px" }}
            >
              {/* Image */}
              <div className="relative h-80 md:h-96 overflow-hidden cinematic-frame">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  width={512}
                  height={640}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "center 15%" }}
                />
                {/* Cinematic gradient */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(8,6,20,0.85) 0%, rgba(8,6,20,0.2) 50%, transparent 100%)" }}
                />
                {/* Tag badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="font-heading text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{
                      background: `rgba(${story.accent === "#D4AF37" ? "212,175,55" : story.accent === "#4A90D9" ? "74,144,217" : "39,174,96"},0.2)`,
                      border: `1px solid ${story.accent}55`,
                      color: story.accent,
                    }}
                  >
                    {story.tag}
                  </span>
                </div>
                {/* Gold accent line on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(to right, ${story.accent}, transparent)` }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="font-heading font-semibold leading-snug mb-3 group-hover:text-primary transition-colors duration-300"
                  style={{ fontSize: "clamp(16px, 1.8vw, 18px)" }}
                >
                  {story.title}
                </h3>
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                  }}
                >
                  {story.description}
                </p>
                <div
                  className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  <span className="font-heading text-[11px] tracking-[0.15em] uppercase">{t("home.featured.read_story")}</span>
                  <span style={{ fontSize: "12px" }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
