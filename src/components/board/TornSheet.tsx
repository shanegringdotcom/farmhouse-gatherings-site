import type { ReactNode } from "react";

const VARIANTS = {
  cream: "bg-paper",
  white: "bg-[#fdfcf7]",
  legal: "bg-[#f5e9ae]",
  kraft: "bg-[#d9c39a]",
} as const;

// A sheet of paper tacked to the board, with a rough torn bottom edge and
// optional ruled lines. Text always sits on paper, never directly on cork.
//
// The torn-edge mask lives on an inner background layer, NOT the outer
// element: a CSS mask clips everything the element paints, including
// absolutely-positioned children — which was slicing the heads off pushpins
// and cutting off patches that overflow the sheet.
const TornSheet = ({
  variant = "cream",
  ruled = false,
  rotate = 0,
  className = "",
  children,
}: {
  variant?: keyof typeof VARIANTS;
  ruled?: boolean;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`relative shadow-pinned ${className}`}
    style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
  >
    <span
      aria-hidden="true"
      className={`absolute inset-0 torn-edge-b ${VARIANTS[variant]} ${ruled ? "bg-ruled" : ""}`}
    />
    <div className="relative">{children}</div>
  </div>
);

export default TornSheet;
