/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/verify
   Verifies the HMAC-SHA256 signature Razorpay returns after a
   successful Checkout. Confirms the payment is genuine before the
   client unlocks access in localStorage.
───────────────────────────────────────────────────────────── */

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

async function hmacSha256Hex(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time hex string comparison */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestPost(context) {
  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid JSON" }, 400); }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return json({ error: "Missing payment fields" }, 400);
  }

  const keySecret = context.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return json({ error: "Razorpay not configured" }, 500);

  const expected = await hmacSha256Hex(
    `${razorpay_order_id}|${razorpay_payment_id}`,
    keySecret
  );

  if (!timingSafeEqual(expected, razorpay_signature)) {
    return json({ error: "Invalid signature" }, 400);
  }

  return json({
    verified:  true,
    plan,
    paymentId: razorpay_payment_id,
    orderId:   razorpay_order_id,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
