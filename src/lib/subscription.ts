/* ─────────────────────────────────────────────────────────────
   Subscription + trial state — localStorage-only.
   14-day free trial from first visit; paid plans extend access.
   5 articles are permanently free — no trial or payment needed.
───────────────────────────────────────────────────────────── */

const TRIAL_KEY = "mbd_trial_start";
const SUB_KEY   = "mbd_subscription";

const DAY_MS    = 24 * 60 * 60 * 1000;
export const TRIAL_DAYS = 14;
const TRIAL_MS  = TRIAL_DAYS * DAY_MS;

/* ── Permanently free articles — no login or payment needed ── */
export const FREE_ARTICLE_SLUGS: string[] = [
  "karna-loyalty-vs-self-respect",
  "who-caused-mahabharata-war",
  "duryodhana-why-he-was-not-wrong",
  "bhagavad-gita-lessons-workplace-stress",
  "draupadi-humiliation-dice-game",
];

export function isArticleFree(slug: string): boolean {
  return FREE_ARTICLE_SLUGS.includes(slug);
}

export type PlanId = "monthly" | "yearly";

export interface Subscription {
  plan: PlanId;
  expiresAt: number;   // epoch ms
  paymentId: string;
  orderId: string;
}

export interface Plan {
  id: PlanId;
  label: string;
  priceInr: number;
  amountPaise: number;
  durationMs: number;
  tagline: string;
  perMonth: string;
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    priceInr: 99,
    amountPaise: 9900,
    durationMs: 30 * DAY_MS,
    tagline: "Cancel anytime",
    perMonth: "₹99/month",
  },
  yearly: {
    id: "yearly",
    label: "Yearly",
    priceInr: 999,
    amountPaise: 99900,
    durationMs: 365 * DAY_MS,
    tagline: "Save ₹189 — 2 months free",
    perMonth: "₹83/month",
  },
};

const safeStorage = {
  get(k: string): string | null {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string): void {
    try { localStorage.setItem(k, v); } catch { /* private mode */ }
  },
};

export function getTrialStart(): number {
  const v = safeStorage.get(TRIAL_KEY);
  if (v) {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n;
  }
  const now = Date.now();
  safeStorage.set(TRIAL_KEY, String(now));
  return now;
}

export function trialDaysLeft(): number {
  const remaining = TRIAL_MS - (Date.now() - getTrialStart());
  return Math.max(0, Math.ceil(remaining / DAY_MS));
}

export function isInTrial(): boolean {
  return trialDaysLeft() > 0;
}

export function getSubscription(): Subscription | null {
  const raw = safeStorage.get(SUB_KEY);
  if (!raw) return null;
  try {
    const sub = JSON.parse(raw) as Subscription;
    if (!sub.expiresAt || sub.expiresAt <= Date.now()) return null;
    return sub;
  } catch {
    return null;
  }
}

export function setSubscription(sub: Subscription): void {
  safeStorage.set(SUB_KEY, JSON.stringify(sub));
}

export function hasAccess(): boolean {
  return isInTrial() || getSubscription() !== null;
}

export function planExpiry(plan: PlanId): number {
  return Date.now() + PLANS[plan].durationMs;
}

/* ── Customer phone — our (account-less) identity for cross-device restore ── */
const PHONE_KEY = "mbd_phone";

export function getStoredPhone(): string | null {
  const v = safeStorage.get(PHONE_KEY);
  return v && /^[6-9]\d{9}$/.test(v) ? v : null;
}

export function setStoredPhone(phone: string): void {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (/^[6-9]\d{9}$/.test(digits)) safeStorage.set(PHONE_KEY, digits);
}

/** Parse the plan out of an order id (mbd_<plan>_<ts>_<rand>). */
export function planFromOrderId(orderId: string): PlanId | null {
  const m = /^mbd_(monthly|yearly)_/.exec(orderId || "");
  return m ? (m[1] as PlanId) : null;
}

/* ── Daily story limit ── */
const DAILY_KEY  = "mbd_daily_stories";
export const FREE_DAILY_LIMIT = 3;

interface DailyRecord {
  date: string;
  count: number;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyRecord(): DailyRecord {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) {
      const rec = JSON.parse(raw) as DailyRecord;
      if (rec.date === todayStr()) return rec;
    }
  } catch { /* private mode */ }
  return { date: todayStr(), count: 0 };
}

export function dailyStoriesUsed(): number {
  return getDailyRecord().count;
}

export function dailyStoriesLeft(): number {
  return Math.max(0, FREE_DAILY_LIMIT - dailyStoriesUsed());
}

export function canGenerateStory(): boolean {
  if (getSubscription() !== null) return true;
  return dailyStoriesLeft() > 0;
}

export function recordStoryGenerated(): void {
  const rec = getDailyRecord();
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify({
      date: todayStr(),
      count: rec.count + 1,
    }));
  } catch { /* private mode */ }
}
