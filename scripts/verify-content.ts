/**
 * pnpm verify — check every quote against its source and set lesson status.
 *
 * - QURAN quotes: must sit inside the Qara'i verse range (content/sources).
 * - Other quotes: the source page is fetched (max 1 request/second, cached in
 *   .cache/pages/), stripped to text, and the quote must appear as an exact
 *   substring after whitespace / curly-quote / nbsp normalisation only.
 *   A page you saved by hand into .cache/pages/<name>.html is used as-is
 *   (the name is printed when a page cannot be fetched).
 * - Pass -> verification written, DRAFT becomes PREVIEW (never APPROVED).
 * - Fail -> DRAFT, with the slug, locator, expected quote and closest match.
 * Exit code 1 only on script errors.
 */
import fs from "node:fs";
import path from "node:path";

import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

import { tierFileSchema } from "../content/schema";
import { quoteHash } from "../lib/text";
import {
  type Check,
  type WebfetchEntry,
  checkWebfetchEvidence,
  type Verses,
  htmlToText,
  pageCacheName,
  parseQaraiJson,
  parseQaraiTxt,
  verifyPageQuote,
  verifyQuranQuote,
} from "./verify-lib";

const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const PAGES = path.join(ROOT, ".cache", "pages");
const UA =
  "TheRoadmapVerifier/1.0 (non-commercial educational site; quote verification)";

if (process.env.HTTPS_PROXY || process.env.https_proxy)
  setGlobalDispatcher(new EnvHttpProxyAgent());

function loadVerses(): Verses {
  const txt = path.join(CONTENT, "sources", "en.qarai.txt");
  const json = path.join(CONTENT, "sources", "en.qarai.json");
  if (fs.existsSync(txt)) return parseQaraiTxt(fs.readFileSync(txt, "utf8"));
  if (fs.existsSync(json)) return parseQaraiJson(fs.readFileSync(json, "utf8"));
  throw new Error("No Qara'i source file in content/sources/");
}

let lastFetch = 0;
const pageMemo = new Map<string, { text: string } | { error: string }>();

async function getPage(
  url: string
): Promise<{ text: string } | { error: string }> {
  const memo = pageMemo.get(url);
  if (memo) return memo;
  const file = path.join(PAGES, pageCacheName(url));
  let result: { text: string } | { error: string };
  if (fs.existsSync(file)) {
    result = { text: htmlToText(fs.readFileSync(file, "utf8")) };
  } else {
    const wait = lastFetch + 1000 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastFetch = Date.now();
    try {
      const res = await fetch(url, {
        headers: { "user-agent": UA, accept: "text/html" },
        signal: AbortSignal.timeout(30_000),
      });
      if (res.headers.get("cf-mitigated") === "challenge" || res.status === 403)
        result = {
          error: `source unreachable: HTTP ${res.status} (the site blocks automated readers; save the exact page by hand as .cache/pages/${pageCacheName(url)})`,
        };
      else if (!res.ok)
        result = { error: `source unreachable: HTTP ${res.status}` };
      else {
        const html = await res.text();
        fs.mkdirSync(PAGES, { recursive: true });
        fs.writeFileSync(file, html);
        result = { text: htmlToText(html) };
      }
    } catch (e) {
      result = { error: `source unreachable: ${(e as Error).message}` };
    }
  }
  pageMemo.set(url, result);
  return result;
}

// Raw JSON is edited in place and re-validated by the schema before it is written.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = Record<string, any>;

type Failure = {
  slug: string;
  locator: string;
  quote: string;
  reason: string;
  closest?: string;
};

/** Quotes confirmed through WebFetch (see REWORK.md C2). Each needs two confirmations. */
function loadWebfetch(): Map<string, WebfetchEntry> {
  const file = path.join(CONTENT, "webfetch-evidence.json");
  const m = new Map<string, WebfetchEntry>();
  if (!fs.existsSync(file)) return m;
  const j = JSON.parse(fs.readFileSync(file, "utf8")) as {
    entries: WebfetchEntry[];
  };
  for (const e of j.entries) m.set(`${e.slug}#${e.source}`, e);
  return m;
}

async function main() {
  const webfetch = loadWebfetch();
  const verses = loadVerses();
  const checkedAt = new Date().toISOString().slice(0, 10);
  const failures: Failure[] = [];
  let passed = 0;
  let unverifiable = 0;

  const files = fs
    .readdirSync(CONTENT)
    .filter((f) => /^tier-\d+\.json$/.test(f));
  files.sort((a, b) => parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10));

  for (const f of files) {
    const file = path.join(CONTENT, f);
    const tier = JSON.parse(fs.readFileSync(file, "utf8"));
    const lessons = tier.lessons as Raw[];

    // Pass 1: lessons that carry their own quotes.
    for (const l of lessons) {
      if (!l.sources?.length) continue;
      const hashes: (string | null)[] = [];
      const evidence: (string | null)[] = [];
      let usedWebfetch = false;
      let primaryOk = true;
      let reason = "";
      for (const [si, s] of l.sources.entries()) {
        let check: Check;
        let evidenceText: string | null = null;
        if (s.key === "QURAN")
          check = verifyQuranQuote(s.quote, s.locator, verses);
        else {
          const entry = webfetch.get(`${l.slug}#${si}`);
          const viaWebfetch = entry
            ? checkWebfetchEvidence(s.quote, entry)
            : null;
          if (viaWebfetch?.ok) {
            check = viaWebfetch;
            evidenceText = entry!.evidence;
            usedWebfetch = true;
          } else {
            const page = await getPage(s.url);
            check =
              "error" in page
                ? { ok: false, reason: page.error }
                : verifyPageQuote(s.quote, page.text);
            if (!check.ok && viaWebfetch)
              check = {
                ...check,
                reason: `${check.reason}; WebFetch record rejected: ${viaWebfetch.reason}`,
              };
          }
        }
        evidence.push(evidenceText);
        hashes.push(check.ok ? quoteHash(s.quote) : null);
        if (!check.ok) {
          if (check.reason.startsWith("source unreachable")) unverifiable++;
          failures.push({
            slug: l.slug,
            locator: `${s.key} ${s.locator}`,
            quote: s.quote,
            reason: check.reason,
            closest: check.closest,
          });
          if (s.role === "primary") {
            primaryOk = false;
            reason ||= `${s.key} ${s.locator}: ${check.reason}`;
          }
        }
      }
      l.verification = {
        passed: primaryOk,
        checkedAt,
        quoteHashes: hashes,
        method: usedWebfetch ? "webfetch" : "script",
        ...(usedWebfetch ? { evidence } : {}),
      };
      if (primaryOk) {
        passed++;
        delete l.draftReason;
        if (l.status === "DRAFT" && l.hook && l.summary) l.status = "PREVIEW";
      } else {
        l.status = "DRAFT";
        l.draftReason = reason.includes("source unreachable")
          ? `Not yet verified — ${reason}`
          : `Quote failed verification — ${reason}`;
      }
    }

    // Pass 2: checkpoints and site-only lessons need no outside quote of their own.
    const live = lessons.some(
      (l) =>
        l.mechanic !== "boss_checkpoint" &&
        l.status !== "DRAFT" &&
        l.verification?.passed &&
        (l.sources?.length || l.siteOnly)
    );
    for (const l of lessons) {
      const isBoss = l.mechanic === "boss_checkpoint";
      if (!isBoss && !(l.siteOnly && !l.sources?.length)) continue;
      const ok = isBoss ? live : true;
      const hashes =
        (l.verification?.quoteHashes as (string | null)[] | undefined) ?? [];
      l.verification = {
        passed: ok,
        checkedAt,
        quoteHashes: l.sources?.length ? hashes : [],
      };
      if (ok) {
        delete l.draftReason;
        if (l.status === "DRAFT" && l.hook && l.summary) l.status = "PREVIEW";
      } else {
        l.status = "DRAFT";
        l.draftReason = "No verified lessons in this tier yet.";
      }
    }

    const parsed = tierFileSchema.safeParse(tier);
    if (!parsed.success) {
      console.error(`Schema errors in ${f}; nothing written for it:`);
      console.error(JSON.stringify(parsed.error.issues.slice(0, 8), null, 2));
      throw new Error(`Invalid content in ${f}`);
    }
    fs.writeFileSync(file, JSON.stringify(tier, null, 2) + "\n");
  }

  // Report
  const all = files.flatMap(
    (f) =>
      JSON.parse(fs.readFileSync(path.join(CONTENT, f), "utf8"))
        .lessons as Raw[]
  );
  const count = (s: string) => all.filter((l) => l.status === s).length;
  const lines = [
    "# Verification report",
    "",
    `Run on ${checkedAt}. Lessons: ${all.length} · PREVIEW ${count("PREVIEW")} · APPROVED ${count("APPROVED")} · DRAFT ${count("DRAFT")}.`,
    `Quote checks failed: ${failures.length} (of which source unreachable: ${unverifiable}).`,
    "",
    "| Slug | Source | Reason | Closest match on the page |",
    "|---|---|---|---|",
    ...failures.map(
      (x) =>
        `| ${x.slug} | ${x.locator} | ${x.reason.replace(/\|/g, "/")} | ${(x.closest ?? "").replace(/\|/g, "/")} |`
    ),
    "",
  ];
  fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, "docs", "verify-report.md"),
    lines.join("\n")
  );

  console.log(`verified lessons: ${passed}`);
  console.log(
    `PREVIEW ${count("PREVIEW")} · APPROVED ${count("APPROVED")} · DRAFT ${count("DRAFT")}`
  );
  for (const x of failures) {
    console.log(`\nFAIL ${x.slug} [${x.locator}] ${x.reason}`);
    console.log(`  expected: ${x.quote}`);
    if (x.closest) console.log(`  closest:  ${x.closest}`);
  }
  console.log(`\nSee docs/verify-report.md`);
}

main().catch((e) => {
  console.error("verify script error:", e);
  process.exit(1);
});
