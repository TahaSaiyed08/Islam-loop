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
    banner: "bg-[#46A302] border-[#378500]",
    node: "bg-[#58CC02] border-[#46A302]",
    ring: "#58CC02",
    ink: "text-[#3C8C00]",
  },
  {
    banner: "bg-[#7C4DEB] border-[#5B2EC7]",
    node: "bg-[#9B5DE5] border-[#7C4DEB]",
    ring: "#9B5DE5",
    ink: "text-[#5B2EC7]",
  },
  {
    banner: "bg-[#0B85C6] border-[#07689C]",
    node: "bg-[#1CB0F6] border-[#1899D6]",
    ring: "#1CB0F6",
    ink: "text-[#0B77B0]",
  },
  {
    banner: "bg-[#C76500] border-[#994D00]",
    node: "bg-[#FF9600] border-[#D97700]",
    ring: "#FF9600",
    ink: "text-[#A35200]",
  },
];

export const unitTheme = (unit: number): UnitTheme =>
  UNIT_THEMES[(Math.max(unit, 1) - 1) % UNIT_THEMES.length];
