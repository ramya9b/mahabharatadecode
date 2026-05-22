import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Heart, Lightbulb, Users, Mail,
  ArrowRight, Quote, Star, Layers, Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import { useSEO } from "@/hooks/useSEO";
import karnaImg from "@/assets/karna.jpg";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — HERO
───────────────────────────────────────────────────────── */
const AboutHero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax bg */}
      <div ref={bgRef} className="absolute will-change-transform" style={{ inset: "-15% 0", height: "130%" }}>
        <img
        loading="eager"
        fetchPriority="high"
        decoding="async" src={heroBg} alt="Kurukshetra" className="w-full h-full object-cover" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,6,26,0.55) 0%, rgba(8,6,26,0.75) 50%, rgba(8,6,26,1) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />

      {/* Particles */}
      <div className="particles absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="particle bg-primary/20" style={{
            width: Math.random() * 2 + 1 + "px", height: Math.random() * 2 + 1 + "px",
            left: Math.random() * 100 + "%", bottom: "-6px",
            "--duration": Math.random() * 10 + 8 + "s", "--delay": Math.random() * 7 + "s",
          } as React.CSSProperties} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-28 pb-20">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.35em] uppercase font-heading mb-10 animate-fade-up backdrop-blur-sm">
          <Star size={10} />
          Our Mission
        </div>

        {/* Manifesto headline */}
        <h1 className="font-heading font-black leading-[0.95] mb-10 animate-fade-up-delay-1" style={{ fontSize: "clamp(52px, 9vw, 108px)" }}>
          <span className="gold-text block">Ancient Wisdom.</span>
          <span style={{ color: "rgba(42,31,14,0.9)", fontSize: "0.78em", display: "block", marginTop: "8px" }}>Modern Life.</span>
        </h1>

        {/* Manifesto body */}
        <p
          className="animate-fade-up-delay-2 leading-relaxed mx-auto mb-12"
          style={{
            fontSize: "clamp(18px, 2.2vw, 22px)",
            color: "rgba(42,31,14,0.65)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            maxWidth: "600px",
            lineHeight: 1.8,
          }}
        >
          The Mahabharata was written 5,000 years ago. It is more relevant today
          than anything published this year. This site exists to prove that.
        </p>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-4 animate-fade-up-delay-2">
          <div className="h-px w-12 bg-primary/30" />
          <span className="text-primary/40 text-[11px] tracking-[0.4em] uppercase font-heading">MahabharataDecoded</span>
          <div className="h-px w-12 bg-primary/30" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 2 — MISSION STATEMENT (large editorial type)
───────────────────────────────────────────────────────── */
const MissionSection = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="py-24 md:py-32" style={{ background: "hsl(38 55% 91%)" }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div ref={ref} className="reveal-element">
          {/* Label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-10 bg-primary/40" />
            <span className="section-label !mb-0">Why We Exist</span>
          </div>

          {/* Large mission text */}
          <div className="space-y-6">
            {[
              "The Bhagavad Gita was spoken on a battlefield to a man who had run out of answers. Every one of its 700 verses was born not from certainty — but from crisis.",
              "That is not ancient history. That is Monday morning.",
              "MahabharataDecoded exists for everyone who has ever frozen when it mattered most, stayed loyal past the point of wisdom, or asked themselves whether the victory they're pursuing is worth what it will cost.",
              "We translate the world's greatest epic into the language of modern decisions.",
            ].map((para, i) => (
              <p
                key={i}
                className="leading-relaxed"
                style={{
                  fontSize: i === 1
                    ? "clamp(26px, 3.5vw, 40px)"
                    : "clamp(18px, 2.2vw, 22px)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: i === 1
                    ? "rgba(212,175,55,0.9)"
                    : "rgba(42,31,14,0.75)",
                  fontStyle: i === 1 ? "italic" : "normal",
                  fontWeight: i === 1 ? 500 : 400,
                  lineHeight: 1.855,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 3 — ANIMATED STATS
───────────────────────────────────────────────────────── */
const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = 0;
          const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const StatCard = ({ value, suffix = "", label, desc }: { value: number; suffix?: string; label: string; desc: string }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <div className="font-heading font-black leading-none mb-2" style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
        <span
          ref={ref}
          style={{
            background: "linear-gradient(135deg, #E8C547 0%, #D4AF37 50%, #B8922A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {count.toLocaleString()}
        </span>
        <span className="gold-text">{suffix}</span>
      </div>
      <p className="font-heading text-foreground text-sm tracking-[0.12em] uppercase mb-1">{label}</p>
      <p className="text-muted-foreground text-[13px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{desc}</p>
    </div>
  );
};

const StatsSection = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="py-20 md:py-24" style={{ background: "linear-gradient(180deg, hsl(38 55% 91%), hsl(38 45% 87%))", borderTop: "1px solid rgba(212,175,55,0.08)", borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div ref={ref} className="reveal-element grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          <StatCard value={8}    suffix="+"  label="Deep Articles"      desc="Each 6–10 min read" />
          <StatCard value={5}    suffix=""   label="Character Profiles"  desc="With full image & stats" />
          <StatCard value={12}   suffix="K+" label="Readers"            desc="And growing daily" />
          <StatCard value={18}   suffix=""   label="Parvas Decoded"      desc="The complete epic" />
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 4 — ORIGIN STORY
───────────────────────────────────────────────────────── */
const OriginSection = () => {
  const imgRef = useScrollReveal<HTMLDivElement>();
  const textRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32" style={{ background: "hsl(38 35% 88%)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image side */}
          <div ref={imgRef} className="reveal-element">
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.12)" }}>
              <img
        loading="eager"
        fetchPriority="high"
        decoding="async" src={karnaImg} alt="Karna — the character that started it all" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,6,26,0.9) 0%, rgba(8,6,26,0.2) 50%, transparent 80%)" }} />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-heading text-[10px] tracking-[0.3em] uppercase text-primary/50 mb-2">The character that started everything</p>
                <p className="font-heading text-xl text-foreground mb-1">Karna</p>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                  "The greatest warrior no one talks about enough."
                </p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div ref={textRef} className="reveal-element" style={{ transitionDelay: "120ms" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-primary/40" />
              <span className="section-label !mb-0">The Origin Story</span>
            </div>

            <h2 className="font-heading font-bold leading-tight mb-8" style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}>
              It Started With{" "}
              <span className="gold-text">One Question</span>
            </h2>

            <div className="space-y-5">
              {[
                "Not an ancient question. A very modern one: How do you stay loyal when loyalty conflicts with truth?",
                "It was Karna who forced that question into focus. Here was a man who knew he was on the wrong side of history — and chose to stay anyway. Not out of ignorance. Not out of cowardice. Out of a principle so deeply held it had become indistinguishable from identity.",
                "That story felt more alive than anything in the news cycle. More useful than any productivity framework or leadership book. And I couldn't stop asking: why doesn't anyone talk about this?",
                "MahabharataDecoded is the answer to that question. Every article is an attempt to do for one Mahabharata story what that story once did for me — make it impossible to ignore.",
              ].map((para, i) => (
                <p
                  key={i}
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: i === 0 ? "rgba(42,31,14,0.92)" : "rgba(42,31,14,0.7)",
                    fontWeight: i === 0 ? 500 : 400,
                    fontStyle: i === 0 ? "italic" : "normal",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Decorative rule */}
            <div className="flex items-center gap-3 mt-8">
              <div className="h-px w-8 bg-primary/20" />
              <span className="text-primary/35 text-[10px] tracking-[0.35em] uppercase font-heading">Founded 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 5 — THREE PILLARS
───────────────────────────────────────────────────────── */
const pillars = [
  {
    icon: Heart,
    title: "Story-First",
    accent: "212,175,55",
    hex: "#D4AF37",
    body: "We don't summarise the Mahabharata. We tell stories from it — with the same weight and care that Vyasa intended. Every article is structured to be an experience, not a briefing.",
    detail: "Introduction → Background → Turning Point → Key Lessons → Modern Parallels",
  },
  {
    icon: Compass,
    title: "Ancient Root, Modern Branch",
    accent: "74,144,217",
    hex: "#4A90D9",
    body: "Karna's loyalty crisis lives in every boardroom. Arjuna's paralysis lives in every major life decision. Every article maps the ancient story to your career, your relationships, your choices.",
    detail: "Career · Relationships · Personal Growth",
  },
  {
    icon: Layers,
    title: "Depth Over Volume",
    accent: "76,175,80",
    hex: "#4CAF50",
    body: "We will never publish eighty shallow articles to rank on Google. We publish eight articles that say something true — with full research, emotional honesty, and modern psychological insight.",
    detail: "8 articles, each 1,500–3,000 words",
  },
];

const PillarsSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggeredReveal(3);

  return (
    <section className="py-24 md:py-28" style={{ background: "linear-gradient(180deg, hsl(38 45% 87%), hsl(38 55% 91%))" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div ref={headerRef} className="reveal-element text-center mb-16">
          <span className="section-label">Our Approach</span>
          <h2 className="section-title">Three Principles.<br /><span className="gold-text">No Compromises.</span></h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, accent, hex, body, detail }) => (
            <div
              key={title}
              className="reveal-element glass-card rounded-2xl p-7 md:p-8 hover-lift relative overflow-hidden group"
              style={{ borderColor: `rgba(${accent},0.15)` }}
            >
              {/* Top shimmer on hover */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, transparent, rgba(${accent},0.5), transparent)` }} />
              {/* Background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(${accent},0.06), transparent 70%)` }} />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `rgba(${accent},0.12)`, border: `1px solid rgba(${accent},0.2)` }}>
                  <Icon size={22} style={{ color: hex }} />
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-foreground text-xl mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>

                {/* Body */}
                <p className="text-muted-foreground leading-relaxed mb-5" style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {body}
                </p>

                {/* Detail tag */}
                <div className="inline-block px-3 py-1.5 rounded-full text-[11px] font-heading tracking-[0.12em] uppercase"
                  style={{ background: `rgba(${accent},0.1)`, border: `1px solid rgba(${accent},0.2)`, color: hex }}>
                  {detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 6 — THE PROCESS (how each article is crafted)
───────────────────────────────────────────────────────── */
const steps = [
  { num: "01", icon: BookOpen,   title: "Source the Story",       body: "We go back to the original Sanskrit parva and study the full scene — not just the famous version, but the uncomfortable details that popular retellings omit." },
  { num: "02", icon: Heart,      title: "Find the Human Moment",  body: "Every great story has one scene where everything changes. We find it, sit with it, and ask: why does this still make us feel something 5,000 years later?" },
  { num: "03", icon: Lightbulb,  title: "Extract the Turning Point", body: "The Mahabharata works because every character faces an impossible choice. We name that choice exactly, so the reader can hold it clearly." },
  { num: "04", icon: Compass,    title: "Bridge to Modern Life",  body: "We identify three specific modern scenarios where the ancient lesson lives — in careers, relationships, and personal identity — and write them as real situations." },
  { num: "05", icon: Star,       title: "Distil the Lesson",      body: "We end with something you can carry. Not a platitude. A specific, uncomfortable, honest truth that you'll still be thinking about a week from now." },
];

const ProcessSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const stepsRef = useStaggeredReveal(5);

  return (
    <section className="py-24 md:py-28" style={{ background: "hsl(38 55% 91%)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <div ref={headerRef} className="reveal-element mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-10 bg-primary/40" />
            <span className="section-label !mb-0">How We Work</span>
          </div>
          <h2 className="section-title max-w-xl">
            How Every Article<br />
            <span className="gold-text">Gets Made</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed max-w-lg" style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Each piece goes through five stages before it's published — a process
            designed to produce depth, not volume.
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Connecting line */}
          <div className="absolute left-[22px] top-10 bottom-10 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.3), rgba(212,175,55,0.05))" }} />

          <div className="space-y-6">
            {steps.map(({ num, icon: Icon, title, body }) => (
              <div key={num} className="reveal-element flex gap-6 md:gap-8 group">
                {/* Step circle */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    boxShadow: "0 0 0 0 rgba(212,175,55,0)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(212,175,55,0)")}
                >
                  <Icon size={16} className="text-primary" />
                </div>

                {/* Content */}
                <div className="pb-6 border-b border-border/30 flex-1 group-last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-heading text-[10px] tracking-[0.3em] text-primary/40">{num}</span>
                    <h3 className="font-heading font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-300">{title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 7 — PHILOSOPHY PULL QUOTE (full-width)
───────────────────────────────────────────────────────── */
const PhilosophySection = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(38 55% 91%), hsl(38 45% 87%))" }}>
      {/* Large decorative quote mark */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-heading select-none pointer-events-none"
        style={{ fontSize: "240px", lineHeight: 1, color: "rgba(212,175,55,0.04)" }}>
        "
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,0,0,0.06), transparent 70%)" }} />

      <div ref={ref} className="reveal-element relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12 bg-primary/30" />
          <Quote size={16} className="text-primary/50" />
          <div className="h-px w-12 bg-primary/30" />
        </div>

        {/* Sanskrit */}
        <p className="font-heading mb-4" style={{ fontSize: "clamp(18px, 2.5vw, 26px)", color: "rgba(212,175,55,0.8)", lineHeight: 1.85, letterSpacing: "0.06em" }}>
          यदा यदा हि धर्मस्य ग्लानिर्भवति भारत
        </p>
        <p className="text-muted-foreground italic mb-10" style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.04em" }}>
          Yada yada hi dharmasya glanir bhavati bharata
        </p>

        {/* Translation */}
        <p className="font-heading italic font-semibold leading-relaxed mb-4"
          style={{ fontSize: "clamp(22px, 3vw, 34px)", color: "rgba(42,31,14,0.9)" }}>
          "Whenever there is a decline in righteousness and a rise in unrighteousness —
          at that time, I manifest myself on earth."
        </p>
        <p className="font-heading text-[11px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,0.4)" }}>
          — Bhagavad Gita 4.7
        </p>

        {/* Site's interpretation */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="h-px w-16 mx-auto mb-8" style={{ background: "rgba(212,175,55,0.2)" }} />
          <p className="leading-relaxed" style={{ fontSize: "clamp(17px, 2vw, 20px)", color: "rgba(42,31,14,0.6)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
            This is our operating principle. Every time a person faces a real choice —
            in their career, their relationships, their identity — and feels unequipped to
            make it: that is the moment the Mahabharata was written for.
            That is the moment we show up.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 8 — VALUES GRID
───────────────────────────────────────────────────────── */
const values = [
  { title: "Honesty over Comfort",       body: "The Mahabharata doesn't give easy answers. Neither do we. We'll tell you when the hero was also wrong." },
  { title: "Complexity over Simplicity", body: "Real life is complicated. We resist reducing 5,000-year-old wisdom to a listicle." },
  { title: "Story over Information",     body: "Facts are forgotten. Experiences are carried. Every article is built to be an experience." },
  { title: "Depth over Frequency",       body: "We'd rather publish one thing that matters than ten things that fill a slot." },
  { title: "Modern over Nostalgic",      body: "We are not preservationists. We are translators. The Mahabharata is alive, not archived." },
  { title: "Human over Algorithmic",     body: "Every word here is written by a person, for a person. No AI-generated content. Ever." },
];

const ValuesSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useStaggeredReveal(6);

  return (
    <section className="py-24 md:py-28" style={{ background: "hsl(38 35% 88%)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div ref={headerRef} className="reveal-element text-center mb-16">
          <span className="section-label">What We Stand For</span>
          <h2 className="section-title">Six <span className="gold-text">Non-Negotiables</span></h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map(({ title, body }, i) => (
            <div key={title} className="reveal-element glass-card rounded-xl p-6 hover-lift group relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.6), rgba(212,175,55,0.1))" }} />
              <div className="flex items-start gap-3 mb-3">
                <span className="font-heading text-[10px] tracking-[0.25em] text-primary/35 mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300" style={{ fontSize: "17px" }}>
                  {title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-7" style={{ fontSize: "14px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 9 — CREATOR / AUTHOR
───────────────────────────────────────────────────────── */
const CreatorSection = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-28" style={{ background: "hsl(38 55% 91%)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <div ref={ref} className="reveal-element">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-10 bg-primary/40" />
            <span className="section-label !mb-0">The Person Behind This</span>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center lg:items-start gap-5">
              {/* Monogram circle */}
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                  border: "1px solid rgba(212,175,55,0.25)",
                  boxShadow: "0 0 40px rgba(212,175,55,0.1)",
                }}
              >
                {/* Rotating ring */}
                <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 30s linear infinite" }} viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
                </svg>
                <span className="font-heading font-black text-3xl gold-text">M</span>
              </div>

              {/* Meta */}
              <div className="text-center lg:text-left">
                <p className="font-heading font-bold text-foreground text-xl mb-1">MahabharataDecoded</p>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                  Founded 2026
                </p>
              </div>

              {/* Social links */}
              <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                {["Twitter / X", "Instagram", "YouTube"].map((s) => (
                  <span key={s} className="glass-card px-3 py-1.5 rounded-full text-[11px] font-heading tracking-[0.1em] text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="space-y-5">
              {[
                "This site is written by one person who read the Mahabharata at a moment when modern life had run out of useful answers. Not a Sanskrit scholar. Not a mythology professor. A person who discovered that every question I had about loyalty, identity, leadership, and loss had already been asked — and answered, with more honesty than anything else I'd read — in a 5,000-year-old epic.",
                "I'm not interested in the Mahabharata as a cultural artefact. I'm interested in it as a tool. The most precise, most honest, most psychologically sophisticated tool for understanding human decision-making that I've ever encountered.",
                "Everything on this site is an attempt to be worthy of the source material. That means no easy lessons. No reductive summaries. No 'ten life hacks from the Gita'. Only honest engagement with what these stories actually say — and why it still matters.",
                "If something on this site has made you think differently about a decision you're facing, then it worked.",
              ].map((para, i) => (
                <p key={i} className="leading-relaxed"
                  style={{
                    fontSize: "clamp(17px, 1.9vw, 19px)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: i === 0 ? "rgba(42,31,14,0.8)" : "rgba(42,31,14,0.62)",
                  }}>
                  {para}
                </p>
              ))}

              {/* Signature */}
              <div className="pt-4">
                <div className="h-px w-12 bg-primary/20 mb-5" />
                <p className="font-heading text-primary/70 text-sm tracking-[0.15em]">— The Author</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION 10 — CTA
───────────────────────────────────────────────────────── */
const AboutCTA = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="py-24 md:py-28 relative overflow-hidden text-center"
      style={{ background: "linear-gradient(180deg, hsl(38 45% 87%), hsl(38 55% 91%))" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.06), transparent 65%)" }} />

      <div ref={ref} className="reveal-element relative z-10 max-w-2xl mx-auto px-6">
        <span className="section-label block mb-4">Start Here</span>
        <h2 className="font-heading font-bold mb-5 leading-tight" style={{ fontSize: "clamp(30px, 4vw, 48px)" }}>
          Ready to Decode<br /><span className="gold-text">the Epic?</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-10 mx-auto" style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif", maxWidth: "420px" }}>
          Start with the articles. Explore the characters.
          And subscribe for one piece of ancient wisdom delivered every morning.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-heading text-[13px] font-bold tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow group">
            Read the Stories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/characters" className="px-8 py-3.5 rounded-full glass-card font-heading text-[13px] tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300">
            Meet the Characters →
          </Link>
        </div>

        {/* Newsletter */}
        <div className="glass-card rounded-2xl px-8 py-8 max-w-md mx-auto relative overflow-hidden" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }} />
          <Users size={20} className="text-primary mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground mb-1" style={{ fontSize: "17px" }}>Join 12,000+ Readers</p>
          <p className="text-muted-foreground mb-5 text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            One ancient insight in your inbox. Every morning. Free forever.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 glass-card px-4 py-2.5 rounded-full">
              <Mail size={13} className="text-muted-foreground flex-shrink-0" />
              <input type="email" placeholder="Your email address" className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full" />
            </div>
            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-heading font-bold tracking-wide hover:bg-gold-light transition-colors flex-shrink-0">
              Subscribe
            </button>
          </div>
          <p className="text-muted-foreground/40 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const About = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  useSEO({
    title: "About",
    description: "Ancient wisdom for modern life. Learn why MahabharataDecoded was built, our mission, and how every article is crafted.",
    path: "/about",
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <AboutHero />
      <MissionSection />
      <StatsSection />
      <OriginSection />
      <PillarsSection />
      <ProcessSection />
      <PhilosophySection />
      <ValuesSection />
      <CreatorSection />
      <AboutCTA />
      <Footer />
    </div>
  );
};

export default About;
