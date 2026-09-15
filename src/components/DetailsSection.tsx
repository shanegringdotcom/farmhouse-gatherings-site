import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";
import TornSheet from "@/components/board/TornSheet";
import PushPin from "@/components/board/PushPin";
import MeritPatch from "@/components/board/MeritPatch";

const stats = [
  { label: "Sleeps", value: "12", rotate: -3 },
  { label: "Bedrooms", value: "4", rotate: 2 },
  { label: "Baths", value: "2", rotate: -1.5 },
  { label: "Min Stay", value: "2 nights", rotate: 2.5 },
];

const amenities = [
  "Private dock on Big Long Lake",
  "Lakefront yard with firepit",
  "Spacious deck with lake views",
  "Full kitchen with dishwasher",
  "Large dining table (seats 12)",
  "Cozy living room with board games",
  "Bunk rooms with nautical decor",
  "Kids room with twin beds",
  "Central air conditioning",
  "Washer and dryer",
  "Free parking for multiple cars",
  "Charcoal grill",
];

const rules = [
  "Family-friendly. Always.",
  "No pets, please.",
  "No large party groups.",
  "Treat it like your grandparents' place.",
  "Leave it better than you found it.",
];

// A kraft-paper luggage tag: punched hole, bit of string, big serif number.
const LuggageTag = ({ label, value, rotate }: { label: string; value: string; rotate: number }) => (
  <div className="relative pt-7 flex justify-center">
    <svg
      viewBox="0 0 40 30"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-7"
      aria-hidden="true"
    >
      <path d="M6 2 Q20 14 20 28" fill="none" stroke="#b8a888" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <div
      className="relative bg-[#d9c39a] shadow-pinned px-7 pt-6 pb-4 text-center min-w-[8.5rem]"
      style={{
        transform: `rotate(${rotate}deg)`,
        clipPath: "polygon(14% 0, 86% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[hsl(30_4%_11%)] ring-4 ring-[#c7b184]"
      />
      <div className="font-display text-4xl sm:text-5xl font-bold text-[#7a3020]">{value}</div>
      <div className="font-hand text-xl text-[#2b2520]/70">{label}</div>
    </div>
  </div>
);

const DetailsSection = () => (
  <BoardPanel id="details">
    <div className="text-center mb-12">
      <StampHeading className="text-2xl sm:text-4xl">Stay Details</StampHeading>
    </div>

    {/* Stats as luggage tags strung to the board */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mb-16 max-w-4xl mx-auto">
      {stats.map((s) => (
        <LuggageTag key={s.label} label={s.label} value={s.value} rotate={s.rotate} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start max-w-5xl mx-auto">
      {/* Packing list on a legal pad */}
      <TornSheet variant="legal" ruled rotate={-0.8} className="lg:col-span-3 px-6 py-8 sm:px-9">
        <PushPin color="yellow" className="absolute -top-3.5 left-8" />
        <PushPin color="red" className="absolute -top-3.5 right-8" />
        <h3 className="font-marker text-xl sm:text-2xl text-[#2b2520] mb-6 text-center uppercase">
          What's Included
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 font-body text-[#2b2520]/75 text-base">
          {amenities.map((a) => (
            <li key={a} className="flex items-start gap-2.5">
              <span className="font-hand text-xl text-[#3d7a44] leading-none mt-0.5" aria-hidden="true">
                ✓
              </span>
              {a}
            </li>
          ))}
        </ul>
      </TornSheet>

      {/* CAMP RULES */}
      <TornSheet variant="cream" rotate={1.6} className="lg:col-span-2 px-6 py-8 text-center">
        <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
        <MeritPatch
          icon="campfire"
          label="Campfire merit patch"
          felt="brick"
          rotate={-9}
          className="absolute -bottom-7 -left-4 hidden sm:block pointer-events-none"
        />
        <p className="font-marker text-2xl sm:text-3xl text-[#b3402f] uppercase mb-1" aria-hidden="true">
          Camp Rules
        </p>
        <h3 className="font-typed text-xs uppercase tracking-[0.25em] text-[#2b2520]/50 mb-6">
          A Few House Notes
        </h3>
        <ul className="font-body text-[#2b2520]/70 text-base space-y-3.5">
          {rules.map((r) => (
            <li key={r}>
              {r === "Treat it like your grandparents' place." ? (
                <span className="underline decoration-[#b3402f]/60 decoration-2 underline-offset-4">
                  {r}
                </span>
              ) : (
                r
              )}
            </li>
          ))}
        </ul>
      </TornSheet>
    </div>
  </BoardPanel>
);

export default DetailsSection;
