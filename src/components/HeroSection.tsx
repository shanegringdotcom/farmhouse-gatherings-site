import heroImg from "@/assets/deck-view.webp";
import Tape from "@/components/board/Tape";
import StickerBadge from "@/components/board/StickerBadge";

// Corner staple for the hero poster.
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

// The hero is a big cream poster stapled to the dark lodge wall. The photo
// stays a plain eager <img> — it is the LCP element, so no masks or filters.
const HeroSection = () => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-16 sm:pt-28"
  >
    <div
      className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-12 sm:pb-10 text-center"
      style={{ transform: "rotate(-0.6deg)" }}
    >
      <Staple className="top-1.5 left-5 -rotate-6" />
      <Staple className="top-1.5 right-5 rotate-6" />
      <Staple className="bottom-1.5 left-8 rotate-3" />
      <Staple className="bottom-1.5 right-8 -rotate-3" />

      <p className="font-typed text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2b2520]/55 mb-4">
        Wolcottville, Indiana
      </p>
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#2b2520] leading-[0.95] mb-3">
        The Farmhouse at
        <br />
        Big Long Lake
      </h1>
      <p
        className="font-hand text-2xl sm:text-3xl text-secondary mb-6"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        A place to gather.
      </p>

      <div className="relative mb-6">
        <Tape className="-top-3 -left-4" rotate={-38} />
        <Tape className="-top-3 -right-4" rotate={38} />
        <img
          src={heroImg}
          alt="Big Long Lake vacation rental deck view in Wolcottville, Indiana"
          className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
          loading="eager"
          width={1280}
          height={853}
        />
        <StickerBadge
          ringText="THE FARMHOUSE · BIG LONG LAKE · "
          lines={["SLEEPS", "12"]}
          ink="red"
          rotate={10}
          className="absolute -bottom-8 -right-2 sm:-right-8"
        />
        <StickerBadge
          ringText="SWIM · SKI · FISH · PADDLE · "
          lines={["ALL-SPORTS", "LAKE"]}
          ink="pine"
          rotate={-8}
          className="absolute -bottom-8 -left-2 sm:-left-8 hidden sm:block"
        />
      </div>

      <p className="font-body text-base sm:text-lg text-[#2b2520]/70 max-w-xl mx-auto mb-5">
        A lakefront vacation rental on Big Long Lake — 4 bedrooms, a private dock,
        and room for 12 in the heart of Indiana&rsquo;s Amish country.
      </p>
      <p className="font-hand text-xl sm:text-2xl text-[#2b2520]/65 mb-3" style={{ transform: "rotate(-1deg)" }}>
        come to the lake!
      </p>
      <a
        href="#inquire"
        className="relative inline-block font-marker uppercase tracking-wider text-base sm:text-lg bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
        />
        Book Your Week ↓
      </a>
    </div>
  </section>
);

export default HeroSection;
