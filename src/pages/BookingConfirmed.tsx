import { useEffect } from "react";
import TornSheet from "@/components/board/TornSheet";
import PushPin from "@/components/board/PushPin";
import { pushEvent, CONTACT_EMAIL, trackContactClick } from "@/lib/analytics";

// Where OwnerRez sends a guest after they finish paying and sign the rental
// agreement (worker/ownerrez.ts sets this as redirectAfterBookingUrl).
//
// Deliberately says nothing specific about the booking: this page is a plain
// URL a guest can bookmark or share, and it receives no booking identifier, so
// it must not imply it is showing anyone's reservation. OwnerRez sends the
// actual confirmation email with the details.
const BookingConfirmed = () => {
  useEffect(() => {
    // GA4 conversion. No value attached — the amount lives with OwnerRez, and
    // a guest can reload this page, so treating it as a revenue event would
    // double-count. begin_checkout on the booking form is the paired event.
    pushEvent("purchase_complete", { form_id: "booking", form_name: "Direct Booking" });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-corkboard px-6 py-16">
      <TornSheet variant="cream" rotate={-0.8} className="max-w-md text-center px-10 pt-16 pb-12">
        {/* TornSheet wraps children in its own `relative` div, so this offset is
            measured from the content box, not the sheet edge — hence -top-12
            against pt-16 to land the pin just inside the paper. */}
        <PushPin color="green" className="absolute -top-12 left-1/2 -translate-x-1/2" />

        <p className="mb-2 font-hand text-4xl text-secondary" style={{ transform: "rotate(-1.5deg)" }}>
          you&rsquo;re all set!
        </p>
        <h1 className="mb-4 font-display text-3xl font-bold text-[#2b2520]">
          Booking confirmed
        </h1>
        <p className="mb-4 font-body text-[#2b2520]/65">
          Thanks for booking The Farmhouse directly with us. A confirmation email with your
          dates, your total and the signed rental agreement is on its way.
        </p>
        <p className="mb-8 font-body text-sm text-[#2b2520]/50">
          Closer to your stay we&rsquo;ll send door codes, wifi and the guide to the lake.
        </p>

        <a
          href="/"
          className="font-typed text-sm font-bold uppercase tracking-wide text-[#b3402f] underline underline-offset-4 hover:text-[#8e2a1f]"
        >
          Back to the farmhouse
        </a>

        <p className="mt-8 font-body text-sm text-[#2b2520]/50">
          Nothing in your inbox? Email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Booking confirmation")}`}
            onClick={() => trackContactClick("email", "booking-confirmed")}
            className="text-secondary underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </TornSheet>
    </div>
  );
};

export default BookingConfirmed;
