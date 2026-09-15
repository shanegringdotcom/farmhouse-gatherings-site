/// <reference path="../worker-configuration.d.ts" />

// Secrets/vars not present in wrangler.jsonc, so `wrangler types` can't see
// them: TURNSTILE_SECRET via `wrangler secret put`, TURNSTILE_REQUIRED via
// vars once enforcement flips on.
declare global {
  interface Env {
    TURNSTILE_SECRET?: string;
    TURNSTILE_REQUIRED?: string;
  }
}

// The site's Worker: static assets do almost everything (see wrangler.jsonc);
// this script only handles the routes listed in assets.run_worker_first —
// the /welcome rewrite, the inquiry form POST — plus host canonicalization.

const CANONICAL_HOST = "biglongfarmhouse.com";
const NOTIFY_TO = "shane@shanegring.com";
const FROM = { email: "noreply@biglongfarmhouse.com", name: "Farmhouse Inquiries" };

// Mirrors the zod schema in src/components/InquirySection.tsx — keep in sync.
const LIMITS = { name: 100, email: 255, dates: 200, group: 100, message: 2000 } as const;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // www (or any other alias) → apex, 301. Replaces Netlify's canonical-host
    // redirect rule. workers.dev/localhost pass through for pre-cutover testing.
    if (
      url.hostname !== CANONICAL_HOST &&
      !url.hostname.endsWith(".workers.dev") &&
      url.hostname !== "localhost" &&
      url.hostname !== "127.0.0.1"
    ) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // Inquiry form. /__forms.html is the path the Netlify-era client bundle
    // POSTs to (see the history in src/components/InquirySection.tsx);
    // /api/inquiry is the go-forward name. Both stay accepted indefinitely —
    // cached JS bundles keep using the old one for a while.
    if (
      request.method === "POST" &&
      (url.pathname === "/__forms.html" || url.pathname === "/api/inquiry")
    ) {
      return handleInquiry(request, env);
    }

    // /welcome: client-rendered private guest route, deliberately not
    // prerendered. Serve the homepage shell with a genuine 200 — its canonical
    // points at "/", which is what keeps /welcome out of the index. (Fetch "/"
    // rather than "/index.html": html_handling would redirect the latter.)
    if (url.pathname === "/welcome" && (request.method === "GET" || request.method === "HEAD")) {
      const shell = await env.ASSETS.fetch(new URL("/", request.url));
      return new Response(shell.body, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=0, must-revalidate",
        },
      });
    }

    // Anything else routed worker-first falls through to assets.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return new Response("Unsupported media type", { status: 415 });
  }

  const body = new URLSearchParams(await request.text());
  if (body.get("form-name") !== "inquiry") {
    return new Response("Unknown form", { status: 400 });
  }

  const field = (key: string, max: number) => (body.get(key) ?? "").trim().slice(0, max);
  const data = {
    name: field("name", LIMITS.name),
    email: field("email", LIMITS.email),
    dates: field("dates", LIMITS.dates),
    group: field("group", LIMITS.group),
    message: field("message", LIMITS.message),
  };
  // Honeypot: a filled bot-field gets a 200 (nothing for the bot to learn)
  // and a flagged row — never an email. Netlify discarded these invisibly,
  // which once cost days of debugging; we keep the evidence.
  const isBot = (body.get("bot-field") ?? "") !== "";

  if (!isBot && (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    return new Response("Invalid submission", { status: 400 });
  }

  // Turnstile: verified when the client sends a token. Enforcement (rejecting
  // token-less POSTs) waits for TURNSTILE_REQUIRED=true, once every cached
  // pre-Turnstile bundle has drained.
  const turnstileToken = body.get("cf-turnstile-response");
  if (!isBot && env.TURNSTILE_SECRET) {
    if (turnstileToken) {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: request.headers.get("cf-connecting-ip") ?? "",
        }),
      });
      const outcome = (await verify.json()) as { success: boolean };
      if (!outcome.success) return new Response("Verification failed", { status: 400 });
    } else if (env.TURNSTILE_REQUIRED === "true") {
      return new Response("Verification required", { status: 400 });
    }
  }

  // Store first — the D1 row is the source of truth; email is best-effort.
  await env.DB.prepare(
    `INSERT INTO inquiries (name, email, dates, group_size, message, ip, user_agent, bot)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
  )
    .bind(
      data.name,
      data.email,
      data.dates,
      data.group,
      data.message,
      request.headers.get("cf-connecting-ip"),
      request.headers.get("user-agent"),
      isBot ? 1 : 0
    )
    .run();

  if (!isBot) {
    try {
      const lines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Dates: ${data.dates || "—"}`,
        `Group size: ${data.group || "—"}`,
        "",
        data.message || "(no message)",
        "",
        "— biglongfarmhouse.com inquiry form",
      ];
      await env.EMAIL.send({
        to: NOTIFY_TO,
        from: FROM,
        replyTo: data.email, // hit Reply to talk straight to the guest
        subject: `Booking inquiry from ${data.name}`,
        text: lines.join("\n"),
        html: `<table cellpadding="4">
          <tr><td><b>Name</b></td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td><b>Dates</b></td><td>${escapeHtml(data.dates) || "—"}</td></tr>
          <tr><td><b>Group size</b></td><td>${escapeHtml(data.group) || "—"}</td></tr>
        </table>
        <p style="white-space:pre-wrap">${escapeHtml(data.message) || "(no message)"}</p>
        <p>— biglongfarmhouse.com inquiry form</p>`,
      });
    } catch (err) {
      // The lead is already in D1 — never fail the request over the email.
      console.error("inquiry email failed:", (err as Error).message);
    }
  }

  // The client fires GA4 form_submit + generate_lead only on a 2xx.
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
