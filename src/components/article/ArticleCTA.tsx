import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, BookOpen } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ArticleCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      ref={ref}
      className="reveal-element py-20 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,18,30,0.95) 0%, rgba(20,14,8,0.98) 50%, rgba(15,18,30,0.95) 100%)",
            border: "1px solid rgba(212,175,55,0.15)",
            boxShadow:
              "0 0 80px rgba(212,175,55,0.04), 0 30px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.45), transparent)",
            }}
          />

          {/* Background radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,175,55,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 px-8 md:px-14 py-12 md:py-14">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Subscribe */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(212,175,55,0.1)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    <Mail size={15} className="text-primary" />
                  </div>
                  <span className="section-label !mb-0">Daily Wisdom</span>
                </div>

                <h3
                  className="font-heading font-bold text-foreground mb-3"
                  style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
                >
                  Get Daily Wisdom
                  <span className="gold-text block">Delivered Free</span>
                </h3>

                <p
                  className="text-muted-foreground leading-relaxed mb-6"
                  style={{ fontSize: "17px" }}
                >
                  One timeless insight from the Mahabharata in your inbox every morning.
                  Ancient knowledge for the modern mind. Join 12,000+ readers.
                </p>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <div
                      className="flex-1 flex items-center gap-2.5 rounded-full px-4 py-3"
                      style={{
                        background: "rgba(139,105,20,0.06)",
                        border: "1px solid rgba(139,105,20,0.12)",
                      }}
                    >
                      <Mail size={13} className="text-muted-foreground flex-shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                        style={{ fontFamily: "'Lora', Georgia, serif" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full text-primary-foreground text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #E8C547, #D4AF37, #B8922A)",
                        fontFamily: "'Playfair Display', 'Cinzel', serif",
                        boxShadow: "0 0 20px rgba(212,175,55,0.3)",
                      }}
                    >
                      Subscribe
                    </button>
                  </form>
                ) : (
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 rounded-full"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    <span className="text-primary">✦</span>
                    <p className="text-foreground/80 text-sm">
                      You're in. First wisdom arrives tomorrow morning.
                    </p>
                  </div>
                )}

                <p className="text-muted-foreground/40 text-xs mt-4 tracking-wide">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:flex items-center justify-center">
                <div
                  className="h-32 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(212,175,55,0.2), transparent)",
                  }}
                />
              </div>

              {/* Read More */}
              <div className="md:col-start-2 md:row-start-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(139,0,0,0.15)",
                      border: "1px solid rgba(139,0,0,0.25)",
                    }}
                  >
                    <BookOpen size={15} className="text-red-400" />
                  </div>
                  <span
                    className="text-[11px] tracking-[0.3em] uppercase text-red-400/70"
                    style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
                  >
                    Continue Reading
                  </span>
                </div>

                <h3
                  className="font-heading font-bold text-foreground mb-3"
                  style={{ fontSize: "clamp(22px, 2.5vw, 28px)" }}
                >
                  Explore More{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #E8C547 0%, #D4AF37 45%, #B8922A 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Epic Stories
                  </span>
                </h3>

                <p
                  className="text-muted-foreground leading-relaxed mb-7"
                  style={{ fontSize: "17px" }}
                >
                  Eight deep articles on the Mahabharata's greatest characters, most
                  powerful slokas, and most transformative life lessons.
                </p>

                <Link
                  to="/blog"
                  className="inline-flex items-center gap-3 group"
                >
                  <span
                    className="px-7 py-3.5 rounded-full text-foreground text-sm font-medium tracking-wide transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary"
                    style={{
                      background: "rgba(139,105,20,0.06)",
                      border: "1px solid rgba(139,105,20,0.12)",
                      fontFamily: "'Playfair Display', 'Cinzel', serif",
                    }}
                  >
                    Read More Stories
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleCTA;
