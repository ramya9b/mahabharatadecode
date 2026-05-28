import { useEffect, useRef, useCallback } from "react";

/* ── Character → mood audio file ────────────────────────────────────
   8 distinct mood loops live at /public/audio/<mood>.mp3.
   Each character belongs to ONE mood. The audio for each mood is a
   real instrument loop (tanpura, bansuri, war drums, sitar, sanskrit
   chant, etc.) so opening different characters gives a meaningfully
   different sonic atmosphere.

   Loops are short (~36-60s) and fade in/out at the edges, so even
   when the HTMLAudio loop re-starts the seam is smooth.
   ────────────────────────────────────────────────────────────────── */

type Mood =
  | "tragic"
  | "devotional"
  | "war"
  | "epic"
  | "philosophical"
  | "shadow"
  | "regal"
  | "mystical";

/* Every character that exists in storyCharacters.ts is mapped here.
   Adding new characters? Add their id → mood here too. The fallback
   below is "epic" but it should never actually fire if all chars are
   mapped. */
const CHAR_MOOD: Record<string, Mood> = {
  /* tragic — fated to suffer, noble sorrow */
  karna:         "tragic",
  draupadi:      "tragic",
  abhimanyu:     "tragic",
  gandhari:      "tragic",

  /* devotional — divine, joyful, blue-sky calm */
  krishna:       "devotional",
  hanuman:       "devotional",
  subhadra:      "devotional",

  /* war — battlefield tension, weapons drawn */
  arjuna:        "war",
  bhima:         "war",
  duryodhana:    "war",
  ashwatthama:   "war",
  dushasana:     "war",

  /* epic — grand, dignified, the patriarch energy */
  bhishma:       "epic",
  drona:         "epic",
  kunti:         "epic",

  /* philosophical — wise narrators, sages, dharma-king */
  vyasa:         "philosophical",
  vidura:        "philosophical",
  yudhishthira:  "philosophical",

  /* shadow — scheming villain */
  shakuni:       "shadow",

  /* regal — kings, courts, ceremonies */
  drupada:       "regal",
  virata:        "regal",
  shalya:        "regal",
  pandu:         "regal",
  dhritarashtra: "regal",

  /* mystical — otherworldly, between worlds */
  parashurama:   "mystical",
  hidimbi:       "mystical",
  nakula:        "mystical",
  sahadeva:      "mystical",
};

const MOOD_SRC: Record<Mood, string> = {
  tragic:        "/audio/tragic.mp3",
  devotional:    "/audio/devotional.mp3",
  war:           "/audio/war.mp3",
  epic:          "/audio/epic.mp3",
  philosophical: "/audio/philosophical.mp3",
  shadow:        "/audio/shadow.mp3",
  regal:         "/audio/regal.mp3",
  mystical:      "/audio/mystical.mp3",
};

const TARGET_VOL = 0.22;          /* soft ambient background */
const FADE_IN_MS = 1500;
const FADE_OUT_MS = 900;

const MUTE_KEY = "mbd_audio_muted";
const isMuted  = () => {
  try { return localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
};
const setMuted = (v: boolean) => {
  try { localStorage.setItem(MUTE_KEY, v ? "1" : "0"); } catch { /* private mode */ }
};

/* ── Hook ─────────────────────────────────────────────────────────── */
export const useCharacterAudio = (characterId: string, active: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef  = useRef<number | null>(null);
  const muteRef  = useRef(isMuted());

  const clearFade = () => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeTo = useCallback((target: number, durationMs: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) { onDone?.(); return; }
    clearFade();
    const start = audio.volume;
    const steps = Math.max(1, Math.round(durationMs / 50));
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i++;
      const t = i / steps;
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * t));
      if (i >= steps) {
        clearFade();
        onDone?.();
      }
    }, 50);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, FADE_OUT_MS, () => {
      audio.pause();
      try { audio.src = ""; audio.load(); } catch { /* noop */ }
      audioRef.current = null;
    });
  }, [fadeTo]);

  const start = useCallback(() => {
    if (muteRef.current) return;
    const mood = CHAR_MOOD[characterId] ?? "epic";
    const src  = MOOD_SRC[mood];
    if (!src) return;

    /* Reuse existing audio element if we're already on the right mood.
       If autoplay was previously blocked the element will still be paused —
       retry play() so we don't silently loop a paused track forever. */
    if (audioRef.current && audioRef.current.src.endsWith(src)) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => { /* still blocked */ });
      }
      fadeTo(TARGET_VOL, FADE_IN_MS);
      return;
    }

    /* Otherwise tear down and create fresh */
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.src = ""; } catch { /* noop */ }
      audioRef.current = null;
    }

    const audio = new Audio(src);
    audio.loop    = true;
    audio.volume  = 0;
    audio.preload = "metadata";  /* fetch headers only — play() streams on demand */
    audioRef.current = audio;

    /* Browser autoplay policies require a user gesture before audio
       can start. Most CharacterModal opens happen as a result of a
       click, so play() should succeed. If it doesn't, we catch and
       stay silent rather than throw. */
    audio.play()
      .then(() => fadeTo(TARGET_VOL, FADE_IN_MS))
      .catch(() => { /* autoplay blocked — silently fail */ });
  }, [characterId, fadeTo]);

  useEffect(() => {
    if (active) start();
    else        stop();
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, characterId]);

  /* Toggle mute externally — used by the mute button in CharacterModal */
  const toggleMute = useCallback(() => {
    const next = !muteRef.current;
    muteRef.current = next;
    setMuted(next);
    if (next) {
      stop();
    } else if (active) {
      start();
    }
    return next;
  }, [active, start, stop]);

  return { toggleMute, isMuted: () => muteRef.current };
};
