/** An original illustration for the landing page: a winding path with lesson stops. */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 424 424"
      role="img"
      aria-label="A winding path with lesson stops leading to a lit window"
      className={className}
    >
      <circle cx="212" cy="212" r="200" className="fill-secondary" />
      <circle cx="318" cy="102" r="34" className="fill-sand" />
      <path
        d="M96 372c-48-54 8-92 70-98s118-30 106-78-98-34-104-84 56-62 118-48"
        fill="none"
        strokeWidth="26"
        strokeLinecap="round"
        className="stroke-white"
      />
      <path
        d="M96 372c-48-54 8-92 70-98s118-30 106-78-98-34-104-84 56-62 118-48"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 18"
        className="stroke-brand"
      />
      {[
        [120, 338],
        [168, 272],
        [262, 214],
        [184, 138],
        [236, 76],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="24" className="fill-brand" />
          <circle
            cx={cx}
            cy={cy + 4}
            r="24"
            className="fill-brand-dark"
            opacity="0.35"
          />
          <circle cx={cx} cy={cy} r="24" className="fill-brand" />
          <path
            d={`M${cx - 8} ${cy + 3}l5 5 11-12`}
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={i < 3 ? 1 : 0}
          />
          {i >= 3 && <circle cx={cx} cy={cy} r="6" className="fill-white" />}
        </g>
      ))}
      <rect
        x="318"
        y="50"
        width="56"
        height="72"
        rx="28"
        className="fill-brand-dark"
        opacity="0.0"
      />
    </svg>
  );
}
