export type PathTier = {
  tier: number;
  lessons: { slug: string; isCheckpoint: boolean }[];
};

export type LessonState = "complete" | "available" | "locked";

export type TierPath = {
  tier: number;
  open: boolean;
  /** Below the placement start tier: not completed, but still openable. */
  skipped: boolean;
  lessons: { slug: string; state: LessonState }[];
};

/**
 * Unlock rules:
 * - Inside an open tier a lesson unlocks when the one before it is complete.
 * - A tier opens when the previous tier's checkpoint is passed (or, if it has
 *   no checkpoint, all its lessons are done; or it has no lessons at all),
 *   or when placement starts the learner at or beyond it.
 * - Tiers below the placement start are "skipped": every lesson is openable.
 */
export function computePath(
  tiers: PathTier[],
  completed: ReadonlySet<string>,
  startTier = 1
): TierPath[] {
  const out: TierPath[] = [];
  let prevGate: boolean = true;

  for (const t of [...tiers].sort((a, b) => a.tier - b.tier)) {
    const skipped = t.tier < startTier;
    const open: boolean = t.tier === 1 || t.tier <= startTier || prevGate;

    let allBefore = true;
    const lessons = t.lessons.map((l) => {
      const done = completed.has(l.slug);
      const state: LessonState = done
        ? "complete"
        : !open
          ? "locked"
          : skipped || allBefore
            ? "available"
            : "locked";
      if (!done) allBefore = false;
      return { slug: l.slug, state };
    });

    const checkpoint = t.lessons.find((l) => l.isCheckpoint);
    const gateDone =
      t.lessons.length === 0
        ? true
        : checkpoint
          ? completed.has(checkpoint.slug)
          : t.lessons.every((l) => completed.has(l.slug));
    prevGate = open && gateDone;

    out.push({ tier: t.tier, open, skipped, lessons });
  }
  return out;
}

/** The first available (not complete) lesson, for "Continue where you left off". */
export function nextLessonSlug(path: TierPath[]): string | null {
  for (const t of path)
    for (const l of t.lessons) if (l.state === "available") return l.slug;
  return null;
}
