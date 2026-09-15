import { useEffect, useState } from "react";
import {
  Wifi,
  Trash2,
  Recycle,
  Phone,
  MessageCircle,
  MapPin,
  Flame,
  Music,
  Thermometer,
  GlassWater,
  CigaretteOff,
  Home,
  Hand,
  KeyRound,
  Sailboat,
  Dog,
  Clock,
  CalendarClock,
  CircleParking,
  UtensilsCrossed,
  Coffee,
  Wine,
  Beer,
  Pizza,
  IceCreamCone,
  Popsicle,
  Candy,
  Cherry,
  Cake,
  ShoppingCart,
  ShoppingBasket,
  Truck,
  Store,
  PawPrint,
  BookOpen,
  Lightbulb,
  Footprints,
  Dices,
  Package,
  Beef,
  Sun,
} from "lucide-react";
import TornSheet from "@/components/board/TornSheet";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import MeritPatch from "@/components/board/MeritPatch";
import deckLakeImg from "@/assets/deck-lake.webp";
import backyardImg from "@/assets/backyard.webp";
import livingRoomImg from "@/assets/living-room-wide.webp";
import lakeYardImg from "@/assets/lake-yard.webp";
import housesFromLakeImg from "@/assets/houses-from-lake.webp";
import arrivalLaneImg from "@/assets/arrival-lane.webp";
import parkingAreaImg from "@/assets/parking-area.webp";
import wifiQr from "@/assets/wifi-qr.svg";

const sections = [
  { id: "arrival", label: "Arrival" },
  { id: "essentials", label: "The Essentials" },
  { id: "rules", label: "House Rules" },
  { id: "house", label: "Around the House" },
  { id: "neighbors", label: "The Neighbors" },
  { id: "area", label: "Things to Do" },
  { id: "history", label: "A Little History" },
  { id: "checkout", label: "Checkout" },
  { id: "contact", label: "Contact Us" },
];

const houseTips = [
  {
    icon: Footprints,
    title: "Watch your step",
    text: "At 130 years old, the floors and stairs are a little wonky. Please take extra care on the narrow staircase.",
  },
  {
    icon: GlassWater,
    title: "Drinking water",
    text: "The tap water is safe to drink but not very tasty. We recommend the water jugs provided (or bottled water) for drinking.",
  },
  {
    icon: Thermometer,
    title: "Heating & cooling",
    text: "Each floor is different: the basement stays naturally cool, the main floor gets most of the AC, and each upstairs bedroom has its own window unit. Please turn units off or to eco mode when not in use. At night, set units to “cool” mode at your desired temperature so they run steadily instead of cycling on and off.",
  },
  {
    icon: Music,
    title: "Alexa is your DJ",
    text: "Say “Alexa, play [genre]” for music — or “Alexa, play in everywhere group” to play on all speakers.",
  },
  {
    icon: Lightbulb,
    title: "Lights",
    text: "The sunroom light is Alexa-connected: “Alexa, turn off porch lights.” There's also a switch for the outdoor porch lights to the right of the back door, behind the swing. For the string lights, just plug in the extension cord right outside the door.",
  },
];

const thingsToEnjoy = [
  {
    icon: Package,
    title: "Deck bins",
    text: "Everything in the bins under the deck is yours to use — just tuck it all back at the end of your stay.",
  },
  {
    icon: Beef,
    title: "Grills",
    text: "A Blackstone and a grill are on the deck, with all the tools kept alongside. Please clean after each use and replace the covers.",
  },
  {
    icon: Flame,
    title: "Firepit",
    text: "Firewood and the firepit (under the deck) are free to use.",
  },
  {
    icon: Sun,
    title: "Beach towels",
    text: "Extra towels are labeled in a lower cabinet next to the downstairs bathroom.",
  },
  {
    icon: Dices,
    title: "Games & puzzles",
    text: "A big collection lives under the basement stairs.",
  },
];

const eatDrink = [
  {
    icon: Pizza,
    title: "The Shady Nook",
    text: "Great lake bar for a quick bite or a hangout. Try the crab rangoon pizza!",
  },
  {
    icon: Beer,
    title: "Adams Lake Pub",
    text: "Casual lakeside spot nearby.",
  },
  {
    icon: Coffee,
    title: "Coffee & Cream — South Milford",
    text: "Coffee plus a small hard-serve ice cream selection. Closed Sundays; check hours online.",
  },
  {
    icon: UtensilsCrossed,
    title: "Destination 814 & Fireside Craft & Brews — LaGrange",
    text: "Our go-to dinner spots in LaGrange.",
  },
  {
    icon: Wine,
    title: "Sylvan Cellars & Events",
    text: "Occasionally hosts concerts and wine tastings.",
  },
];

const iceCreamTrail = [
  { icon: IceCreamCone, text: "Happiness Is Ice Cream — Howe" },
  { icon: Popsicle, text: "Lickety Splits — Rome City" },
  { icon: Cake, text: "Sundaes on Sylvan — Rome City" },
  { icon: Candy, text: "Rescue Scoops — Ashley" },
  { icon: Cherry, text: "Lucy's Vedie Twist — LaGrange" },
];

const dayTrips = [
  {
    icon: Store,
    title: "Shipshewana",
    text: "About 30 minutes away — Amish country shopping, flea markets, and food.",
  },
  {
    icon: PawPrint,
    title: "Fort Wayne",
    text: "About 45 minutes south — expansive zoo and a great kids' museum.",
  },
  {
    icon: BookOpen,
    title: "Kendallville Library",
    text: "Nice library with a playground out back.",
  },
];

const checkoutList = [
  "Strip the beds and place used towels downstairs by the laundry.",
  "Take trash to the bin and start the dishwasher.",
  "Bring outdoor furniture cushions inside so they stay dry.",
  "Remove all umbrellas from their stands — we've lost many to storms!",
  "Make sure all doors are locked — especially the back door and the basement door.",
];

const Welcome = () => {
  const [active, setActive] = useState(sections[0].id);

  // Keep this page out of search engines — it's a private guest link
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const prevRobots = meta.content;
    meta.content = "noindex, nofollow";
    const prevTitle = document.title;
    document.title = "Guest Welcome | The Farmhouse at Big Long Lake";
    return () => {
      if (created) meta!.remove();
      else meta!.content = prevRobots;
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLink = (s: (typeof sections)[number], mobile = false) => (
    <a
      key={s.id}
      href={`#${s.id}`}
      onClick={(e) => handleNavClick(e, s.id)}
      className={
        mobile
          ? `whitespace-nowrap px-4 py-2 rounded-full text-xs font-body font-medium uppercase tracking-[0.1em] transition-colors ${
              active === s.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-[#2b2520]/5 text-[#2b2520]/60"
            }`
          : `block py-2 text-sm font-body uppercase tracking-[0.15em] border-l-2 pl-4 transition-colors ${
              active === s.id
                ? "border-secondary text-secondary font-semibold"
                : "border-[#2b2520]/10 text-[#2b2520]/50 hover:text-[#2b2520]"
            }`
      }
    >
      {s.label}
    </a>
  );

  const subheading = (text: string) => (
    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2b2520] mt-10 mb-5">
      {text}
    </h3>
  );

  return (
    <div className="bg-corkboard min-h-screen">
      {/* Minimal private header — no marketing nav */}
      <header>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span
            className="font-hand text-2xl font-bold text-[#2b2520] [text-shadow:0_1px_0_rgba(255,255,255,0.25)]"
            style={{ transform: "rotate(-2deg)" }}
          >
            The Farmhouse
          </span>
          <span className="font-typed text-[11px] font-bold uppercase tracking-wide bg-[#f2e8d5] px-3 pt-2 pb-1.5 shadow-pinned rotate-1 text-[#2b2520]">
            Guest Guide
          </span>
        </div>
      </header>

      {/* Hero: the welcome poster, stapled to the board */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 pt-6 pb-8">
        <div
          className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-8 text-center"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
            Welcome to the Farmhouse
          </h1>
          <div className="relative mb-6">
            <Tape className="-top-3 -left-4" rotate={-38} />
            <Tape className="-top-3 -right-4" rotate={38} />
            <img
              src={deckLakeImg}
              alt="View of Big Long Lake from the deck"
              className="w-full aspect-[3/2] object-cover border-[6px] border-white shadow-pinned"
              loading="eager"
              width={1280}
              height={853}
            />
          </div>
          <p className="font-body text-[#2b2520]/70 text-base sm:text-lg mb-4">
            Built in 1895, this was the original house on Big Long Lake — and
            after 130 years, it's still the best seat on the water. We're so
            glad you're here.
          </p>
          <p className="font-hand text-xl sm:text-2xl text-[#2b2520]/75 flex items-center justify-center gap-2" style={{ transform: "rotate(-1deg)" }}>
            <MapPin size={17} className="shrink-0 text-secondary" />
            5688 S. 980 E., Wolcottville, IN 46795 &middot; Lane 2L
          </p>
        </div>
      </section>

      {/* Mobile section nav — sticky chips */}
      <nav className="lg:hidden sticky top-0 z-40 bg-[#f2e8d5]/95 backdrop-blur-md shadow-pinned">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [-webkit-overflow-scrolling:touch]">
          {sections.map((s) => navLink(s, true))}
        </div>
      </nav>

      {/* Body: side nav + sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Desktop side nav — an index card pinned beside the sheets */}
        <aside className="hidden lg:block">
          <nav
            className="sticky top-12 space-y-1 relative bg-[#fbf8ee] shadow-pinned px-4 pt-7 pb-5"
            style={{ transform: "rotate(-0.8deg)" }}
          >
            <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            {sections.map((s) => navLink(s))}
          </nav>
        </aside>

        <main className="max-w-2xl space-y-14 sm:space-y-16">
          {/* ————— Arrival ————— */}
          <section id="arrival" className="scroll-mt-24">
            <TornSheet variant="cream" rotate={-0.4} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <MeritPatch
              icon="boat"
              label="Boating merit patch"
              felt="teal"
              rotate={8}
              className="absolute -top-6 -right-3 hidden sm:block pointer-events-none z-10"
            />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              Arrival
            </h2>
            <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-6">
              You'll find us at 5688 S. 980 E., Wolcottville — down Lane 2L.
              Follow the gravel lane toward the lake, and park in the gravel
              area just before the house.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <figure className="relative bg-white p-2.5 pb-2 shadow-pinned -rotate-1">
                <Tape className="-top-3 left-1/2 -ml-12" rotate={-5} />
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={arrivalLaneImg}
                    alt="The gravel lane down to the house, marked with a red arrow"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1000}
                    height={1334}
                  />
                </div>
                <figcaption className="pt-2 font-hand text-lg text-[#2b2520]/75 text-center">
                  Follow the lane down toward the lake
                </figcaption>
              </figure>
              <figure className="relative bg-white p-2.5 pb-2 shadow-pinned rotate-1">
                <Tape className="-top-3 left-1/2 -ml-12" rotate={4} />
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={parkingAreaImg}
                    alt="The gravel parking area with a red arrow pointing to the house"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1000}
                    height={1334}
                  />
                </div>
                <figcaption className="pt-2 font-hand text-lg text-[#2b2520]/75 text-center">
                  Park here — the house is just beyond
                </figcaption>
              </figure>
            </div>
            <div className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <div className="flex gap-4">
                <Clock size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Check-in.</strong> 3:00 PM.
                </p>
              </div>
              <div className="flex gap-4">
                <CircleParking size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Parking.</strong> The
                  parking area comfortably fits up to 5 cars.
                </p>
              </div>
              <div className="flex gap-4">
                <KeyRound size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Door code.</strong> We'll
                  text you the door code on the day of your arrival.
                </p>
              </div>
            </div>
            </TornSheet>
          </section>

          {/* ————— The Essentials ————— */}
          <section id="essentials" className="scroll-mt-24">
            <TornSheet variant="white" rotate={0.5} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="yellow" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              The Essentials
            </h2>

            {/* Wifi card */}
            <div className="rounded-2xl bg-[#2b2520] text-[#f3ede2] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi size={20} className="text-secondary" />
                  <span className="font-body font-semibold uppercase tracking-[0.15em] text-sm">
                    Wifi
                  </span>
                </div>
                <dl className="font-body space-y-1">
                  <div className="flex gap-3">
                    <dt className="text-[#f3ede2]/50 w-24">Network</dt>
                    <dd className="font-semibold">Pumps Palace 2025</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="text-[#f3ede2]/50 w-24">Password</dt>
                    <dd className="font-semibold">Farmhouse</dd>
                  </div>
                </dl>
              </div>
              <div className="shrink-0 text-center">
                <div className="bg-white rounded-xl p-3 inline-block">
                  <img
                    src={wifiQr}
                    alt="Scan to join the wifi network"
                    width={120}
                    height={120}
                    className="block"
                  />
                </div>
                <p className="font-body text-xs text-[#f3ede2]/50 mt-2 uppercase tracking-[0.1em]">
                  Scan to join
                </p>
              </div>
            </div>

            <div className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <div className="flex gap-4">
                <CalendarClock size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Check-in.</strong> 3:00 PM
                  &middot;{" "}
                  <strong className="text-[#2b2520]">Check-out.</strong> 11:00 AM.
                </p>
              </div>
            </div>
            </TornSheet>
          </section>

          {/* ————— House Rules ————— */}
          <section id="rules" className="scroll-mt-24">
            <TornSheet variant="cream" rotate={-0.5} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <p className="font-marker text-xl text-[#b3402f] uppercase mb-1" aria-hidden="true">
              Camp Rules
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              House Rules
            </h2>
            <div className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <div className="flex gap-4">
                <CigaretteOff size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">No smoking</strong> anywhere
                  on the property.
                </p>
              </div>
              <div className="flex gap-4">
                <Sailboat size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">No unapproved boats.</strong>{" "}
                  Please check with us before bringing any watercraft.
                </p>
              </div>
              <div className="flex gap-4">
                <Dog size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">No unapproved dogs.</strong>{" "}
                  Please check with us before bringing a pet.
                </p>
              </div>
              <div className="flex gap-4">
                <Trash2 size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Trash.</strong> Use the can
                  in the parking area and make sure the lid is fully closed so
                  animals can't get in. Overflow trash can go in the bin labeled
                  &ldquo;GRING&rdquo; at the end of Lane 2K.
                </p>
              </div>
              <div className="flex gap-4">
                <Recycle size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">Metal cans.</strong> Save
                  them! Cans are collected and recycled to fund the lake's
                  annual fireworks display. There's a labeled bin in the
                  kitchen.
                </p>
              </div>
            </div>
            </TornSheet>
          </section>

          {/* ————— Around the House ————— */}
          <section id="house" className="scroll-mt-24">
            <TornSheet variant="white" rotate={0.4} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <MeritPatch
              icon="campfire"
              label="Campfire merit patch"
              felt="mustard"
              rotate={-8}
              className="absolute -top-6 -right-3 hidden sm:block pointer-events-none z-10"
            />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-4">
              Around the House
            </h2>
            <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-6">
              This house is quirky and old — that's the charm we love! A few
              things to know:
            </p>
            <div className="aspect-[16/10] overflow-hidden border-[6px] border-white shadow-pinned mb-8">
              <img
                src={livingRoomImg}
                alt="The Farmhouse living room"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <ul className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {houseTips.map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <tip.icon size={22} className="shrink-0 mt-1 text-secondary" />
                  <p>
                    <strong className="text-[#2b2520]">{tip.title}.</strong>{" "}
                    {tip.text}
                  </p>
                </li>
              ))}
            </ul>

            {subheading("Things to enjoy during your stay")}
            <ul className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {thingsToEnjoy.map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <tip.icon size={22} className="shrink-0 mt-1 text-secondary" />
                  <p>
                    <strong className="text-[#2b2520]">{tip.title}.</strong>{" "}
                    {tip.text}
                  </p>
                </li>
              ))}
            </ul>
            </TornSheet>
          </section>

          {/* ————— The Neighbors ————— */}
          <section id="neighbors" className="scroll-mt-24">
            <TornSheet variant="cream" rotate={-0.6} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              The Neighbors
            </h2>
            <div className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <div className="flex gap-4">
                <Home size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">To the right</strong>{" "}
                  (facing the lake) is Jeff and his family in the orange house —
                  friendly folks.
                </p>
              </div>
              <div className="flex gap-4">
                <Hand size={22} className="shrink-0 mt-1 text-secondary" />
                <p>
                  <strong className="text-[#2b2520]">To the left</strong> are
                  David and Rachel Michael and their kids — super fun and
                  friendly, and they'll be sure to say hello.
                </p>
              </div>
            </div>
            </TornSheet>
          </section>

          {/* ————— Things to Do ————— */}
          <section id="area" className="scroll-mt-24">
            <TornSheet variant="white" rotate={0.5} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="yellow" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <MeritPatch
              icon="icecream"
              label="Ice cream merit patch"
              felt="brick"
              rotate={9}
              className="absolute -top-6 -right-3 hidden sm:block pointer-events-none z-10"
            />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-4">
              Things to Do
            </h2>
            <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-6">
              Our favorite local spots — and there's a binder on the table with
              even more.
            </p>
            <div className="aspect-[16/10] overflow-hidden border-[6px] border-white shadow-pinned mb-2">
              <img
                src={lakeYardImg}
                alt="The yard leading down to Big Long Lake"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {subheading("Eat & drink nearby")}
            <ul className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {eatDrink.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <item.icon size={22} className="shrink-0 mt-1 text-secondary" />
                  <p>
                    <strong className="text-[#2b2520]">{item.title}.</strong>{" "}
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            {subheading("The ice cream trail")}
            <ul className="space-y-3 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {iceCreamTrail.map((stop, i) => (
                <li key={i} className="flex gap-4">
                  <stop.icon size={22} className="shrink-0 mt-1 text-secondary" />
                  <p>{stop.text}</p>
                </li>
              ))}
            </ul>

            {subheading("Groceries & quick stops")}
            <ul className="space-y-3 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <li className="flex gap-4">
                <Truck size={22} className="shrink-0 mt-1 text-secondary" />
                <p>Walmart and Kroger both deliver groceries right to the house.</p>
              </li>
              <li className="flex gap-4">
                <ShoppingCart size={22} className="shrink-0 mt-1 text-secondary" />
                <p>Kendallville is about 15 minutes away for in-person shopping.</p>
              </li>
              <li className="flex gap-4">
                <ShoppingBasket size={22} className="shrink-0 mt-1 text-secondary" />
                <p>Dollar General is about 8 minutes away for ice and quick grabs.</p>
              </li>
            </ul>

            {subheading("Day trips")}
            <ul className="space-y-6 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {dayTrips.map((trip, i) => (
                <li key={i} className="flex gap-4">
                  <trip.icon size={22} className="shrink-0 mt-1 text-secondary" />
                  <p>
                    <strong className="text-[#2b2520]">{trip.title}.</strong>{" "}
                    {trip.text}
                  </p>
                </li>
              ))}
            </ul>
            </TornSheet>
          </section>

          {/* ————— A Little History ————— */}
          <section id="history" className="scroll-mt-24">
            <TornSheet variant="cream" rotate={-0.4} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              A Little History
            </h2>
            <div className="aspect-[16/10] overflow-hidden border-[6px] border-white shadow-pinned mb-8">
              <img
                src={housesFromLakeImg}
                alt="The Farmhouse seen from Big Long Lake"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              <p>
                Big Long Lake is a 365-acre glacial lake in LaGrange County,
                Indiana, just north of Kendallville and Wolcottville. Spring-fed
                and crystal clear, it averages 30 feet deep and reaches 82 feet
                at its deepest point. The lake was once part of an Indian
                reserve, and a trail still circles the entire shoreline.
              </p>
              <p>
                The Farmhouse was the original house on the lake, built in 1895
                by a local farm family. Additions and changes have come over the
                years, but the charm remains — the original flooring on the main
                floor, some original basement windows, and the same unhurried
                feel. The bones are the same. The screen door still slams. The
                dock still catches the evening light.
              </p>
            </div>
            </TornSheet>
          </section>

          {/* ————— Checkout ————— */}
          <section id="checkout" className="scroll-mt-24">
            <TornSheet variant="legal" ruled rotate={0.6} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="yellow" className="absolute -top-3.5 left-8" />
            <PushPin color="red" className="absolute -top-3.5 right-8" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-2">
              Checkout
            </h2>
            <p className="font-body text-secondary font-semibold uppercase tracking-[0.15em] text-sm mb-6">
              By 11:00 AM
            </p>
            <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-6">
              Before you head out, please:
            </p>
            <ul className="space-y-4 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
              {checkoutList.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 mt-1 w-6 h-6 rounded-full border-2 border-secondary flex items-center justify-center text-secondary text-xs font-bold font-body">
                    {i + 1}
                  </span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-hand text-2xl text-[#2b2520]/75" style={{ transform: "rotate(-1deg)" }}>
              Thanks for staying with us. We hope you had a wonderful stay!
            </p>
            </TornSheet>
          </section>

          {/* ————— Contact ————— */}
          <section id="contact" className="scroll-mt-24">
            <TornSheet variant="cream" rotate={-0.5} className="px-5 py-8 sm:px-8 sm:py-10">
            <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] mb-6">
              Contact Us
            </h2>
            <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed mb-6">
              Please contact us immediately if you have any problems during your
              stay. Questions anytime — just text or call.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <a
                href="tel:303-619-5099"
                className="relative bg-[#fbf8ee] shadow-pinned p-6 pt-7 -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <Phone size={16} />
                  <span className="font-body text-xs uppercase tracking-[0.15em]">
                    Text / Call
                  </span>
                </div>
                <p className="font-display text-xl font-bold text-[#2b2520]">
                  Shane Gring
                </p>
                <p className="font-body text-[#2b2520]/70">303-619-5099</p>
              </a>
              <a
                href="tel:734-660-5947"
                className="relative bg-[#fbf8ee] shadow-pinned p-6 pt-7 rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <MessageCircle size={16} />
                  <span className="font-body text-xs uppercase tracking-[0.15em]">
                    Text / Call
                  </span>
                </div>
                <p className="font-display text-xl font-bold text-[#2b2520]">
                  Scott Gring
                </p>
                <p className="font-body text-[#2b2520]/70">734-660-5947</p>
              </a>
            </div>
            </TornSheet>
          </section>

          <footer className="pt-4">
            <div className="relative bg-white p-3 pb-2 shadow-pinned rotate-1 mb-6">
              <Tape className="-top-3 -left-4" rotate={-38} />
              <Tape className="-top-3 -right-4" rotate={38} />
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={backyardImg}
                  alt="The Farmhouse backyard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="font-hand text-2xl text-[#3a2a18] text-center" style={{ transform: "rotate(-1deg)" }}>
              We wish you a comfortable and fun stay! — Shane, Scott &amp; Family
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Welcome;
