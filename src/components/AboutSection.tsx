import houseImg from "@/assets/houses-from-lake.webp";
import backyardImg from "@/assets/backyard.webp";
import familyShorelineImg from "@/assets/family-shoreline.webp";
import twinsLawnImg from "@/assets/twins-lawn.webp";
import twirlImg from "@/assets/twirl-shoreline.webp";
import BoardPanel from "@/components/board/BoardPanel";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";

// The letter home, pinned to the first corkboard, with two snapshots beside it.
const AboutSection = () => (
  <BoardPanel id="about">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8 items-start">
      <div className="lg:col-span-3">
      <TornSheet
        variant="cream"
        rotate={-0.8}
        className="px-6 py-9 sm:px-10 sm:py-12"
      >
        <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#2b2520] mb-8">
          About the Home
        </h2>
        <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
          <p>
            The Farmhouse is one of the oldest properties on Big Long Lake. It's been gently
            updated over the years but never lost what makes it feel like home.
          </p>
          <p>
            Four bedrooms sleep up to 12 guests — bunk rooms for the cousins,
            a kids room with twin beds, and two rooms for the grown-ups.
            Two full bathrooms, a full kitchen with everything you need for big
            breakfasts, and a dining table long enough for the whole crew.
          </p>
          <p>
            Outside, the lakefront yard runs straight down to your own private dock
            on Big Long Lake. There's a deck for morning coffee, a firepit for
            after-dark s'mores, and enough open grass for wiffle ball.
          </p>
          <p>
            The bones are the same. The screen door still slams. The dock still
            catches the evening light. It's clean, comfortable, and unhurried —
            a place that feels like it's always been part of the lake.
          </p>
        </div>
        <p className="font-hand text-2xl text-[#2b2520]/75 mt-8" style={{ transform: "rotate(-1.2deg)" }}>
          — see you at the dock
        </p>
      </TornSheet>

      {/* Snapshots tacked up right under the letter */}
      <div className="grid grid-cols-2 gap-8 sm:gap-10 mt-12">
        <Polaroid
          src={twinsLawnImg}
          alt="Two toddlers in sun hats sitting on the lawn in front of The Farmhouse"
          caption="the littlest campers, reporting for duty"
          rotate={-2.2}
          fastener="tape"
          draggable
          imgClassName="aspect-[3/4]"
          width={1280}
          height={1707}
        />
        <Polaroid
          src={twirlImg}
          alt="A girl twirling in a dress on the lakefront lawn at golden hour"
          caption="golden hour twirls by the dock"
          rotate={1.8}
          fastener="pin"
          pinColor="red"
          draggable
          imgClassName="aspect-[3/4]"
          width={1280}
          height={1707}
        />
      </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-12 lg:pt-6">
        <Polaroid
          src={houseImg}
          alt="The Farmhouse from the lake"
          caption="the old girl herself"
          rotate={2.5}
          fastener="pin"
          pinColor="red"
          draggable
        />
        <Polaroid
          src={backyardImg}
          alt="Backyard and deck"
          caption="wiffle ball stadium"
          rotate={-3}
          fastener="tape"
          draggable
          width={1280}
          height={852}
        />
        <Polaroid
          src={familyShorelineImg}
          alt="Three generations of the Gring family on the shoreline at Big Long Lake"
          caption="a place to gather — proof"
          rotate={2}
          fastener="pin"
          pinColor="yellow"
          draggable
          imgClassName="aspect-[3/4]"
          width={1280}
          height={1920}
          className="col-span-2 lg:col-span-1 max-w-xs mx-auto lg:max-w-none"
        />
      </div>
    </div>
  </BoardPanel>
);

export default AboutSection;
