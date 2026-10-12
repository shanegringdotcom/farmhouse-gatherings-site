import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/board/MotionProvider";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import StampHeading from "@/components/board/StampHeading";
import MeritPatch from "@/components/board/MeritPatch";
import dockImg from "@/assets/dock.webp";
import bunkRoomImg from "@/assets/bunk-room.webp";
import diningRoomImg from "@/assets/dining-room.webp";
import lakeYardImg from "@/assets/lake-yard.webp";
import { DIRECT_BOOKING_ENABLED, BOOK_ANCHOR } from "@/lib/features";

// Every fact on this page is already stated elsewhere on the site (the homepage
// sections, the Big Long Lake guide, the northern Indiana lakes guide, the
// booking panel). Nothing here is new — if a detail isn't on the site, it
// doesn't belong on this page either. In particular: no claim about a boat
// coming with the house, only the dock and lake access.

const linkClass =
  "underline decoration-secondary/40 underline-offset-4 hover:decoration-secondary transition-colors";

const ctaClass =
  "relative inline-block font-marker uppercase tracking-wider text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

const sleeping = [
  {
    title: "Four bedrooms, up to 12",
    desc: "Bunk rooms with nautical decor for the cousins, a kids room with twin beds, and quieter rooms for the grown-ups.",
    rotate: -1.2,
    pin: "red" as const,
  },
  {
    title: "Two full bathrooms",
    desc: "Twelve people, two full baths. Stagger the morning showers and it works fine — and there's a washer and dryer for the swimsuits and towels.",
    rotate: 1.4,
    pin: "navy" as const,
  },
  {
    title: "One table for everyone",
    desc: "A full kitchen with a dishwasher, a charcoal grill, and a dining table that seats 12. Everybody eats together, which is most of the point.",
    rotate: 1,
    pin: "green" as const,
  },
  {
    title: "Room to spread out",
    desc: "A living room with board games, central air for July, a deck over the water, and free parking for multiple cars when the families arrive separately.",
    rotate: -1.6,
    pin: "yellow" as const,
  },
];

const IndianaLakeHouseRental = () => {
  return (
    <>
      <Navbar />
      <MotionProvider>
        <main className="bg-corkboard">
          {/* Hero: cover sheet taped to the board */}
          <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 pt-24 pb-10">
            <div
              className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-9 text-center"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <p className="font-typed text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2b2520]/55 mb-4">
                Wolcottville · LaGrange County, Indiana
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
                Lake House Rental in Indiana, on Big Long Lake
              </h1>
              <div className="relative mb-7">
                <Tape className="-top-3 -left-4" rotate={-38} />
                <Tape className="-top-3 -right-4" rotate={38} />
                <img
                  src={dockImg}
                  alt="The private dock at The Farmhouse on Big Long Lake in Wolcottville, Indiana"
                  className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
                  loading="eager"
                  width={1280}
                  height={849}
                />
              </div>
              <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                <p>
                  Looking for a lake house rental in Indiana that fits the whole group?
                  The Farmhouse sits right on the shoreline of Big Long Lake in
                  Wolcottville — four bedrooms, sleeps 12, and a private dock of its own.
                </p>
                <p>
                  If you&rsquo;ve been sorting through Indiana lake house rentals with boat
                  access, here&rsquo;s what that looks like here: the lakefront yard runs
                  straight down to the dock, and the dock puts you straight onto an
                  all-sports lake. No ramp, no parking lot, no hauling gear down the road.
                </p>
              </div>
            </div>
          </section>

          {/* Why northeast Indiana */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  Why a Northeast Indiana Lake
                </StampHeading>
              </div>
              <TornSheet variant="cream" rotate={0.6} className="px-6 py-9 sm:px-10 sm:py-11">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    The lakes up here are glacial. LaGrange, Steuben, Noble and Kosciusko
                    counties hold nearly 70% of Indiana&rsquo;s natural lake acreage between
                    them, and 239 public lakes — so a lake week in this corner of the state
                    is a different thing from a reservoir weekend further south.
                  </p>
                  <p>
                    Big Long Lake is one of the quieter ones: roughly 300 acres, spring-fed
                    and deep — around 30 feet on average, past 80 at the deepest point. Big
                    enough for boating and skiing, small enough that you can kayak the whole
                    shoreline before lunch. It&rsquo;s also on the Indiana DNR&rsquo;s list of
                    the state&rsquo;s best panfishing lakes, credited with some of the best
                    bluegill fishing in northeastern Indiana.
                  </p>
                  <p>
                    And it&rsquo;s Amish country. Shipshewana and its flea market are about 15
                    minutes away, the farm stands run all summer, and Wolcottville moves slow
                    on purpose. The{" "}
                    <a href="/big-long-lake" className={linkClass}>
                      Big Long Lake guide
                    </a>{" "}
                    covers the lake itself, and the{" "}
                    <a href="/northern-indiana-lakes" className={linkClass}>
                      guide to northern Indiana lakes
                    </a>{" "}
                    covers the rest of the region.
                  </p>
                </div>
              </TornSheet>
            </div>
          </section>

          {/* Dock & lake access */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4 max-w-xl mx-auto">
                <StampHeading className="text-2xl sm:text-4xl">
                  The Dock &amp; Getting on the Water
                </StampHeading>
              </div>
              <p
                className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
                style={{ transform: "rotate(-1deg)" }}
              >
                Your own way onto the lake, for the whole stay.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="relative md:col-span-2">
                  <Polaroid
                    src={lakeYardImg}
                    alt="Lakefront yard running down to the water at The Farmhouse on Big Long Lake"
                    caption="straight down to the water"
                    rotate={-2}
                    fastener="pin"
                    pinColor="green"
                    draggable
                  />
                </div>
                <TornSheet variant="white" rotate={0.8} className="md:col-span-3 px-6 py-8 sm:px-9">
                  <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                  <MeritPatch
                    icon="boat"
                    label="Boating merit patch"
                    felt="teal"
                    rotate={8}
                    className="absolute -top-7 -right-4 hidden sm:block pointer-events-none z-10"
                  />
                  <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                    <p>
                      The private dock is the house&rsquo;s front door to the lake. Wade in
                      off it, jump off the end of it, or fish from it — bass, bluegill and
                      crappie keep the anglers busy, and mornings and evenings are the sweet
                      spots.
                    </p>
                    <p>
                      Big Long is an all-sports lake, so motorboats, tubes and water skis are
                      all fair game. The lake association&rsquo;s rules are simple: boat
                      traffic runs counterclockwise, boats keep 200 feet off shore except when
                      entering or leaving, and between sunset and sunrise it&rsquo;s idle speed
                      only.
                    </p>
                    <p>
                      Trailering your own boat? The public access launch is at the north end
                      of the lake — the{" "}
                      <a href="/big-long-lake#public-access" className={linkClass}>
                        lake guide
                      </a>{" "}
                      has the address, the lake map, and what the ramp is actually like.
                    </p>
                  </div>
                </TornSheet>
              </div>
            </div>
          </section>

          {/* Sleeping 12 */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4 max-w-xl mx-auto">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  What Sleeps 12 Means Here
                </StampHeading>
              </div>
              <p
                className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
                style={{ transform: "rotate(1deg)" }}
              >
                Built for a family reunion, not a party.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14 max-w-3xl mx-auto">
                <Polaroid
                  src={bunkRoomImg}
                  alt="Bunk room at The Farmhouse on Big Long Lake"
                  caption="cousins go here"
                  rotate={-2.2}
                  fastener="tape"
                  draggable
                />
                <Polaroid
                  src={diningRoomImg}
                  alt="Dining table at The Farmhouse on Big Long Lake"
                  caption="a table for all 12"
                  rotate={1.8}
                  fastener="pin"
                  pinColor="red"
                  draggable
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                {sleeping.map((s) => (
                  <TornSheet key={s.title} variant="white" rotate={s.rotate} className="px-6 py-7">
                    <PushPin color={s.pin} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#2b2520] mb-3">
                      {s.title}
                    </h3>
                    <p className="font-body text-[#2b2520]/60 text-base leading-relaxed">{s.desc}</p>
                  </TornSheet>
                ))}
              </div>
              <TornSheet variant="kraft" rotate={0.8} className="max-w-xl mx-auto mt-12 px-6 py-6 text-center">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <p className="font-hand text-xl sm:text-2xl text-[#2b2520]/75">
                  Two-night minimum. Family-friendly, always — no pets and no large party groups.
                </p>
              </TornSheet>
            </div>
          </section>

          {/* Booking direct */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading className="text-2xl sm:text-4xl">
                  Booking Direct vs. a Booking Site
                </StampHeading>
              </div>
              <TornSheet variant="legal" ruled rotate={-0.6} className="px-6 py-9 sm:px-10">
                <PushPin color="yellow" className="absolute -top-3.5 left-8" />
                <PushPin color="red" className="absolute -top-3.5 right-8" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    Book through a third-party booking site and there&rsquo;s a middleman
                    between you and the house. Book direct with us and there isn&rsquo;t: no
                    booking fees — you pay us, not a middleman.
                  </p>
                  {DIRECT_BOOKING_ENABLED ? (
                    <p>
                      Pick your dates on the calendar and you&rsquo;ll see the open nights and
                      the full price for your stay, line by line, before you commit. You finish
                      payment and sign the rental agreement on our booking page, hosted
                      securely by OwnerRez, so card details never touch this site.
                    </p>
                  ) : (
                    <p>
                      Send over your dates and group size and we&rsquo;ll get back to you within
                      24 hours with a price for your stay.
                    </p>
                  )}
                  <p>
                    And when you have a question, it goes to the family who owns the house.
                    Send us a note with your dates and group size and we&rsquo;ll get back to
                    you within 24 hours.
                  </p>
                </div>
              </TornSheet>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 sm:py-20 px-6 text-center">
            <TornSheet variant="white" rotate={-0.8} className="max-w-xl mx-auto px-8 py-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2520] mb-4">
                Check Your Dates
              </h2>
              <p className="font-body text-[#2b2520]/60 text-base sm:text-lg mb-8">
                {DIRECT_BOOKING_ENABLED ? (
                  <>
                    Four bedrooms, sleeps 12, private dock on Big Long Lake. The booking
                    calendar is on the homepage — or{" "}
                    <a href="/#inquire" className={linkClass}>
                      send us a note
                    </a>{" "}
                    first.
                  </>
                ) : (
                  "Four bedrooms, sleeps 12, private dock on Big Long Lake. Send us your dates and we'll get back to you within 24 hours."
                )}
              </p>
              <a href={`/${BOOK_ANCHOR}`} className={ctaClass}>
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                {DIRECT_BOOKING_ENABLED ? "See the Calendar & Book Direct" : "Send Us a Note"}
              </a>
            </TornSheet>
          </section>
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
};

export default IndianaLakeHouseRental;
