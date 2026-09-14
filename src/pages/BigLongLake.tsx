import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BigLongLakeMap from "@/components/BigLongLakeMap";
import MotionProvider from "@/components/board/MotionProvider";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import StampHeading from "@/components/board/StampHeading";
import MeritPatch from "@/components/board/MeritPatch";
import { mapsUrl } from "@/data/ice-cream";
import lakeImg from "@/assets/houses-from-lake.webp";
import dockImg from "@/assets/dock.webp";
import deckLakeImg from "@/assets/deck-lake.webp";
import lakeYardImg from "@/assets/lake-yard.webp";

const activities = [
  {
    title: "Swimming & Sandy Shoreline",
    desc: "Big Long Lake has clean, swimmable water and a gently sloping shoreline that's great for kids. Wade in off the dock or float the afternoon away.",
    rotate: -1.2,
    pin: "red" as const,
  },
  {
    title: "Boating, Tubing & Skiing",
    desc: "As an all-sports lake, Big Long is open to motorboats, tubes, and water skis. There's room to pull the kids around and still find a quiet cove.",
    rotate: 1.4,
    pin: "navy" as const,
  },
  {
    title: "Fishing",
    desc: "Bass, bluegill, and crappie keep anglers busy from the dock or a boat. Mornings and evenings are the sweet spots.",
    rotate: 1,
    pin: "green" as const,
  },
  {
    title: "Kayaking & Paddleboarding",
    desc: "At roughly 300 acres, you can paddle the whole shoreline before lunch. The water is glass first thing in the morning.",
    rotate: -1.6,
    pin: "yellow" as const,
  },
];

const events = [
  {
    when: "Every Tuesday & Wednesday, May–September",
    what: "Shipshewana Flea Market",
    where: "Shipshewana, ~15 minutes away",
    desc: "One of the Midwest's largest outdoor flea markets — 700+ vendors across 40 acres, plus the year-round antique auction.",
  },
  {
    when: "All summer long",
    what: "Roadside Farm Stands",
    where: "Throughout LaGrange County",
    desc: "Amish-country sweet corn, tomatoes, melons, and baked goods appear at front-yard stands and gravel pull-offs from June through the fall harvest.",
  },
  {
    when: "Late June – early July",
    what: "Lake & Town Fireworks",
    where: "Big Long Lake & nearby Wolcottville",
    desc: "The lake comes alive around Independence Day — boat parades on the water and fireworks you can watch right from the dock.",
  },
  {
    when: "September – October",
    what: "Fall in Amish Country",
    where: "LaGrange County & Chain O'Lakes State Park",
    desc: "Cooler mornings, quiet water, and the trees turning. Great for kayaking, hiking Chain O'Lakes (~30 minutes south), and pie season at the local bakeries.",
  },
];

const BigLongLake = () => {
  return (
    <>
      <Navbar />
      <MotionProvider>
        <main className="bg-corkboard">
          {/* Hero: guide cover taped to the board */}
          <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 pt-24 pb-10">
            <div
              className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-9 text-center"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <p className="font-typed text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2b2520]/55 mb-4">
                LaGrange County, Indiana
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
                Big Long Lake Vacation Rental Guide
              </h1>
              <div className="relative">
                <Tape className="-top-3 -left-4" rotate={-38} />
                <Tape className="-top-3 -right-4" rotate={38} />
                <img
                  src={lakeImg}
                  alt="Homes along the shoreline of Big Long Lake in Wolcottville, Indiana"
                  className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
                  loading="eager"
                  width={1280}
                  height={849}
                />
              </div>
            </div>
          </section>

          {/* Intro */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  About Big Long Lake
                </StampHeading>
              </div>
              <TornSheet variant="cream" rotate={0.6} className="px-6 py-9 sm:px-10 sm:py-11 text-center">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    Big Long Lake is a spring-fed, all-sports lake in LaGrange County,
                    Indiana — roughly 300 acres of clean water tucked into the woods and
                    farm country near Wolcottville, in the heart of the state's Amish
                    country. It's one of the quieter northeast Indiana lakes: big enough
                    for boating and skiing, small enough to feel like your own.
                  </p>
                  <p>
                    Our home, The Farmhouse, sits right on the shoreline with a private
                    dock, a lakefront yard, and a deck overlooking the water. If you're
                    looking for a{" "}
                    <a href="/" className="underline decoration-secondary/40 underline-offset-4 hover:decoration-secondary transition-colors">
                      Big Long Lake rental
                    </a>{" "}
                    for a family reunion, a summer week,
                    or a long weekend, this guide covers what there is to do on the water
                    and around town.
                  </p>
                  <p>
                    Looking further afield? Big Long is one of 239 public lakes across
                    LaGrange, Steuben, Noble and Kosciusko counties &mdash; see the{" "}
                    <a
                      href="/northern-indiana-lakes"
                      className="underline decoration-secondary/40 underline-offset-4 hover:decoration-secondary transition-colors"
                    >
                      guide to northern Indiana lakes
                    </a>{" "}
                    for the whole region.
                  </p>
                </div>
                <a
                  href="/#inquire"
                  className="relative inline-block mt-10 font-marker uppercase tracking-wider text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                  />
                  Check Availability
                </a>
              </TornSheet>
            </div>
          </section>

          {/* Photo band */}
          <section className="px-4 sm:px-6 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Polaroid
                src={dockImg}
                alt="Private dock on Big Long Lake"
                caption="your dock for the week"
                rotate={-2.5}
                fastener="pin"
                pinColor="red"
                draggable
              />
              <Polaroid
                src={deckLakeImg}
                alt="Deck overlooking Big Long Lake"
                caption="coffee goes here"
                rotate={1.8}
                fastener="tape"
                draggable
              />
              <Polaroid
                src={lakeYardImg}
                alt="Lakefront yard at the Big Long Lake farmhouse"
                caption="straight down to the water"
                rotate={-1.2}
                fastener="pin"
                pinColor="green"
                draggable
              />
            </div>
          </section>

          {/* Things to do */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4 max-w-xl mx-auto">
                <StampHeading className="text-2xl sm:text-4xl">
                  Things to Do on the Lake
                </StampHeading>
              </div>
              <p
                className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
                style={{ transform: "rotate(-1deg)" }}
              >
                An all-sports lake means there's a little of everything.
              </p>
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                <MeritPatch
                  icon="paddle"
                  label="Paddling merit patch"
                  felt="pine"
                  rotate={9}
                  className="absolute -top-9 -right-3 hidden sm:block pointer-events-none z-10"
                />
                {activities.map((a) => (
                  <TornSheet key={a.title} variant="white" rotate={a.rotate} className="px-6 py-7">
                    <PushPin color={a.pin} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#2b2520] mb-3">
                      {a.title}
                    </h3>
                    <p className="font-body text-[#2b2520]/60 text-base leading-relaxed">
                      {a.desc}
                    </p>
                  </TornSheet>
                ))}
              </div>
            </div>
          </section>

          {/* Events / what's on */}
          <section id="events" className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-4">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  Events &amp; What&rsquo;s On
                </StampHeading>
              </div>
              <p
                className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
                style={{ transform: "rotate(1deg)" }}
              >
                Seasonal happenings on Big Long Lake and around Amish country.
              </p>
              <TornSheet variant="legal" ruled rotate={-0.6} className="px-6 py-9 sm:px-10">
                <PushPin color="yellow" className="absolute -top-3.5 left-8" />
                <PushPin color="red" className="absolute -top-3.5 right-8" />
                <div className="space-y-10">
                  {events.map((ev) => (
                    <div key={ev.what} className="border-l-2 border-[#b3402f]/50 pl-6">
                      <p className="font-typed text-xs uppercase tracking-[0.2em] text-[#b3402f] mb-1">
                        {ev.when}
                      </p>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#2b2520]">
                        {ev.what}
                      </h3>
                      <p className="font-body text-[#2b2520]/45 text-sm mb-2">{ev.where}</p>
                      <p className="font-body text-[#2b2520]/65 text-base leading-relaxed">
                        {ev.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="font-hand text-lg text-[#2b2520]/55 text-center mt-10 max-w-xl mx-auto">
                  Dates shift a little year to year — check the organizers&rsquo; sites for
                  current schedules before you plan around them.
                </p>
              </TornSheet>
            </div>
          </section>

          {/* Best time to visit */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading className="text-2xl sm:text-4xl">When to Visit</StampHeading>
              </div>
              <TornSheet variant="white" rotate={0.8} className="px-6 py-8 sm:px-9 text-center">
                <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/65 text-base sm:text-lg leading-relaxed">
                  <p>
                    Summer (June through August) is peak season — warm water, long days,
                    and the best weather for swimming, boating, and everything else on the
                    water. Weekends book up first.
                  </p>
                  <p>
                    Early fall is beautiful and quieter, with fewer boats and the trees
                    starting to turn. Late spring weekends are great for fishing and
                    kayaking before the summer crowds arrive.
                  </p>
                </div>
              </TornSheet>
            </div>
          </section>

          {/* Public access & lake map */}
          <section id="public-access" className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-4 max-w-xl mx-auto">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  Public Access &amp; Getting on the Lake
                </StampHeading>
              </div>
              <p
                className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
                style={{ transform: "rotate(-1deg)" }}
              >
                Where to launch a boat, and the rules of the water once you&rsquo;re out.
              </p>
              <TornSheet variant="cream" rotate={-0.5} className="px-6 py-8 sm:px-9 mb-12">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    Staying at The Farmhouse, you don&rsquo;t need a ramp at all — the
                    private dock puts you straight on the water. But if you&rsquo;re
                    trailering your own boat, Big Long Lake has a public access site:
                    the launch at{" "}
                    <a
                      href={mapsUrl("Big Long Lake Public Access Launch, 9555 E 600 S, Wolcottville, IN 46795")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-secondary/40 underline-offset-4 hover:decoration-secondary transition-colors"
                    >
                      9555 E 600 S, Wolcottville
                    </a>
                    , at the north end of the lake.
                  </p>
                  <p>
                    The ramp puts in on a quiet channel off the main water, so
                    launching is calm even when the lake is busy. The trade-off is
                    size: the parking area is small and the channel is snug, which
                    suits fishing boats and runabouts better than big rigs. On
                    summer Saturdays, arrive early for a parking spot.
                  </p>
                  <p>
                    Once you&rsquo;re out, the lake association&rsquo;s rules are
                    simple: boat traffic runs counterclockwise, boats keep 200 feet
                    off shore except when entering or leaving, and between sunset
                    and sunrise it&rsquo;s idle speed only. The water under you is
                    spring-fed and deep — around 30 feet on average, and past 80
                    feet at the deepest point.
                  </p>
                </div>
              </TornSheet>
              <div className="relative bg-white p-3 sm:p-4 shadow-pinned" style={{ transform: "rotate(0.5deg)" }}>
                <MeritPatch
                  icon="boat"
                  label="Boating merit patch"
                  felt="teal"
                  rotate={8}
                  className="absolute -top-7 -right-4 hidden sm:block pointer-events-none z-10"
                />
                <BigLongLakeMap />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 sm:py-20 px-6 text-center">
            <TornSheet variant="white" rotate={-0.8} className="max-w-xl mx-auto px-8 py-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2520] mb-4">
                Stay on Big Long Lake
              </h2>
              <p className="font-body text-[#2b2520]/60 text-base sm:text-lg mb-8">
                Four bedrooms, sleeps 12, private dock. Tell us your dates and group
                size and we&rsquo;ll get back to you within 24 hours.
              </p>
              <a
                href="/#inquire"
                className="relative inline-block font-marker uppercase tracking-wider text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                Check the Big Long Lake Rental
              </a>
            </TornSheet>
          </section>
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
};

export default BigLongLake;
