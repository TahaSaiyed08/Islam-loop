"use client";

import { useMemo } from "react";

import { DailyQuests } from "@/components/daily-quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { TierCard } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { computePath, nextLessonSlug } from "@/lib/path";
import { unitTheme } from "@/lib/unit-theme";
import { useProgress } from "@/store/use-progress";

import { Header } from "./header";
import { Unit, type UnitLesson } from "./unit";

export type LearnLesson = Omit<UnitLesson, "state">;
export type LearnUnit = { unit: number; name?: string; lessons: LearnLesson[] };
export type LearnTier = {
  tier: number;
  name: string;
  total: number;
  units: LearnUnit[];
};

export function LearnView({ tiers }: { tiers: LearnTier[] }) {
  const { completed, placement } = useProgress();
  const startTier = placement?.startTier ?? 1;

  const path = useMemo(
    () =>
      computePath(
        tiers.map((t) => ({
          tier: t.tier,
          lessons: t.units.flatMap((u) =>
            u.lessons.map((l) => ({
              slug: l.slug,
              isCheckpoint: l.isCheckpoint,
            }))
          ),
        })),
        new Set(completed),
        startTier
      ),
    [tiers, completed, startTier]
  );

  const states = new Map(
    path.flatMap((t) => t.lessons.map((l) => [l.slug, l.state] as const))
  );
  const currentSlug = nextLessonSlug(path);
  const currentTier =
    tiers.find((t) =>
      t.units.some((u) => u.lessons.some((l) => l.slug === currentSlug))
    ) ??
    tiers.find((t) => t.units.some((u) => u.lessons.length > 0)) ??
    tiers[0];
  const currentLessons = currentTier.units.flatMap((u) => u.lessons);
  const checkpoint = currentLessons.find((l) => l.isCheckpoint);

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress />
        <Promo />
        <DailyQuests />
        <TierCard
          tier={currentTier.tier}
          name={currentTier.name}
          done={
            currentLessons.filter((l) => states.get(l.slug) === "complete")
              .length
          }
          open={currentLessons.length}
          hasCheckpoint={!!checkpoint}
          checkpointDone={
            !!checkpoint && states.get(checkpoint.slug) === "complete"
          }
        />
      </StickyWrapper>

      <FeedWrapper>
        {tiers.map((t) => {
          const tp = path.find((p) => p.tier === t.tier);
          const count = t.units.reduce((n, u) => n + u.lessons.length, 0);
          const pending = t.total - count;
          let offset = 0;
          return (
            <section
              key={t.tier}
              aria-label={`Tier ${t.tier}`}
              data-testid={`tier-${t.tier}`}
              data-open={tp?.open}
            >
              <Header title={`Tier ${t.tier} · ${t.name}`} />
              {tp?.skipped && (
                <p
                  className="mb-4 text-center text-sm font-bold text-wolf"
                  data-testid={`skipped-${t.tier}`}
                >
                  Skipped through placement. You can still open any lesson here.
                </p>
              )}
              {pending > 0 && (
                <p className="mb-5 text-center text-wolf">
                  {count === 0
                    ? "These lessons are still being checked against their sources."
                    : `${pending} more lesson${pending === 1 ? " is" : "s are"} still being checked against their sources.`}
                </p>
              )}

              {t.units
                .filter((u) => u.lessons.length > 0)
                .map((u) => {
                  const lessons: UnitLesson[] = u.lessons.map((l) => ({
                    ...l,
                    state: states.get(l.slug) ?? "locked",
                  }));
                  const startIndex = offset;
                  offset += lessons.length;
                  const finished = lessons.filter(
                    (l) => l.state === "complete"
                  ).length;
                  return (
                    <div key={u.unit} className="mb-10">
                      <Unit
                        label={`Tier ${t.tier} · Unit ${u.unit}`}
                        title={
                          u.name ??
                          `${lessons.length} lesson${lessons.length === 1 ? "" : "s"}`
                        }
                        theme={unitTheme(u.unit)}
                        lessons={lessons}
                        startIndex={startIndex}
                        currentSlug={currentSlug}
                        percentage={(finished / lessons.length) * 100}
                      />
                    </div>
                  );
                })}
            </section>
          );
        })}
      </FeedWrapper>
    </div>
  );
}
