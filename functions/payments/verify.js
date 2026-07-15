/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/verify
   After Cashfree Checkout closes, the frontend asks us to verify
   the order status. We query Cashfree's GET /orders/{order_id}
   server-side (so the browser can't fake a "PAID" claim).
───────────────────────────────────────────────────────────── */

import { recordEntitlement, planFromOrderId } from "./_shared.js";

const API_VERSION = "2023-08-01";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function baseUrl(mode) {
  return mode === "live"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export async function onRequestPost(context) {
  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid JSON" }, 400); }

  const { orderId, plan } = body || {};
  if (!orderId) return json({ error: "Missing orderId" }, 400);

  const appId     = context.env.CASHFREE_APP_ID;
  /* Accept either canonical CASHFREE_SECRET_KEY or the looser CASHFREE_API_KEY name. */
  const secretKey = context.env.CASHFREE_SECRET_KEY || context.env.CASHFREE_API_KEY;
  const mode      = (context.env.CASHFREE_MODE || "test").toLowerCase();
  if (!appId || !secretKey) return json({ error: "Cashfree not configured" }, 500);

  let res;
  try {
    res = await fetch(`${baseUrl(mode)}/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: {
        "x-api-version":   API_VERSION,
        "x-client-id":     appId,
        "x-client-secret": secretKey,
      },
    });
  } catch (_) {
    return json({ error: "Network error contacting Cashfree" }, 502);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return json({ error: data?.message || "Verification request failed" }, res.status || 500);
  }

  /* order_status values: ACTIVE | PAID | EXPIRED | TERMINATED | TERMINATION_REQUESTED */
  if (data.order_status !== "PAID") {
    return json({
      verified: false,
      status:   data.order_status,
      message:  `Order is ${data.order_status}, not PAID`,
    }, 400);
  }

  const resolvedPlan = plan || planFromOrderId(data.order_id);
  const phone        = data?.customer_details?.customer_phone || null;
  const paymentId    = data.cf_order_id ? String(data.cf_order_id) : data.order_id;

  /* Persist entitlement server-side (KV) so it survives across devices and
     can be restored by phone. No-op if the SUBS KV binding isn't set yet. */
  await recordEntitlement(context.env.SUBS, {
    orderId:   data.order_id,
    plan:      resolvedPlan,
    phone,
    paymentId,
    amount:    data.order_amount,
  });

  return json({
    verified:  true,
    plan:      resolvedPlan,
    orderId:   data.order_id,
    paymentId,
    amount:    data.order_amount,
    phone,
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
