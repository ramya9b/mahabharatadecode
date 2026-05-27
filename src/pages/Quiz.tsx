import { useReducer, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Check, BookOpen, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSEO } from "@/hooks/useSEO";
import Footer from "@/components/Footer";
import { QUIZ_QUESTIONS, TOTAL_QUESTIONS, CHARACTER_META } from "@/data/quiz";
import { computeQuizResult, scoreBreakdown } from "@/utils/quizScoring";
import { resolveImage } from "@/utils/images";
import type { QuizResult } from "@/data/quiz";

/* ─────────────────────────────────────────────────────────
   STATE MACHINE
───────────────────────────────────────────────────────── */
type Phase = "welcome" | "quiz" | "calculating" | "result";

interface State {
  phase: Phase;
  currentQ: number;
  answers: (number | null)[];
  result: QuizResult | null;
  transitioning: boolean;
  shareSuccess: boolean;
}

type Action =
  | { type: "START" }
  | { type: "SELECT_ANSWER"; questionIndex: number; answerIndex: number }
  | { type: "ADVANCE" }
  | { type: "BACK" }
  | { type: "SHOW_RESULT"; result: QuizResult }
  | { type: "RETAKE" }
  | { type: "SET_TRANSITIONING"; value: boolean }
  | { type: "SET_SHARE_SUCCESS"; value: boolean };

const INITIAL_STATE: State = {
  phase: "welcome",
  currentQ: 0,
  answers: new Array(TOTAL_QUESTIONS).fill(null),
  result: null,
  transitioning: false,
  shareSuccess: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...INITIAL_STATE, phase: "quiz" };

    case "SELECT_ANSWER": {
      if (state.transitioning) return state; // Prevent double-tap
      const newAnswers = [...state.answers];
      newAnswers[action.questionIndex] = action.answerIndex;
      return { ...state, answers: newAnswers, transitioning: true };
    }

    case "ADVANCE": {
      const nextQ = state.currentQ + 1;
      if (nextQ >= TOTAL_QUESTIONS) {
        // All questions answered → go to calculating
        return { ...state, phase: "calculating", transitioning: false };
      }
      return { ...state, currentQ: nextQ, transitioning: false };
    }

    case "BACK": {
      if (state.currentQ === 0) return state;
      return { ...state, currentQ: state.currentQ - 1, transitioning: false };
    }

    case "SHOW_RESULT":
      return { ...state, phase: "result", result: action.result };

    case "RETAKE":
      return { ...INITIAL_STATE };

    case "SET_TRANSITIONING":
      return { ...state, transitioning: action.value };

    case "SET_SHARE_SUCCESS":
      return { ...state, shareSuccess: action.value };

    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────
   WELCOME SCREEN
───────────────────────────────────────────────────────── */
const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
    {/* Background radial glows */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />

    {/* Floating character portrait ring */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Object.entries(CHARACTER_META).map(([id, meta], i) => {
        const angle = (i / 5) * 360;
        const radius = "min(38vw, 300px)";
        return (
          <div
            key={id}
            className="absolute top-1/2 left-1/2 opacity-15"
            style={{
              transform: `rotate(${angle}deg) translateX(${radius}) rotate(-${angle}deg) translate(-50%, -50%)`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ border: `2px solid rgba(${meta.accentRgb},0.4)` }}
            >
              <img
            loading="lazy"
            decoding="async" src={resolveImage(meta.imageKey)} alt={meta.name}
                className="w-full h-full object-cover object-top" />
            </div>
          </div>
        );
      })}
    </div>

    <div className="relative z-10 text-center max-w-2xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary text-[11px] tracking-[0.35em] uppercase font-heading mb-8 animate-fade-up backdrop-blur-sm">
        <Trophy size={10} /> Discover Your Epic Self
      </div>

      {/* Title */}
      <h1 className="font-heading font-black leading-[0.95] mb-6 animate-fade-up-delay-1"
        style={{ fontSize: "clamp(40px, 7vw, 80px)" }}>
        <span className="gold-text block">Which Mahabharata</span>
        <span className="block" style={{ color: "hsl(var(--foreground) / 0.90)", fontSize: "0.72em" }}>
          Character Are You?
        </span>
      </h1>

      {/* Description */}
      <p className="leading-relaxed mx-auto mb-4 animate-fade-up-delay-2"
        style={{
          fontSize: "clamp(17px, 2vw, 20px)", color: "hsl(var(--foreground) / 0.72)",
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", maxWidth: "500px",
        }}>
        8 questions. No right answers. Only honest ones.
      </p>
      <p className="leading-relaxed mx-auto mb-12"
        style={{
          fontSize: "17px", color: "hsl(var(--muted-foreground) / 0.85)",
          fontFamily: "'Cormorant Garamond', Georgia, serif", maxWidth: "420px",
        }}>
        Answer truthfully — not how you want to be seen, but how you actually are.
        The Mahabharata has a mirror for every kind of person.
      </p>

      {/* Character previews */}
      <div className="flex justify-center gap-3 mb-10 animate-fade-up-delay-2 flex-wrap">
        {Object.entries(CHARACTER_META).map(([id, meta]) => (
          <div key={id} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: `2px solid rgba(${meta.accentRgb},0.35)` }}>
              <img
            loading="lazy"
            decoding="async" src={resolveImage(meta.imageKey)} alt={meta.name} className="w-full h-full object-cover object-top" />
            </div>
            <span className="font-heading text-[9px] tracking-[0.12em] uppercase" style={{ color: `rgba(${meta.accentRgb},0.7)` }}>
              {meta.name}
            </span>
          </div>
        ))}
      </div>

      {/* Start CTA */}
      <button onClick={onStart}
        className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm tracking-wide hover:bg-gold-light transition-all duration-300 animate-pulse-glow hover:scale-105"
        style={{ fontFamily: "'Cinzel', serif" }}>
        Begin the Journey →
      </button>

      <p className="text-muted-foreground text-xs mt-4">Takes about 3 minutes</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   QUESTION SCREEN
───────────────────────────────────────────────────────── */
const QuestionScreen = ({
  questionIndex, answers, onSelect, onBack, transitioning,
}: {
  questionIndex: number;
  answers: (number | null)[];
  onSelect: (qi: number, ai: number) => void;
  onBack: () => void;
  transitioning: boolean;
}) => {
  const q = QUIZ_QUESTIONS[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const progress = ((questionIndex) / TOTAL_QUESTIONS) * 100;
  const progressAfter = ((questionIndex + 1) / TOTAL_QUESTIONS) * 100;

  const LETTERS = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-16 px-6">
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} disabled={questionIndex === 0}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-heading text-[11px] tracking-[0.15em] uppercase">Back</span>
          </button>
          <span className="font-heading text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {questionIndex + 1} of {TOTAL_QUESTIONS}
          </span>
          <div className="w-12" /> {/* spacer */}
        </div>

        {/* Bar */}
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(139,105,20,0.1)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${selectedAnswer !== null ? progressAfter : progress}%`,
              background: "linear-gradient(to right, rgba(212,175,55,0.6), #D4AF37)",
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Question number + text */}
        <div className="mb-8">
          <span className="font-heading text-[10px] tracking-[0.35em] text-primary/40 uppercase block mb-3">
            Question {questionIndex + 1}
          </span>
          <h2 className="font-heading font-bold leading-tight text-foreground mb-3"
            style={{ fontSize: "clamp(22px, 3vw, 32px)" }}>
            {q.question}
          </h2>
          {q.subtitle && (
            <p className="text-muted-foreground" style={{ fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
              {q.subtitle}
            </p>
          )}
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {q.answers.map((answer, ai) => {
            const isSelected = selectedAnswer === ai;
            const isOtherSelected = selectedAnswer !== null && selectedAnswer !== ai;
            return (
              <button
                key={answer.id}
                onClick={() => !transitioning && onSelect(questionIndex, ai)}
                disabled={transitioning && !isSelected}
                className="w-full text-left group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))"
                    : "hsl(var(--primary) / 0.07)",
                  border: isSelected
                    ? "1px solid rgba(212,175,55,0.5)"
                    : "1px solid rgba(139,105,20,0.1)",
                  opacity: isOtherSelected ? 0.45 : 1,
                  transform: isOtherSelected ? "scale(0.99)" : undefined,
                }}
              >
                {/* Top shimmer on selected */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)" }} />
                )}

                <div className="flex items-center gap-4 p-4 md:p-5">
                  {/* Letter indicator */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isSelected ? "rgba(212,175,55,0.2)" : "hsl(var(--primary) / 0.08)",
                      border: isSelected ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(251,191,36,0.14)",
                    }}>
                    {isSelected ? (
                      <Check size={14} className="text-primary" />
                    ) : (
                      <span className="font-heading text-[11px] tracking-wide"
                        style={{ color: "hsl(var(--muted-foreground) / 0.85)" }}>
                        {LETTERS[ai]}
                      </span>
                    )}
                  </div>

                  {/* Answer text */}
                  <p className="flex-1 leading-relaxed transition-colors duration-200"
                    style={{
                      fontSize: "clamp(14px, 1.7vw, 16px)",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: isSelected ? "rgba(237,232,216,0.92)" : "hsl(var(--foreground) / 0.80)",
                    }}>
                    {answer.text}
                  </p>

                  {/* Arrow on hover */}
                  {!isSelected && (
                    <ArrowRight size={14} className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   CALCULATING SCREEN
───────────────────────────────────────────────────────── */
const CalculatingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      {/* Spinning Sudarshana Chakra */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <g style={{ animation: "spin 3s linear infinite", transformOrigin: "60px 60px" }}>
            <circle cx="60" cy="60" r="56" stroke="rgba(212,175,55,0.25)" strokeWidth="0.5" fill="none" strokeDasharray="4 6" />
            <circle cx="60" cy="60" r="46" stroke="rgba(212,175,55,0.35)" strokeWidth="0.8" fill="none" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line key={deg}
                x1="60" y1="4" x2="60" y2="18"
                stroke="rgba(212,175,55,0.5)" strokeWidth="1"
                style={{ transformOrigin: "60px 60px", transform: `rotate(${deg}deg)` }} />
            ))}
          </g>
          <g style={{ animation: "spin 2s linear infinite reverse", transformOrigin: "60px 60px" }}>
            <circle cx="60" cy="60" r="32" stroke="rgba(212,175,55,0.4)" strokeWidth="1" fill="none" />
            <polygon points="60,28 72,50 60,72 48,50" stroke="rgba(212,175,55,0.6)" strokeWidth="0.8" fill="rgba(212,175,55,0.06)" />
          </g>
          <circle cx="60" cy="60" r="10" stroke="rgba(212,175,55,0.6)" strokeWidth="1" fill="rgba(212,175,55,0.12)" />
        </svg>
      </div>

      <p className="font-heading text-primary/80 tracking-[0.3em] uppercase text-sm mb-3">
        Reading your dharma
      </p>
      <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
        The Mahabharata sees you clearly…
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   RESULT SCREEN
───────────────────────────────────────────────────────── */
const ResultScreen = ({
  result, answers, onRetake, onShare, shareSuccess,
}: {
  result: QuizResult;
  answers: (number | null)[];
  onRetake: () => void;
  onShare: () => void;
  shareSuccess: boolean;
}) => {
  const meta = CHARACTER_META[result.winner];
  const image = resolveImage(meta.imageKey);
  const totalAnswered = answers.filter((a) => a !== null).length;
  const breakdown = scoreBreakdown(result.scores, totalAnswered);
  const tiedMeta = result.tiedWith ? CHARACTER_META[result.tiedWith] : null;

  const charOrder: Array<keyof typeof result.scores> = ["karna", "krishna", "arjuna", "draupadi", "bhishma"];

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Tie notice */}
        {result.isTie && tiedMeta && (
          <div className="glass-card rounded-xl px-5 py-4 mb-8 flex items-center gap-3 max-w-lg mx-auto"
            style={{ borderColor: `rgba(${meta.accentRgb},0.25)` }}>
            <span className="text-primary text-lg flex-shrink-0">⚖️</span>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              You are torn between{" "}
              <span style={{ color: meta.accentHex }}>{meta.name}</span> and{" "}
              <span style={{ color: tiedMeta.accentHex }}>{tiedMeta.name}</span>.
              {" "}Your final answer tipped the balance.
            </p>
          </div>
        )}

        {/* Main result card */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
          {/* Character image */}
          <div className="animate-fade-up">
            <div className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "4/5",
                boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${meta.accentRgb},0.25)`,
              }}>
              <img
            loading="lazy"
            decoding="async" src={image} alt={meta.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(8,6,26,0.9) 0%, rgba(8,6,26,0.2) 50%, transparent 80%)" }} />
              <div className="absolute inset-0"
                style={{ background: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(${meta.accentRgb},0.12) 0%, transparent 65%)` }} />

              {/* Percentage badge */}
              <div className="absolute top-5 right-5 flex flex-col items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm"
                style={{ background: `rgba(${meta.accentRgb},0.2)`, border: `1px solid rgba(${meta.accentRgb},0.4)` }}>
                <span className="font-heading font-black text-xl leading-none" style={{ color: meta.accentHex }}>
                  {result.percentage}
                </span>
                <span className="font-heading text-[8px] tracking-[0.1em] uppercase" style={{ color: `rgba(${meta.accentRgb},0.7)` }}>%</span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-heading text-[10px] tracking-[0.3em] uppercase mb-1"
                  style={{ color: `rgba(${meta.accentRgb},0.7)` }}>
                  {meta.archetype}
                </p>
                {/* Text sits on the image's dark gradient overlay — keep light in both themes. */}
                <h2 className="font-heading font-black" style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "rgba(253,230,138,0.95)" }}>
                  {meta.name}
                </h2>
                <p className="font-heading italic" style={{ fontSize: "17px", color: "rgba(253,230,138,0.70)" }}>
                  {meta.title}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-fade-up-delay-1 space-y-6">
            {/* You are */}
            <div>
              <p className="font-heading text-[10px] tracking-[0.35em] uppercase text-primary/50 mb-2">Your result</p>
              <h3 className="font-heading font-bold leading-tight mb-1"
                style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: "hsl(var(--foreground))" }}>
                You are{" "}
                <span style={{
                  background: `linear-gradient(135deg, rgba(${meta.accentRgb},1) 0%, rgba(${meta.accentRgb},0.7) 100%)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {meta.name}
                </span>
              </h3>
            </div>

            {/* Traits */}
            <div className="flex flex-wrap gap-2">
              {meta.traits.map((trait) => (
                <span key={trait} className="px-3 py-1.5 rounded-full font-heading text-[10px] tracking-[0.12em] uppercase"
                  style={{ background: `rgba(${meta.accentRgb},0.1)`, border: `1px solid rgba(${meta.accentRgb},0.22)`, color: meta.accentHex }}>
                  {trait}
                </span>
              ))}
            </div>

            {/* Insight */}
            <div className="rounded-xl p-5 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(${meta.accentRgb},0.07), rgba(${meta.accentRgb},0.03))`,
                border: `1px solid rgba(${meta.accentRgb},0.15)`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, rgba(${meta.accentRgb},0.4), transparent)` }} />
              <p className="leading-relaxed" style={{
                fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "hsl(var(--foreground) / 0.82)", fontStyle: "italic",
              }}>
                {meta.resultInsight}
              </p>
            </div>

            {/* Score breakdown */}
            <div>
              <p className="font-heading text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                Your score breakdown
              </p>
              <div className="space-y-2.5">
                {charOrder.map((cid) => {
                  const cMeta = CHARACTER_META[cid];
                  const pct = breakdown[cid];
                  const isWinner = cid === result.winner;
                  return (
                    <div key={cid} className="flex items-center gap-3">
                      <span className="font-heading text-[10px] tracking-[0.1em] uppercase w-16 flex-shrink-0 text-right"
                        style={{ color: isWinner ? cMeta.accentHex : "hsl(var(--foreground) / 0.45)" }}>
                        {cMeta.name}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(139,105,20,0.09)" }}>
                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: pct + "%", background: `linear-gradient(to right, rgba(${cMeta.accentRgb},0.5), ${cMeta.accentHex})` }} />
                      </div>
                      <span className="font-heading text-[10px] w-8 flex-shrink-0 tabular-nums"
                        style={{ color: isWinner ? cMeta.accentHex : "hsl(var(--foreground) / 0.35)" }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to={`/blog/${meta.articleSlug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-heading text-[12px] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, rgba(${meta.accentRgb},0.9), rgba(${meta.accentRgb},0.7))`,
                  color: "#0B0F1A", boxShadow: `0 0 20px rgba(${meta.accentRgb},0.3)`,
                }}>
                <BookOpen size={13} /> Read {meta.name}'s Story
              </Link>

              <button onClick={onShare}
                className="flex items-center gap-2 glass-card px-6 py-3 rounded-full font-heading text-[12px] tracking-wide hover:border-primary/40 hover:text-primary transition-all duration-300">
                {shareSuccess ? <Check size={13} className="text-green-400" /> : <Share2 size={13} />}
                {shareSuccess ? "Copied!" : "Share Result"}
              </button>

              <button onClick={onRetake}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <RotateCcw size={13} />
                <span className="font-heading text-[11px] tracking-[0.15em] uppercase">Retake</span>
              </button>
            </div>

            {/* Related characters */}
            <div className="pt-2">
              <p className="font-heading text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Also explore
              </p>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(CHARACTER_META)
                  .filter(([id]) => id !== result.winner)
                  .slice(0, 4)
                  .map(([id, m]) => (
                    <Link key={id} to={`/blog/${m.articleSlug}`}
                      className="flex items-center gap-2 glass-card px-3 py-2 rounded-full hover:border-primary/30 transition-all duration-200 group">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        <img
            loading="lazy"
            decoding="async" src={resolveImage(m.imageKey)} alt={m.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <span className="font-heading text-[10px] tracking-[0.1em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
                        {m.name}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN QUIZ PAGE
───────────────────────────────────────────────────────── */
const Quiz = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useSEO({
    title: "Which Mahabharata Character Are You?",
    description: "Take the quiz and discover which Mahabharata character reflects your deepest values — Karna, Krishna, Arjuna, Draupadi, or Bhishma.",
    path: "/quiz",
  });

  // Auto-advance after answer selection
  useEffect(() => {
    if (!state.transitioning) return;
    const currentAnswered = state.answers[state.currentQ] !== null;
    if (!currentAnswered) return;

    advanceTimeout.current = setTimeout(() => {
      dispatch({ type: "ADVANCE" });
    }, 480);

    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, [state.transitioning, state.currentQ, state.answers]);

  // Calculate result when in calculating phase
  useEffect(() => {
    if (state.phase !== "calculating") return;
    const timeout = setTimeout(() => {
      const result = computeQuizResult(state.answers, QUIZ_QUESTIONS);
      dispatch({ type: "SHOW_RESULT", result });
    }, 2200); // dramatic pause ✦
    return () => clearTimeout(timeout);
  }, [state.phase, state.answers]);

  const handleSelectAnswer = useCallback(
    (qi: number, ai: number) => {
      dispatch({ type: "SELECT_ANSWER", questionIndex: qi, answerIndex: ai });
    },
    []
  );

  const handleShare = useCallback(async () => {
    const winner = state.result?.winner;
    if (!winner) return;
    const meta = CHARACTER_META[winner];
    const text = `I'm ${meta.name} — ${meta.title} — in the Mahabharata. Which character are you? 🏹`;
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "MahabharataDecoded Quiz", text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        dispatch({ type: "SET_SHARE_SUCCESS", value: true });
        setTimeout(() => dispatch({ type: "SET_SHARE_SUCCESS", value: false }), 2500);
      }
    } catch {
      // User dismissed share sheet — not an error
    }
  }, [state.result]);

  // Keyboard navigation
  useEffect(() => {
    if (state.phase !== "quiz") return;
    const LETTERS = ["a", "b", "c", "d", "e"];
    const handleKey = (e: KeyboardEvent) => {
      if (state.transitioning) return;
      const idx = LETTERS.indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < QUIZ_QUESTIONS[state.currentQ].answers.length) {
        handleSelectAnswer(state.currentQ, idx);
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        if (state.currentQ > 0) dispatch({ type: "BACK" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, state.currentQ, state.transitioning, handleSelectAnswer]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Background ambient glow changes per phase */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: state.phase === "result" && state.result
            ? `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(${CHARACTER_META[state.result.winner].accentRgb},0.05) 0%, transparent 65%)`
            : "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212,175,55,0.04) 0%, transparent 65%)",
        }} />

      {/* Phase renderer */}
      {state.phase === "welcome" && (
        <WelcomeScreen onStart={() => dispatch({ type: "START" })} />
      )}

      {state.phase === "quiz" && (
        <QuestionScreen
          questionIndex={state.currentQ}
          answers={state.answers}
          onSelect={handleSelectAnswer}
          onBack={() => dispatch({ type: "BACK" })}
          transitioning={state.transitioning}
        />
      )}

      {state.phase === "calculating" && <CalculatingScreen />}

      {state.phase === "result" && state.result && (
        <ResultScreen
          result={state.result}
          answers={state.answers}
          onRetake={() => dispatch({ type: "RETAKE" })}
          onShare={handleShare}
          shareSuccess={state.shareSuccess}
        />
      )}

      {/* Keyboard hint (quiz phase only) */}
      {state.phase === "quiz" && (
        <div className="fixed bottom-6 right-6 hidden lg:flex items-center gap-2 opacity-30">
          <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground uppercase">
            Press A–E to answer
          </span>
        </div>
      )}

      {(state.phase === "result") && <Footer />}
    </div>
  );
};

export default Quiz;
