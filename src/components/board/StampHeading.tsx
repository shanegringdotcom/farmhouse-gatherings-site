import type { ElementType, ReactNode } from "react";

const INKS = {
  red: "text-[#b3402f] border-[#b3402f]",
  pine: "text-[#2e4a3a] border-[#2e4a3a]",
  cream: "text-[#f2e8d5] border-[#f2e8d5]",
} as const;

// A rubber-stamped heading: marker face, inked border, slight tilt. Real
// heading element so the document outline survives the kitsch.
const StampHeading = ({
  as: Tag = "h2",
  ink = "red",
  rotate = -1.5,
  className = "",
  children,
}: {
  as?: ElementType;
  ink?: keyof typeof INKS;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) => (
  <Tag
    className={`inline-block font-marker uppercase tracking-wide border-[3px] px-4 py-1.5 opacity-90 ${INKS[ink]} ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </Tag>
);

export default StampHeading;
