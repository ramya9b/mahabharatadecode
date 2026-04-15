import { Link } from "react-router-dom";
import krishnaImg from "@/assets/krishna.jpg";
import karnaImg from "@/assets/karna.jpg";
import arjunaImg from "@/assets/arjuna.jpg";

const stories = [
  {
    image: karnaImg,
    title: "Karna: The Man Who Chose Honour Over Everything",
    description:
      "He was offered the world — and turned it down. The most devastating story about loyalty in the entire epic.",
    tag: "Characters",
    slug: "karna-loyalty-vs-self-respect",
  },
  {
    image: krishnaImg,
    title: "Krishna: The Leader Who Never Needed the Throne",
    description:
      "He had ten million warriors and chose not to use them. The leadership secrets no business school teaches.",
    tag: "Life Lessons",
    slug: "krishna-leadership-secrets",
  },
  {
    image: arjunaImg,
    title: "Arjuna's Confusion: Why the Greatest Warrior Broke First",
    description:
      "On the most important day of his life, he put down his bow. And in that breakdown, the Bhagavad Gita was born.",
    tag: "Life Lessons",
    slug: "arjuna-confusion-moment-of-doubt",
  },
];

const FeaturedStories = () => {
  return (
    <section id="stories" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-label">Featured</span>
          <h2 className="section-title">Epic Narratives</h2>
          <p className="section-subtitle">
            Explore the stories that have shaped civilizations for millennia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {stories.map((story, i) => (
            <Link
              key={i}
              to={`/blog/${story.slug}`}
              className="group glass-card overflow-hidden hover-lift cursor-pointer block"
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  width={512}
                  height={640}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-[11px] tracking-wider backdrop-blur-sm border border-primary/15">
                  {story.tag}
                </span>
              </div>
              <div className="p-6 pt-5">
                <h3 className="font-heading text-lg mb-2.5 text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                  {story.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {story.description}
                </p>
                <span className="inline-block mt-4 text-primary text-[12px] tracking-wide font-medium group-hover:tracking-wider transition-all duration-300">
                  Read Story →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/blog"
            className="px-10 py-3.5 rounded-full glass-card text-foreground text-sm font-medium tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            View All Stories →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
