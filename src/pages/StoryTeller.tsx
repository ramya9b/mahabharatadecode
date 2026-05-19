/* ─────────────────────────────────────────────
   StoryTeller Page — /storyteller
   Integrated into MahabharataDecoded
───────────────────────────────────────────── */

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Mic, MicOff, Share2, RefreshCw, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import {
  storyCharacters,
  getCharactersByGroup,
  type StoryCharacter,
  type CharacterGroup,
  GROUP_LABELS,
  GROUP_COLORS,
} from "@/data/storyCharacters";
import { generateStory, generateLifeLesson, generateMySituation, type Tone, type Language } from "@/services/gemini";

/* ── Types ── */
type Step = "select" | "prompt" | "story";

/* ── Tone config ── */
const TONES: { value: Tone; label: string; icon: string }[] = [
  { value: "epic",          label: "Epic",          icon: "⚡" },
  { value: "devotional",    label: "Devotional",    icon: "🪷" },
  { value: "kids",          label: "Kids",          icon: "🌟" },
  { value: "philosophical", label: "Philosophical", icon: "🔮" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिंदी"  },
  { value: "kn", label: "ಕನ್ನಡ" },
];

const GROUPS = Object.keys(GROUP_LABELS) as CharacterGroup[];

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
  const { i18n } = useTranslation();

  /* State */
  const [step, setStep]                     = useState<Step>("select");
  const [activeGroup, setActiveGroup]       = useState<CharacterGroup>("pandavas");
  const [selected, setSelected]             = useState<StoryCharacter | null>(null);
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
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }, [selected, activePromptIdx, customPrompt, tone, language]);

  /* ── Voice narration — sentence-by-sentence to fix Chrome TTS bug ── */
  const sentencesRef = useRef<string[]>([]);
  const sentIdxRef   = useRef(0);
  const stoppedRef   = useRef(false);   // ← prevents onend loop after cancel

  /* Pick best Indian voice for the selected language */
  const getIndianVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    /* Priority order: exact Indian locale → any Indian → any matching language */
    const localMap: Record<string, string[]> = {
      en: ["en-IN", "en-GB"],   // prefer India, then GB over US
      te: ["te-IN", "te"],
      hi: ["hi-IN", "hi"],
      kn: ["kn-IN", "kn"],
    };

    const preferred = localMap[lang] ?? [`${lang}-IN`, lang];

    /* 1. Try exact locale match */
    for (const locale of preferred) {
      const match = voices.find(v =>
        v.lang.toLowerCase() === locale.toLowerCase()
      );
      if (match) return match;
    }

    /* 2. Try voices with "India" or "-IN" in name/lang */
    const indiaMatch = voices.find(v =>
      v.lang.toLowerCase().startsWith(lang) &&
      (v.lang.includes("IN") || v.name.toLowerCase().includes("india"))
    );
    if (indiaMatch) return indiaMatch;

    /* 3. Any voice starting with the language code */
    return voices.find(v => v.lang.toLowerCase().startsWith(lang)) ?? null;
  }, []);

  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;   // ← stop here if cancelled
    const sentences = sentencesRef.current;
    const idx       = sentIdxRef.current;
    if (idx >= sentences.length) { setSpeaking(false); return; }

    const utt   = new SpeechSynthesisUtterance(sentences[idx]);
    utt.rate    = 0.88;
    utt.pitch   = 1.05;

    /* Always use Indian voice */
    const voice = getIndianVoice(language);
    if (voice) utt.voice = voice;
    utt.lang = voice?.lang ?? (
      language === "te" ? "te-IN" :
      language === "hi" ? "hi-IN" :
      language === "kn" ? "kn-IN" : "en-IN"
    );

    utt.onend   = () => {
      if (stoppedRef.current) return;  // ← stop here too
      sentIdxRef.current += 1;
      speakNext();
    };
    utt.onerror = () => {
      if (stoppedRef.current) return;  // ← and here
      sentIdxRef.current += 1;
      speakNext();
    };
    utterRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [language, getIndianVoice]);

  const toggleSpeech = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    if (speaking) {
      stoppedRef.current = true;        // ← set BEFORE cancel
      window.speechSynthesis.cancel();
      setSpeaking(false);
      sentIdxRef.current = 0;
      return;
    }

    /* Reset stopped flag for new narration */
    stoppedRef.current   = false;

    /* Strip markdown formatting before speaking */
    const cleanText = story
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/^\s*[-•]\s/gm, "")
      .trim();

    /* Split into sentences */
    const sentences = cleanText
      .split(/(?<=[.!?।])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    sentencesRef.current = sentences;
    sentIdxRef.current   = 0;
    setSpeaking(true);
    window.speechSynthesis.cancel();

    /* Voices load async in Chrome — wait if not ready */
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakNext();
      };
    } else {
      speakNext();
    }
  }, [speaking, story, speakNext]);

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

  /* ── Styles (using existing site tokens) ── */
  const gold       = "var(--gold-light, #A07820)";
  const goldDark   = "var(--gold-dark, #6B4E10)";
  const parchment  = "hsl(38 52% 91%)";
  const inkDark    = "hsl(28 62% 12%)";
  const inkMuted   = "hsl(28 30% 42%)";
  const cardBg     = "hsl(38 45% 94%)";
  const borderClr  = "hsl(35 28% 74%)";

  const serif = "'Cinzel', 'Playfair Display', serif";
  const body  = "'Lora', 'Noto Serif Telugu', serif";

  return (
    <div style={{ minHeight: "100vh", background: parchment, color: inkDark }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          textAlign: "center",
          padding: "120px 24px 64px",
          background: `linear-gradient(180deg, hsl(28 62% 8%) 0%, hsl(35 55% 18%) 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)",
        }} />

        <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.35em", color: "rgba(212,175,55,0.65)", textTransform: "uppercase", marginBottom: "16px" }}>
          MahabharataDecoded presents
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, color: "#F5E6C8", lineHeight: 1.1, marginBottom: "20px" }}>
          The Story Teller
        </h1>
        <p style={{ fontFamily: body, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(245,230,200,0.65)", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Choose a character. Choose your story. Hear the Mahabharata come alive — narrated by Veda Vyasa himself.
        </p>

        {/* Language + Tone selectors in hero */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "8px" }}>
          {/* Language */}
          <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", padding: "4px" }}>
            {LANGUAGES.map(l => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                style={{
                  padding: "6px 16px", borderRadius: "99px", border: "none", cursor: "pointer",
                  fontFamily: serif, fontSize: "13px",
                  background: language === l.value ? gold : "transparent",
                  color: language === l.value ? "#2A1506" : "rgba(245,230,200,0.65)",
                  transition: "all 0.2s",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Tone */}
          <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", padding: "4px" }}>
            {TONES.map(t => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                title={t.label}
                style={{
                  padding: "6px 14px", borderRadius: "99px", border: "none", cursor: "pointer",
                  fontFamily: serif, fontSize: "13px",
                  background: tone === t.value ? gold : "transparent",
                  color: tone === t.value ? "#2A1506" : "rgba(245,230,200,0.65)",
                  transition: "all 0.2s",
                }}
              >
                {t.icon} {t.label}
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
              {s === "select" ? "Character" : s === "prompt" ? "Story" : "Read"}
            </span>
            {i < 2 && <div style={{ width: "40px", height: "1px", background: "rgba(160,120,32,0.3)" }} />}
          </div>
        ))}
      </div>

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>

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
                  {GROUP_LABELS[g]}
                </button>
              ))}
            </div>

            {/* Character grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "40px" }}>
              {getCharactersByGroup(activeGroup).map(char => {
                const isSelected = selected?.id === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelected(char);
                      setActivePromptIdx(null);
                      setCustomPrompt("");
                      setStep("prompt");
                      setStory("");
                      setError("");
                    }}
                    style={{
                      padding: "16px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                      background: isSelected ? char.accentHex + "18" : cardBg,
                      border: `1.5px solid ${isSelected ? char.accentHex : borderClr}`,
                      transition: "all 0.2s",
                      boxShadow: isSelected ? `0 4px 16px ${char.accentHex}30` : "none",
                    }}
                  >
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{char.icon}</div>
                    <div style={{ fontFamily: serif, fontSize: "14px", fontWeight: 600, color: isSelected ? char.accentHex : inkDark, marginBottom: "4px" }}>
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
              background: cardBg, border: `1px solid ${borderClr}`, borderRadius: "16px",
              padding: "32px", marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "32px" }}>{selected.icon}</span>
              <div>
                <h2 style={{ fontFamily: serif, fontSize: "1.5rem", color: selected.accentHex, margin: 0 }}>
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
                    background: activePromptIdx === i ? selected.accentHex + "15" : "rgba(160,120,32,0.04)",
                    border: `1.5px solid ${activePromptIdx === i ? selected.accentHex : "rgba(160,120,32,0.2)"}`,
                    transition: "all 0.2s",
                    fontFamily: body, fontSize: "14px",
                    color: activePromptIdx === i ? selected.accentHex : inkDark,
                  }}
                >
                  <span style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.08em", color: inkMuted, display: "block", marginBottom: "2px" }}>
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
              disabled={loading || (activePromptIdx === null && !customPrompt.trim())}
              style={{
                marginTop: "16px", padding: "14px 40px", borderRadius: "99px",
                background: (activePromptIdx !== null || customPrompt.trim()) && !loading ? selected.accentHex : "rgba(160,120,32,0.2)",
                color: (activePromptIdx !== null || customPrompt.trim()) && !loading ? "#FFF8E8" : inkMuted,
                border: "none", cursor: (activePromptIdx !== null || customPrompt.trim()) && !loading ? "pointer" : "not-allowed",
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
              ) : (
                "✨ Tell this story"
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
                  Make sure VITE_GEMINI_API_KEY is set in your .env file. Get a free key at ai.google.dev
                </p>
              </div>
            )}

            {/* Story card with 3 tabs */}
            {(loading || story) && (
              <div style={{
                background: `linear-gradient(160deg, hsl(38 50% 96%) 0%, hsl(28 45% 93%) 100%)`,
                border: `1.5px solid ${selected?.accentHex ?? "#A07820"}50`,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              }}>

                {/* ── Tab bar ── */}
                {storyComplete && (
                  <div style={{
                    display: "flex", borderBottom: `1px solid rgba(160,120,32,0.15)`,
                    background: "rgba(160,120,32,0.04)",
                  }}>
                    {([
                      { key: "story",     label: "📖 The Story",    desc: "What happened" },
                      { key: "lesson",    label: "💡 Life Lesson",   desc: "What it means for you" },
                      { key: "situation", label: "🙋 My Situation",  desc: "Your personal guidance" },
                    ] as { key: StoryTab; label: string; desc: string }[]).map(tab => (
                      <button
                        key={tab.key}
                        onClick={async () => {
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
                          background: activeTab === tab.key ? "white" : "transparent",
                          borderBottom: activeTab === tab.key ? `3px solid ${selected?.accentHex ?? "#A07820"}` : "3px solid transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontFamily: serif, fontSize: "12px", fontWeight: 600,
                          color: activeTab === tab.key ? (selected?.accentHex ?? "#A07820") : inkMuted }}>
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
                    background: `linear-gradient(90deg, transparent, ${selected?.accentHex ?? "#A07820"}, transparent)`,
                    marginBottom: "28px", borderRadius: "2px", opacity: 0.7,
                  }} />

                  {/* Character badge */}
                  {selected && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                      <span style={{ fontSize: "24px" }}>{selected.icon}</span>
                      <div>
                        <span style={{ fontFamily: serif, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: selected.accentHex }}>
                          {selected.name}
                        </span>
                        <span style={{ fontFamily: serif, fontSize: "10px", color: inkMuted, marginLeft: "8px" }}>
                          · {TONES.find(t => t.value === tone)?.icon} {TONES.find(t => t.value === tone)?.label} · {LANGUAGES.find(l => l.value === language)?.label}
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
                          fontFamily: body, fontSize: "clamp(1rem, 2vw, 1.15rem)",
                          lineHeight: 2, color: inkDark, whiteSpace: "pre-wrap",
                          userSelect: "none", WebkitUserSelect: "none", minHeight: "120px",
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
                            background: "transparent", border: `1.5px solid ${selected?.accentHex ?? gold}`,
                            cursor: "pointer", fontFamily: serif, fontSize: "13px",
                            color: selected?.accentHex ?? gold, letterSpacing: "0.08em",
                            display: "block", transition: "all 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = (selected?.accentHex ?? gold) + "15"}
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
                        textTransform: "uppercase", color: selected?.accentHex ?? gold, marginBottom: "20px" }}>
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
                          lineHeight: 2, color: inkDark, whiteSpace: "pre-wrap",
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
                        textTransform: "uppercase", color: selected?.accentHex ?? gold, marginBottom: "16px" }}>
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
                              border: `1.5px solid ${situationInput ? (selected?.accentHex ?? gold) : "rgba(160,120,32,0.2)"}`,
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
                              background: situationInput.trim() ? (selected?.accentHex ?? gold) : "rgba(160,120,32,0.2)",
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
                            lineHeight: 2, color: inkDark, whiteSpace: "pre-wrap",
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
                    background: `linear-gradient(90deg, transparent, ${selected?.accentHex ?? "#A07820"}, transparent)`,
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
                    {speaking ? "Stop narration" : "Listen to story"}
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

                {/* Share */}
                <div style={{ marginLeft: "auto" }}>
                  <ShareButtons
                    url={window.location.href}
                    title={`The Story of ${selected?.name} — MahabharataDecoded`}
                    description={story.slice(0, 120) + "…"}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── API Key notice (dev only) ── */}
        {!import.meta.env.VITE_GEMINI_API_KEY && step !== "story" && (
          <div style={{
            marginTop: "48px", padding: "20px 24px", borderRadius: "12px",
            background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)",
          }}>
            <p style={{ fontFamily: serif, fontSize: "13px", color: goldDark, margin: 0 }}>
              🔑 Add <code style={{ background: "rgba(212,175,55,0.15)", padding: "2px 6px", borderRadius: "4px" }}>VITE_GEMINI_API_KEY=your_key</code> to your <code>.env</code> file to activate story generation.
              Get a free key at <a href="https://ai.google.dev" target="_blank" rel="noreferrer" style={{ color: gold }}>ai.google.dev</a>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StoryTeller;
