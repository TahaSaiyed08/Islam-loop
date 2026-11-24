import {
  type Lesson,
  type PlacementQuestion,
  type Question,
  type TierFile,
  placementFileSchema,
  tierFileSchema,
} from "@/content/schema";

import { quoteHash } from "./text";

/** True when a lesson may be shown: not DRAFT, verified, and every primary quote still matches its hash. */
export function isVisible(l: Lesson): boolean {
  if (l.status === "DRAFT") return false;
  const v = l.verification;
  if (!v || !v.passed) return false;
  return l.sources.every(
    (s, i) => s.role !== "primary" || v.quoteHashes[i] === quoteHash(s.quote)
  );
}

function isFullyVerified(l: Lesson): boolean {
  return (
    isVisible(l) &&
    l.sources.every(
      (s, i) => l.verification?.quoteHashes[i] === quoteHash(s.quote)
    )
  );
}

export function effectiveStatus(l: Lesson): Lesson["status"] {
  return isVisible(l) ? l.status : "DRAFT";
}

export type PlayableLesson = Lesson & { isCheckpoint: boolean };

export type CatalogTier = {
  tier: number;
  name: string;
  /** All lessons planned for the tier, including hidden DRAFTs. */
  total: number;
  units: { unit: number; name?: string; lessons: PlayableLesson[] }[];
  lessons: PlayableLesson[];
};

export type Catalog = {
  tiers: CatalogTier[];
  lessons: PlayableLesson[];
  bySlug: Map<string, PlayableLesson>;
  placement: PlacementQuestion[];
};

const CHECKPOINT_SIZE = 5;

/** Round-robin through a tier's visible lessons' questions until we have 5. */
export function buildCheckpointQuestions(lessons: Lesson[]): Question[] {
  const out: Question[] = [];
  for (let qi = 0; qi < 3 && out.length < CHECKPOINT_SIZE; qi++)
    for (const l of lessons) {
      const q = l.questions[qi];
      if (q && out.length < CHECKPOINT_SIZE) out.push(q);
    }
  return out;
}

/** Pass mark: 4 of 5; proportionally (rounded up) when fewer questions exist. */
export function passMark(total: number): number {
  return total >= CHECKPOINT_SIZE ? 4 : Math.ceil(total * 0.8);
}

const bySlugOrder = (a: Lesson, b: Lesson) => {
  const pa = a.slug.split(".").map(Number);
  const pb = b.slug.split(".").map(Number);
  return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
};

/** Pure: validate raw JSON and keep only what may be shown. */
export function buildCatalog(
  rawTiers: unknown[],
  rawPlacement: unknown
): Catalog {
  const tierFiles: TierFile[] = rawTiers
    .map((t) => tierFileSchema.parse(t))
    .sort((a, b) => a.tier - b.tier);

  const tiers: CatalogTier[] = [];
  const all: PlayableLesson[] = [];

  for (const tf of tierFiles) {
    const lessons = [...tf.lessons].sort(bySlugOrder);
    const visible = lessons.filter(isVisible);
    const regular = visible.filter((l) => l.mechanic !== "boss_checkpoint");
    const playable: PlayableLesson[] = [];

    for (const l of visible) {
      const isCheckpoint = l.mechanic === "boss_checkpoint";
      const shown: Lesson = {
        ...l,
        // Family / cross-reference quotes appear only if they verified.
        sources: l.sources.filter(
          (s, i) =>
            s.role === "primary" ||
            l.verification?.quoteHashes[i] === quoteHash(s.quote)
        ),
      };
      if (isCheckpoint) {
        const questions = buildCheckpointQuestions(regular);
        if (questions.length === 0) continue;
        playable.push({ ...shown, questions, isCheckpoint });
      } else playable.push({ ...shown, isCheckpoint });
    }

    const units = tf.units.map((u) => ({
      ...u,
      lessons: playable.filter((l) => l.unit === u.unit),
    }));
    tiers.push({
      tier: tf.tier,
      name: tf.name,
      total: tf.lessons.length,
      units,
      lessons: playable,
    });
    all.push(...playable);
  }

  const bySlug = new Map(all.map((l) => [l.slug, l]));
  // A placement question is built from a lesson's quote, so it needs that
  // lesson visible AND every one of its quotes verified.
  const fullyVerified = new Set(
    tierFiles
      .flatMap((t) => t.lessons)
      .filter(isFullyVerified)
      .map((l) => l.slug)
  );
  const placement = placementFileSchema
    .parse(rawPlacement)
    .questions.filter(
      (q) => bySlug.has(q.lesson) && fullyVerified.has(q.lesson)
    );
  return { tiers, lessons: all, bySlug, placement };
}
