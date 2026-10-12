// Single on/off switch for OwnerRez direct booking. Off: every "Book" CTA
// points at the enquiry form instead, and BookingSection is not rendered
// anywhere on the site. Flip to true to turn it back on — BookingSection,
// BookingCalendar, lib/ownerrez.ts, worker/ownerrez.ts and the
// /booking-confirmed route are all still in place, untouched.
export const DIRECT_BOOKING_ENABLED = false;

// Where "Book" CTAs point. BookingSection owns "#book" when the flag above is
// on; the enquiry form owns "#inquire" either way, so CTAs land there instead
// when it's off.
export const BOOK_ANCHOR = DIRECT_BOOKING_ENABLED ? "#book" : "#inquire";
