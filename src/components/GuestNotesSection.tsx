import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import PushPin, { type PinColor } from "@/components/board/PushPin";

// Guest testimonials, pinned to the board like notes left on a camp
// guest book. Three spots; empty ones are standing invitations rather
// than blank space. Quotes are rendered exactly as guests wrote them.
const notes: {
  quote: string;
  name: string;
  date: string;
  rotate: number;
  pin: PinColor;
  variant: "cream" | "white" | "legal";
}[] = [
  {
    quote: "The place was wonderful, we loved it.",
    name: "Ann",
    date: "August 2026",
    rotate: -1.5,
    pin: "red",
    variant: "cream",
  },
];

const openSpots = [
  { rotate: 1.4, label: "this spot's saved for your crew" },
  { rotate: -1, label: "and one for the next family after that" },
];

const GuestNotesSection = () => (
  <BoardPanel id="guest-notes">
    <div className="text-center mb-4">
      <StampHeading ink="pine" className="text-2xl sm:text-4xl">
        From the Guest Book
      </StampHeading>
    </div>
    <p
      className="font-hand text-xl sm:text-2xl text-[#3a2a18] text-center mb-12"
      style={{ transform: "rotate(-1deg)" }}
    >
      Notes left behind by the families who stayed.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto items-start">
      {notes.map((n) => (
        <TornSheet key={n.name + n.date} variant={n.variant} rotate={n.rotate} className="px-6 pt-8 pb-7">
          <PushPin color={n.pin} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
          <blockquote>
            <p className="font-hand text-2xl leading-snug text-[#2b2520]/85 mb-4">
              &ldquo;{n.quote}&rdquo;
            </p>
            <footer className="font-typed text-xs font-bold uppercase tracking-[0.15em] text-[#2b2520]/55">
              — {n.name} · {n.date}
            </footer>
          </blockquote>
        </TornSheet>
      ))}

      {openSpots.map((s) => (
        <a
          key={s.label}
          href="#inquire"
          className="group block border-[3px] border-dashed border-[#5a4222]/40 px-6 pt-8 pb-7 text-center hover:border-[#b3402f]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          style={{ transform: `rotate(${s.rotate}deg)` }}
        >
          <p className="font-hand text-2xl leading-snug text-[#3a2a18]/75 mb-3">
            {s.label}
          </p>
          <p className="font-typed text-xs font-bold uppercase tracking-[0.15em] text-[#b3402f] group-hover:underline underline-offset-4">
            book your week →
          </p>
        </a>
      ))}
    </div>
  </BoardPanel>
);

export default GuestNotesSection;
