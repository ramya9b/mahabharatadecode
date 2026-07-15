/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — POST /payments/entitlement
   "Restore access" — given a phone number, return the active
   (non-expired) subscription recorded server-side, so a paid
   user can unlock a new device/browser without paying again.
───────────────────────────────────────────────────────────── */

import { lookupEntitlement } from "./_shared.js";

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

  const phone = body?.phone;
  if (!phone) return json({ error: "Missing phone" }, 400);

  /* If KV isn't configured, we simply have no record to restore from. */
  if (!context.env.SUBS) {
    return json({ active: false, reason: "not_configured" });
  }

  const rec = await lookupEntitlement(context.env.SUBS, phone);
  if (!rec) return json({ active: false });

  return json({
    active:    true,
    plan:      rec.plan,
    expiresAt: rec.expiresAt,
    orderId:   rec.orderId,
    paymentId: rec.paymentId,
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
