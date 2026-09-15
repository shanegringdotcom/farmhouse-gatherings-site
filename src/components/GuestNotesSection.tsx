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
  {
    quote: "Thank you so much for the stay! It was perfect for my sister, her daughters, and her grandkids.",
    name: "Lindsay",
    date: "July 2026",
    rotate: 1.2,
    pin: "navy",
    variant: "white",
  },
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

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-3xl mx-auto items-start">
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

    </div>
  </BoardPanel>
);

export default GuestNotesSection;
