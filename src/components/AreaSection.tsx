import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import IndexCard from "@/components/board/IndexCard";
import PushPin from "@/components/board/PushPin";
import MeritPatch from "@/components/board/MeritPatch";

const highlights = [
  {
    title: "Shipshewana & Amish Country",
    desc: "Just 15 minutes away. The Shipshewana Flea Market runs every Tuesday and Wednesday from May through September — over 700 vendors across 40 acres. Grab a pie from an Amish bakery on the way home.",
    rotate: -1.2,
    pin: "red" as const,
  },
  {
    title: "Farm Stands & Local Eats",
    desc: "Fresh sweet corn and tomatoes from roadside stands all summer long. LaGrange County is farm country, and the produce shows up everywhere — front yards, gravel pull-offs, hand-painted signs you can't miss.",
    rotate: 1.5,
    pin: "green" as const,
  },
  {
    title: "Small-Town Rhythm",
    desc: "Wolcottville moves slow. That's the whole point. Quiet roads, friendly waves, nowhere to rush to. It's the kind of place where the ice cream shop is a 5-minute drive and the biggest decision is what flavor.",
    rotate: 1,
    pin: "yellow" as const,
  },
  {
    title: "Outdoor Adventures",
    desc: "Pigeon River Fish & Wildlife Area is a short drive east — great for hiking and birdwatching. Mongo is a few minutes down the road. Chain O'Lakes State Park is about 30 minutes south for anyone who wants a day trip.",
    rotate: -1.6,
    pin: "navy" as const,
  },
];

// The area board: intro sheet (with the SEO-load-bearing guide links kept in
// prose), three pinned guide index cards, and four flyers.
const AreaSection = () => (
  <BoardPanel id="area">
    <div className="text-center mb-10">
      <StampHeading ink="pine" className="text-2xl sm:text-4xl">The Area</StampHeading>
    </div>

    <TornSheet variant="cream" rotate={0.6} className="max-w-2xl mx-auto px-6 py-8 sm:px-10 mb-14">
      <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
      <p className="font-body text-[#2b2520]/60 text-base sm:text-lg text-center mb-5">
        Wolcottville sits in the heart of LaGrange County, Indiana — Amish country, lake country, and about as far from a highway as you can get.
      </p>
      {/* Body-copy links to the regional hub + ice cream guide, with the anchor
          text they target. Same reasoning as the Big Long Lake link in LakeSection. */}
      <p className="font-body text-[#2b2520]/60 text-base sm:text-lg text-center">
        It's also a good base for the rest of the region — we wrote a guide to the{" "}
        <a
          href="/northern-indiana-lakes"
          className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
        >
          northern Indiana lakes
        </a>{" "}
        worth a day trip from here, and another to the{" "}
        <a
          href="/northern-indiana-ice-cream"
          className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
        >
          best ice cream in the area
        </a>
        , which turns out to be the question guests ask most.
      </p>
    </TornSheet>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto mb-16">
      <div className="relative">
        <IndexCard
          href="/big-long-lake"
          title="THE LAKE GUIDE"
          sub="Fishing, public access, events & the lake map. Read before you pack."
          rotate={-1.5}
          pinColor="red"
        />
        <MeritPatch
          icon="boat"
          label="Boating merit patch"
          felt="teal"
          rotate={-8}
          className="absolute -bottom-6 -right-3 pointer-events-none"
        />
      </div>
      <div className="relative">
        <IndexCard
          href="/northern-indiana-lakes"
          title="239 LAKES NEARBY"
          sub="Every public lake in the four counties, ranked by day-trip worthiness."
          rotate={1.2}
          pinColor="navy"
        />
        <MeritPatch
          icon="compass"
          label="Explorer merit patch"
          felt="pine"
          rotate={7}
          className="absolute -bottom-6 -right-3 pointer-events-none"
        />
      </div>
      <div className="relative">
        <IndexCard
          href="/northern-indiana-ice-cream"
          title="THE ICE CREAM MAP"
          sub="24 shops, 4 counties, 1 official trail. The most-asked guest question."
          rotate={-0.8}
          pinColor="yellow"
        />
        <MeritPatch
          icon="icecream"
          label="Ice cream merit patch"
          felt="mustard"
          rotate={-6}
          className="absolute -bottom-6 -right-3 pointer-events-none"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto">
      {highlights.map((h) => (
        <TornSheet key={h.title} variant="white" rotate={h.rotate} className="px-6 py-7">
          <PushPin color={h.pin} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#2b2520] mb-3 text-center">
            {h.title}
          </h3>
          <p className="font-body text-[#2b2520]/60 text-base leading-relaxed text-center">
            {h.desc}
          </p>
        </TornSheet>
      ))}
    </div>
  </BoardPanel>
);

export default AreaSection;
