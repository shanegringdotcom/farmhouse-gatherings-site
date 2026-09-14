import { m } from "motion/react";
import PushPin, { type PinColor } from "./PushPin";

// A pinned 3x5 index card that is one big link — typed text, red top rule,
// faint ruled lines. Interactive, so it keeps a visible focus ring and only
// a whisper of rotation.
const IndexCard = ({
  href,
  title,
  sub,
  rotate = 0,
  pinColor = "red",
  className = "",
}: {
  href: string;
  title: string;
  sub: string;
  rotate?: number;
  pinColor?: PinColor;
  className?: string;
}) => (
  <m.a
    href={href}
    whileHover={{ rotate: [rotate, rotate - 1.2, rotate + 0.8, rotate] }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    style={{ rotate, transformOrigin: "50% 12px" }}
    className={`relative block bg-[#fbf8ee] shadow-pinned px-5 pt-7 pb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${className}`}
  >
    <PushPin color={pinColor} className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-5 h-px bg-[#c0392b]/50"
    />
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-ruled"
      style={{ backgroundPosition: "0 44px" }}
    />
    <span className="relative block font-typed font-bold text-base sm:text-lg text-[#2b2520] mb-1">
      {title}
    </span>
    <span className="relative block font-typed text-sm text-[#2b2520]/65 leading-snug">
      {sub}
    </span>
  </m.a>
);

export default IndexCard;
