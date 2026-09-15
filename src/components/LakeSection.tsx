import lakeImg from "@/assets/dock.webp";
import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";
import StickerBadge from "@/components/board/StickerBadge";
import MeritPatch from "@/components/board/MeritPatch";

// The trophy wall: the dock photo hangs straight on the dark lodge wall with
// the DNR bluegill brag stuck to its corner, next to a typed page of lake notes.
const LakeSection = () => (
  <BoardPanel id="lake">
    <div className="text-center mb-12">
      <StampHeading ink="pine" rotate={1.2} className="text-2xl sm:text-4xl">
        The Lake
      </StampHeading>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-10 items-start">
      <div className="relative lg:col-span-3">
        <Polaroid
          src={lakeImg}
          alt="Dock on Big Long Lake"
          caption="golden hour at the end of the dock"
          rotate={-1.5}
          fastener="tape"
          imgClassName="aspect-[4/3]"
          draggable
        />
        <StickerBadge
          ringText="INDIANA DNR SAYS SO · REALLY · "
          lines={["BEST", "BLUEGILL", "NE INDIANA"]}
          ink="navy"
          rotate={9}
          className="absolute bottom-16 -right-2 sm:-bottom-10 sm:-right-6 z-10"
        />
      </div>

      <TornSheet
        variant="white"
        rotate={1}
        className="lg:col-span-2 px-6 py-8 sm:px-8 sm:py-10"
      >
        <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
        <MeritPatch
          icon="fish"
          label="Fishing merit patch"
          felt="brick"
          rotate={8}
          className="absolute -top-7 -right-4 pointer-events-none"
        />
        <p className="font-typed text-xs uppercase tracking-[0.25em] text-[#2b2520]/50 mb-5 pr-16">
          Lake report — all summer
        </p>
        <div className="space-y-5 font-body text-[#2b2520]/70 text-base leading-relaxed">
          <p>
            Big Long Lake is an all-sports lake in LaGrange County, Indiana — roughly
            300 acres of clean water surrounded by woods and old lake houses. Swimming,
            boating, fishing, kayaking, paddleboarding — it's all fair game.
          </p>
          <p>
            In the mornings the lake is glass. Bring your coffee down to the dock
            and watch the mist burn off. By afternoon the kids are jumping off
            the dock, tubes are getting pulled, and someone's always fishing off
            the end.
          </p>
          <p>
            Bass, bluegill, and crappie keep the anglers busy. The lake is deep
            enough for tubing and skiing but small enough that you can kayak the
            whole shoreline before lunch.
          </p>
          <p>
            Summer evenings are the best part. The water goes still, the sky
            turns gold, and everyone ends up sitting at the end of the dock
            doing nothing in particular.
          </p>
          {/* Body-copy link to the guide page. The nav and footer already point at
              it, but a link inside the prose is what passes topical relevance —
              and the anchor text is the term we want the guide to rank for. */}
          <p>
            If you're still deciding where to stay, our guide to{" "}
            <a
              href="/big-long-lake"
              className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
            >
              Big Long Lake
            </a>{" "}
            covers the depth, the fishing, the public boat launch, and what the
            shoreline is actually like.
          </p>
        </div>
      </TornSheet>
    </div>
  </BoardPanel>
);

export default LakeSection;
