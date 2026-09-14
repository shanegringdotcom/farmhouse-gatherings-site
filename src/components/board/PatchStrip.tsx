import MeritPatch, { type PatchIcon } from "./MeritPatch";

const PATCHES: {
  icon: PatchIcon;
  label: string;
  felt: "mustard" | "teal" | "pine" | "brick" | "cream";
  rotate: number;
}[] = [
  { icon: "boat", label: "Boating merit patch", felt: "teal", rotate: -7 },
  { icon: "fish", label: "Fishing merit patch", felt: "brick", rotate: 5 },
  { icon: "paddle", label: "Paddling merit patch", felt: "pine", rotate: -4 },
  { icon: "campfire", label: "Campfire merit patch", felt: "mustard", rotate: 8 },
  { icon: "icecream", label: "Ice cream merit patch", felt: "cream", rotate: -6 },
  { icon: "compass", label: "Explorer merit patch", felt: "teal", rotate: 4 },
];

// A row of merit patches pinned straight to the corkboard between sections —
// the weekend, summarized in badges.
const PatchStrip = () => (
  <div className="px-4 sm:px-6 py-4">
    <div className="max-w-3xl mx-auto text-center">
      <p
        className="font-hand text-2xl sm:text-3xl text-[#3a2a18] mb-6"
        style={{ transform: "rotate(-1deg)" }}
      >
        badges you'll have earned by Sunday:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
        {PATCHES.map((p) => (
          <MeritPatch
            key={p.label}
            icon={p.icon}
            label={p.label}
            felt={p.felt}
            rotate={p.rotate}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PatchStrip;
