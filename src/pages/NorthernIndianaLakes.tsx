import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/board/MotionProvider";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import { LAKES, PUBLIC_LAKE_COUNTS, TOTAL_PUBLIC_LAKES } from "@/data/lakes";
import lakeImg from "@/assets/houses-from-lake.webp";
import dockImg from "@/assets/dock.webp";
import deckLakeImg from "@/assets/deck-lake.webp";

// Corner staple for the hero poster (same treatment as HeroSection).
const Staple = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 26 8" className={`absolute w-6 h-2.5 ${className}`} aria-hidden="true">
    <path
      d="M2 8 V3 Q2 1 4 1 H22 Q24 1 24 3 V8"
      fill="none"
      stroke="#8f8f8f"
      strokeWidth="2.6"
    />
  </svg>
);

const COUNTIES = [
  {
    name: "Steuben",
    lakes: PUBLIC_LAKE_COUNTS.Steuben,
    seat: "Angola",
    known: "The busiest lake country in the state, and home to Pokagon State Park on Lake James.",
  },
  {
    name: "Kosciusko",
    lakes: PUBLIC_LAKE_COUNTS.Kosciusko,
    seat: "Warsaw",
    known: "Holds both Indiana's largest natural lake (Wawasee) and its deepest (Tippecanoe).",
  },
  {
    name: "LaGrange",
    lakes: PUBLIC_LAKE_COUNTS.LaGrange,
    seat: "LaGrange",
    known: "Quieter water, Amish farm country, and two of the DNR's 15 best panfishing lakes.",
  },
  {
    name: "Noble",
    lakes: PUBLIC_LAKE_COUNTS.Noble,
    seat: "Albion",
    known: "Chain O'Lakes State Park — nine connected lakes, electric motors only.",
  },
] as const;

const PICKS = [
  {
    heading: "Best for a first visit",
    lake: "Lake James, Steuben County",
    why: "Pokagon State Park puts a beach, trails, a saddle barn and a boat launch in one place, so you are not gambling on access. Big enough to feel like a proper lake holiday.",
  },
  {
    heading: "Best for panfishing",
    lake: "Big Long Lake, LaGrange County",
    why: "One of only fifteen lakes on the Indiana DNR's statewide best-panfishing list, and the one it credits with some of the best bluegill fishing in northeastern Indiana.",
  },
  {
    heading: "Best for paddling",
    lake: "Chain O'Lakes State Park, Noble County",
    why: "Nine connected lakes with electric motors only. No wake, no jet skis, and a genuine point-to-point route rather than laps of one basin.",
  },
  {
    heading: "Best for big-water boating",
    lake: "Lake Wawasee, Kosciusko County",
    why: "Three thousand acres, a channel system and room for sailboats. The closest Indiana gets to a Great Lakes summer town.",
  },
  {
    heading: "Best for quiet",
    lake: "Olin Lake, LaGrange County",
    why: "The only lake here you have to walk to. Its entire shoreline is a protected nature preserve — no cottages, no docks, no engines.",
  },
  {
    heading: "Best for a rainy day",
    lake: "Shipshewana, LaGrange County",
    why: "The lake is good, but the draw is the town: the Midwest's largest outdoor flea market runs Tuesdays and Wednesdays from May through September.",
  },
] as const;

// NOTE: these strings are mirrored character-for-character in the JSON-LD
// emitted by scripts/prerender.mjs. Change one, change both.
const FAQS = [
  {
    q: "How many lakes are in northern Indiana?",
    a: "The Natural Resources Commission's official listing of public freshwater lakes records 239 across the four core lake counties alone — 76 in Steuben, 64 in Kosciusko, 52 in LaGrange and 47 in Noble. Those are lakes the public has a legal right to use; the total number of lakes, including private ones, is higher.",
  },
  {
    q: "Why does northeast Indiana have so many lakes?",
    a: "They are glacial. Retreating ice sheets left behind kettle holes and moraine dams across the northern third of the state, which is why the lakes cluster where they do. The Indiana DNR notes that eighteen counties in northern Indiana contain natural lakes, but Kosciusko, LaGrange, Noble and Steuben hold nearly 70% of the total surface acreage between them.",
  },
  {
    q: "What is the largest lake in Indiana?",
    a: "Lake Wawasee in Kosciusko County, at 3,006 acres, is the largest natural lake wholly within the state. Some reservoirs in southern Indiana, such as Patoka Lake at roughly 8,800 acres, are larger but are man-made.",
  },
  {
    q: "What is the deepest lake in Indiana?",
    a: "Lake Tippecanoe in Kosciusko County, with a maximum depth of 122 feet and an average depth of 37 feet.",
  },
  {
    q: "When is the best time to visit the northern Indiana lakes?",
    a: "Late June through August is peak season — warm water, full marinas and every festival running. September is the quiet favourite: the water is still swimmable, the boat traffic drops away and the Amish farm stands are at their best. Winter brings ice fishing on the shallower lakes.",
  },
  {
    q: "Can you swim in the northern Indiana lakes?",
    a: "Yes. Several have public beaches, including Pokagon State Park on Lake James, Chain O'Lakes State Park, Bixler Lake in Kendallville and Webster Lake. Many of the natural lakes are spring-fed with clear water and gently sloping sandy shorelines.",
  },
] as const;

const byCounty = (county: string) => LAKES.filter((l) => l.county === county);

const PICK_PINS = ["red", "navy", "green", "yellow", "red", "navy"] as const;
const PICK_ROTATES = [-1.2, 1.4, 0.8, -1.6, 1.1, -0.9] as const;
const COUNTY_ROTATES = [-0.6, 0.7, -0.4, 0.5] as const;
const FAQ_PINS = ["red", "green", "navy", "yellow", "red", "green"] as const;

const NorthernIndianaLakes = () => (
  <>
    <Navbar />
    <MotionProvider>
      <main className="bg-corkboard">
        {/* Hero — a big cream poster stapled to the board */}
        <section className="relative flex items-center justify-center px-4 sm:px-6 pt-24 pb-16 sm:pt-28">
          <div
            className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-12 sm:pb-10 text-center"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            <Staple className="top-1.5 left-5 -rotate-6" />
            <Staple className="top-1.5 right-5 rotate-6" />
            <Staple className="bottom-1.5 left-8 rotate-3" />
            <Staple className="bottom-1.5 right-8 -rotate-3" />

            <p className="font-typed text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2b2520]/55 mb-4">
              LaGrange · Steuben · Noble · Kosciusko Counties
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
              Northern Indiana Lakes
            </h1>

            <div className="relative mb-6">
              <Tape className="-top-3 -left-4" rotate={-38} />
              <Tape className="-top-3 -right-4" rotate={38} />
              <img
                src={lakeImg}
                alt="Cottages along a northern Indiana lake shoreline at Big Long Lake"
                className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
                loading="eager"
                width={1280}
                height={849}
              />
            </div>

            <p className="font-body text-[#2b2520]/70 text-lg sm:text-xl max-w-2xl mx-auto">
              A complete guide to Indiana&rsquo;s lake country — 239 public lakes across
              four counties, and how to choose the right one.
            </p>
          </div>
        </section>

        {/* Lede + the headline stat */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <TornSheet variant="cream" rotate={0.5} className="px-6 py-8 sm:px-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <div className="space-y-5 font-body text-[#2b2520]/75 text-base sm:text-lg leading-relaxed">
                <p>
                  Most people picture Indiana as flat farm country. The northeast corner
                  is something else entirely: a dense scatter of glacial lakes packed
                  into four adjoining counties, close enough together that you can fish a
                  different one every morning for a week without driving more than half
                  an hour.
                </p>
                <p>
                  The concentration is not folklore. In its State Wildlife Action Plan,
                  the Indiana Department of Natural Resources notes that eighteen
                  counties in northern Indiana contain natural lakes &mdash; but that{" "}
                  <strong className="text-[#2b2520]">
                    Kosciusko, LaGrange, Noble and Steuben counties contain nearly 70% of
                    the total surface acreage
                  </strong>{" "}
                  between them. Four counties out of ninety-two hold most of the state&rsquo;s
                  natural lake water.
                </p>
                <p>
                  This guide covers those four counties: which lakes are public, which
                  are worth the drive, and which one suits the trip you actually want.
                </p>
              </div>
            </TornSheet>

            {/* Stat band — four small paper tallies pinned under the lede */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
              {[
                { n: TOTAL_PUBLIC_LAKES, l: "public lakes", s: "across four counties", pin: "navy", r: -1.5 },
                { n: "70%", l: "of state acreage", s: "of natural lake water", pin: "red", r: 1.2 },
                { n: "5 of 15", l: "best panfishing", s: "DNR statewide list", pin: "green", r: -0.8 },
                { n: "3,006", l: "acres", s: "Indiana's largest lake", pin: "yellow", r: 1.6 },
              ].map((s) => (
                <div
                  key={s.l}
                  className="relative bg-[#fbf8ee] shadow-pinned text-center px-3 pt-7 pb-4"
                  style={{ transform: `rotate(${s.r}deg)` }}
                >
                  <PushPin
                    color={s.pin as "red" | "yellow" | "green" | "navy"}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                  />
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520]">
                    {s.n}
                  </p>
                  <p className="font-typed text-xs uppercase tracking-[0.15em] text-[#2b2520]/60 mt-2">
                    {s.l}
                  </p>
                  <p className="font-body text-xs text-[#2b2520]/40 mt-1">{s.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why the lakes are here */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <StampHeading as="h2" ink="red" className="text-2xl sm:text-3xl">
                Why the lakes are all in one corner
              </StampHeading>
            </div>
            <TornSheet variant="white" rotate={-0.5} className="px-6 py-8 sm:px-10">
              <Tape className="-top-3.5 left-1/2 -ml-12" rotate={-5} />
              <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                <p>
                  They are glacial. As the last ice sheets retreated, buried blocks of
                  ice melted out and left behind kettle holes; moraines dammed the
                  drainage. The result is a band of natural lakes across the top of the
                  state, deepest and most numerous where the ice sat longest.
                </p>
                <p>
                  That geology explains the character of the water. The deeper lakes
                  &mdash; Tippecanoe at 122 feet, Wawasee at 81 &mdash; are spring-fed,
                  cold at depth and unusually clear. The shallower ones warm quickly and
                  grow dense weed beds, which is exactly why they produce the bluegill the
                  region is known for. Neither is better; they are different trips.
                </p>
                <p>
                  It also explains why the lakes come in chains. Where meltwater linked
                  one kettle to the next, you get connected water: the Barbee chain in
                  Kosciusko County, the Indian Lakes in LaGrange, the nine linked lakes
                  inside Chain O&rsquo;Lakes State Park.
                </p>
              </div>
            </TornSheet>
          </div>
        </section>

        {/* County table */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <StampHeading as="h2" ink="pine" rotate={1} className="text-2xl sm:text-3xl">
                The four counties at a glance
              </StampHeading>
            </div>
            <p
              className="font-hand text-xl sm:text-2xl text-[#3a2a18] mb-10 max-w-xl"
              style={{ transform: "rotate(-0.6deg)" }}
            >
              Public lake counts tallied from the Natural Resources Commission&rsquo;s
              official listing of public freshwater lakes.
            </p>
            <div
              className="relative bg-[#fbf8ee] shadow-pinned px-5 py-4 sm:px-8 sm:py-6"
              style={{ transform: "rotate(0.4deg)" }}
            >
              <PushPin color="navy" className="absolute -top-3.5 left-6" />
              <PushPin color="red" className="absolute -top-3.5 right-6" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse font-body">
                  <thead>
                    <tr className="border-b border-[#2b2520]/25 text-left">
                      <th className="py-3 pr-4 font-typed text-xs uppercase tracking-[0.15em] text-[#2b2520]/50 font-medium">
                        County
                      </th>
                      <th className="py-3 pr-4 font-typed text-xs uppercase tracking-[0.15em] text-[#2b2520]/50 font-medium">
                        Public lakes
                      </th>
                      <th className="py-3 pr-4 font-typed text-xs uppercase tracking-[0.15em] text-[#2b2520]/50 font-medium">
                        County seat
                      </th>
                      <th className="py-3 font-typed text-xs uppercase tracking-[0.15em] text-[#2b2520]/50 font-medium">
                        Known for
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTIES.map((c) => (
                      <tr key={c.name} className="border-b border-[#2b2520]/10 align-top">
                        <td className="py-4 pr-4 font-display font-semibold text-[#2b2520]">
                          {c.name}
                        </td>
                        <td className="py-4 pr-4 text-[#b3402f] font-semibold">
                          {c.lakes}
                        </td>
                        <td className="py-4 pr-4 text-[#2b2520]/60">{c.seat}</td>
                        <td className="py-4 text-[#2b2520]/60 text-sm">{c.known}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Lake by lake */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <StampHeading as="h2" ink="red" className="text-2xl sm:text-3xl">
                The lakes, county by county
              </StampHeading>
            </div>
            <TornSheet variant="legal" ruled rotate={-0.4} className="px-6 py-6 sm:px-8 mb-14 max-w-2xl">
              <Tape className="-top-3.5 left-6" rotate={-6} />
              <p className="font-body text-[#2b2520]/60">
                Acreage and depth figures come from the Indiana DNR and the Lilly Center
                for Lakes &amp; Streams at Grace College. Lakes marked{" "}
                <span className="text-[#b3402f] font-semibold">DNR top 15</span> appear on
                the state&rsquo;s official list of the fifteen best panfishing lakes in
                Indiana.
              </p>
            </TornSheet>

            {COUNTIES.map((c, ci) => (
              <div key={c.name} className="mb-16 last:mb-0">
                <div className="mb-2">
                  <StampHeading
                    as="h3"
                    ink={ci % 2 === 0 ? "pine" : "red"}
                    rotate={ci % 2 === 0 ? -1 : 1}
                    className="text-xl sm:text-2xl"
                  >
                    {c.name} County
                  </StampHeading>
                </div>
                <p
                  className="font-hand text-lg sm:text-xl text-[#3a2a18] mb-8"
                  style={{ transform: "rotate(-0.5deg)" }}
                >
                  {c.lakes} public freshwater lakes
                </p>
                <TornSheet
                  variant={ci % 2 === 0 ? "cream" : "white"}
                  rotate={COUNTY_ROTATES[ci]}
                  className="px-6 py-8 sm:px-9"
                >
                  <PushPin
                    color={(["red", "navy", "green", "yellow"] as const)[ci]}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                  />
                  <div className="space-y-8">
                    {byCounty(c.name).map((l) => (
                      <div
                        key={l.name}
                        className="border-l-2 border-[#b3402f]/30 pl-6"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                          <h4 className="font-display text-xl font-semibold text-[#2b2520]">
                            {l.name}
                          </h4>
                          {l.acres && (
                            <span className="font-body text-sm text-[#2b2520]/45">
                              {l.acres.toLocaleString()} acres
                            </span>
                          )}
                          {l.maxDepthFt && (
                            <span className="font-body text-sm text-[#2b2520]/45">
                              · {l.maxDepthFt} ft deep
                            </span>
                          )}
                          {l.dnrPanfish && (
                            <span className="font-marker text-[10px] uppercase tracking-[0.15em] text-[#b3402f] border-2 border-[#b3402f]/50 px-2 py-0.5 -rotate-1 inline-block">
                              DNR top 15
                            </span>
                          )}
                        </div>
                        <p className="font-body text-[#2b2520]/65 leading-relaxed">
                          {l.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </TornSheet>
              </div>
            ))}
          </div>
        </section>

        {/* Photo band — polaroids on the board */}
        <section className="px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-8 max-w-4xl mx-auto">
            <Polaroid
              src={dockImg}
              alt="Private dock on Big Long Lake in LaGrange County, Indiana"
              caption="Big Long Lake"
              rotate={-2.5}
              fastener="pin"
              pinColor="red"
              draggable
              width={1280}
              height={960}
            />
            <Polaroid
              src={deckLakeImg}
              alt="Deck overlooking a northern Indiana lake at sunset"
              caption="sunset from the deck"
              rotate={2}
              fastener="tape"
              draggable
              width={1280}
              height={960}
            />
          </div>
        </section>

        {/* Which lake for which trip */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14">
              <StampHeading as="h2" ink="pine" rotate={-1} className="text-2xl sm:text-3xl">
                Which lake for which trip
              </StampHeading>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              {PICKS.map((p, i) => (
                <TornSheet
                  key={p.heading}
                  variant={i % 2 === 0 ? "white" : "cream"}
                  rotate={PICK_ROTATES[i]}
                  className="px-6 py-7"
                >
                  <PushPin
                    color={PICK_PINS[i]}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                  />
                  <p className="font-typed text-xs uppercase tracking-[0.2em] text-[#b3402f] mb-2">
                    {p.heading}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-2">
                    {p.lake}
                  </h3>
                  <p className="font-body text-[#2b2520]/65 leading-relaxed">
                    {p.why}
                  </p>
                </TornSheet>
              ))}
            </div>
          </div>
        </section>

        {/* Planning */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <StampHeading as="h2" ink="red" className="text-2xl sm:text-3xl">
                Planning a lake trip
              </StampHeading>
            </div>
            <TornSheet variant="cream" rotate={0.4} className="px-6 py-8 sm:px-10">
              <PushPin color="green" className="absolute -top-3.5 left-8" />
              <PushPin color="yellow" className="absolute -top-3.5 right-8" />
              <div className="space-y-8 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-2">
                    When to come
                  </h3>
                  <p>
                    Peak season runs late June through August, when the water is warm and
                    every marina, beach and festival is open. September is the local
                    favourite &mdash; still swimmable, far fewer boats, and the farm
                    stands at their peak. October brings colour to the state parks. On the
                    shallower lakes, ice fishing carries through the winter.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-2">
                    Public access
                  </h3>
                  <p>
                    Being on the Natural Resources Commission&rsquo;s public freshwater
                    lakes list means the public has a legal right to use the water &mdash;
                    but, as the listing itself notes, it does not convey the right to cross
                    private property to reach it. Use a DNR public access site, a state
                    park, or stay somewhere with its own frontage. The DNR&rsquo;s
                    Where&nbsp;to&nbsp;Fish map is the authoritative source for launch
                    locations.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-2">
                    What else is here
                  </h3>
                  <p>
                    LaGrange County sits in one of the largest Amish communities in the
                    country, which shapes the whole experience: horse-drawn buggies on the
                    county roads, front-yard produce stands, and the Shipshewana flea
                    market on Tuesdays and Wednesdays through the summer. Pokagon State
                    Park has a toboggan run that draws people from three states in winter.
                    Fort Wayne, with an airport and a well-regarded zoo, is the nearest
                    city. And there is a great deal of ice cream &mdash; enough that we
                    mapped it in a{" "}
                    <a
                      href="/northern-indiana-ice-cream"
                      className="text-[#b3402f] underline decoration-[#b3402f]/40 underline-offset-4 hover:decoration-[#b3402f] transition-colors"
                    >
                      separate guide to the region&rsquo;s scoop shops
                    </a>
                    , including Steuben County&rsquo;s official eight-stop ice cream
                    trail.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-2">
                    Getting here
                  </h3>
                  <p>
                    The region sits within a few hours&rsquo; drive of Chicago,
                    Indianapolis, Detroit and Columbus, which is much of why it fills up
                    each summer. I&#8209;69 runs north to south through Steuben and Noble
                    counties; the Indiana Toll Road clips the top of LaGrange County.
                  </p>
                </div>
              </div>
            </TornSheet>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <StampHeading as="h2" ink="pine" rotate={1} className="text-2xl sm:text-3xl">
                Common questions
              </StampHeading>
            </div>
            <div className="space-y-10">
              {FAQS.map((f, i) => (
                <TornSheet
                  key={f.q}
                  variant={i % 2 === 0 ? "white" : "cream"}
                  rotate={i % 2 === 0 ? -0.6 : 0.7}
                  className="px-6 py-7 sm:px-9"
                >
                  <PushPin
                    color={FAQ_PINS[i]}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                  />
                  <h3 className="font-display text-xl font-semibold text-[#2b2520] mb-3">
                    {f.q}
                  </h3>
                  <p className="font-body text-[#2b2520]/65 leading-relaxed">{f.a}</p>
                </TornSheet>
              ))}
            </div>
          </div>
        </section>

        {/* Sources — the reason to trust the numbers */}
        <section className="py-14 sm:py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <TornSheet variant="kraft" rotate={-0.5} className="px-6 py-7 sm:px-9">
              <Tape className="-top-3.5 left-1/2 -ml-12" rotate={4} />
              <h2 className="font-typed text-lg font-bold text-[#2b2520] mb-4">
                Sources
              </h2>
              <ul className="font-body text-sm text-[#2b2520]/60 space-y-2 leading-relaxed">
                <li>
                  Indiana DNR, State Wildlife Action Plan &mdash; Natural Lakes Habitat
                  Summary (county share of natural lake acreage)
                </li>
                <li>
                  Natural Resources Commission Information Bulletin #61, Listing of Public
                  Freshwater Lakes (public lake counts by county)
                </li>
                <li>
                  Indiana DNR Division of Fish &amp; Wildlife, 15 Best Indiana Panfishing
                  Lakes (fishery descriptions and acreage for Big Long, Shipshewana, Clear,
                  Sylvan and Skinner lakes)
                </li>
                <li>
                  Lilly Center for Lakes &amp; Streams, Grace College (acreage, maximum and
                  average depth for Kosciusko County lakes)
                </li>
                <li>
                  Indiana DNR Division of Nature Preserves, Olin Lake Nature Preserve
                </li>
              </ul>
            </TornSheet>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 text-center">
          <div className="max-w-xl mx-auto">
            <TornSheet variant="cream" rotate={0.6} className="px-6 py-9 sm:px-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2520] mb-4">
                Stay on one of them
              </h2>
              <p className="font-body text-[#2b2520]/65 text-base sm:text-lg mb-8">
                The Farmhouse sits on the shoreline of Big Long Lake in LaGrange County
                &mdash; four bedrooms, sleeps 12, private dock. Read the{" "}
                <a
                  href="/big-long-lake"
                  className="text-[#b3402f] underline decoration-[#b3402f]/40 underline-offset-4 hover:decoration-[#b3402f] transition-colors"
                >
                  Big Long Lake guide
                </a>{" "}
                or ask us about dates.
              </p>
              <a
                href="/#inquire"
                className="relative inline-block font-marker uppercase tracking-wider text-sm sm:text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                Check the Big Long Lake Rental
              </a>
            </TornSheet>
          </div>
        </section>
      </main>
    </MotionProvider>
    <Footer />
  </>
);

export default NorthernIndianaLakes;
