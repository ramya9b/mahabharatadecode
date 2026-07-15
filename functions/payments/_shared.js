/* ─────────────────────────────────────────────────────────────
   Shared helpers for the Cashfree payment functions.
   Files prefixed with "_" are NOT routed by Cloudflare Pages,
   so this is import-only.
───────────────────────────────────────────────────────────── */

const DAY_MS = 24 * 60 * 60 * 1000;

/* Keep these in sync with src/lib/subscription.ts PLANS durations. */
export const PLAN_DAYS = { monthly: 30, yearly: 365 };

/** Extract the plan from our order_id convention: mbd_<plan>_<ts>_<rand>. */
export function planFromOrderId(orderId) {
  const m = /^mbd_(monthly|yearly)_/.exec(orderId || "");
  return m ? m[1] : null;
}

/** Normalise an Indian phone to its last 10 digits, or null if invalid. */
export function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  const last10 = digits.slice(-10);
  return /^[6-9]\d{9}$/.test(last10) ? last10 : null;
}

/** expiry epoch-ms for a plan starting at `fromMs` (defaults to now). */
export function computeExpiry(plan, fromMs) {
  const days = PLAN_DAYS[plan];
  if (!days) return 0;
  return (fromMs || Date.now()) + days * DAY_MS;
}

export const kvOrderKey = (orderId) => `order:${orderId}`;
export const kvPhoneKey = (phone) => `phone:${phone}`;

/**
 * Record a paid entitlement in KV. No-op when KV is not bound, so the
 * site keeps working before the namespace is configured.
 * - order:<id>   → full order record (idempotent audit trail)
 * - phone:<10d>  → the user's best (latest-expiring) active entitlement
 */
export async function recordEntitlement(KV, { orderId, plan, phone, paymentId, amount }) {
  if (!KV || !orderId || !plan) return;

  const now      = Date.now();
  const expiresAt = computeExpiry(plan, now);
  const norm      = normalizePhone(phone);

  const orderRecord = {
    status: "PAID",
    plan,
    amount: amount ?? null,
    paymentId: paymentId || orderId,
    phone: norm,
    expiresAt,
    recordedAt: now,
  };
  try {
    await KV.put(kvOrderKey(orderId), JSON.stringify(orderRecord));
  } catch (_) { /* KV write best-effort */ }

  if (!norm) return;
  try {
    const existingRaw = await KV.get(kvPhoneKey(norm));
    const existing = existingRaw ? JSON.parse(existingRaw) : null;
    /* Only overwrite if this entitlement extends further than what's stored. */
    if (!existing || (existing.expiresAt || 0) < expiresAt) {
      await KV.put(kvPhoneKey(norm), JSON.stringify({
        plan, expiresAt, orderId, paymentId: paymentId || orderId,
      }));
    }
  } catch (_) { /* best-effort */ }
}

/** Look up an active (non-expired) entitlement for a phone. null otherwise. */
export async function lookupEntitlement(KV, phone) {
  if (!KV) return null;
  const norm = normalizePhone(phone);
  if (!norm) return null;
  try {
    const raw = await KV.get(kvPhoneKey(norm));
    if (!raw) return null;
    const rec = JSON.parse(raw);
    if (!rec.expiresAt || rec.expiresAt <= Date.now()) return null;
    return rec;
  } catch (_) {
    return null;
  }
}

/**
 * Verify a Cashfree webhook signature.
 * Cashfree signs: base64( HMAC_SHA256( `${timestamp}${rawBody}`, secret ) ).
 */
export async function verifyWebhookSignature(secret, timestamp, rawBody, signature) {
  if (!secret || !timestamp || !signature) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}${rawBody}`));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
    /* constant-time-ish compare */
    if (expected.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    return diff === 0;
  } catch (_) {
    return false;
  }
}
