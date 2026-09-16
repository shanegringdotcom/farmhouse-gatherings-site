import { useMemo, useState } from "react";
import type { Night } from "@/lib/ownerrez";

// A month grid of NIGHTS, not calendar days. Each cell is the night beginning
// on that date, which is why a departure date can sit on a cell that is itself
// booked — you leave the morning of, before that night starts.

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const addDays = (date: string, n: number) => iso(Date.parse(date) + n * DAY);

/** First day of the month containing `date`, as YYYY-MM-01. */
const monthStart = (date: string) => `${date.slice(0, 7)}-01`;
const shiftMonth = (monthIso: string, delta: number) => {
  const [y, m] = monthIso.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 10);
};

type Props = {
  nights: Night[];
  arrival: string;
  departure: string;
  onChange: (arrival: string, departure: string) => void;
};

const BookingCalendar = ({ nights, arrival, departure, onChange }: Props) => {
  const byDate = useMemo(() => new Map(nights.map((n) => [n.date, n])), [nights]);
  const bounds = useMemo(
    () =>
      nights.length
        ? { first: nights[0].date, last: nights[nights.length - 1].date }
        : { first: iso(Date.now()), last: iso(Date.now()) },
    [nights]
  );

  const [view, setView] = useState(() => monthStart(arrival || bounds.first));

  /** A night that can be slept in. */
  const isOpen = (date: string) => {
    const n = byDate.get(date);
    return !!n && n.status === "available" && !n.rules?.is_stay_disallowed;
  };

  /** Can a stay START here? Arrival rules bite only on the first night. */
  const canArrive = (date: string) =>
    isOpen(date) && !byDate.get(date)?.rules?.is_arrival_disallowed;

  // Once an arrival is picked, you may check out any morning up to and
  // including the one after the last consecutive open night. Past that there is
  // a booked night in the way, so those cells stop being reachable.
  const maxDeparture = useMemo(() => {
    if (!arrival) return null;
    let cursor = arrival;
    while (isOpen(cursor)) cursor = addDays(cursor, 1);
    return cursor; // the morning after the last open night
  }, [arrival, byDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const selecting = arrival !== "" && departure === "";

  const isDepartureCandidate = (date: string) =>
    selecting &&
    maxDeparture !== null &&
    Date.parse(date) > Date.parse(arrival) &&
    Date.parse(date) <= Date.parse(maxDeparture) &&
    !byDate.get(addDays(date, -1))?.rules?.is_departure_disallowed;

  const inRange = (date: string) =>
    arrival !== "" &&
    departure !== "" &&
    Date.parse(date) >= Date.parse(arrival) &&
    Date.parse(date) < Date.parse(departure);

  const handleClick = (date: string) => {
    // Picking a second date completes the stay; anything else starts over.
    if (selecting && isDepartureCandidate(date)) {
      onChange(arrival, date);
      return;
    }
    if (canArrive(date)) onChange(date, "");
  };

  // Leading blanks so the 1st lands under its weekday.
  const cells = useMemo(() => {
    const first = new Date(view + "T00:00:00Z");
    const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const out: (string | null)[] = Array.from({ length: first.getUTCDay() }, () => null);
    for (let d = 1; d <= daysInMonth; d++) out.push(`${view.slice(0, 7)}-${String(d).padStart(2, "0")}`);
    return out;
  }, [view]);

  const canGoBack = view > monthStart(bounds.first);
  const canGoForward = shiftMonth(view, 1) <= monthStart(bounds.last);

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(shiftMonth(view, -1))}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="px-3 py-1 font-marker text-lg text-[#2b2520]/70 disabled:opacity-25 hover:text-secondary transition-colors"
        >
          ‹
        </button>
        <p aria-live="polite" className="font-display text-xl font-bold text-[#2b2520]">
          {MONTHS[Number(view.slice(5, 7)) - 1]} {view.slice(0, 4)}
        </p>
        <button
          type="button"
          onClick={() => setView(shiftMonth(view, 1))}
          disabled={!canGoForward}
          aria-label="Next month"
          className="px-3 py-1 font-marker text-lg text-[#2b2520]/70 disabled:opacity-25 hover:text-secondary transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px mb-1" aria-hidden="true">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-marker text-xs text-[#2b2520]/40 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;

          const night = byDate.get(date);
          const open = isOpen(date);
          const isArrival = date === arrival;
          const isDeparture = date === departure;
          const selected = isArrival || isDeparture;
          const ranged = inRange(date) && !isArrival;
          const candidate = isDepartureCandidate(date);
          // Clickable as an arrival, or as the checkout morning mid-selection.
          const clickable = candidate || canArrive(date);

          return (
            <button
              key={date}
              type="button"
              onClick={() => handleClick(date)}
              disabled={!clickable}
              aria-label={[
                date,
                night?.rate != null ? `, $${night.rate} per night` : "",
                !open ? " — booked" : !clickable && selecting ? " — check-out not available" : !clickable ? " — check-in not available this day" : "",
              ].join("")}
              aria-pressed={selected}
              className={[
                "aspect-square flex flex-col items-center justify-center text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:z-10",
                selected
                  ? "bg-[#b3402f] text-[#fdf6e8] font-bold"
                  : ranged
                    ? "bg-[#b3402f]/15 text-[#2b2520]"
                    : candidate
                      ? "bg-secondary/10 text-[#2b2520] hover:bg-secondary/25"
                      : clickable
                        ? "text-[#2b2520] hover:bg-[#2b2520]/10"
                        // Two different kinds of "can't click this", and
                        // conflating them costs bookings: a night that is
                        // genuinely taken gets struck through, but a night that
                        // is free and merely can't START a stay (season arrival
                        // rules) must not look sold — it is bookable, just not
                        // as day one. Striking those made a fully open November
                        // read as half-booked.
                        : !open
                          ? "text-[#2b2520]/25 line-through cursor-not-allowed"
                          : "text-[#2b2520]/45 cursor-not-allowed",
              ].join(" ")}
            >
              <span className="leading-none">{Number(date.slice(8, 10))}</span>
              {open && night?.rate != null && !selected && (
                <span className="text-[9px] leading-none mt-0.5 text-[#2b2520]/40 tabular-nums">
                  ${night.rate}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="font-body text-xs text-[#2b2520]/50 mt-3 text-center">
        {selecting
          ? "Now pick your check-out date."
          : arrival && departure
            ? "Tap any open date to start over."
            // Without this, a dimmed-but-unstruck day reads as a rendering bug.
            : "Tap your check-in date. Dimmed days can\u2019t start a stay; crossed-out nights are taken."}
      </p>
    </div>
  );
};

export default BookingCalendar;
