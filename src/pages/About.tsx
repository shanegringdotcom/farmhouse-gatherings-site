import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/board/MotionProvider";
import TornSheet from "@/components/board/TornSheet";
import Polaroid from "@/components/board/Polaroid";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import StampHeading from "@/components/board/StampHeading";
import houseImg from "@/assets/house-exterior.webp";
import familyImg from "@/assets/family-dock.webp";
import familyLivingRoomImg from "@/assets/family-livingroom.webp";

const About = () => {
  return (
    <>
      <Navbar />
      <MotionProvider>
        <main className="bg-corkboard">
          {/* Hero: the house photo taped up like a poster */}
          <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 pt-24 pb-10">
            <div
              className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-9 text-center"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
                Our Family
              </h1>
              <div className="relative">
                <Tape className="-top-3 -left-4" rotate={-38} />
                <Tape className="-top-3 -right-4" rotate={38} />
                <img
                  src={houseImg}
                  alt="The Farmhouse at Big Long Lake exterior"
                  className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
                  loading="eager"
                  width={1280}
                  height={853}
                />
              </div>
            </div>
          </section>

          {/* Family introduction */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  The Gring Family
                </StampHeading>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 items-start mb-14">
                <Polaroid
                  src={familyImg}
                  alt="Laura, Shane, Kyle, and Scott Gring on the shoreline at Big Long Lake"
                  caption="the four of us (plus the dog), dock-side"
                  rotate={-2}
                  fastener="pin"
                  pinColor="red"
                  draggable
                  imgClassName="aspect-[3/4]"
                  width={1280}
                  height={1920}
                  className="sm:col-span-2"
                />
                <Polaroid
                  src={familyLivingRoomImg}
                  alt="Three generations of the Gring family gathered in the living room at The Farmhouse"
                  caption="the whole crew, living-room edition"
                  rotate={1.5}
                  fastener="tape"
                  draggable
                  imgClassName="aspect-[3/2]"
                  width={1280}
                  height={853}
                  className="sm:col-span-3 sm:mt-8"
                />
              </div>

              <TornSheet variant="cream" rotate={0.8} className="px-6 py-9 sm:px-10 sm:py-11">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed text-center">
                  <p>
                    We're Laura, Shane, Kyle, and Scott — and we've been the owners
                    of The Farmhouse at Big Long Lake since 2018.
                  </p>
                  <p>
                    When we first found this place, we knew it was something special.
                    One of the oldest homes on Big Long Lake, tucked into a quiet
                    stretch of shoreline in Wolcottville, Indiana. The kind of house
                    that feels like it's been waiting for big families and long weekends.
                  </p>
                  <p>
                    We've put a lot of love into updating it over the years — new
                    kitchen, comfortable beds, a deck you never want to leave — but
                    we've kept the character that makes it feel like a real lake house
                    and not a rental. The screen door still slams. The dock still
                    catches the sunset.
                  </p>
                  <p>
                    For us, this place is about slowing down and being together.
                    Morning coffee on the deck, afternoons on the water, evenings
                    around the firepit. We hope it gives your family the same thing
                    it gives ours.
                  </p>
                </div>
              </TornSheet>
            </div>
          </section>

          {/* CTA back to inquiry */}
          <section className="py-16 sm:py-20 px-6 text-center">
            <TornSheet variant="white" rotate={-0.8} className="max-w-xl mx-auto px-8 py-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2520] mb-4">
                Come stay with us
              </h2>
              <p className="font-body text-[#2b2520]/60 text-base sm:text-lg mb-8">
                We'd love to share this place with your family.
              </p>
              <a
                href="/#inquire"
                className="relative inline-block font-marker uppercase tracking-wider text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                Get in Touch
              </a>
            </TornSheet>
          </section>
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
};

export default About;
