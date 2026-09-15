const INKS = {
  red: { bg: "#c0392b", edge: "#8e2a1f", ring: "#f6e7c8", text: "#fdf3df" },
  pine: { bg: "#2e4a3a", edge: "#1f3428", ring: "#f6e7c8", text: "#f6e7c8" },
  navy: { bg: "#33566b", edge: "#24404f", ring: "#f6e7c8", text: "#f6e7c8" },
} as const;

// Scalloped seal edge: n outward arc bumps around a circle of radius R.
const scallopPath = (cx: number, cy: number, R: number, n: number, r: number) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const;
  });
  return (
    `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} ` +
    pts
      .map((_, i) => {
        const [x, y] = pts[(i + 1) % n];
        return `A ${r} ${r} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );
};

const SEAL_EDGE = scallopPath(60, 60, 52, 22, 8.2);
// Ring-text circle: r=39, circumference ≈ 245 — textLength stretches the text
// evenly all the way around so it never bunches or overflows.
const RING_CIRCUMFERENCE = 245;

// A round camp seal slapped on a corner: scalloped edge, ring text on a
// circular path, big marker text in the middle. Text is real SVG <text>, so
// it stays crawlable; keep ringText short (roughly 30 characters) and end it
// with a "·" so the loop reads continuously.
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
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        role="img"
        aria-label={`${ringText.replace(/\s*·\s*$/, "")} — ${lines.join(" ")}`}
      >
        <path d={SEAL_EDGE} fill={c.bg} stroke={c.edge} strokeWidth="1" />
        <circle cx="60" cy="60" r="46" fill="none" stroke={c.ring} strokeWidth="1.4" />
        <circle cx="60" cy="60" r="30" fill="none" stroke={c.ring} strokeWidth="1" strokeDasharray="3 2.5" opacity="0.75" />
        {/* soft top-left sheen so it reads as a glossy sticker */}
        <path
          d="M 22 42 A 42 42 0 0 1 52 19"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.16"
        />
        <defs>
          <path id={id} d="M 60,60 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0" />
        </defs>
        <text
          fill={c.text}
          fontSize="9.5"
          style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", textTransform: "uppercase" }}
        >
          <textPath href={`#${id}`} textLength={RING_CIRCUMFERENCE} lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
        {(() => {
          // Size the marker lines to the inner circle (r=30) so long words
          // like "ALL-SPORTS" never collide with the dashed ring.
          const longest = Math.max(...lines.map((l) => l.length));
          const fontSize = Math.min(13.5, 56 / (longest * 0.6));
          const lineGap = fontSize * 1.15;
          return lines.map((line, i) => (
            <text
              key={line}
              x="60"
              y={60 + (i - (lines.length - 1) / 2) * lineGap + fontSize * 0.35}
              textAnchor="middle"
              fill={c.text}
              fontSize={fontSize}
              style={{ fontFamily: "'Permanent Marker', 'Marker Felt', cursive" }}
            >
              {line}
            </text>
          ));
        })()}
      </svg>
    </div>
  );
};

export default StickerBadge;
