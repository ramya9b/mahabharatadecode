/**
 * Temple ghanta, synthesised with the Web Audio API.
 *
 * A field recording would be warmer, but a bell *is* additive synthesis at
 * heart: a struck metal shell rings a fixed set of inharmonic partials, each
 * decaying at its own rate. Building it from oscillators costs no download,
 * no licence, and no cache miss on a first visit — which matters when the
 * point is for it to sound the moment somebody arrives.
 *
 * To swap in a real recording later, replace ringBells() with an <audio>
 * element; the calling contract (a promise, and canRing()) stays the same.
 */

/* ratio to the strike tone · relative loudness · decay seconds.
   Unlike a harmonic series these ratios are deliberately irrational-ish —
   that inharmonicity is what stops it sounding like an organ. */
const PARTIALS: ReadonlyArray<{ r: number; g: number; d: number }> = [
  { r: 0.50, g: 0.30, d: 7.0 },   /* hum — felt more than heard */
  { r: 1.00, g: 1.00, d: 5.5 },   /* prime */
  { r: 1.19, g: 0.34, d: 4.0 },   /* tierce */
  { r: 1.56, g: 0.30, d: 3.4 },   /* quint */
  { r: 2.00, g: 0.48, d: 3.0 },   /* nominal */
  { r: 2.63, g: 0.27, d: 2.2 },
  { r: 3.42, g: 0.19, d: 1.6 },
  { r: 4.51, g: 0.13, d: 1.1 },
  { r: 5.88, g: 0.08, d: 0.70 },
  { r: 7.71, g: 0.05, d: 0.45 },  /* the bright clang of the first instant */
];

type Ctor = typeof AudioContext;
let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (ctx) return ctx;
  const W = window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  const C = W.AudioContext ?? W.webkitAudioContext;
  if (!C) return null;
  try { ctx = new C(); } catch { return null; }
  return ctx;
}

export function canRing(): boolean {
  const W = window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  return Boolean(W.AudioContext ?? W.webkitAudioContext);
}

/** The strike itself — the hammer on metal, before the shell rings. */
function transient(c: AudioContext, dest: AudioNode, at: number, level: number) {
  const n = Math.floor(c.sampleRate * 0.05);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) {
    /* white noise under a steep decay */
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2600;
  bp.Q.value = 0.7;
  const g = c.createGain();
  g.gain.value = level * 0.5;
  src.connect(bp).connect(g).connect(dest);
  src.start(at);
  src.stop(at + 0.06);
}

function strike(c: AudioContext, dest: AudioNode, at: number, base: number, level: number) {
  transient(c, dest, at, level);
  for (const { r, g, d } of PARTIALS) {
    const osc = c.createOscillator();
    osc.type = "sine";
    /* a few cents of detune per partial keeps it from sounding synthetic */
    osc.frequency.value = base * r;
    osc.detune.value = (r * 37) % 11 - 5;

    const amp = c.createGain();
    const peak = Math.max(0.0001, g * level);
    amp.gain.setValueAtTime(0.0001, at);
    amp.gain.exponentialRampToValueAtTime(peak, at + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + d);

    osc.connect(amp).connect(dest);
    osc.start(at);
    osc.stop(at + d + 0.1);
  }
}

/**
 * Ring the bells. Resolves once scheduled — not once silent.
 * Returns false if audio is unavailable or still blocked by the browser.
 */
export async function ringBells(volume = 0.16): Promise<boolean> {
  const c = context();
  if (!c) return false;

  if (c.state === "suspended") {
    try { await c.resume(); } catch { /* no gesture yet */ }
  }
  if (c.state !== "running") return false;

  const master = c.createGain();
  master.gain.value = volume;

  /* Keeps the stacked partials from clipping on the strike. */
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;

  /* Rolls off the harshest top end — a bell in open air, not in your ear. */
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 7000;

  master.connect(comp).connect(lp).connect(c.destination);

  const t = c.currentTime + 0.02;
  /* Two bells, the second a fifth up and a beat behind, as a pair is rung. */
  strike(c, master, t,        421, 1.00);
  strike(c, master, t + 0.62, 632, 0.72);
  strike(c, master, t + 1.34, 421, 0.46);

  return true;
}
