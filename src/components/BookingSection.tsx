import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import PushPin from "@/components/board/PushPin";
import BookingCalendar from "@/components/BookingCalendar";
import { pushEvent, CONTACT_EMAIL, trackContactClick } from "@/lib/analytics";
import {
  BookingError,
  formatCurrency,
  getAvailability,
  getQuote,
  isRangeBookable,
  startCheckout,
  type Night,
  type Quote,
} from "@/lib/ownerrez";

// How far ahead to load the calendar. OwnerRez caps a calendar request at 366
// days and omits nights past the property's booking window, so asking for the
// full year and taking what comes back is correct — a short answer is normal.
const WINDOW_DAYS = 365;

const MAX_ADULTS = 12; // the house sleeps 12; OwnerRez still has final say
const QUOTE_DEBOUNCE_MS = 400;

const fmtDate = (isoDate: string) =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
  });

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, n: number) =>
  new Date(Date.parse(iso) + n * 86_400_000).toISOString().slice(0, 10);

const fieldClass =
  "mt-1 bg-transparent border-0 border-b-2 border-[#2b2520]/25 rounded-none px-1 text-[#2b2520] placeholder:text-[#2b2520]/35 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary";
const labelClass = "font-hand text-xl text-[#2b2520]/75";

const ANALYTICS = { form_id: "booking", form_name: "Direct Booking" } as const;

const BookingSection = () => {
  const [nights, setNights] = useState<Night[]>([]);
  const [calendarError, setCalendarError] = useState(false);

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [guest, setGuest] = useState({ firstName: "", lastName: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const startedRef = useRef(false);
  const markStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent("form_start", { ...ANALYTICS });
  };

  // ---- availability -------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();
    const from = today();
    getAvailability(from, addDays(from, WINDOW_DAYS), controller.signal)
      .then((a) => setNights(a.nights))
      // An unreachable calendar must not hide the whole section — the quote
      // call is the real gate, and guests can still fall back to the enquiry
      // form below. Just stop promising which dates are open.
      .catch(() => !controller.signal.aborted && setCalendarError(true));
    return () => controller.abort();
  }, []);

  const bookingWindow = useMemo(() => {
    if (nights.length === 0) return { min: today(), max: addDays(today(), WINDOW_DAYS) };
    return { min: nights[0].date, max: nights[nights.length - 1].date };
  }, [nights]);

  // Cheap local verdict, so an impossible range says so before we ask OwnerRez.
  // Advisory only — the quote is authoritative.
  const localCheck = useMemo(() => {
    if (!arrival || !departure || nights.length === 0) return null;
    return isRangeBookable(nights, arrival, departure);
  }, [nights, arrival, departure]);

  // ---- live price ---------------------------------------------------------
  const stay = useMemo(
    () => ({ arrival, departure, adults, children, pets }),
    [arrival, departure, adults, children, pets]
  );

  useEffect(() => {
    if (!arrival || !departure || Date.parse(departure) <= Date.parse(arrival)) {
      setQuote(null);
      return;
    }
    // Don't spend a request on a range we already know breaks the rules.
    if (localCheck !== null && localCheck.ok === false) {
      setQuote({ bookable: false, reason: localCheck.reason });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setQuoting(true);
      getQuote(stay, controller.signal)
        .then(setQuote)
        .catch((err) => {
          if (controller.signal.aborted) return;
          setQuote({
            bookable: false,
            reason: err instanceof BookingError ? err.message : "Couldn't price those dates.",
          });
        })
        .finally(() => !controller.signal.aborted && setQuoting(false));
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [stay, arrival, departure, localCheck]);

  // ---- checkout -----------------------------------------------------------
  const priced = quote?.bookable === true ? quote : null;
  const canSubmit =
    priced !== null &&
    !submitting &&
    guest.firstName.trim() !== "" &&
    guest.lastName.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !priced) return;

    setSubmitting(true);
    pushEvent("begin_checkout", {
      ...ANALYTICS,
      currency: "USD",
      value: priced.total,
      items: [{ item_name: "The Farmhouse", quantity: priced.nights }],
    });

    try {
      // Redirects to OwnerRez on success, so nothing after this runs.
      await startCheckout(stay, {
        firstName: guest.firstName.trim(),
        lastName: guest.lastName.trim(),
        email: guest.email.trim(),
      });
    } catch (err) {
      setSubmitting(false);
      pushEvent("form_error", { ...ANALYTICS });
      toast({
        title: "Couldn't start checkout",
        description:
          err instanceof BookingError ? err.message : "Please try again, or send us a note below.",
        variant: "destructive",
      });
    }
  };

  const nightCount =
    arrival && departure ? Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000) : 0;

  return (
    <section id="book" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-lg mx-auto relative">
        <div
          className="bg-paper shadow-lifted px-6 sm:px-10 pt-10 pb-9 relative"
          style={{ transform: "rotate(0.3deg)" }}
        >
          <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />

          <p
            className="font-hand text-2xl sm:text-3xl text-secondary text-center mb-1"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            pick your dates
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] text-center mb-2">
            Book Direct
          </h2>
          <p className="font-body text-[#2b2520]/50 text-center mb-8 text-base sm:text-lg">
            No booking fees. You pay us, not a middleman.
          </p>

          <form onSubmit={handleSubmit} onFocus={markStart} className="space-y-6">
            <BookingCalendar
              nights={nights}
              arrival={arrival}
              departure={departure}
              onChange={(a, d) => {
                markStart();
                setArrival(a);
                setDeparture(d);
              }}
            />

            {/* The chosen range in words. The grid shows which cells are lit,
                but a guest committing to a price needs the dates spelled out. */}
            {arrival && departure && (
              <p className="font-hand text-2xl text-[#2b2520]/75 text-center">
                {fmtDate(arrival)} &rarr; {fmtDate(departure)}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adults" className={labelClass}>Adults</Label>
                <Input id="adults" type="number" min={1} max={MAX_ADULTS} value={adults}
                  onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                  className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="children" className={labelClass}>Kids</Label>
                <Input id="children" type="number" min={0} max={MAX_ADULTS} value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                  className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="pets" className={labelClass}>Pets</Label>
                <Input id="pets" type="number" min={0} max={4} value={pets}
                  onChange={(e) => setPets(Math.max(0, Number(e.target.value) || 0))}
                  className={fieldClass} />
              </div>
            </div>

            {calendarError && (
              <p className="font-body text-sm text-[#2b2520]/50">
                We couldn&rsquo;t load the calendar just now — pick your dates and we&rsquo;ll still
                check them for you.
              </p>
            )}

            {/* ---- price ---- */}
            <div aria-live="polite" className="min-h-[3rem]">
              {quoting && (
                <p className="font-hand text-2xl text-[#2b2520]/45">working out the total…</p>
              )}

              {!quoting && quote?.bookable === false && (
                <p className="font-body text-sm text-[#b3402f]">{quote.reason}</p>
              )}

              {!quoting && priced && (
                <div className="border-t-2 border-dashed border-[#2b2520]/20 pt-4 space-y-1.5">
                  {priced.charges.map((c, i) => (
                    <div key={i} className="flex justify-between gap-4 font-body text-sm text-[#2b2520]/70">
                      <span>{c.description}</span>
                      <span className="tabular-nums whitespace-nowrap">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-[#2b2520]/15">
                    <span className="font-marker uppercase tracking-wide text-[#2b2520]">
                      Total · {priced.nights} {priced.nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-marker text-[#2b2520] tabular-nums">
                      {formatCurrency(priced.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ---- guest details: only once there's a real price ---- */}
            {priced && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className={labelClass}>First name</Label>
                    <Input id="firstName" value={guest.firstName} required
                      onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                      className={fieldClass} />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className={labelClass}>Last name</Label>
                    <Input id="lastName" value={guest.lastName} required
                      onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                      className={fieldClass} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bookingEmail" className={labelClass}>Email</Label>
                  <Input id="bookingEmail" type="email" value={guest.email} required
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                    className={fieldClass} />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="relative w-full font-marker uppercase tracking-wider text-lg bg-[#b3402f] text-[#fdf6e8] py-3.5 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  <span aria-hidden="true" className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none" />
                  {submitting ? "Taking you to payment…" : `Continue to payment · ${formatCurrency(priced.total)}`}
                </button>

                {/* Say where the button leads before it takes them off-site. */}
                <p className="font-body text-xs text-[#2b2520]/50 text-center">
                  You&rsquo;ll finish payment and sign the rental agreement on our booking page,
                  hosted securely by OwnerRez. Card details never touch this site.
                </p>
              </div>
            )}

            {!priced && nightCount > 0 && !quoting && quote === null && (
              <p className="font-body text-sm text-[#2b2520]/50">Checking those dates…</p>
            )}
          </form>

          <p className="font-body text-sm text-[#2b2520]/50 text-center pt-8">
            Questions first? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Big Long Lake farmhouse — booking")}`}
              onClick={() => trackContactClick("email", "booking-form")}
              className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
