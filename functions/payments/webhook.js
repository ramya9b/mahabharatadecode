/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/webhook
   Cashfree calls this server-to-server when a payment settles.
   This is the authoritative record: even if the user closes the
   tab before the inline verify runs, the webhook still grants
   their entitlement in KV.

   Configure this URL in Cashfree Dashboard → Developers → Webhooks:
     https://mahabharatadecoded.com/payments/webhook
   The signature is verified with CASHFREE_SECRET_KEY.
───────────────────────────────────────────────────────────── */

import { recordEntitlement, planFromOrderId, verifyWebhookSignature } from "./_shared.js";

export async function onRequestPost(context) {
  const secret =
    context.env.CASHFREE_SECRET_KEY || context.env.CASHFREE_API_KEY;

  /* Read the RAW body — signature is computed over the exact bytes. */
  const rawBody   = await context.request.text();
  const timestamp = context.request.headers.get("x-webhook-timestamp");
  const signature = context.request.headers.get("x-webhook-signature");

  /* Reject anything we can't authenticate. If no secret is configured we
     cannot verify, so we refuse rather than trust an unsigned caller. */
  const ok = await verifyWebhookSignature(secret, timestamp, rawBody, signature);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return new Response("bad json", { status: 400 }); }

  /* Cashfree PG webhook shape: { type, data: { order, payment, customer_details } } */
  const data      = event?.data || {};
  const order     = data.order || {};
  const payment   = data.payment || {};
  const customer  = data.customer_details || {};
  const orderId   = order.order_id;
  const isPaid    =
    (event?.type && String(event.type).toUpperCase().includes("SUCCESS")) ||
    String(payment.payment_status || "").toUpperCase() === "SUCCESS";

  /* Always 200 to non-payment events so Cashfree doesn't retry needlessly. */
  if (!orderId || !isPaid) {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  await recordEntitlement(context.env.SUBS, {
    orderId,
    plan:      planFromOrderId(orderId),
    phone:     customer.customer_phone || order.customer_phone || null,
    paymentId: payment.cf_payment_id ? String(payment.cf_payment_id) : orderId,
    amount:    order.order_amount ?? payment.payment_amount ?? null,
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/* Cashfree may probe with GET; respond 200 so the endpoint validates. */
export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
