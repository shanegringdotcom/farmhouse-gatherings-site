const INKS = {
  red: { bg: "#c0392b", ring: "#f6e7c8", text: "#fff8ec" },
  pine: { bg: "#2e4a3a", ring: "#f6e7c8", text: "#f6e7c8" },
  navy: { bg: "#33566b", ring: "#f6e7c8", text: "#f6e7c8" },
} as const;

// A round camp sticker slapped on a corner: ring text on a circular path,
// big marker text in the middle. Text is real (SVG <text>), so it stays
// crawlable and screen-reader-visible.
const StickerBadge = ({
  ringText,
  lines,
  ink = "red",
  rotate = 8,
  className = "",
}: {
  ringText: string;
  lines: string[];
  ink?: keyof typeof INKS;
  rotate?: number;
  className?: string;
}) => {
  const c = INKS[ink];
  const id = `ring-${ringText.replace(/[^a-z0-9]/gi, "").slice(0, 12)}`;
  return (
    <div
      className={`w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full" role="img" aria-label={`${ringText} — ${lines.join(" ")}`}>
        <circle cx="60" cy="60" r="58" fill={c.bg} />
        <circle cx="60" cy="60" r="54" fill="none" stroke={c.ring} strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="60" cy="60" r="38" fill="none" stroke={c.ring} strokeWidth="1" opacity="0.7" />
        <defs>
          <path id={id} d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
        </defs>
        <text
          fill={c.text}
          fontSize="10.5"
          letterSpacing="2"
          style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", textTransform: "uppercase" }}
        >
          <textPath href={`#${id}`} startOffset="0">
            {ringText}
          </textPath>
        </text>
        {lines.map((line, i) => (
          <text
            key={line}
            x="60"
            y={60 + (i - (lines.length - 1) / 2) * 15 + 4}
            textAnchor="middle"
            fill={c.text}
            fontSize={lines.length > 2 ? 11 : 13.5}
            style={{ fontFamily: "'Permanent Marker', 'Marker Felt', cursive" }}
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default StickerBadge;
