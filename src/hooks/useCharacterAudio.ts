import { useEffect, useRef, useCallback } from "react";

/* ── Mood → musical profile map ────────────────────────────────────
   Each preset is a chord of oscillators with different
   frequencies, wave types, and volumes that evoke the
   character's emotional world.
   ────────────────────────────────────────────────────────────────── */
interface AudioPreset {
  notes:  number[];       /* Hz — root + overtones */
  type:   OscillatorType;
  tempo:  number;         /* slow pulse rate (ms between beats) */
  reverb: number;         /* 0–1 reverb wetness */
  gain:   number;         /* master volume 0–1 */
}

const PRESETS: Record<string, AudioPreset> = {
  /* Karna — D minor, tragic, low warm drone */
  tragic: {
    notes: [146.83, 220.00, 261.63, 174.61],
    type:  "sine",
    tempo: 3200,
    reverb: 0.72,
    gain:  0.10,
  },
  /* Krishna — G major, bright celestial, divine shimmer */
  devotional: {
    notes: [196.00, 246.94, 293.66, 392.00],
    type:  "sine",
    tempo: 2400,
    reverb: 0.65,
    gain:  0.09,
  },
  /* Arjuna — E minor, tense warrior pulse */
  war: {
    notes: [164.81, 196.00, 246.94, 329.63],
    type:  "triangle",
    tempo: 1800,
    reverb: 0.50,
    gain:  0.08,
  },
  /* Draupadi / Bhishma / general epic */
  epic: {
    notes: [130.81, 196.00, 261.63, 311.13],
    type:  "sine",
    tempo: 2800,
    reverb: 0.70,
    gain:  0.09,
  },
  /* Philosophical / sages */
  philosophical: {
    notes: [174.61, 220.00, 261.63, 349.23],
    type:  "sine",
    tempo: 4000,
    reverb: 0.80,
    gain:  0.08,
  },
};

/* Map character ids → mood preset key */
const CHAR_MOOD: Record<string, keyof typeof PRESETS> = {
  karna:         "tragic",
  draupadi:      "tragic",
  abhimanyu:     "tragic",
  krishna:       "devotional",
  hanuman:       "devotional",
  vyasa:         "philosophical",
  vidura:        "philosophical",
  arjuna:        "war",
  bhima:         "war",
  duryodhana:    "war",
  ashwatthama:   "war",
  dushasana:     "war",
  bhishma:       "epic",
  drona:         "epic",
  yudhishthira:  "philosophical",
  kunti:         "epic",
  gandhari:      "tragic",
  subhadra:      "devotional",
};

const MUTE_KEY = "mbd_audio_muted";

const isMuted  = () => localStorage.getItem(MUTE_KEY) === "1";
const setMuted = (v: boolean) => localStorage.setItem(MUTE_KEY, v ? "1" : "0");

/* ── Hook ─────────────────────────────────────────────────────────── */
export const useCharacterAudio = (characterId: string, active: boolean) => {
  const ctxRef   = useRef<AudioContext | null>(null);
  const oscsRef  = useRef<OscillatorNode[]>([]);
  const gainRef  = useRef<GainNode | null>(null);
  const muteRef  = useRef(isMuted());

  const stop = useCallback(() => {
    if (!ctxRef.current || !gainRef.current) return;
    const g   = gainRef.current;
    const now = ctxRef.current.currentTime;
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.linearRampToValueAtTime(0, now + 1.8);
    setTimeout(() => {
      oscsRef.current.forEach(o => { try { o.stop(); } catch(_) {} });
      oscsRef.current = [];
      ctxRef.current?.close();
      ctxRef.current = null;
    }, 2000);
  }, []);

  const start = useCallback(() => {
    if (muteRef.current) return;
    const moodKey = CHAR_MOOD[characterId] ?? "epic";
    const preset  = PRESETS[moodKey];

    try {
      const ctx    = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      /* Reverb via convolver ---------------------------------------- */
      const convolver = ctx.createConvolver();
      const bufLen    = ctx.sampleRate * 3;
      const revBuf    = ctx.createBuffer(2, bufLen, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = revBuf.getChannelData(c);
        for (let i = 0; i < bufLen; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
      }
      convolver.buffer = revBuf;

      /* Master gain — fade in over 2 seconds */
      const masterGain  = ctx.createGain();
      gainRef.current   = masterGain;
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(preset.gain, ctx.currentTime + 2);

      /* Dry/wet mix */
      const dryGain = ctx.createGain();
      const wetGain = ctx.createGain();
      dryGain.gain.value = 1 - preset.reverb;
      wetGain.gain.value = preset.reverb;
      convolver.connect(wetGain);
      dryGain.connect(masterGain);
      wetGain.connect(masterGain);
      masterGain.connect(ctx.destination);

      /* Create one oscillator per note with slight detuning */
      preset.notes.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gn   = ctx.createGain();
        osc.type   = preset.type;
        osc.frequency.value = freq;
        osc.detune.value    = (i % 2 === 0 ? 1 : -1) * (i * 1.5); /* micro-detune */
        gn.gain.value       = 1 / preset.notes.length;
        osc.connect(gn);
        gn.connect(dryGain);
        gn.connect(convolver);
        osc.start();
        oscsRef.current.push(osc);

        /* Slow tremolo pulse */
        const lfo     = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 1000 / preset.tempo;
        lfoGain.gain.value  = 0.015;
        lfo.connect(lfoGain);
        lfoGain.connect(gn.gain);
        lfo.start();
        oscsRef.current.push(lfo);
      });
    } catch (err) {
      console.warn("Audio not available:", err);
    }
  }, [characterId]);

  /* Start/stop based on active flag */
  useEffect(() => {
    if (active) {
      start();
    } else {
      stop();
    }
    return () => { stop(); };
  }, [active, characterId]);

  /* Toggle mute externally */
  const toggleMute = useCallback(() => {
    const next = !muteRef.current;
    muteRef.current = next;
    setMuted(next);
    if (next) {
      /* Fade out */
      if (gainRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime;
        gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
        gainRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
      }
    } else {
      /* Fade in — need to restart */
      stop();
      setTimeout(start, 600);
    }
    return next;
  }, [start, stop]);

  return { toggleMute, isMuted: () => muteRef.current };
};
