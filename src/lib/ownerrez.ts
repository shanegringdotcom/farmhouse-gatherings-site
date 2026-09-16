// Client-side helpers for the OwnerRez direct-booking flow.
//
// This module talks only to our own Worker (/api/ownerrez/*), never to
// OwnerRez. There is no token here and there must never be one: anything this
// file can read ships in the JS bundle. See worker/ownerrez.ts for the proxy.
//
// The flow a booking component drives:
//   1. getAvailability()  — paint the calendar (which nights are open)
//   2. getQuote()         — live total for the selected range (nothing stored)
//   3. startCheckout()    — leave the site for OwnerRez's hosted payment page

const BASE = "/api/ownerrez";

export type NightStatus = "available" | "booked" | "blocked" | "gap" | "unavailable";

/** Per-night booking rules. Absent when nothing restricts the night. */
export type NightRules = {
  min_nights?: number;
  max_nights?: number;
  is_stay_disallowed?: boolean;
  is_arrival_disallowed?: boolean;
  is_departure_disallowed?: boolean;
  is_gap_required?: boolean;
};

export type Night = {
  /** YYYY-MM-DD, property-local. This is a NIGHT, not a calendar cell. */
  date: string;
  status: NightStatus;
  /** Nightly rate excluding fees and taxes; null when unpriced. */
  rate: number | null;
  isArrival: boolean;
  isDeparture: boolean;
  holiday: string | null;
  rules: NightRules | null;
};

export type Availability = {
  propertyId: number;
  currency: string;
  from: string;
  to: string;
  nights: Night[];
};

export type QuoteCharge = {
  description: string;
  amount: number;
  type: "rent" | "surcharge" | "tax" | "tax_other" | "surcharge_other" | string;
};

export type Quote =
  | { bookable: false; reason: string }
  | {
      bookable: true;
      nights: number;
      checkIn: string | null;
      checkOut: string | null;
      charges: QuoteCharge[];
      subtotals: { rent: number; fees: number; taxes: number };
      total: number;
    };

export type StayRequest = {
  /** YYYY-MM-DD */
  arrival: string;
  /** YYYY-MM-DD */
  departure: string;
  adults: number;
  children?: number;
  infants?: number;
  pets?: number;
  discountCode?: string;
};

export type GuestDetails = {
  firstName: string;
  lastName: string;
  email: string;
  /** Turnstile token, when the widget is on the page. */
  turnstileToken?: string;
};

/** Thrown for any non-2xx from our Worker. `status` is the Worker's, not OwnerRez's. */
export class BookingError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "BookingError";
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { accept: "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new BookingError("Couldn't reach the booking service. Check your connection.", 0);
  }

  const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) {
    throw new BookingError(body?.error ?? "Something went wrong. Please try again.", res.status);
  }
  if (body === null) throw new BookingError("The booking service returned an unreadable response.", res.status);
  return body;
}

// ------------------------------------------------------------------ requests

/**
 * Nightly availability and rates. Range may not exceed 366 days.
 *
 * Treat the result as display data only. A night marked "available" can still
 * be unbookable — rules decide that (see isRangeBookable), and the calendar can
 * lag a live booking by a short time. Only a quote confirms a stay is real.
 */
export function getAvailability(from: string, to: string, signal?: AbortSignal) {
  const qs = new URLSearchParams({ from, to });
  return call<Availability>(`/availability?${qs}`, { signal });
}

/**
 * Live price for a stay. Safe to call on every date change: the Worker asks
 * OwnerRez for a test quote, which prices and validates without creating
 * anything in the account.
 *
 * Returns `{ bookable: false, reason }` — not an error — when the property's
 * own rules reject the dates. Render that as a message, not a failure.
 */
export function getQuote(stay: StayRequest, signal?: AbortSignal) {
  return call<Quote>("/quote/preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(stay),
    signal,
  });
}

/**
 * Create the real quote and hand the guest to OwnerRez.
 *
 * This is the committing step: it writes a guest and a quote to the OwnerRez
 * account, so call it on an explicit submit, never speculatively. By default it
 * performs the redirect itself — payment and the rental agreement happen on
 * OwnerRez's PCI-certified pages, and the guest returns to /booking/confirmed.
 *
 * Pass `redirect: false` to get the URL back instead of navigating.
 */
export async function startCheckout(
  stay: StayRequest,
  guest: GuestDetails,
  options: { redirect?: boolean } = {}
): Promise<string> {
  const { paymentUrl } = await call<{ paymentUrl: string; quoteId: number | null }>("/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...stay, ...guest }),
  });

  if (options.redirect !== false) {
    // Full-page navigation, not a new tab: the guest is leaving our site for
    // the hosted form, and popup blockers eat window.open here.
    window.location.assign(paymentUrl);
  }
  return paymentUrl;
}

// ------------------------------------------------------------------- helpers

const DAY = 86_400_000;

/** Inclusive-start, exclusive-end list of the night dates a stay occupies. */
export function nightsInStay(arrival: string, departure: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(arrival); t < Date.parse(departure); t += DAY) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

/** Dates a date-picker should disable outright. */
export function blockedDates(nights: Night[]): Set<string> {
  return new Set(
    nights.filter((n) => n.status !== "available" || n.rules?.is_stay_disallowed).map((n) => n.date)
  );
}

/**
 * Client-side pre-check so the UI can grey out an impossible range before
 * spending a round trip. Deliberately conservative and NOT authoritative —
 * getQuote() is the real answer, because only OwnerRez knows the full rule set.
 */
export function isRangeBookable(
  nights: Night[],
  arrival: string,
  departure: string
): { ok: true } | { ok: false; reason: string } {
  const byDate = new Map(nights.map((n) => [n.date, n]));
  const stay = nightsInStay(arrival, departure);
  if (stay.length === 0) return { ok: false, reason: "Choose at least one night." };

  for (const date of stay) {
    const night = byDate.get(date);
    // Unknown nights fall outside the loaded window or the booking window.
    if (!night) return { ok: false, reason: "Those dates aren't open for booking yet." };
    if (night.status !== "available" || night.rules?.is_stay_disallowed) {
      return { ok: false, reason: "Some of those nights are already taken." };
    }
  }

  const first = byDate.get(stay[0]);
  if (first?.rules?.is_arrival_disallowed) {
    return { ok: false, reason: "Check-in isn't available on that date." };
  }
  // Departure lands the morning after the last night.
  const last = byDate.get(stay[stay.length - 1]);
  if (last?.rules?.is_departure_disallowed) {
    return { ok: false, reason: "Check-out isn't available on that date." };
  }

  const minNights = first?.rules?.min_nights ?? 0;
  if (minNights && stay.length < minNights) {
    return { ok: false, reason: `These dates need a minimum of ${minNights} nights.` };
  }
  const maxNights = first?.rules?.max_nights ?? 0;
  if (maxNights && stay.length > maxNights) {
    return { ok: false, reason: `These dates allow a maximum of ${maxNights} nights.` };
  }

  return { ok: true };
}

/** Money formatting for quote totals. */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
