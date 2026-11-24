/** Words and names that must never appear on the site (SYLLABUS.md 1.2). */
const TERMS = [
  "Shia",
  "Shi'a",
  "Shiite",
  "Twelver",
  "Sunni",
  "sect",
  "sects",
  "madhhab",
  "madhab",
  "Abu Bakr",
  "Umar",
  "Uthman",
  "Mu'awiya",
  "Muawiya",
  "Imamate",
  "Saqifa",
  "Fadak",
  "Ghadir",
  "Occultation",
  "Ziyarat",
  "succession",
  "curse",
  "curses",
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const apos = (s: string) => s.replace(/'/g, "['‘’]");

export const BANNED_PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(?:${TERMS.map((t) => apos(escape(t))).join("|")})(?![\\p{L}\\p{N}])`,
  "iu"
);

/** Returns the first banned term found in `text`, or null. */
export function findBanned(text: string): string | null {
  const m = BANNED_PATTERN.exec(text);
  return m ? m[0] : null;
}
