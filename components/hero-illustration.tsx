/** An original illustration for the landing page: a winding path of lesson stops, in unit colours. */
export function HeroIllustration({ className }: { className?: string }) {
  const stops: [number, number, string, string, boolean][] = [
    [120, 338, "#14A3A3", "#0B7C80", true],
    [176, 270, "#8B5CF6", "#6236C4", true],
    [262, 214, "#F2554C", "#C93B3B", true],
    [186, 140, "#C77700", "#8F5500", false],
    [238, 76, "#14A3A3", "#0B7C80", false],
  ];
  return (
    <svg
      viewBox="0 0 424 424"
      role="img"
      aria-label="A winding path of lesson stops"
      className={className}
    >
      <circle cx="212" cy="212" r="200" fill="#F7F7F7" />
      <circle cx="322" cy="104" r="30" fill="#F2A93B" />
      <path
        d="M96 372c-48-54 8-92 70-98s118-30 106-78-98-34-104-84 56-62 118-48"
        fill="none"
        stroke="#E5E5E5"
        strokeWidth="26"
        strokeLinecap="round"
      />
      {stops.map(([cx, cy, face, edge, done], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy + 7} r="26" fill={edge} />
          <circle cx={cx} cy={cy} r="26" fill={face} />
          {done ? (
            <path
              d={`M${cx - 10} ${cy + 1}l6 6 14-14`}
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d={`M${cx} ${cy - 11}l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1Z`}
              fill="white"
            />
          )}
        </g>
      ))}
    </svg>
  );
}
