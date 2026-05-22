/* ─────────────────────────────────────────────────────────────
   Cloudflare Pages Function — /subscribe
   Proxies newsletter signups to Brevo API server-side.
   API key never exposed to browser.
───────────────────────────────────────────────────────────── */

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { email, source } = await context.request.json();

    /* Basic email validation */
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const BREVO_API_KEY = context.env.BREVO_API_KEY;
    const BREVO_LIST_ID = parseInt(context.env.BREVO_LIST_ID || "2");

    if (!BREVO_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Newsletter not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* Add contact to Brevo list */
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept":       "application/json",
        "content-type": "application/json",
        "api-key":      BREVO_API_KEY,
      },
      body: JSON.stringify({
        email:         email.trim().toLowerCase(),
        listIds:       [BREVO_LIST_ID],
        updateEnabled: true,
        attributes: {
          SOURCE: source || "website",
          SIGNUP_DATE: new Date().toISOString().split("T")[0],
        },
      }),
    });

    /* 204 = already subscribed (updateEnabled updates them), 201 = new */
    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    /* Handle duplicate (contact already exists with same data) */
    const body = await brevoRes.json().catch(() => ({}));
    if (brevoRes.status === 400 && body.code === "duplicate_parameter") {
      return new Response(
        JSON.stringify({ success: true }),   /* treat as success */
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: body.message || "Brevo error" }),
      { status: brevoRes.status, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

/* Handle CORS preflight */
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
