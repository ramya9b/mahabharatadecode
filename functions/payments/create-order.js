/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/create-order
   Creates a Cashfree Order server-side and returns its
   payment_session_id so the browser can open Cashfree Checkout.
   CASHFREE_SECRET_KEY never reaches the browser.
───────────────────────────────────────────────────────────── */

const PLAN_AMOUNTS = { monthly: 99, yearly: 999 };  // INR (not paise — Cashfree wants rupees)
const API_VERSION  = "2023-08-01";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

/** Cashfree base URL depends on mode. CASHFREE_MODE = "test" | "live" (default test) */
function baseUrl(mode) {
  return mode === "live"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export async function onRequestPost(context) {
  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid JSON" }, 400); }

  const plan   = body?.plan;
  const amount = PLAN_AMOUNTS[plan];
  if (!amount) return json({ error: "Invalid plan" }, 400);

  const appId     = context.env.CASHFREE_APP_ID;
  /* Accept either canonical CASHFREE_SECRET_KEY or the looser CASHFREE_API_KEY
     name since Cashfree's dashboard labels it slightly differently across
     versions and merchants frequently store it as "API key". */
  const secretKey = context.env.CASHFREE_SECRET_KEY || context.env.CASHFREE_API_KEY;
  const mode      = (context.env.CASHFREE_MODE || "test").toLowerCase();
  if (!appId || !secretKey) return json({ error: "Cashfree not configured" }, 500);

  /* Cashfree requires customer_id + customer_phone. Since we don't have
     real user accounts (subscription state is localStorage-only), we
     generate an anonymous id + use a placeholder phone. In test mode
     Cashfree accepts these. For production-real users you'd collect a
     real phone before opening checkout. */
  const orderId      = `mbd_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const customerId   = `anon_${Math.random().toString(36).slice(2, 12)}`;
  const customerPhone = body?.customerPhone || "9999999999";  // optional override

  let res;
  try {
    res = await fetch(`${baseUrl(mode)}/orders`, {
      method: "POST",
      headers: {
        "Content-Type":     "application/json",
        "x-api-version":    API_VERSION,
        "x-client-id":      appId,
        "x-client-secret":  secretKey,
      },
      body: JSON.stringify({
        order_id:       orderId,
        order_amount:   amount,
        order_currency: "INR",
        customer_details: {
          customer_id:    customerId,
          customer_phone: customerPhone,
        },
        order_meta: {
          /* Returned in the success redirect URL — used by frontend
             after the SDK modal closes to call /payments/verify. */
          return_url: `${new URL(context.request.url).origin}/?cf_order_id={order_id}`,
        },
        order_note: `MahabharataDecoded ${plan} pass`,
      }),
    });
  } catch (_) {
    return json({ error: "Network error contacting Cashfree" }, 502);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.payment_session_id) {
    return json({ error: data?.message || "Order creation failed", details: data }, res.status || 500);
  }

  return json({
    orderId:           data.order_id,
    paymentSessionId:  data.payment_session_id,
    amount:            data.order_amount,
    currency:          data.order_currency,
    appId,
    mode,
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
