const PIN_COLORS = {
  red: "#c0392b",
  yellow: "#d9a400",
  green: "#3d7a44",
  navy: "#33566b",
} as const;

export type PinColor = keyof typeof PIN_COLORS;

// Decorative pushpin. Parents position it (usually absolute, top-center).
const PushPin = ({
  color = "red",
  className = "",
}: {
  color?: PinColor;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 30"
    className={`w-5 h-6 ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <ellipse cx="13.5" cy="27.5" rx="4.5" ry="1.8" fill="rgba(0,0,0,0.3)" />
    <path d="M12 15 L12.8 26.5" stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="9" r="8" fill={PIN_COLORS[color]} />
    <circle cx="12" cy="9" r="8" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
    <circle cx="9.2" cy="6.2" r="2.6" fill="rgba(255,255,255,0.45)" />
  </svg>
);

export default PushPin;
