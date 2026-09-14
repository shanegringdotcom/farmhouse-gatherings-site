import type { ReactNode } from "react";

const VARIANTS = {
  cream: "bg-paper",
  white: "bg-[#fdfcf7]",
  legal: "bg-[#f5e9ae]",
  kraft: "bg-[#d9c39a]",
} as const;

// A sheet of paper tacked to the board, with a rough torn bottom edge and
// optional ruled lines. Text always sits on paper, never directly on cork.
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
    className={`relative torn-edge-b shadow-pinned ${VARIANTS[variant]} ${ruled ? "bg-ruled" : ""} ${className}`}
    style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
  >
    {children}
  </div>
);

export default TornSheet;
