import { normalizeText, wordCount } from "../lib/text";

export type Verses = Map<string, string>; // key "surah:ayah"

/** Parse Tanzil's "surah|ayah|text" file (comment lines start with #). */
export function parseQaraiTxt(txt: string): Verses {
  const v: Verses = new Map();
  for (const line of txt.split(/\r?\n/)) {
    const m = /^(\d+)\|(\d+)\|(.*)$/.exec(line);
    if (m) v.set(`${m[1]}:${m[2]}`, m[3].trim());
  }
  return v;
}

/** Parse the api.alquran.cloud fallback (en.qarai.json). */
export function parseQaraiJson(json: string): Verses {
  const v: Verses = new Map();
  const data = JSON.parse(json) as {
    data: { surahs: { number: number; ayahs: { numberInSurah: number; text: string }[] }[] };
  };
  for (const s of data.data.surahs)
    for (const a of s.ayahs) v.set(`${s.number}:${a.numberInSurah}`, a.text.trim());
  return v;
}

export function parseLocator(loc: string) {
  const m = /^(\d+):(\d+)(?:[–-](\d+))?$/.exec(loc);
  if (!m) return null;
  const surah = Number(m[1]);
  const from = Number(m[2]);
  return { surah, from, to: m[3] ? Number(m[3]) : from };
}

export type Check = { ok: true } | { ok: false; reason: string; closest?: string };

/** Substring test after the allowed normalisation only. */
export function containsQuote(haystack: string, quote: string): boolean {
  return normalizeText(haystack).includes(normalizeText(quote));
}

/** The window of the haystack sharing the most words with the quote. */
export function closestMatch(haystack: string, quote: string): string {
  const hay = normalizeText(haystack).split(" ");
  const q = normalizeText(quote).split(" ");
  const qset = new Set(q.map((w) => w.toLowerCase()));
  const size = Math.min(q.length, hay.length);
  if (size === 0) return "";
  let best = 0;
  let bestAt = 0;
  let score = 0;
  const hit = (w: string) => (qset.has(w.toLowerCase()) ? 1 : 0);
  for (let i = 0; i < size; i++) score += hit(hay[i]);
  best = score;
  for (let i = size; i < hay.length; i++) {
    score += hit(hay[i]) - hit(hay[i - size]);
    if (score > best) {
      best = score;
      bestAt = i - size + 1;
    }
  }
  return hay.slice(bestAt, bestAt + size).join(" ");
}

export function verifyQuranQuote(quote: string, locator: string, verses: Verses): Check {
  const loc = parseLocator(locator);
  if (!loc) return { ok: false, reason: `bad Qur'an locator "${locator}"` };
  const list: string[] = [];
  for (let a = loc.from; a <= loc.to; a++) {
    const t = verses.get(`${loc.surah}:${a}`);
    if (t === undefined) return { ok: false, reason: `verse ${loc.surah}:${a} not in the Qara'i file` };
    list.push(t);
  }
  const joined = list.join(" ");
  if (!containsQuote(joined, quote))
    return { ok: false, reason: "quote not found in the verse range", closest: closestMatch(joined, quote) };
  if (wordCount(quote) > 25) {
    const nq = normalizeText(quote);
    const whole = list.some((v) => normalizeText(v) === nq) || normalizeText(joined) === nq;
    if (!whole) return { ok: false, reason: "over 25 words and not a complete verse" };
  }
  return { ok: true };
}

const BLOCK_TAGS = /<\/?(?:p|div|br|li|ul|ol|h[1-6]|tr|td|th|table|blockquote|section|article|header|footer|hr|dd|dt|dl)\b[^>]*>/gi;
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  ndash: "–", mdash: "—", hellip: "…",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Strip HTML: block tags become spaces, inline tags vanish so words stay whole. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(BLOCK_TAGS, " ")
      .replace(/<[^>]+>/g, "")
  );
}

export function verifyPageQuote(quote: string, pageText: string): Check {
  if (containsQuote(pageText, quote)) return { ok: true };
  return { ok: false, reason: "quote not found on the source page", closest: closestMatch(pageText, quote) };
}

/** A stable file name for a URL, used for the cache and for manually saved pages. */
export function pageCacheName(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") + ".html";
}
