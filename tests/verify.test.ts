import { describe, expect, it } from "vitest";

import {
  htmlToText,
  pageCacheName,
  parseQaraiTxt,
  verifyPageQuote,
  verifyQuranQuote,
} from "../scripts/verify-lib";

const verses = parseQaraiTxt(
  [
    "# comment",
    "96|1|Read in the Name of your Lord who created;",
    "96|2|who created man from a clot.",
    "96|3|Read, and your Lord is the most generous,",
  ].join("\n")
);

describe("Qur'an verification", () => {
  it("passes a good quote", () => {
    expect(
      verifyQuranQuote(
        "Read in the Name of your Lord who created;",
        "96:1",
        verses
      ).ok
    ).toBe(true);
  });
  it("fails the same quote with one word changed", () => {
    const r = verifyQuranQuote(
      "Read in the Name of your Lord who made;",
      "96:1",
      verses
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.closest).toContain("Read in the Name of your Lord");
  });
  it("joins a verse range with spaces", () => {
    expect(
      verifyQuranQuote("created;who created man", "96:1-2", verses).ok
    ).toBe(false);
    expect(
      verifyQuranQuote("created; who created man", "96:1–2", verses).ok
    ).toBe(true);
  });
  it("fails on a missing verse or bad locator", () => {
    expect(verifyQuranQuote("x", "96:9", verses).ok).toBe(false);
    expect(verifyQuranQuote("x", "nonsense", verses).ok).toBe(false);
  });
  it("accepts curly vs straight quotes only", () => {
    const v = parseQaraiTxt("112|1|Say, ‘He is Allah, the One.");
    expect(verifyQuranQuote("Say, 'He is Allah, the One.", "112:1", v).ok).toBe(
      true
    );
  });
  it("only allows a long quote if it is a complete verse", () => {
    const long = Array.from({ length: 30 }, (_, i) => `word${i}`).join(" ");
    const v = parseQaraiTxt(`1|1|${long}`);
    expect(verifyQuranQuote(long, "1:1", v).ok).toBe(true);
    expect(
      verifyQuranQuote(long.replace("word29", "").trim(), "1:1", v).ok
    ).toBe(false);
  });
});

describe("page verification", () => {
  const html = `<html><script>var x="bad"</script><p>There is no wealth like <em>wisdom</em>, no destitution like ignorance,</p><p>no inheritance&nbsp;like refinement.</p></html>`;
  it("strips HTML without splitting words", () => {
    expect(htmlToText(html)).toContain("like wisdom, no destitution");
  });
  it("passes an exact substring across tags, entities and whitespace", () => {
    expect(
      verifyPageQuote(
        "no wealth like wisdom, no destitution like ignorance, no inheritance like refinement.",
        htmlToText(html)
      ).ok
    ).toBe(true);
  });
  it("fails when one word is changed", () => {
    const r = verifyPageQuote(
      "There is no wealth like knowledge, no destitution like ignorance,",
      htmlToText(html)
    );
    expect(r.ok).toBe(false);
  });
  it("names cache files from URLs", () => {
    expect(pageCacheName("https://www.al-islam.org/a-b/c")).toBe(
      "www_al_islam_org_a_b_c.html"
    );
  });
});

import {
  checkWebfetchEvidence,
  type WebfetchEntry,
} from "../scripts/verify-lib";

describe("WebFetch evidence", () => {
  const quote = "no wealth like wisdom, no destitution like ignorance";
  const entry = (over: Partial<WebfetchEntry> = {}): WebfetchEntry => ({
    slug: "1.1.2",
    source: 0,
    checkedAt: "2026-11-24",
    confirmations: 2,
    evidence:
      "There is no wealth like wisdom, no destitution like ignorance, no inheritance like refinement.",
    ...over,
  });

  it("passes when two calls confirmed and the sentence contains the quote once", () => {
    expect(checkWebfetchEvidence(quote, entry()).ok).toBe(true);
  });
  it("normalises quote marks and spacing only", () => {
    const e = entry({
      evidence:
        "He said ‘no wealth  like wisdom, no destitution like ignorance’.",
    });
    expect(
      checkWebfetchEvidence(
        "'no wealth like wisdom, no destitution like ignorance'",
        e
      ).ok
    ).toBe(true);
  });
  it("fails with a single confirmation", () => {
    expect(checkWebfetchEvidence(quote, entry({ confirmations: 1 })).ok).toBe(
      false
    );
  });
  it("fails when the sentence does not contain the quote (one word changed)", () => {
    const r = checkWebfetchEvidence(
      "no wealth like knowledge, no destitution like ignorance",
      entry()
    );
    expect(r.ok).toBe(false);
  });
  it("fails when the quote appears twice", () => {
    expect(
      checkWebfetchEvidence(
        quote,
        entry({ evidence: `${quote}. And again, ${quote}.` })
      ).ok
    ).toBe(false);
  });
  it("fails without a record", () => {
    expect(checkWebfetchEvidence(quote, undefined).ok).toBe(false);
  });
});
