// Decorative strip of aged sellotape with roughly torn ends. Parents position
// it absolutely over a corner or edge.
const Tape = ({
  className = "",
  rotate = -4,
}: {
  className?: string;
  rotate?: number;
}) => (
  <div
    aria-hidden="true"
    className={`absolute h-7 w-24 bg-[hsl(48_60%_82%_/_0.7)] shadow-sm ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      clipPath:
        "polygon(0 12%, 5% 0, 95% 3%, 100% 14%, 97% 50%, 100% 86%, 95% 100%, 5% 97%, 0 88%, 3% 50%)",
    }}
  />
);

export default Tape;
