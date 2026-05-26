/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/create-order
   Creates a Razorpay Order server-side and returns its id so the
   browser can open Razorpay Checkout. RAZORPAY_KEY_SECRET never
   reaches the browser.
───────────────────────────────────────────────────────────── */

const PLAN_AMOUNTS = { monthly: 9900, yearly: 99900 };

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

export async function onRequestPost(context) {
  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid JSON" }, 400); }

  const plan = body?.plan;
  const amount = PLAN_AMOUNTS[plan];
  if (!amount) return json({ error: "Invalid plan" }, 400);

  const keyId     = context.env.RAZORPAY_KEY_ID;
  const keySecret = context.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return json({ error: "Razorpay not configured" }, 500);

  const auth = btoa(`${keyId}:${keySecret}`);
  let res;
  try {
    res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt:  `mbd_${Date.now()}`,
        notes:    { plan },
      }),
    });
  } catch (_) {
    return json({ error: "Network error contacting Razorpay" }, 502);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return json({ error: data?.error?.description || "Order creation failed" }, res.status);
  }

  return json({
    orderId:  data.id,
    amount:   data.amount,
    currency: data.currency,
    keyId,
    plan,
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
