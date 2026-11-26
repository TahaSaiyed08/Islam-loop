/**
 * Each unit on the path gets its own colour, as in Duolingo's path. The hues are
 * ours. Banner colours carry white text at 4.5:1 or more; node colours are
 * graphics at 3:1 or more against white (checked in DESIGN.md).
 * Class names are written out in full so Tailwind can see them.
 */
export type UnitTheme = {
  banner: string;
  node: string;
  ring: string;
  ink: string;
};

export const UNIT_THEMES: UnitTheme[] = [
  {
    banner: "bg-[#0B7C80] border-[#075A5D]",
    node: "bg-[#14A3A3] border-[#0B7C80]",
    ring: "#14A3A3",
    ink: "text-[#0B6B6E]",
  },
  {
    banner: "bg-[#7C4DEB] border-[#5B2EC7]",
    node: "bg-[#8B5CF6] border-[#6236C4]",
    ring: "#8B5CF6",
    ink: "text-[#5B2EC7]",
  },
  {
    banner: "bg-[#C93B3B] border-[#9E2A2A]",
    node: "bg-[#F2554C] border-[#C93B3B]",
    ring: "#F2554C",
    ink: "text-[#B42328]",
  },
  {
    banner: "bg-[#A36000] border-[#7A4800]",
    node: "bg-[#C77700] border-[#8F5500]",
    ring: "#C77700",
    ink: "text-[#8A5300]",
  },
];

export const unitTheme = (unit: number): UnitTheme =>
  UNIT_THEMES[(Math.max(unit, 1) - 1) % UNIT_THEMES.length];
