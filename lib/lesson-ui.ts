import type { Source } from "@/content/schema";

/** Fixed, non-identity arrangements so server and client render the same order. */
const PERMUTATION: Record<number, number[]> = {
  3: [2, 0, 1],
  4: [2, 0, 3, 1],
  5: [3, 1, 4, 0, 2],
};

/** Returns item indices in the (deterministic) scrambled order shown to the learner. */
export function scrambledOrder(n: number): number[] {
  return PERMUTATION[n] ?? Array.from({ length: n }, (_, i) => (i + 1) % n);
}

export function citation(s: Source): string {
  const parts = [s.book, s.locator];
  if (s.key === "QURAN") parts.push(`tr. ${s.translator ?? "Ali Quli Qara'i"}`);
  else
    parts.push(
      s.translator ? `tr. ${s.translator}` : "translator not credited"
    );
  return parts.join(" · ");
}

export const POINTS_PER_CORRECT = 10;
