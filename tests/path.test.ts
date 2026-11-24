import { describe, expect, it } from "vitest";

import { computePath, nextLessonSlug } from "@/lib/path";
import { computePlacement } from "@/lib/placement";

const tiers = [
  { tier: 1, lessons: [{ slug: "1.1.1", isCheckpoint: false }, { slug: "1.1.2", isCheckpoint: false }, { slug: "1.4.3", isCheckpoint: true }] },
  { tier: 2, lessons: [{ slug: "2.1.1", isCheckpoint: false }] },
  { tier: 3, lessons: [] },
  { tier: 4, lessons: [{ slug: "4.1.1", isCheckpoint: false }] },
];
const state = (p: ReturnType<typeof computePath>, slug: string) =>
  p.flatMap((t) => t.lessons).find((l) => l.slug === slug)?.state;

describe("computePath", () => {
  it("unlocks lessons one at a time", () => {
    const p = computePath(tiers, new Set());
    expect(state(p, "1.1.1")).toBe("available");
    expect(state(p, "1.1.2")).toBe("locked");
    const p2 = computePath(tiers, new Set(["1.1.1"]));
    expect(state(p2, "1.1.1")).toBe("complete");
    expect(state(p2, "1.1.2")).toBe("available");
  });

  it("keeps the next tier locked until the checkpoint is passed", () => {
    const done = new Set(["1.1.1", "1.1.2"]);
    expect(computePath(tiers, done)[1].open).toBe(false);
    done.add("1.4.3");
    expect(computePath(tiers, done)[1].open).toBe(true);
  });

  it("steps over a tier with no visible lessons", () => {
    const p = computePath(tiers, new Set(["1.1.1", "1.1.2", "1.4.3", "2.1.1"]));
    expect(p[2].open).toBe(true);
    expect(p[3].open).toBe(true);
    expect(state(p, "4.1.1")).toBe("available");
  });

  it("opens tiers through placement and marks earlier ones skipped, not complete", () => {
    const p = computePath(tiers, new Set(), 2);
    expect(p[0].skipped).toBe(true);
    expect(state(p, "1.1.2")).toBe("available");
    expect(p[1].open).toBe(true);
    expect(state(p, "2.1.1")).toBe("available");
    expect(p[3].open).toBe(false);
  });

  it("finds the next lesson to continue", () => {
    expect(nextLessonSlug(computePath(tiers, new Set(["1.1.1"])))).toBe("1.1.2");
  });
});

describe("computePlacement", () => {
  it("starts at Tier 1 when the first tier fails", () => {
    expect(computePlacement([{ tier: 1, correct: false }]).startTier).toBe(1);
  });
  it("starts after the last tier passed in a row", () => {
    const r = computePlacement([
      { tier: 1, correct: true }, { tier: 1, correct: true },
      { tier: 2, correct: true },
      { tier: 3, correct: false },
      { tier: 4, correct: true },
    ]);
    expect(r.startTier).toBe(3);
  });
  it("needs every question in a tier to be right", () => {
    expect(computePlacement([{ tier: 1, correct: true }, { tier: 1, correct: false }]).startTier).toBe(1);
  });
  it("steps over tiers with no questions and caps at Tier 10", () => {
    expect(computePlacement([{ tier: 1, correct: true }, { tier: 4, correct: true }]).startTier).toBe(5);
    expect(computePlacement([{ tier: 10, correct: true }]).startTier).toBe(10);
  });
});
