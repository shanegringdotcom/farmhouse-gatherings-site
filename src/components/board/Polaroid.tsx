import { m, useReducedMotion } from "motion/react";
import { useIsFinePointer } from "@/hooks/use-fine-pointer";
import PushPin, { type PinColor } from "./PushPin";
import Tape from "./Tape";

// A polaroid photo on the board. The only draggable primitive: drag is a
// desktop-only, purely decorative enhancement (fine pointers, no reduced
// motion), so touch devices and keyboards get a static figure. The rotation
// is applied via `style` so it is present in the prerendered HTML — no
// pre-hydration jump.
const Polaroid = ({
  src,
  alt,
  caption,
  rotate = 0,
  fastener = "pin",
  pinColor = "red",
  draggable = false,
  imgClassName = "aspect-[4/3]",
  className = "",
  width = 1280,
  height = 849,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  fastener?: "pin" | "tape" | "none";
  pinColor?: PinColor;
  draggable?: boolean;
  imgClassName?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}) => {
  const finePointer = useIsFinePointer();
  const reducedMotion = useReducedMotion();
  const canDrag = draggable && finePointer && !reducedMotion;

  return (
    <m.figure
      drag={canDrag}
      dragConstraints={{ left: -60, right: 60, top: -60, bottom: 60 }}
      dragElastic={0.35}
      whileDrag={{ scale: 1.04, zIndex: 30, boxShadow: "0 18px 36px rgba(0,0,0,0.35)" }}
      whileHover={
        fastener === "pin"
          ? { rotate: [rotate, rotate - 2, rotate + 1.5, rotate] }
          : { y: -5 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
      style={{ rotate, transformOrigin: "50% 12px" }}
      className={`relative bg-white p-3 pb-3 shadow-pinned select-none ${canDrag ? "cursor-grab" : ""} ${className}`}
    >
      {fastener === "pin" && (
        <PushPin
          color={pinColor}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10"
        />
      )}
      {fastener === "tape" && (
        <Tape className="-top-3.5 left-1/2 -ml-12 z-10" rotate={-5} />
      )}
      <div className={`overflow-hidden ${imgClassName}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover pointer-events-none"
          loading={loading}
          width={width}
          height={height}
          draggable={false}
        />
      </div>
      {caption && (
        <figcaption className="font-hand text-xl sm:text-2xl leading-tight text-[#2b2520]/85 text-center pt-2.5 px-1">
          {caption}
        </figcaption>
      )}
    </m.figure>
  );
};

export default Polaroid;
