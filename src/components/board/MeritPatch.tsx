import type { ReactNode } from "react";

// Scout-style embroidered merit patches: felt disc, merrow border with stitch
// marks, and a chunky camp pictogram. Icon-only like the real thing — the
// aria-label carries the meaning.

const FELTS = {
  mustard: { felt: "#e0a832", edge: "#8a5a14", stitch: "#f6dfa0", ink: "#5a3a0c" },
  teal: { felt: "#2e5f66", edge: "#16333a", stitch: "#9fd0d4", ink: "#e8f4f2" },
  pine: { felt: "#3d6647", edge: "#1f3a26", stitch: "#b9d9b9", ink: "#eef6e8" },
  brick: { felt: "#b3402f", edge: "#6e2114", stitch: "#f0c0a8", ink: "#fdf0e0" },
  cream: { felt: "#f0e4c8", edge: "#a08454", stitch: "#fff8e8", ink: "#5a4222" },
} as const;

const ICONS: Record<string, (ink: string) => ReactNode> = {
  icecream: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M31 40 L40 60 L49 40" fill={ink} fillOpacity="0.15" />
      <path d="M31 40 L40 60 L49 40" />
      <path d="M34 33 a 7 7 0 1 1 12.5 -3.5 A 7 7 0 1 1 49 40 L31 40 A 7 7 0 0 1 34 33" fill={ink} fillOpacity="0.15" />
      <path d="M34 33 a 7 7 0 1 1 12.5 -3.5 A 7 7 0 1 1 49 40 L31 40 A 7 7 0 0 1 34 33" />
    </g>
  ),
  boat: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 20 V44" />
      <path d="M40 22 L54 42 H40 Z" fill={ink} fillOpacity="0.15" />
      <path d="M40 22 L54 42 H40 Z" />
      <path d="M37 28 L27 42 H37 Z" />
      <path d="M24 48 H56 L50 57 H30 Z" fill={ink} fillOpacity="0.15" />
      <path d="M24 48 H56 L50 57 H30 Z" />
    </g>
  ),
  fish: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 40 Q34 27 46 34 Q52 37 56 40 Q52 43 46 46 Q34 53 22 40 Z" fill={ink} fillOpacity="0.15" />
      <path d="M22 40 Q34 27 46 34 Q52 37 56 40 Q52 43 46 46 Q34 53 22 40 Z" />
      <path d="M56 40 L63 32 V48 Z" />
      <circle cx="31" cy="38" r="1.8" fill={ink} stroke="none" />
    </g>
  ),
  campfire: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 22 Q47 32 43 38 Q49 36 50 30 Q56 40 49 47 Q44 51 40 50 Q36 51 31 47 Q24 40 30 30 Q31 36 37 38 Q33 32 40 22 Z" fill={ink} fillOpacity="0.15" />
      <path d="M40 22 Q47 32 43 38 Q49 36 50 30 Q56 40 49 47 Q44 51 40 50 Q36 51 31 47 Q24 40 30 30 Q31 36 37 38 Q33 32 40 22 Z" />
      <path d="M26 58 L54 52 M26 52 L54 58" />
    </g>
  ),
  compass: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="40" r="17" />
      <path d="M48 32 L43 43 L32 48 L37 37 Z" fill={ink} fillOpacity="0.15" />
      <path d="M48 32 L43 43 L32 48 L37 37 Z" />
      <path d="M40 19 V23 M40 57 V61 M19 40 H23 M57 40 H61" />
    </g>
  ),
  paddle: (ink) => (
    <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 26 L52 54" />
      <ellipse cx="23" cy="23" rx="5.5" ry="8" transform="rotate(-45 23 23)" fill={ink} fillOpacity="0.15" />
      <ellipse cx="23" cy="23" rx="5.5" ry="8" transform="rotate(-45 23 23)" />
      <path d="M54 26 L28 54" />
      <ellipse cx="57" cy="23" rx="5.5" ry="8" transform="rotate(45 57 23)" fill={ink} fillOpacity="0.15" />
      <ellipse cx="57" cy="23" rx="5.5" ry="8" transform="rotate(45 57 23)" />
    </g>
  ),
};

export type PatchIcon = keyof typeof ICONS;

const MeritPatch = ({
  icon,
  label,
  felt = "mustard",
  rotate = 6,
  className = "",
}: {
  icon: PatchIcon;
  label: string;
  felt?: keyof typeof FELTS;
  rotate?: number;
  className?: string;
}) => {
  const c = FELTS[felt];
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full" role="img" aria-label={label}>
        {/* felt disc + merrow border */}
        <circle cx="40" cy="40" r="36" fill={c.felt} stroke={c.edge} strokeWidth="5" />
        {/* stitch marks around the border */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={c.stitch}
          strokeWidth="3.5"
          strokeDasharray="1.6 3"
        />
        {/* inner running stitch */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke={c.ink}
          strokeWidth="1"
          strokeDasharray="3 2.5"
          opacity="0.5"
        />
        {ICONS[icon](c.ink)}
      </svg>
    </div>
  );
};

export default MeritPatch;
