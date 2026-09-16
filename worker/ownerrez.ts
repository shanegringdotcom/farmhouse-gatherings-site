// OwnerRez direct-booking proxy.
//
// Everything here runs server-side only. The Personal Access Token never
// reaches the browser: the client calls /api/ownerrez/*, this module calls
// OwnerRez with HTTP Basic auth, and only a trimmed projection comes back.
//
// Two API versions are in play, deliberately. They are not interchangeable:
//
//   v2 (api.ownerrez.com/v2, snake_case) — calendar + live pricing. Richer,
//     actively documented, and the only version with a real dry-run
//     (POST /v2/quotes with test:true prices a stay without storing anything).
//   v1 (api.ownerrez.com/v1, camelCase) — quote creation for checkout. ONLY v1
//     returns `paymentForm`, the hosted payment + e-sign URL this whole
//     architecture depends on. v2's QuoteViewModel has no URL field at all
//     (verified field-by-field against api.ownerrez.com/help/v2 on 2026-09-16).
//
// So: price with v2, check out with v1. Do not "unify" these on one version
// without re-reading both specs — you lose either the dry-run or the redirect.

const V1 = "https://api.ownerrez.com/v1";
const V2 = "https://api.ownerrez.com/v2";

// OwnerRez asks that every caller identify itself. Unlabelled traffic is the
// first thing they throttle.
const USER_AGENT = "BigLongFarmhouse/1.0 (+https://biglongfarmhouse.com)";

// Guest-count ceilings. These only bound what we forward — OwnerRez still
// enforces the property's real occupancy rules and will reject a bad quote.
const MAX_GUESTS = 40;
const MAX_RANGE_DAYS = 366; // hard limit on GET /v2/calendar/{id}

type Stay = {
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  discountCode?: string;
};

// ---------------------------------------------------------------- utilities

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Prices and availability go stale the moment a booking lands.
      "cache-control": "no-store",
    },
  });

const fail = (message: string, status = 400) => json({ error: message }, status);

const isDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

const countOf = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_GUESTS, Math.max(0, Math.trunc(n)));
};

const nightsBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

/**
 * Call OwnerRez. Auth is HTTP Basic: username is the OwnerRez login email,
 * password is the PAT (the `pt_...` value from app.ownerrez.com/settings/api).
 */
async function orFetch(
  env: Env,
  base: string,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const credentials = btoa(`${env.OWNERREZ_USERNAME}:${env.OWNERREZ_PAT}`);
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      authorization: `Basic ${credentials}`,
      "user-agent": USER_AGENT,
      accept: "application/json",
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
}

/**
 * Read an OwnerRez response, or throw an UpstreamError carrying the status.
 * Upstream error bodies can name the account, other properties, and internal
 * IDs, so they are logged but never forwarded to the browser.
 */
class UpstreamError extends Error {
  constructor(readonly status: number, readonly detail: string) {
    super(`OwnerRez ${status}`);
  }

  /**
   * OwnerRez's own validation text, when this is a rule rejection.
   *
   * These messages are written for humans and are genuinely the best
   * explanation available — "High Season requires arrival day to be on Sunday
   * or Monday or Wednesday or Thursday" tells a guest exactly how to fix their
   * selection, which no message we invent can match. Only validation failures
   * are surfaced (v2 codes the string, v1 codes the number 11); every other
   * upstream error stays generic, since those bodies can name the account.
   */
  get validationMessages(): string[] | null {
    try {
      const parsed = JSON.parse(this.detail) as { code?: unknown; messages?: unknown };
      if (parsed.code !== "validation_failed" && parsed.code !== 11) return null;
      if (!Array.isArray(parsed.messages)) return null;
      const messages = parsed.messages
        .filter((m): m is string => typeof m === "string")
        .map((m) => m.trim().slice(0, 200))
        .filter(Boolean);
      return messages.length ? messages : null;
    } catch {
      return null;
    }
  }
}

async function orJson<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`ownerrez ${label} -> ${res.status}: ${detail.slice(0, 500)}`);
    throw new UpstreamError(res.status, detail);
  }
  return (await res.json()) as T;
}

/** Config check that runs before any handler touches the network. */
function configError(env: Env): string | null {
  if (!env.OWNERREZ_USERNAME || !env.OWNERREZ_PAT) {
    return "OwnerRez credentials are not configured on this Worker.";
  }
  return null;
}

/** The property is pinned server-side — a client may never choose it. */
function propertyId(env: Env): number | null {
  const id = Number(env.OWNERREZ_PROPERTY_ID);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Existing guest id for an email, or null. Best-effort: a failed search just
 * means we create a new guest, which is worse than reusing one but far better
 * than failing the booking.
 */
async function findGuestByEmail(env: Env, email: string): Promise<number | null> {
  const res = await orFetch(env, V2, `/guests?q=${encodeURIComponent(email)}`);
  if (!res.ok) return null;

  const body = (await res.json().catch(() => null)) as {
    items?: Array<{ id?: number; email_addresses?: Array<{ address?: string }> }>;
  } | null;

  const wanted = email.toLowerCase();
  const match = body?.items?.find((g) =>
    g.email_addresses?.some((e) => e.address?.toLowerCase() === wanted)
  );
  return match?.id ?? null;
}

// ------------------------------------------------------------------ handlers

/**
 * GET /api/ownerrez/properties
 *
 * Setup-only discovery: what this account can see, so you can read off the
 * property ID once and pin it in wrangler.jsonc. Returns id/name/active only —
 * no addresses, rates, or owner detail. Self-disables once
 * OWNERREZ_PROPERTY_ID is set, so it is not a permanent listing endpoint.
 */
async function listProperties(env: Env): Promise<Response> {
  if (propertyId(env) !== null) {
    return fail(
      "Disabled: OWNERREZ_PROPERTY_ID is already configured. Unset it to use this discovery route again.",
      410
    );
  }

  const res = await orFetch(env, V2, "/properties?limit=50&include_inactive=false");
  const body = await orJson<{ items?: Array<Record<string, unknown>> }>(res, "GET /v2/properties");

  const items = (body.items ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    active: p.active,
  }));
  return json({ count: items.length, properties: items });
}

/**
 * GET /api/ownerrez/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Nightly calendar for the pinned property. Each entry is a NIGHT (date through
 * the following morning), not a calendar cell — on a turnover day the departing
 * and arriving bookings are different records.
 *
 * Two warnings straight from the OwnerRez docs, both load-bearing for the UI:
 *   1. status "available" does NOT mean bookable — per-night rules
 *      (min_nights, is_stay_disallowed, is_arrival_disallowed, gaps) can still
 *      forbid the stay. That is why `rules` is passed through.
 *   2. This data can lag live changes. It is for painting a calendar, never for
 *      confirming a reservation. The quote endpoints are the source of truth.
 */
async function availability(env: Env, url: URL): Promise<Response> {
  const id = propertyId(env);
  if (id === null) return fail("OWNERREZ_PROPERTY_ID is not configured.", 503);

  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!isDate(from) || !isDate(to)) {
    return fail("`from` and `to` are required, in YYYY-MM-DD format.");
  }

  const span = nightsBetween(from, to);
  if (span < 0) return fail("`to` must be on or after `from`.");
  if (span > MAX_RANGE_DAYS) return fail(`Date range may not exceed ${MAX_RANGE_DAYS} days.`);

  const res = await orFetch(env, V2, `/calendar/${id}?from=${from}&to=${to}`);
  const body = await orJson<{
    currency_code?: string;
    days?: Array<{
      date?: string;
      status?: string;
      rate?: { amount?: number };
      rules?: Record<string, unknown>;
      is_arrival?: boolean;
      is_departure?: boolean;
      holiday_name?: string;
    }>;
  }>(res, `GET /v2/calendar/${id}`);

  // booking_id is deliberately dropped — it identifies other guests' stays and
  // the UI has no use for it.
  const nights = (body.days ?? []).map((d) => ({
    date: d.date?.slice(0, 10),
    status: d.status,
    rate: d.rate?.amount ?? null,
    isArrival: d.is_arrival ?? false,
    isDeparture: d.is_departure ?? false,
    holiday: d.holiday_name ?? null,
    rules: d.rules ?? null,
  }));

  return json({
    propertyId: id,
    currency: body.currency_code ?? "USD",
    from,
    to,
    // Short of the requested range is normal and expected: nights with no
    // calendar data (past the booking window, before recorded history) are
    // omitted upstream rather than returned empty.
    nights,
  });
}

/** Shared parse for the two quote routes. */
function readStay(input: Record<string, unknown>): Stay | string {
  const arrival = input.arrival;
  const departure = input.departure;
  if (!isDate(arrival) || !isDate(departure)) {
    return "`arrival` and `departure` are required, in YYYY-MM-DD format.";
  }
  if (nightsBetween(arrival, departure) < 1) {
    return "`departure` must be at least one night after `arrival`.";
  }

  const adults = countOf(input.adults, 1);
  if (adults < 1) return "At least one adult is required.";

  const discountCode =
    typeof input.discountCode === "string" && input.discountCode.trim()
      ? input.discountCode.trim().slice(0, 64)
      : undefined;

  return {
    arrival,
    departure,
    adults,
    children: countOf(input.children),
    infants: countOf(input.infants),
    pets: countOf(input.pets),
    discountCode,
  };
}

/**
 * POST /api/ownerrez/quote/preview
 *
 * Live price for a stay. Uses v2's `test: true`, which validates and prices the
 * quote — generating charges, applying rules and discounts — but never commits
 * it. Nothing appears in the OwnerRez account, so this is safe to call on every
 * date-picker change.
 *
 * Note the casing: v2 is snake_case (property_id, generate_charges). v1 is
 * camelCase. Sending v1 spellings here silently drops the fields, which yields
 * a quote for the wrong dates rather than an error.
 */
async function quotePreview(env: Env, request: Request): Promise<Response> {
  const id = propertyId(env);
  if (id === null) return fail("OWNERREZ_PROPERTY_ID is not configured.", 503);

  const input = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!input) return fail("Expected a JSON body.");

  const stay = readStay(input);
  if (typeof stay === "string") return fail(stay);

  const res = await orFetch(env, V2, "/quotes", {
    method: "POST",
    body: JSON.stringify({
      property_id: id, // pinned server-side; never taken from the client
      arrival: stay.arrival,
      departure: stay.departure,
      adults: stay.adults,
      children: stay.children,
      infants: stay.infants,
      pets: stay.pets,
      ...(stay.discountCode ? { discount_code: stay.discountCode } : {}),
      test: true, // price it, don't store it
      generate_charges: true, // without this there is nothing to total
      validate_rules: true, // honour min-nights etc. so the price is real
      generate_email: false, // never email a guest for a price check
      hold_dates: false, // a price check must not block the calendar
    }),
  });

  let quote: {
    charges?: Array<{ amount?: number; description?: string; type?: string; position?: number }>;
    check_in?: string;
    check_out?: string;
  };
  try {
    quote = await orJson(res, "POST /v2/quotes (test)");
  } catch (err) {
    // A 4xx here is usually the property's own rules talking (below min nights,
    // dates unavailable). That is a legitimate answer for the UI, not a fault.
    if (err instanceof UpstreamError && err.status >= 400 && err.status < 500) {
      const reason =
        err.validationMessages?.join(" ") ?? "These dates aren't available for the stay you picked.";
      return json({ bookable: false, reason }, 200);
    }
    throw err;
  }

  const charges = (quote.charges ?? []).map((c) => ({
    description: c.description ?? "",
    amount: c.amount ?? 0,
    type: c.type ?? "other",
  }));
  const sumOf = (...types: string[]) =>
    charges.filter((c) => types.includes(c.type)).reduce((n, c) => n + c.amount, 0);

  const total = charges.reduce((n, c) => n + c.amount, 0);

  return json({
    bookable: true,
    nights: nightsBetween(stay.arrival, stay.departure),
    checkIn: quote.check_in ?? null,
    checkOut: quote.check_out ?? null,
    charges,
    subtotals: {
      rent: sumOf("rent"),
      fees: sumOf("surcharge", "surcharge_other"),
      taxes: sumOf("tax", "tax_other"),
    },
    total,
  });
}

/**
 * POST /api/ownerrez/checkout
 *
 * The committing step, and the only one that writes to the OwnerRez account:
 * create the guest, create a real quote, hand back OwnerRez's hosted payment
 * URL. The guest completes payment and signs the rental agreement there — card
 * details never touch this Worker or the browser bundle, which is what keeps
 * the site out of PCI scope.
 *
 * v1 only. `paymentForm` does not exist on v2.
 */
async function checkout(env: Env, request: Request, url: URL): Promise<Response> {
  const id = propertyId(env);
  if (id === null) return fail("OWNERREZ_PROPERTY_ID is not configured.", 503);

  const input = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!input) return fail("Expected a JSON body.");

  const stay = readStay(input);
  if (typeof stay === "string") return fail(stay);

  const firstName = String(input.firstName ?? "").trim().slice(0, 100);
  const lastName = String(input.lastName ?? "").trim().slice(0, 100);
  const email = String(input.email ?? "").trim().slice(0, 255);
  if (!firstName || !lastName) return fail("First and last name are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("A valid email address is required.");

  // Turnstile, same contract as the inquiry form: verified whenever the client
  // sends a token, enforced once TURNSTILE_REQUIRED flips on. This endpoint
  // creates real guest and quote records, so it is the one worth protecting.
  const token = typeof input.turnstileToken === "string" ? input.turnstileToken : "";
  if (env.TURNSTILE_SECRET) {
    if (token) {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: token,
          remoteip: request.headers.get("cf-connecting-ip") ?? "",
        }),
      });
      const outcome = (await verify.json()) as { success: boolean };
      if (!outcome.success) return fail("Verification failed.", 400);
    } else if (env.TURNSTILE_REQUIRED === "true") {
      return fail("Verification required.", 400);
    }
  }

  // 1) Guest. OwnerRez does NOT de-duplicate on email — posting the same
  // address twice yields two guest records — so look first and only create when
  // there is no match. Without this, every abandoned checkout and every repeat
  // booking litters the account with duplicates.
  let guestId = await findGuestByEmail(env, email);
  const createdGuest = guestId === null;

  if (guestId === null) {
    // v1 nests contact details in defaultEmailAddress/defaultPhone.
    const guestRes = await orFetch(env, V1, "/guests", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, defaultEmailAddress: { address: email } }),
    });
    const guest = await orJson<{ id?: number }>(guestRes, "POST /v1/guests");
    if (!guest.id) {
      console.error("ownerrez: guest created without an id");
      return fail("Could not start checkout. Please try again.", 502);
    }
    guestId = guest.id;
  }

  // 2) Quote. camelCase here — this is v1. The omitted fields (payment rules,
  // security deposit, agreement) intentionally fall back to the property's
  // configured defaults, which is what the OwnerRez-documented minimal example
  // does; set them in OwnerRez, not here.
  const quoteRes = await orFetch(env, V1, "/quotes?addCharges=true&sendEmail=false", {
    method: "POST",
    body: JSON.stringify({
      propertyId: id,
      guestId,
      arrival: stay.arrival,
      departure: stay.departure,
      adults: stay.adults,
      children: stay.children,
      infants: stay.infants,
      pets: stay.pets,
      // Where OwnerRez sends the guest once the booking is complete.
      redirectAfterBookingUrl: new URL("/booking-confirmed", url.origin).toString(),
    }),
  });
  let quote: { id?: number; paymentForm?: string };
  try {
    quote = await orJson(quoteRes, "POST /v1/quotes");
  } catch (err) {
    // The guest exists but the quote does not. Roll back anything we created so
    // a rejected stay does not leave an orphan record behind — the rules that
    // reject a quote (season arrival days, min nights) are hit routinely, so
    // this is the common path, not the rare one.
    if (createdGuest && guestId !== null) {
      await orFetch(env, V2, `/guests/${guestId}`, { method: "DELETE" }).catch(() => {});
    }
    // A rule rejection is the guest's to fix, so give them OwnerRez's wording
    // and a 400 rather than a generic 502.
    if (err instanceof UpstreamError && err.status >= 400 && err.status < 500) {
      const messages = err.validationMessages;
      if (messages) return fail(messages.join(" "), 400);
    }
    throw err;
  }

  if (!quote.paymentForm) {
    // Most likely cause: the property has no payment method configured in
    // OwnerRez, so there is no hosted form to send anyone to.
    console.error("ownerrez: quote created without paymentForm", quote.id);
    return fail("Checkout is not available for this property yet.", 502);
  }

  return json({ paymentUrl: quote.paymentForm, quoteId: quote.id ?? null });
}

// -------------------------------------------------------------------- router

export async function handleOwnerRez(request: Request, env: Env, url: URL): Promise<Response> {
  const configProblem = configError(env);
  if (configProblem) {
    console.error(`ownerrez: ${configProblem}`);
    return fail("Booking is temporarily unavailable.", 503);
  }

  const route = url.pathname.replace(/^\/api\/ownerrez\/?/, "").replace(/\/$/, "");
  const { method } = request;

  try {
    if (method === "GET" && route === "properties") return await listProperties(env);
    if (method === "GET" && route === "availability") return await availability(env, url);
    if (method === "POST" && route === "quote/preview") return await quotePreview(env, request);
    if (method === "POST" && route === "checkout") return await checkout(env, request, url);
    return fail("Not found", 404);
  } catch (err) {
    if (err instanceof UpstreamError) {
      // 401/403 means our credentials, not the guest's request.
      const status = err.status === 401 || err.status === 403 ? 503 : 502;
      return fail("Booking is temporarily unavailable.", status);
    }
    console.error("ownerrez: unhandled", (err as Error).message);
    return fail("Booking is temporarily unavailable.", 500);
  }
}
