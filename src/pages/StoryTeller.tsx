/* ─────────────────────────────────────────────
   StoryTeller Page — /storyteller
   Integrated into MahabharataDecoded
───────────────────────────────────────────── */

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Mic, MicOff, RefreshCw, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoodBackground from "@/components/MoodBackground";
import CharacterModal from "@/components/CharacterModal";
import {
  getCharactersByGroup,
  type StoryCharacter,
  type CharacterGroup,
  GROUP_LABEL_KEYS,
  GROUP_COLORS,
} from "@/data/storyCharacters";
import { MOOD_THEMES, GROUP_THEME_MAP, type MoodTheme } from "@/data/moodThemes";
import { useTheme } from "@/context/ThemeContext";
import { generateStory, generateLifeLesson, generateMySituation, type Tone, type Language } from "@/services/ai";
import { synthesizeSpeech } from "@/services/tts";
import PaywallModal from "@/components/PaywallModal";
import { useSubscription } from "@/hooks/useSubscription";
import { PAYWALL_ENABLED } from "@/lib/subscription";

/* ── Types ── */
type Step = "select" | "prompt" | "story";

/* TONES + GROUPS are computed inside the component now so t() can
   resolve labels at render time (was module-level English-only). */
const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिंदी"  },
  { value: "kn", label: "ಕನ್ನಡ" },
];

const GROUPS = Object.keys(GROUP_LABEL_KEYS) as CharacterGroup[];

/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Main component ── */
const StoryTeller = () => {
  const { t, i18n } = useTranslation();

  /* Localized TONE config — computed at render time so language switch
     re-resolves the labels. Loop variables that previously shadowed `t`
     have been renamed to `tn` further down. */
  const TONES: { value: Tone; label: string; icon: string }[] = [
    { value: "epic",          label: t("storyteller.tone_epic"),          icon: "⚡" },
    { value: "devotional",    label: t("storyteller.tone_devotional"),    icon: "🪷" },
    { value: "kids",          label: t("storyteller.tone_kids"),          icon: "🌟" },
    { value: "philosophical", label: t("storyteller.tone_philosophical"), icon: "🔮" },
  ];

  /* State */
  const [step, setStep]                     = useState<Step>("select");
  const [showIntro, setShowIntro]           = useState(true);  // cinematic opening
  const [activeGroup, setActiveGroup]       = useState<CharacterGroup>("pandavas");
  const [selected, setSelected]             = useState<StoryCharacter | null>(null);
  const [currentTheme, setCurrentTheme]     = useState<MoodTheme>("default");
  const [modalChar, setModalChar]           = useState<StoryCharacter | null>(null);
  const [customPrompt, setCustomPrompt]     = useState("");
  const [activePromptIdx, setActivePromptIdx] = useState<number | null>(null);
  const [tone, setTone]                     = useState<Tone>("epic");
  const [language, setLanguage]             = useState<Language>(
    (i18n.language?.slice(0, 2) as Language) ?? "en"
  );
  const [story, setStory]                   = useState("");
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [speaking, setSpeaking]             = useState(false);

  const storyRef  = useRef<HTMLDivElement>(null);
  const utterRef  = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);

  const [skip, setSkip]     = useState(false);

  // ── Tab state ──
  type StoryTab = "story" | "lesson" | "situation";
  const [activeTab, setActiveTab]         = useState<StoryTab>("story");
  const [lessonText, setLessonText]       = useState("");
  const [lessonLoading, setLessonLoading] = useState(false);
  const [situationText, setSituationText] = useState("");
  const [situationInput, setSituationInput] = useState("");
  const [situationLoading, setSituationLoading] = useState(false);

  const { displayed, done } = useTypewriter(story, 6);
  const shownText           = skip ? story : displayed;
  const storyComplete       = skip || done;   // single source of truth

  /* ── Subscription gate ── */
  const {
    access: hasAccess,
    canGenerate,
    storiesLeft,
    storiesUsed,
    dailyLimit,
    subscription,
    refresh: refreshAccess,
  } = useSubscription();
  const [paywallOpen,   setPaywallOpen]   = useState(false);
  const [paywallReason, setPaywallReason] = useState<string>("Unlock Full Access");

  /* ── Scroll to story when it starts ── */
  useEffect(() => {
    if (step === "story" && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  /* ── Generate story ── */
  /* ── Abort controller ref to cancel in-flight requests ── */
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selected) return;
    const promptText =
      activePromptIdx !== null
        ? selected.prompts[activePromptIdx].request
        : customPrompt.trim();
    if (!promptText) return;

    /* Subscription gate — block AI call if trial expired and not subscribed */
    if (!hasAccess) {
      setPaywallReason("Your 14-day free trial has ended");
      setPaywallOpen(true);
      return;
    }

    /* Daily limit gate — free/trial users: 3 stories per day */
    if (!canGenerate) {
      setPaywallReason("You've used all 3 free stories for today — resets at midnight");
      setPaywallOpen(true);
      return;
    }

    /* Cancel any in-flight request */
    if (abortRef.current) { abortRef.current.abort(); }
    abortRef.current = new AbortController();

    /* Reset ALL state cleanly */
    setLoading(true);
    setError("");
    setStory("");
    setStep("story");
    setSpeaking(false);
    setSkip(false);
    setActiveTab("story");
    setLessonText("");
    setSituationText("");
    setSituationInput("");
    setLessonLoading(false);
    setSituationLoading(false);
    sentIdxRef.current   = 0;
    sentencesRef.current = [];
    stoppedRef.current   = true;
    window.speechSynthesis?.cancel();
    stoppedRef.current   = false;

    try {
      const result = await generateStory({
        characterName: selected.name,
        prompt: promptText,
        tone,
        language,
      });

      /* Ignore result if a new request was already fired */
      if (abortRef.current?.signal.aborted) return;

      setLoading(false);

      if (result.error) {
        setError(result.error);
      } else {
        const cleaned = result.story
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/#{1,6}\s/g, "")
          .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
          .trim();
        setStory(cleaned);
        /* Record daily usage for free/trial users */
        if (!subscription) {
          const { recordStoryGenerated } = await import("@/lib/subscription");
          recordStoryGenerated();
          refreshAccess();
        }
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }, [selected, activePromptIdx, customPrompt, tone, language, hasAccess, canGenerate, subscription, refreshAccess]);

  /* ── Voice narration — sentence-by-sentence to fix Chrome TTS bug ── */
  const sentencesRef = useRef<string[]>([]);
  const sentIdxRef   = useRef(0);
  const stoppedRef   = useRef(false);   // ← prevents onend loop after cancel

  /* ── Voice selection — Indian accent priority ── */
  const getIndianVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    /* Log all voices in dev for debugging */
    if (import.meta.env.DEV) {
      console.log("Available voices:", voices.map(v => `${v.name} [${v.lang}]`));
    }

    /* ── Telugu ── */
    if (lang === "te") {
      return (
        voices.find(v => v.lang === "te-IN") ||
        voices.find(v => v.lang.startsWith("te")) ||
        /* Fallback: Google Hindi Indian — closest prosody to Telugu */
        voices.find(v => v.lang === "hi-IN" && v.name.toLowerCase().includes("google")) ||
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang === "en-IN") ||
        null
      );
    }

    /* ── Hindi ── */
    if (lang === "hi") {
      return (
        voices.find(v => v.lang === "hi-IN" && v.name.toLowerCase().includes("google")) ||
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang.startsWith("hi")) ||
        voices.find(v => v.lang === "en-IN") ||
        null
      );
    }

    /* ── Kannada ── */
    if (lang === "kn") {
      return (
        voices.find(v => v.lang === "kn-IN") ||
        voices.find(v => v.lang.startsWith("kn")) ||
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang === "en-IN") ||
        null
      );
    }

    /* ── English — prefer Indian, then British, avoid US ── */
    return (
      voices.find(v => v.lang === "en-IN" && v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.name.toLowerCase().includes("raveena")) ||  // Google Indian female
      voices.find(v => v.name.toLowerCase().includes("veena")) ||    // Apple Indian
      voices.find(v => v.lang === "en-GB" && v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en")) ||
      null
    );
  }, []);

  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;
    const sentences = sentencesRef.current;
    const idx       = sentIdxRef.current;
    if (idx >= sentences.length) { setSpeaking(false); return; }

    const utt  = new SpeechSynthesisUtterance(sentences[idx]);
    utt.rate   = language === "te" || language === "kn" ? 0.82 : 0.88;
    utt.pitch  = 1.0;
    utt.volume = 1.0;

    /* Set voice and language */
    const voice = getIndianVoice(language);
    if (voice) {
      utt.voice = voice;
      utt.lang  = voice.lang;
    } else {
      /* No voice found — set lang hint so browser picks best available */
      utt.lang = (
        language === "te" ? "te-IN" :
        language === "hi" ? "hi-IN" :
        language === "kn" ? "kn-IN" : "en-IN"
      );
    }

    utt.onend   = () => { if (!stoppedRef.current) { sentIdxRef.current += 1; speakNext(); } };
    utt.onerror = (e) => {
      console.warn("TTS error:", e.error);
      if (!stoppedRef.current) { sentIdxRef.current += 1; speakNext(); }
    };
    utterRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [language, getIndianVoice]);

  const toggleSpeech = useCallback(async () => {
    /* ── STOP ── */
    if (speaking) {
      stoppedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      sentIdxRef.current = 0;
      return;
    }

    /* ── Pick content from active tab ── */
    let textToRead = "";
    if (activeTab === "story")     textToRead = story;
    if (activeTab === "lesson")    textToRead = lessonText;
    if (activeTab === "situation") textToRead = situationText;
    if (!textToRead.trim()) return;

    /* Clean markdown */
    const cleanText = textToRead
      .replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s/g, "").replace(/_{1,2}(.*?)_{1,2}/g, "$1")
      .replace(/`(.*?)`/g, "$1").replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/^\s*[-•]\s/gm, "").trim();

    setSpeaking(true);
    stoppedRef.current = false;

    /* ── Google Cloud TTS (works on ALL devices, ALL languages) ── */
    const googleKey = import.meta.env.VITE_GOOGLE_TTS_KEY;
    if (googleKey) {
      const { audioUrl, error } = await synthesizeSpeech(cleanText, language);
      if (audioUrl && !stoppedRef.current) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => { setSpeaking(false); audioRef.current = null; };
        audio.onerror = () => { setSpeaking(false); audioRef.current = null; };
        audio.play();
        return;
      }
      if (error) console.warn("Google TTS failed, using browser TTS:", error);
    }

    /* ── Fallback: Browser TTS ── */
    const sentences = cleanText.split(/(?<=[.!?।])\s+/).map(s => s.trim()).filter(Boolean);
    sentencesRef.current = sentences;
    sentIdxRef.current   = 0;
    window.speechSynthesis?.cancel();
    const trySpeak = (n = 0) => {
      if (window.speechSynthesis.getVoices().length > 0 || n > 10) speakNext();
      else setTimeout(() => trySpeak(n + 1), 200);
    };
    trySpeak();
  }, [speaking, activeTab, story, lessonText, situationText, language, speakNext]);

  /* ── Reset ── */
  const handleReset = useCallback(() => {
    setStep("select");
    setSelected(null);
    setCustomPrompt("");
    setActivePromptIdx(null);
    setStory("");
    setError("");
    setSpeaking(false);
    window.speechSynthesis?.cancel();
  }, []);


  /* ── Theme-aware styles — solid colors, no alpha issues on mobile ── */
  const { theme: globalTheme } = useTheme();
  const isGlobalDark = globalTheme === "dark";
  const theme     = MOOD_THEMES[currentTheme];
  /* Colours — adapt to global theme + mood theme */
  const gold      = currentTheme !== "default" ? theme.highlightColor : "hsl(var(--primary))";
  const goldDark  = currentTheme !== "default" ? theme.accentColor : "hsl(var(--primary))";

  /* Text colours */
  const inkDark   = "hsl(var(--foreground))";
  const inkMuted  = "hsl(var(--muted-foreground))";

  /* Card backgrounds */
  const cardBg    = "hsl(var(--card))";
  const borderClr = currentTheme !== "default" ? `${theme.accentColor}50` : "hsl(var(--border))";

  const serif  = "'Cinzel', 'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif";
  const body   = language === "en"
    ? "'Cormorant Garamond', Georgia, serif"
    : language === "te"
    ? "'Cormorant Garamond', 'Noto Serif Telugu', Georgia, serif"
    : language === "hi"
    ? "'Cormorant Garamond', 'Noto Serif Devanagari', Georgia, serif"
    : language === "kn"
    ? "'Cormorant Garamond', 'Noto Serif Kannada', Georgia, serif"
    : "'Cormorant Garamond', Georgia, serif";
  const deco   = "'Cinzel Decorative', 'Cinzel', serif";

  /* ── Cinematic Opening Screen ── */
  if (showIntro) {
    return (
      <>
        {/* Navbar rendered OUTSIDE overflow:hidden container — always visible */}
        <Navbar />
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          background: "hsl(var(--background))",
          padding: "clamp(88px, 16vw, 100px) 16px 40px", position: "relative", overflow: "hidden",
        }}>
        {/* CSS particle background for intro — dark mode only */}
        {isGlobalDark && <MoodBackground theme="war" opacity={0.15} />}

        {/* Animated glow — dark mode only */}
        {isGlobalDark && (
          <>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 60% 60% at 80% 35%, rgba(251,191,36,0.16) 0%, transparent 50%)",
            }} />
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 50% 55% at 20% 65%, rgba(52,211,153,0.12) 0%, transparent 50%)",
            }} />
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 40% 45% at 55% 15%, rgba(167,139,250,0.10) 0%, transparent 45%)",
            }} />
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 35% 40% at 60% 80%, rgba(56,189,248,0.09) 0%, transparent 42%)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }} />
          </>
        )}

        <style>{`
          @keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes fade-in-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
          .intro-badge { animation: fade-in-up 0.8s ease forwards; }
          .intro-title { animation: fade-in-up 0.8s ease 0.2s forwards; opacity:0; }
          .intro-sub   { animation: fade-in-up 0.8s ease 0.5s forwards; opacity:0; }
          .intro-langs { animation: fade-in-up 0.8s ease 0.8s forwards; opacity:0; }
          .intro-btn   { animation: fade-in-up 0.8s ease 1s forwards; opacity:0; }
          @keyframes float-p { 0%{opacity:0;transform:translateY(0)} 10%{opacity:1} 90%{opacity:.4} 100%{opacity:0;transform:translateY(-200px) translateX(var(--dx))} }
          .gr-particle { position:absolute; border-radius:50%; animation:float-p var(--d) var(--dl) infinite; }
        `}</style>
        {/* Rainbow top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,#FBBF24,#A3E635,#34D399,#38BDF8,#A78BFA,#F472B6)", zIndex:10 }} />

        {/* Badge */}
        <div className="intro-badge" style={{
          display: "inline-block", padding: "4px 16px", borderRadius: "99px",
          border: "1px solid hsl(var(--border))", fontFamily: serif,
          fontSize: "11px", letterSpacing: "0.3em", color: "hsl(var(--primary))",
          textTransform: "uppercase", marginBottom: "20px",
        }}>
          MahabharataDecoded presents
        </div>

        {/* Title */}
        <h1 className="intro-title" style={{
          fontFamily: deco,
          fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
          fontWeight: 700, color: "hsl(var(--foreground))", lineHeight: 1.15,
          marginBottom: "20px",
          textShadow: "0 0 60px rgba(212,175,55,0.3)",
          letterSpacing: "0.04em",
        }}>
          The Story Teller
        </h1>

        {/* Divider */}
        <div style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, transparent, #D4AF37, transparent)", margin: "0 auto 20px" }} />

        {/* Subtitle */}
        <p className="intro-sub" style={{
          fontFamily: body, fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
          color: "hsl(var(--muted-foreground))", maxWidth: "520px",
          margin: "0 auto 28px", lineHeight: 1.75,
        }}>
          Choose a character. Choose your story.<br />
          Hear the Mahabharata come alive.
        </p>

        {/* Language pills */}
        <div className="intro-langs" style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
          {["English", "తెలుగు", "हिंदी", "ಕನ್ನಡ"].map(l => (
            <span key={l} style={{
              padding: "4px 14px", borderRadius: "99px",
              background: "hsl(var(--accent))", border: "1px solid hsl(var(--border))",
              fontFamily: body, fontSize: "13px", color: "hsl(var(--foreground))",
            }}>{l}</span>
          ))}
        </div>

        {/* Enter button */}
        <button
          className="intro-btn"
          onClick={() => setShowIntro(false)}
          style={{
            padding: "16px 48px", borderRadius: "99px",
            background: "linear-gradient(135deg, #A07820 0%, #D4AF37 50%, #A07820 100%)",
            border: "none", cursor: "pointer", fontFamily: serif,
            fontSize: "15px", letterSpacing: "0.15em", color: "#2A1506",
            fontWeight: 600, boxShadow: "0 8px 32px rgba(212,175,55,0.35)",
            transition: "all 0.3s", backgroundSize: "200%",
            animation: "intro-btn 0.8s ease 1s forwards, shimmer 3s ease-in-out 2s infinite",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,175,55,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,175,55,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          ✨ Enter the Epic
        </button>
      </div>
      </>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(var(--background))",
      color: inkDark,
      transition: "background 0.8s ease, color 0.5s ease",
      position: "relative",
    }}>

      {/* ── SCENE BACKGROUND — Left-gradient for all groups ── */}
      {/* Golden Rainbow background glows — dark mode only */}
      {isGlobalDark && (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          {/* Golden Rainbow base */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(145deg,#0C0900 0%,#100A00 25%,#080A18 55%,#060410 80%,#0C0900 100%)" }} />
          {/* Gold glow — top-right */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 60% at 80% 30%, rgba(251,191,36,0.14) 0%, transparent 50%)" }} />
          {/* Theme accent glow — mid-left — changes per mood */}
          <div style={{ position:"absolute", inset:0, background:
            currentTheme === "war"    ? "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(220,38,38,0.14) 0%, transparent 50%)" :
            currentTheme === "divine" ? "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(124,58,237,0.14) 0%, transparent 50%)" :
            currentTheme === "forest" ? "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(5,150,105,0.14) 0%, transparent 50%)" :
            currentTheme === "tragic" ? "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(180,83,9,0.16) 0%, transparent 50%)" :
            currentTheme === "gita"   ? "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(52,211,153,0.13) 0%, transparent 50%)" :
            "radial-gradient(ellipse 45% 55% at 18% 65%, rgba(52,211,153,0.12) 0%, transparent 50%)"
          }} />
          {/* Purple mid-glow */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 40% 45% at 50% 50%, rgba(167,139,250,0.07) 0%, transparent 45%)" }} />
          {/* Blue bottom-glow */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 35% 40% at 65% 80%, rgba(56,189,248,0.09) 0%, transparent 40%)" }} />
          {/* Rainbow top bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,#FBBF24,#A3E635,#34D399,#38BDF8,#A78BFA,#F472B6)" }} />
        </div>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          textAlign: "center",
          padding: "clamp(96px, 18vw, 120px) 16px 48px",
          background: "transparent",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)",
        }} />

        <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.35em", color: "hsl(var(--primary))", textTransform: "uppercase", marginBottom: "16px" }}>
          MahabharataDecoded presents
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, color: "hsl(var(--foreground))", lineHeight: 1.1, marginBottom: "20px" }}>
          The Story Teller
        </h1>
        <p style={{ fontFamily: body, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "hsl(var(--muted-foreground))", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Choose a character. Choose your story. Hear the Mahabharata come alive — narrated by Veda Vyasa himself.
        </p>

        {/* Language + Tone selectors in hero */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "8px" }}>
          {/* Language */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "4px" }}>
            {LANGUAGES.map(l => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                style={{
                  padding: "6px 16px", borderRadius: "99px", border: "none", cursor: "pointer",
                  fontFamily: serif, fontSize: "13px",
                  background: language === l.value ? gold : "transparent",
                  color: language === l.value ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  transition: "all 0.2s",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Tone */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "4px" }}>
            {TONES.map(tn => (
              <button
                key={tn.value}
                onClick={() => setTone(tn.value)}
                title={tn.label}
                style={{
                  padding: "6px 12px", borderRadius: "99px", border: "none", cursor: "pointer",
                  fontFamily: serif, fontSize: "12px", whiteSpace: "nowrap",
                  background: tone === tn.value ? gold : "transparent",
                  color: tone === tn.value ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  transition: "all 0.2s",
                }}
              >
                {tn.icon} {tn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: "32px", animation: "bounce 2s infinite" }}>
          <ChevronDown size={24} style={{ color: "rgba(212,175,55,0.4)", margin: "0 auto" }} />
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }`}</style>
      </section>

      {/* ── STEP INDICATOR ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0", padding: "32px 24px 0" }}>
        {(["select", "prompt", "story"] as Step[]).map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: serif, fontSize: "13px", fontWeight: 600,
              background: step === s ? gold : step === "prompt" && s === "select" ? gold : step === "story" ? gold : "rgba(160,120,32,0.15)",
              color: (step === s || (step === "prompt" && s === "select") || step === "story") ? "#2A1506" : inkMuted,
              border: `2px solid ${step === s ? gold : "rgba(160,120,32,0.2)"}`,
              transition: "all 0.3s",
            }}>
              {i + 1}
            </div>
            <span style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.1em", color: step === s ? gold : inkMuted, margin: "0 8px", display: "none" /* hide on small screens */ }}>
              {s === "select" ? t("storyteller.step_character") : s === "prompt" ? t("storyteller.step_story") : t("storyteller.step_read")}
            </span>
            {i < 2 && <div style={{ width: "40px", height: "1px", background: "rgba(160,120,32,0.3)" }} />}
          </div>
        ))}
      </div>

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px 80px" }}>

        {/* ══════════════ STEP 1 — CHARACTER SELECT ══════════════ */}
        {(step === "select" || step === "prompt" || step === "story") && (
          <section>
            {/* Group tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
              {GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  style={{
                    padding: "8px 18px", borderRadius: "99px", cursor: "pointer",
                    fontFamily: serif, fontSize: "12px", letterSpacing: "0.08em",
                    border: `1.5px solid ${activeGroup === g ? GROUP_COLORS[g] : borderClr}`,
                    background: activeGroup === g ? GROUP_COLORS[g] + "18" : cardBg,
                    color: activeGroup === g ? GROUP_COLORS[g] : inkMuted,
                    transition: "all 0.2s",
                  }}
                >
                  {t(GROUP_LABEL_KEYS[g])}
                </button>
              ))}
            </div>

            {/* Character grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "40px" }}>
              {getCharactersByGroup(activeGroup).map(char => {
                const isSelected = selected?.id === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setCurrentTheme(GROUP_THEME_MAP[activeGroup]);
                      /* ALL characters → modal flow */
                      setSelected(char);
                      setModalChar(char);
                      /* Reset previous story state */
                      setStory("");
                      setError("");
                      setLessonText("");
                      setSituationText("");
                      setSituationInput("");
                      setActiveTab("story");
                    }}
                    style={{
                      padding: "16px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                      background: isSelected ? GROUP_COLORS[char.group] + "18" : cardBg,
                      border: `1.5px solid ${isSelected ? GROUP_COLORS[char.group] : borderClr}`,
                      transition: "all 0.2s",
                      boxShadow: isSelected ? `0 4px 16px ${GROUP_COLORS[char.group]}30` : "none",
                    }}
                  >
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{char.icon}</div>
                    <div style={{
                      fontFamily: serif,
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: isSelected ? GROUP_COLORS[char.group] : inkDark,
                      marginBottom: "4px",
                      textTransform: "uppercase",
                    }}>
                      {char.name}
                    </div>
                    <div style={{ fontFamily: serif, fontSize: "10px", color: inkMuted, letterSpacing: "0.06em", marginBottom: "6px" }}>
                      {char.title}
                    </div>
                    <div style={{ fontFamily: body, fontSize: "11px", color: inkMuted, lineHeight: 1.5 }}>
                      {char.hook}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════ STEP 2 — PROMPT SELECT ══════════════ */}
        {(step === "prompt" || step === "story") && selected && (
          <section
            style={{
              background: "hsl(var(--card))",
              border: `1px solid ${borderClr}`,
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "32px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "32px" }}>{selected.icon}</span>
              <div>
                <h2 style={{ fontFamily: serif, fontSize: "1.5rem", color: GROUP_COLORS[selected.group], margin: 0 }}>
                  {selected.name}
                </h2>
                <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.1em", color: inkMuted, margin: 0 }}>
                  {selected.title}
                </p>
              </div>
            </div>

            <p style={{ fontFamily: body, fontSize: "13px", color: inkMuted, marginBottom: "20px", fontStyle: "italic" }}>
              {selected.hook}
            </p>

            <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
              Choose a story
            </p>

            {/* Preset prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {selected.prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setActivePromptIdx(i); setCustomPrompt(""); }}
                  style={{
                    padding: "12px 16px", borderRadius: "10px", textAlign: "left", cursor: "pointer",
                    background: activePromptIdx === i
                      ? GROUP_COLORS[selected.group] + "25"
                      : "hsl(var(--accent))",
                    border: `1.5px solid ${activePromptIdx === i
                      ? GROUP_COLORS[selected.group]
                      : "hsl(var(--border))"}`,
                    transition: "all 0.2s",
                    fontFamily: body, fontSize: "14px",
                    color: activePromptIdx === i
                      ? GROUP_COLORS[selected.group]
                      : "hsl(var(--foreground))",
                  }}
                >
                  <span style={{
                    fontFamily: serif, fontSize: "11px", letterSpacing: "0.1em",
                    color: "hsl(var(--muted-foreground))",
                    display: "block", marginBottom: "2px", textTransform: "uppercase"
                  }}>
                    {p.label}
                  </span>
                  {p.request.slice(0, 80)}…
                </button>
              ))}
            </div>

            {/* Or custom prompt */}
            <p style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: inkMuted, marginBottom: "8px" }}>
              Or ask your own
            </p>
            <textarea
              value={customPrompt}
              onChange={e => { setCustomPrompt(e.target.value); setActivePromptIdx(null); }}
              placeholder={`Ask anything about ${selected.name}…`}
              rows={3}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "10px", resize: "vertical",
                fontFamily: body, fontSize: "14px", color: inkDark,
                background: "rgba(160,120,32,0.04)",
                border: `1.5px solid ${customPrompt ? gold : "rgba(160,120,32,0.2)"}`,
                outline: "none", transition: "border 0.2s",
                boxSizing: "border-box",
              }}
            />

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || (activePromptIdx === null && !customPrompt.trim()) || !canGenerate}
              style={{
                marginTop: "16px", padding: "14px 40px", borderRadius: "99px",
                background: (activePromptIdx !== null || customPrompt.trim()) && !loading && canGenerate ? GROUP_COLORS[selected.group] : "rgba(160,120,32,0.2)",
                color: (activePromptIdx !== null || customPrompt.trim()) && !loading && canGenerate ? "#FFF8E8" : inkMuted,
                border: "none", cursor: (activePromptIdx !== null || customPrompt.trim()) && !loading && canGenerate ? "pointer" : "not-allowed",
                fontFamily: serif, fontSize: "14px", letterSpacing: "0.12em",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1.2s linear infinite" }}>⟳</span>
                  Veda Vyasa is narrating…
                </>
              ) : !canGenerate ? (
                "✦ Daily limit reached — upgrade for unlimited"
              ) : (
                "✨ Tell this story"
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Daily usage counter — free/trial users only */}
            {PAYWALL_ENABLED && !subscription && hasAccess && (
              <p style={{
                marginTop: "10px", fontFamily: "'Cinzel', serif",
                fontSize: "11px", letterSpacing: "0.12em",
                color: storiesLeft === 0 ? "rgba(192,57,43,0.8)" : "rgba(160,120,32,0.65)",
                textAlign: "center",
              }}>
                {storiesLeft === 0
                  ? `✦ ${storiesUsed}/${dailyLimit} stories used today — resets at midnight`
                  : `✦ ${storiesLeft} of ${dailyLimit} free stories remaining today`
                }
              </p>
            )}
          </section>
        )}

        {/* ══════════════ STEP 3 — STORY OUTPUT ══════════════ */}
        {step === "story" && (
          <section ref={storyRef}>
            {/* Error state */}
            {error && (
              <div style={{
                background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)",
                borderRadius: "12px", padding: "24px", marginBottom: "24px",
              }}>
                <p style={{ fontFamily: serif, fontSize: "14px", color: "#922B21", margin: 0 }}>
                  ⚠️ {error}
                </p>
                <p style={{ fontFamily: body, fontSize: "12px", color: inkMuted, marginTop: "8px" }}>
                  Make sure VITE_GROQ_API_KEY is set in your .env file. Get a free key at console.groq.com
                </p>
              </div>
            )}

            {/* Story card with 3 tabs */}
            {(loading || story) && (
              <div style={{
                background: "hsl(var(--card))",
                border: `1.5px solid ${(selected ? GROUP_COLORS[selected.group] : "#A07820")}50`,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}>

                {/* ── Tab bar ── */}
                {storyComplete && (
                  <div style={{
                    display: "flex",
                    borderBottom: "1px solid hsl(var(--border))",
                    background: "hsl(var(--accent))",
                  }}>
                    {([
                      { key: "story",     label: `📖 ${t("storyteller.tab_story")}`,     desc: t("storyteller.tab_story_desc") },
                      { key: "lesson",    label: `💡 ${t("storyteller.tab_lesson")}`,    desc: t("storyteller.tab_lesson_desc") },
                      { key: "situation", label: `🙋 ${t("storyteller.tab_situation")}`, desc: t("storyteller.tab_situation_desc") },
                    ] as { key: StoryTab; label: string; desc: string }[]).map(tab => (
                      <button
                        key={tab.key}
                        onClick={async () => {
                          if (tab.key !== activeTab) {
                            /* Stop any playing narration when switching tabs */
                            if (speaking) {
                              stoppedRef.current = true;
                              window.speechSynthesis?.cancel();
                              setSpeaking(false);
                              sentIdxRef.current = 0;
                            }
                          }
                          /* Guard — Life Lesson and My Situation need story first */
                          if (!story && tab.key !== "story") return;
                          setActiveTab(tab.key);

                          /* Auto-load Life Lesson on first click */
                          if (tab.key === "lesson" && !lessonText && !lessonLoading && story) {
                            setLessonLoading(true);
                            setLessonText("");
                            try {
                              const res = await generateLifeLesson({
                                characterName: selected?.name ?? "",
                                storyContext: story,
                                language,
                              });
                              setLessonLoading(false);
                              if (res.error) {
                                setLessonText(`⚠️ ${res.error}`);
                              } else {
                                setLessonText(
                                  res.story
                                    .replace(/\*\*(.*?)\*\*/g,"$1")
                                    .replace(/\*(.*?)\*/g,"$1")
                                    .trim()
                                );
                              }
                            } catch {
                              setLessonLoading(false);
                              setLessonText("⚠️ Something went wrong. Please try again.");
                            }
                          }
                        }}
                        style={{
                          flex: 1, padding: "14px 8px", border: "none",
                          cursor: (!story && tab.key !== "story") ? "not-allowed" : "pointer",
                          opacity: (!story && tab.key !== "story") ? 0.4 : 1,
                          background: activeTab === tab.key
                            ? "hsl(var(--card))"
                            : "transparent",
                          borderBottom: activeTab === tab.key ? `3px solid ${(selected ? GROUP_COLORS[selected.group] : "#A07820")}` : "3px solid transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontFamily: serif, fontSize: "12px", fontWeight: 600,
                          color: activeTab === tab.key ? ((selected ? GROUP_COLORS[selected.group] : "#A07820")) : inkMuted }}>
                          {tab.label}
                        </div>
                        <div style={{ fontFamily: body, fontSize: "10px", color: inkMuted, marginTop: "2px" }}>
                          {tab.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Tab content ── */}
                <div style={{ padding: "32px 36px", minHeight: "260px" }}>

                  {/* Decorative top line */}
                  <div style={{
                    height: "3px",
                    background: `linear-gradient(90deg, transparent, ${(selected ? GROUP_COLORS[selected.group] : "#A07820")}, transparent)`,
                    marginBottom: "28px", borderRadius: "2px", opacity: 0.7,
                  }} />

                  {/* Character badge */}
                  {selected && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                      <span style={{ fontSize: "24px" }}>{selected.icon}</span>
                      <div>
                        <span style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: GROUP_COLORS[selected.group] }}>
                          {selected.name}
                        </span>
                        <span style={{ fontFamily: serif, fontSize: "10px", color: inkMuted, marginLeft: "8px" }}>
                          · {TONES.find(tn => tn.value === tone)?.icon} {TONES.find(tn => tn.value === tone)?.label} · {LANGUAGES.find(l => l.value === language)?.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 1: Story ── */}
                  {(activeTab === "story" || !storyComplete) && (
                    <>
                      {loading && !shownText ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: inkMuted, minHeight: "80px" }}>
                          <span style={{ display: "inline-block", animation: "spin 1.2s linear infinite", fontSize: "20px" }}>⟳</span>
                          <span style={{ fontFamily: body, fontSize: "14px", fontStyle: "italic" }}>Veda Vyasa is composing your story…</span>
                        </div>
                      ) : (
                        <div style={{
                          fontFamily: body,
                          fontSize: "clamp(1rem, 2vw, 1.15rem)",
                          lineHeight: 1.9,
                          color: "hsl(var(--foreground))",
                          textAlign: "justify",
                          hyphens: "auto",
                          WebkitHyphens: "auto",
                          whiteSpace: "pre-wrap",
                          userSelect: "none", WebkitUserSelect: "none",
                          minHeight: "120px",
                        }}>
                          {shownText}
                          {!storyComplete && (
                            <span style={{ animation: "blink 0.7s step-end infinite", color: gold }}>|</span>
                          )}
                        </div>
                      )}

                      {/* Skip button */}
                      {!storyComplete && story && (
                        <button onClick={() => setSkip(true)} style={{
                          marginTop: "16px", padding: "6px 16px", borderRadius: "99px",
                          background: "transparent", border: `1px solid ${borderClr}`,
                          cursor: "pointer", fontFamily: serif, fontSize: "11px",
                          color: inkMuted, letterSpacing: "0.08em",
                        }}>
                          Skip animation ⏭
                        </button>
                      )}

                      {/* Tell me more */}
                      {storyComplete && story && (
                        <button
                          onClick={async () => {
                            setSkip(false); setStory(""); setLoading(true);
                            setActiveTab("story"); setLessonText(""); setSituationText("");
                            stoppedRef.current = true; window.speechSynthesis?.cancel(); setSpeaking(false);
                            const res = await generateStory({
                              characterName: selected?.name ?? "",
                              prompt: "Continue the story — tell me more details, what happened next, go deeper into emotions.",
                              tone, language,
                            });
                            setLoading(false);
                            if (!res.error) {
                              setStory(res.story.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").trim());
                              stoppedRef.current = false;
                            }
                          }}
                          style={{
                            marginTop: "20px", padding: "10px 28px", borderRadius: "99px",
                            background: "transparent", border: `1.5px solid ${(selected ? GROUP_COLORS[selected.group] : gold)}`,
                            cursor: "pointer", fontFamily: serif, fontSize: "13px",
                            color: (selected ? GROUP_COLORS[selected.group] : gold), letterSpacing: "0.08em",
                            display: "block", transition: "all 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = ((selected ? GROUP_COLORS[selected.group] : gold)) + "15"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          Tell me more →
                        </button>
                      )}
                    </>
                  )}

                  {/* ── TAB 2: Life Lesson ── */}
                  {activeTab === "lesson" && storyComplete && (
                    <div>
                      <p style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em",
                        textTransform: "uppercase", color: (selected ? GROUP_COLORS[selected.group] : gold), marginBottom: "20px" }}>
                        💡 What {selected?.name}'s story means for your life today
                      </p>

                      {lessonLoading ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: inkMuted }}>
                          <span style={{ display: "inline-block", animation: "spin 1.2s linear infinite", fontSize: "20px" }}>⟳</span>
                          <span style={{ fontFamily: body, fontSize: "14px", fontStyle: "italic" }}>Finding the lesson for your life…</span>
                        </div>
                      ) : (
                        <div style={{
                          fontFamily: body, fontSize: "clamp(1rem, 2vw, 1.1rem)",
                          lineHeight: 1.9, color: inkDark, textAlign: "justify", hyphens: "auto", WebkitHyphens: "auto", whiteSpace: "pre-wrap",
                          userSelect: "none",
                        }}>
                          {lessonText}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 3: My Situation ── */}
                  {activeTab === "situation" && storyComplete && (
                    <div>
                      <p style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em",
                        textTransform: "uppercase", color: (selected ? GROUP_COLORS[selected.group] : gold), marginBottom: "16px" }}>
                        🙋 Tell me your situation — get personal guidance
                      </p>

                      {!situationText && (
                        <>
                          <p style={{ fontFamily: body, fontSize: "13px", color: inkMuted,
                            marginBottom: "16px", lineHeight: 1.6 }}>
                            Describe what you're going through right now — {selected?.name}'s wisdom will be applied directly to your situation.
                          </p>
                          <textarea
                            value={situationInput}
                            onChange={e => setSituationInput(e.target.value)}
                            placeholder={`e.g. "I work hard but never get recognised..." or "I'm being judged unfairly..."`}
                            rows={4}
                            style={{
                              width: "100%", padding: "14px 16px", borderRadius: "12px",
                              fontFamily: body, fontSize: "14px", color: inkDark,
                              background: "rgba(160,120,32,0.04)",
                              border: `1.5px solid ${situationInput ? ((selected ? GROUP_COLORS[selected.group] : gold)) : "rgba(160,120,32,0.2)"}`,
                              outline: "none", resize: "vertical", boxSizing: "border-box",
                              transition: "border 0.2s",
                            }}
                          />
                          <button
                            onClick={async () => {
                              if (!situationInput.trim()) return;
                              setSituationText("");
                              setSituationLoading(true);
                              try {
                                const res = await generateMySituation({
                                  characterName: selected?.name ?? "",
                                  storyContext: story,
                                  userSituation: situationInput.trim(),
                                  language,
                                });
                                setSituationLoading(false);
                                if (res.error) {
                                  setSituationText(`⚠️ ${res.error}`);
                                } else {
                                  setSituationText(
                                    res.story
                                      .replace(/\*\*(.*?)\*\*/g,"$1")
                                      .replace(/\*(.*?)\*/g,"$1")
                                      .trim()
                                  );
                                }
                              } catch {
                                setSituationLoading(false);
                                setSituationText("⚠️ Something went wrong. Please try again.");
                              }
                            }}
                            disabled={situationLoading || !situationInput.trim()}
                            style={{
                              marginTop: "14px", padding: "12px 32px", borderRadius: "99px",
                              background: situationInput.trim() ? ((selected ? GROUP_COLORS[selected.group] : gold)) : "rgba(160,120,32,0.2)",
                              color: situationInput.trim() ? "#FFF8E8" : inkMuted,
                              border: "none", cursor: situationInput.trim() ? "pointer" : "not-allowed",
                              fontFamily: serif, fontSize: "13px", letterSpacing: "0.1em",
                              display: "flex", alignItems: "center", gap: "8px",
                            }}
                          >
                            {situationLoading
                              ? <><span style={{ display:"inline-block", animation:"spin 1.2s linear infinite" }}>⟳</span> Getting your guidance…</>
                              : "✨ Get my guidance"}
                          </button>
                        </>
                      )}

                      {situationText && (
                        <>
                          <div style={{
                            fontFamily: body, fontSize: "clamp(1rem, 2vw, 1.1rem)",
                            lineHeight: 1.9, color: inkDark, textAlign: "justify", hyphens: "auto", WebkitHyphens: "auto", whiteSpace: "pre-wrap",
                            userSelect: "none",
                          }}>
                            {situationText}
                          </div>
                          <button
                            onClick={() => { setSituationText(""); setSituationInput(""); }}
                            style={{
                              marginTop: "20px", padding: "8px 20px", borderRadius: "99px",
                              background: "transparent", border: `1px solid ${borderClr}`,
                              cursor: "pointer", fontFamily: serif, fontSize: "11px",
                              color: inkMuted,
                            }}
                          >
                            Try a different situation
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <style>{`
                    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                    @keyframes spin  { to { transform: rotate(360deg); } }
                  `}</style>

                  {/* Decorative bottom line */}
                  <div style={{
                    height: "3px",
                    background: `linear-gradient(90deg, transparent, ${(selected ? GROUP_COLORS[selected.group] : "#A07820")}, transparent)`,
                    marginTop: "28px", borderRadius: "2px", opacity: 0.7,
                  }} />
                </div>
              </div>
            )}

            {/* Actions row */}
            {story && storyComplete && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginTop: "24px" }}>
                {/* Voice narration */}
                {"speechSynthesis" in window && (
                  <button
                    onClick={toggleSpeech}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "10px 20px", borderRadius: "99px",
                      background: speaking ? gold + "20" : cardBg,
                      border: `1.5px solid ${speaking ? gold : borderClr}`,
                      cursor: "pointer", fontFamily: serif, fontSize: "12px",
                      color: speaking ? goldDark : inkMuted, transition: "all 0.2s",
                    }}
                  >
                    {speaking ? <MicOff size={14} /> : <Mic size={14} />}
                    {speaking ? t("storyteller.stop_narration") : (
                      activeTab === "lesson" ? t("storyteller.listen_lesson") :
                      activeTab === "situation" ? t("storyteller.listen_guidance") :
                      t("storyteller.listen_story")
                    )}
                  </button>
                )}

                {/* New story */}
                <button
                  onClick={() => { setStep("prompt"); setStory(""); setError(""); setSpeaking(false); window.speechSynthesis?.cancel(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 20px", borderRadius: "99px",
                    background: cardBg, border: `1.5px solid ${borderClr}`,
                    cursor: "pointer", fontFamily: serif, fontSize: "12px",
                    color: inkMuted, transition: "all 0.2s",
                  }}
                >
                  <RefreshCw size={14} />
                  Different story
                </button>

                {/* New character */}
                <button
                  onClick={handleReset}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 20px", borderRadius: "99px",
                    background: cardBg, border: `1.5px solid ${borderClr}`,
                    cursor: "pointer", fontFamily: serif, fontSize: "12px",
                    color: inkMuted, transition: "all 0.2s",
                  }}
                >
                  New character
                </button>

                {/* Share — prominent WhatsApp button */}
                <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>

                  {/* WhatsApp — green, clearly labelled */}
                  <button
                    onClick={() => {
                      const storyExcerpt = story.slice(0, 150) + "…";
                      const text = `✨ "${storyExcerpt}"\n\nRead the full story of ${selected?.name} on MahabharataDecoded:\n${window.location.origin}/storyteller`;
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(text)}`,
                        "_blank", "noopener,noreferrer"
                      );
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "10px 20px", borderRadius: "99px",
                      background: "#25D366", border: "none",
                      cursor: "pointer", fontFamily: serif, fontSize: "12px",
                      color: "#FFFFFF", letterSpacing: "0.08em",
                      transition: "all 0.2s",
                      fontWeight: 600,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1DA851"}
                    onMouseLeave={e => e.currentTarget.style.background = "#25D366"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Share on WhatsApp
                  </button>

                  {/* Copy link */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + "/storyteller");
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "10px 16px", borderRadius: "99px",
                      background: cardBg, border: `1.5px solid ${borderClr}`,
                      cursor: "pointer", fontFamily: serif, fontSize: "12px",
                      color: inkMuted, transition: "all 0.2s",
                    }}
                    title="Copy link"
                  >
                    🔗 Copy link
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── API Key notice (dev only) ── */}
        {!import.meta.env.VITE_GROQ_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY && step !== "story" && (
          <div style={{
            marginTop: "48px", padding: "20px 24px", borderRadius: "12px",
            background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)",
          }}>
            <p style={{ fontFamily: serif, fontSize: "13px", color: goldDark, margin: 0 }}>
              🔑 Add <code style={{ background: "rgba(212,175,55,0.15)", padding: "2px 6px", borderRadius: "4px" }}>VITE_GROQ_API_KEY=your_key</code> to your <code>.env</code> file to activate story generation.
              Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: gold }}>console.groq.com</a>
            </p>
          </div>
        )}
      </main>

      {/* Footer must stay INSIDE the relative/zIndex:1 wrapper so it
          renders above the position:fixed/zIndex:0 mood-gradient overlay
          that paints in dark mode. Moving it outside (previous setup)
          let the overlay cover most of the footer text in dark mode,
          leaving only form inputs visible. */}
      <Footer />
      </div>{/* end relative zIndex wrapper */}

      {/* ── Character Modal (Yudhishthira pilot) ── */}
      {modalChar && (
        <CharacterModal
          char={modalChar}
          sceneImage={(() => {
            const sceneMap: Record<string, string> = {
              gita:    "/scenes/pandavas.webp",
              war:     activeGroup === "warriors" ? "/scenes/warriors.webp" : "/scenes/kauravas.webp",
              tragic:  "/scenes/women.webp",
              forest:  "/scenes/kings.webp",
              divine:  "/scenes/divine.webp",
            };
            return sceneMap[currentTheme] ?? "/scenes/pandavas.webp";
          })()}
          onClose={() => setModalChar(null)}
          onStart={(promptText, _promptLabel) => {
            setModalChar(null);
            if (!hasAccess) {
              setPaywallReason("Your 14-day free trial has ended");
              setPaywallOpen(true);
              return;
            }
            if (!canGenerate) {
              setPaywallReason("You've used all 3 free stories for today — resets at midnight");
              setPaywallOpen(true);
              return;
            }
            setActivePromptIdx(null);
            setCustomPrompt(promptText);
            setStep("story");
            setStory("");
            setError("");
            setActiveTab("story");
            setLessonText("");
            setSituationText("");
            setSituationInput("");
            /* Trigger generation with the selected prompt */
            setTimeout(async () => {
              if (!selected) return;
              abortRef.current?.abort();
              abortRef.current = new AbortController();
              setLoading(true);
              stoppedRef.current = true;
              window.speechSynthesis?.cancel();
              setSpeaking(false);
              setSkip(false);
              stoppedRef.current = false;
              sentIdxRef.current = 0;
              sentencesRef.current = [];
              setLessonLoading(false);
              setSituationLoading(false);
              try {
                const result = await generateStory({
                  characterName: selected.name,
                  prompt: promptText,
                  tone,
                  language,
                });
                if (abortRef.current?.signal.aborted) return;
                setLoading(false);
                if (result.error) {
                  setError(result.error);
                } else {
                  const cleaned = result.story
                    .replace(/\*\*(.*?)\*\*/g,"$1")
                    .replace(/\*(.*?)\*/g,"$1")
                    .replace(/#{1,6}\s/g,"")
                    .trim();
                  setStory(cleaned);
                }
              } catch {
                setLoading(false);
                setError("Something went wrong. Please try again.");
              }
            }, 100);
          }}
        />
      )}

      {/* Subscription paywall (rendered at root so it overlays everything) */}
      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={() => { setPaywallOpen(false); refreshAccess(); }}
        reason={paywallReason}
      />
    </div>
  );
};

export default StoryTeller;
