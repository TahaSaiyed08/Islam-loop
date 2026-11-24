export type PlacementAnswer = { tier: number; correct: boolean };

export type PlacementResult = {
  startTier: number;
  /** Tiers that had questions, and whether every one was answered correctly. */
  tiers: { tier: number; passed: boolean }[];
};

/**
 * Walk the tiers from 1. A tier is passed when every question in it is
 * correct. The first failed tier stops the walk. Tiers with no questions are
 * not assessed and are stepped over. The learner starts at the tier after the
 * last passed tier (or Tier 1 if none), capped at Tier 10.
 */
export function computePlacement(answers: PlacementAnswer[]): PlacementResult {
  const tiers = [...new Set(answers.map((a) => a.tier))]
    .sort((a, b) => a - b)
    .map((tier) => ({
      tier,
      passed: answers.filter((a) => a.tier === tier).every((a) => a.correct),
    }));

  let last = 0;
  for (const t of tiers) {
    if (!t.passed) break;
    last = t.tier;
  }
  return { startTier: Math.min(last + 1, 10), tiers };
}
