import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharactersHero from "@/components/characters/CharactersHero";
import CharacterProfile from "@/components/characters/CharacterProfile";
import CharacterNav from "@/components/characters/CharacterNav";
import CharacterComparison from "@/components/characters/CharacterComparison";
import { characters } from "@/data/characters";
import { useSEO } from "@/hooks/useSEO";

const Characters = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Sticky right-side character dot navigation */}
      <CharacterNav characters={characters} />

      {/* ── 1. Cinematic Hero ── */}
      <CharactersHero characters={characters} />

      {/* ── 2. Individual Character Profiles (alternating layout) ── */}
      {characters.map((character, index) => (
        <CharacterProfile
          key={character.id}
          character={character}
          index={index}
        />
      ))}

      {/* ── 3. Comparison table ── */}
      <CharacterComparison characters={characters} />

      {/* ── 4. CTA section ── */}
      <CharactersCTA />

      <Footer />
    </div>
  );
};

/* ── Inline CTA section ── */
const CharactersCTA = () => (
  <section
    className="relative py-24 overflow-hidden text-center"
    style={{
      background:
        "linear-gradient(180deg, hsl(38 55% 91%), hsl(38 50% 89%))",
    }}
  >
    {/* Ambient glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,0,0,0.08) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)",
      }}
    />

    <div className="relative z-10 max-w-3xl mx-auto px-6">
      <span className="section-label block mb-4">Keep Exploring</span>
      <h2
        className="font-heading font-bold mb-6 leading-tight"
        style={{ fontSize: "clamp(30px, 4vw, 50px)" }}
      >
        Every Character Has a{" "}
        <span className="gold-text">Full Story</span>
      </h2>
      <p
        className="leading-relaxed mb-10 mx-auto"
        style={{
          fontSize: "17px",
          color: "rgba(42,31,14,0.6)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          maxWidth: "520px",
        }}
      >
        Each profile above is just the beginning. Read the full deep-dive
        articles — with life lessons, modern parallels, and sacred verses.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
        <Link
          to="/blog"
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow"
        >
          Read All Stories
        </Link>
        <Link
          to="/blog?category=Characters"
          className="px-8 py-3.5 rounded-full glass-card font-heading text-sm tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
        >
          Characters Only →
        </Link>
      </div>

      {/* Mini newsletter */}
      <div
        className="glass-card rounded-2xl px-8 py-8 max-w-md mx-auto relative overflow-hidden"
        style={{ borderColor: "rgba(212,175,55,0.15)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
          }}
        />
        <span className="text-primary text-lg block mb-3">✦</span>
        <p
          className="font-heading font-semibold text-foreground mb-2"
          style={{ fontSize: "17px" }}
        >
          Get Daily Character Wisdom
        </p>
        <p
          className="mb-5"
          style={{
            fontSize: "14px",
            color: "rgba(42,31,14,0.55)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
        >
          One insight from a Mahabharata character every morning. Free.
        </p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 glass-card px-4 py-2.5 rounded-full">
            <Mail size={13} className="text-muted-foreground flex-shrink-0" />
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold tracking-wide hover:bg-gold-light transition-colors flex-shrink-0">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Characters;
