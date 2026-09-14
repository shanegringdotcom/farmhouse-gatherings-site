import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BigLongLakeMap from "@/components/BigLongLakeMap";
import { mapsUrl } from "@/data/ice-cream";
import lakeImg from "@/assets/houses-from-lake.webp";
import dockImg from "@/assets/dock.webp";
import deckLakeImg from "@/assets/deck-lake.webp";
import lakeYardImg from "@/assets/lake-yard.webp";

const activities = [
  {
    title: "Swimming & Sandy Shoreline",
    desc: "Big Long Lake has clean, swimmable water and a gently sloping shoreline that's great for kids. Wade in off the dock or float the afternoon away.",
  },
  {
    title: "Boating, Tubing & Skiing",
    desc: "As an all-sports lake, Big Long is open to motorboats, tubes, and water skis. There's room to pull the kids around and still find a quiet cove.",
  },
  {
    title: "Fishing",
    desc: "Bass, bluegill, and crappie keep anglers busy from the dock or a boat. Mornings and evenings are the sweet spots.",
  },
  {
    title: "Kayaking & Paddleboarding",
    desc: "At roughly 300 acres, you can paddle the whole shoreline before lunch. The water is glass first thing in the morning.",
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
      <main>
        {/* Hero */}
        <section className="relative h-[70vh] flex items-center justify-center">
          <div className="absolute inset-4 sm:inset-6 rounded-3xl overflow-hidden">
            <img
              src={lakeImg}
              alt="Homes along the shoreline of Big Long Lake in Wolcottville, Indiana"
              className="w-full h-full object-cover"
              loading="eager"
              width={1280}
              height={849}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-white/60 mb-6">
              LaGrange County, Indiana
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[0.95]">
              Big Long Lake Vacation Rental Guide
            </h1>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20 sm:py-28 px-6 bg-surface-warm">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-8">
              About Big Long Lake
            </h2>
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
              className="inline-block mt-10 bg-secondary text-secondary-foreground font-body font-semibold text-sm tracking-wide uppercase px-8 py-3 rounded-sm hover:bg-secondary/90 transition-colors"
            >
              Check Availability
            </a>
          </div>
        </section>

        {/* Photo band */}
        <section className="px-6 bg-surface-warm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-6xl mx-auto pb-20">
            {[
              { img: dockImg, alt: "Private dock on Big Long Lake" },
              { img: deckLakeImg, alt: "Deck overlooking Big Long Lake" },
              { img: lakeYardImg, alt: "Lakefront yard at the Big Long Lake farmhouse" },
            ].map((p) => (
              <div key={p.alt} className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src={p.img} alt={p.alt} className="w-full h-full object-cover" loading="lazy" width={1280} height={849} />
              </div>
            ))}
          </div>
        </section>

        {/* Things to do */}
        <section className="py-20 sm:py-28 px-6 bg-surface-cool">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Things to Do on the Lake
            </h2>
            <p className="font-body text-foreground/50 text-center mb-14 text-base sm:text-lg">
              An all-sports lake means there's a little of everything.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
              {activities.map((a) => (
                <div key={a.title}>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3">
                    {a.title}
                  </h3>
                  <p className="font-body text-foreground/60 text-base leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events / what's on */}
        <section id="events" className="py-20 sm:py-28 px-6 bg-surface-warm">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] text-center mb-4">
              Events &amp; What&rsquo;s On
            </h2>
            <p className="font-body text-[#2b2520]/50 text-center mb-14 text-base sm:text-lg">
              Seasonal happenings on Big Long Lake and around Amish country.
            </p>
            <div className="space-y-10">
              {events.map((ev) => (
                <div key={ev.what} className="border-l-2 border-secondary/50 pl-6">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary mb-1">
                    {ev.when}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#2b2520]">
                    {ev.what}
                  </h3>
                  <p className="font-body text-[#2b2520]/40 text-sm mb-2">{ev.where}</p>
                  <p className="font-body text-[#2b2520]/60 text-base leading-relaxed">
                    {ev.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-body text-[#2b2520]/40 text-sm text-center mt-12 max-w-xl mx-auto">
              Dates shift a little year to year — check the organizers&rsquo; sites for
              current schedules before you plan around them.
            </p>
          </div>
        </section>

        {/* Best time to visit */}
        <section className="py-20 sm:py-28 px-6 bg-surface-cool">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8">
              When to Visit
            </h2>
            <div className="space-y-5 font-body text-foreground/60 text-base sm:text-lg leading-relaxed">
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
          </div>
        </section>

        {/* Public access & lake map */}
        <section id="public-access" className="py-20 sm:py-28 px-6 bg-surface-warm">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] text-center mb-4">
              Public Access &amp; Getting on the Lake
            </h2>
            <p className="font-body text-[#2b2520]/50 text-center mb-14 text-base sm:text-lg">
              Where to launch a boat, and the rules of the water once you&rsquo;re out.
            </p>
            <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-12">
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
            <BigLongLakeMap />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24 px-6 bg-surface-pine text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay on Big Long Lake
            </h2>
            <p className="font-body text-white/60 text-base sm:text-lg mb-8">
              Four bedrooms, sleeps 12, private dock. Tell us your dates and group
              size and we&rsquo;ll get back to you within 24 hours.
            </p>
            <a
              href="/#inquire"
              className="inline-block bg-secondary text-secondary-foreground font-body font-semibold text-sm tracking-wide uppercase px-8 py-3 rounded-sm hover:bg-secondary/90 transition-colors"
            >
              Check the Big Long Lake Rental
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BigLongLake;
