/* ─────────────────────────────────────────────────────────────
   Subscription + trial state — localStorage-only.
   14-day free trial from first visit; paid plans extend access.
───────────────────────────────────────────────────────────── */

const TRIAL_KEY = "mbd_trial_start";
const SUB_KEY   = "mbd_subscription";

const DAY_MS    = 24 * 60 * 60 * 1000;
export const TRIAL_DAYS = 14;
const TRIAL_MS  = TRIAL_DAYS * DAY_MS;

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
  priceInr: number;       // display price
  amountPaise: number;    // amount sent to Razorpay
  durationMs: number;
  tagline: string;
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    priceInr: 99,
    amountPaise: 9900,
    durationMs: 30 * DAY_MS,
    tagline: "Cancel anytime",
  },
  yearly: {
    id: "yearly",
    label: "Yearly",
    priceInr: 999,
    amountPaise: 99900,
    durationMs: 365 * DAY_MS,
    tagline: "Save ₹189 vs monthly",
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

/** Read trial start; initialize to "now" on first call. */
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

/* ─────────────────────────────────────────────────────────────
   Daily story limit for free / trial users
   Paid subscribers get unlimited stories.
   Free limit: 3 stories per calendar day (resets at midnight).
───────────────────────────────────────────────────────────── */

const DAILY_KEY  = "mbd_daily_stories";
export const FREE_DAILY_LIMIT = 3;

interface DailyRecord {
  date: string;  // YYYY-MM-DD local date
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

/** Number of stories generated today (free users). */
export function dailyStoriesUsed(): number {
  return getDailyRecord().count;
}

/** Stories remaining today for free users. */
export function dailyStoriesLeft(): number {
  return Math.max(0, FREE_DAILY_LIMIT - dailyStoriesUsed());
}

/** Returns true if the user can generate another story right now. */
export function canGenerateStory(): boolean {
  if (getSubscription() !== null) return true;   // paid — unlimited
  return dailyStoriesLeft() > 0;
}

/** Call this after a story is successfully generated. */
export function recordStoryGenerated(): void {
  const rec = getDailyRecord();
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify({
      date: todayStr(),
      count: rec.count + 1,
    }));
  } catch { /* private mode */ }
}
