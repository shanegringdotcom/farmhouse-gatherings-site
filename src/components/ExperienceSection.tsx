import bunkImg from "@/assets/bunk-room.webp";
import kidsRoomImg from "@/assets/kids-room.webp";
import diningImg from "@/assets/dining-room.webp";
import livingImg from "@/assets/living-room.webp";
import kitchenImg from "@/assets/kitchen.webp";
import livingWideImg from "@/assets/living-room-wide.webp";
import twinsLawnImg from "@/assets/twins-lawn.webp";
import twirlImg from "@/assets/twirl-shoreline.webp";
import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import MeritPatch from "@/components/board/MeritPatch";
import type { PinColor } from "@/components/board/PushPin";

// The six room photos as a cluster of pinned-and-taped snapshots.
const snapshots: {
  img: string;
  alt: string;
  caption: string;
  rotate: number;
  fastener: "pin" | "tape";
  pinColor?: PinColor;
  portrait?: boolean;
  width?: number;
  height?: number;
}[] = [
  { img: diningImg, alt: "Dining table with lake views", caption: "Big Dining Table — room for everyone. Pass the corn.", rotate: -2.5, fastener: "pin", pinColor: "red" },
  { img: livingImg, alt: "Warm living room", caption: "Cozy Living Space — board games. Rainy afternoons. Extra blankets.", rotate: 1.8, fastener: "tape" },
  { img: kitchenImg, alt: "Kitchen", caption: "Full Kitchen — morning coffee. Big breakfasts. Late-night snacks.", rotate: -1.2, fastener: "pin", pinColor: "yellow" },
  { img: bunkImg, alt: "Bunk room with nautical decor", caption: "Bunk Rooms (cousins' quarters)", rotate: 2.2, fastener: "pin", pinColor: "green" },
  { img: kidsRoomImg, alt: "Kids room with twin beds", caption: "Kids Room — lights out means lights out", rotate: -2, fastener: "tape" },
  { img: livingWideImg, alt: "Open living and dining area", caption: "Living Area — the whole gang fits", rotate: 1.4, fastener: "pin", pinColor: "navy" },
  { img: twinsLawnImg, alt: "Two toddlers in sun hats sitting on the lawn in front of The Farmhouse", caption: "the littlest campers, reporting for duty", rotate: -2.2, fastener: "tape", portrait: true, width: 1280, height: 1707 },
  { img: twirlImg, alt: "A girl twirling in a dress on the lakefront lawn at golden hour", caption: "golden hour twirls by the dock", rotate: 1.8, fastener: "pin", pinColor: "red", portrait: true, width: 1280, height: 1707 },
];

const ExperienceSection = () => (
  <BoardPanel id="experience">
    <div className="relative text-center mb-12 max-w-xl mx-auto">
      <StampHeading className="text-2xl sm:text-4xl mb-5">The Experience</StampHeading>
      <TornSheet
        variant="white"
        rotate={0.8}
        className="inline-block px-6 py-3 max-w-md mx-auto"
      >
        <p className="font-hand text-xl sm:text-2xl text-[#2b2520]/80">
          Everything you need. Nothing you don't.
        </p>
      </TornSheet>
      <MeritPatch
        icon="paddle"
        label="Paddling merit patch"
        felt="cream"
        rotate={10}
        className="absolute -top-3 right-0 hidden sm:block pointer-events-none"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {snapshots.map((s) => (
        <Polaroid
          key={s.alt}
          src={s.img}
          alt={s.alt}
          caption={s.caption}
          rotate={s.rotate}
          fastener={s.fastener}
          pinColor={s.pinColor}
          imgClassName={s.portrait ? "aspect-[3/4]" : "aspect-[4/3]"}
          width={s.width}
          height={s.height}
          draggable
        />
      ))}
    </div>
  </BoardPanel>
);

export default ExperienceSection;
