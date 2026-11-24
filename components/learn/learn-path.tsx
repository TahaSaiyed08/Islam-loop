"use client";

import { useMemo } from "react";

import Link from "next/link";
import { Check, Lock, Play, Trophy } from "lucide-react";

import { PreviewBadge } from "@/components/lesson/preview-badge";
import { Button } from "@/components/ui/button";
import { computePath, nextLessonSlug, type LessonState } from "@/lib/path";
import { MECHANIC_LABEL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/use-progress";

export type PathLesson = {
  slug: string;
  title: string;
  mechanic: string;
  isCheckpoint: boolean;
  status: "PREVIEW" | "APPROVED";
};
export type PathUnit = { unit: number; name?: string; lessons: PathLesson[] };
export type PathTierData = {
  tier: number;
  name: string;
  total: number;
  units: PathUnit[];
};

export function LearnPath({ tiers }: { tiers: PathTierData[] }) {
  const { completed, placement, ready } = useProgress();
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
  const stateOf = (slug: string): LessonState =>
    path.flatMap((t) => t.lessons).find((l) => l.slug === slug)?.state ??
    "locked";
  const next = nextLessonSlug(path);
  const started = completed.length > 0;

  return (
    <div>
      {ready && next && (
        <div className="mb-10 flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {started ? "Welcome back" : "Ready when you are"}
            </p>
            <p className="text-lg font-semibold">Lesson {next}</p>
          </div>
          <Button asChild size="lg" data-testid="continue-learning">
            <Link href={`/lesson/${next}`}>
              {started
                ? "Continue where you left off"
                : "Start the first lesson"}
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-14">
        {tiers.map((t) => {
          const tp = path.find((p) => p.tier === t.tier);
          const count = t.units.reduce((n, u) => n + u.lessons.length, 0);
          const pending = t.total - count;
          return (
            <section
              key={t.tier}
              aria-labelledby={`tier-${t.tier}`}
              data-testid={`tier-${t.tier}`}
              data-open={tp?.open}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 id={`tier-${t.tier}`} className="text-2xl font-bold">
                  Tier {t.tier} · {t.name}
                </h2>
                {tp?.skipped && (
                  <span
                    className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground"
                    data-testid={`skipped-${t.tier}`}
                  >
                    Skipped through placement
                  </span>
                )}
                {tp && !tp.open && count > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                    <Lock className="size-3.5" aria-hidden /> Passes after the
                    previous checkpoint
                  </span>
                )}
              </div>
              {pending > 0 && (
                <p className="mt-1 text-muted-foreground">
                  {count === 0
                    ? "These lessons are still being checked against their sources."
                    : `${pending} more lesson${pending === 1 ? " is" : "s are"} still being checked against their sources.`}
                </p>
              )}

              <div className="mt-6 space-y-8">
                {t.units
                  .filter((u) => u.lessons.length > 0)
                  .map((u) => (
                    <div key={u.unit}>
                      <h3 className="text-base font-semibold text-muted-foreground">
                        Unit {t.tier}.{u.unit}
                        {u.name ? ` · ${u.name}` : ""}
                      </h3>
                      <ol className="mt-3 space-y-3">
                        {u.lessons.map((l) => {
                          const state = stateOf(l.slug);
                          const inner = (
                            <>
                              <span
                                aria-hidden
                                className={cn(
                                  "flex size-12 shrink-0 items-center justify-center rounded-full border-2",
                                  state === "complete" &&
                                    "border-success bg-success text-white",
                                  state === "available" &&
                                    "border-primary bg-primary text-primary-foreground",
                                  state === "locked" &&
                                    "border-input bg-muted text-muted-foreground"
                                )}
                              >
                                {state === "complete" ? (
                                  <Check className="size-6" />
                                ) : state === "locked" ? (
                                  <Lock className="size-5" />
                                ) : l.isCheckpoint ? (
                                  <Trophy className="size-5" />
                                ) : (
                                  <Play className="size-5" />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-lg font-semibold leading-snug">
                                  {l.title}
                                </span>
                                <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                  <span>{l.slug}</span>
                                  <span>{MECHANIC_LABEL[l.mechanic]}</span>
                                  {l.status === "PREVIEW" && (
                                    <PreviewBadge className="px-2 py-0.5 text-xs" />
                                  )}
                                </span>
                              </span>
                            </>
                          );
                          return (
                            <li key={l.slug}>
                              {state === "locked" ? (
                                <div
                                  aria-disabled="true"
                                  data-testid={`lesson-${l.slug}`}
                                  data-state="locked"
                                  className="flex items-center gap-4 rounded-xl border bg-card/60 p-4 opacity-80"
                                >
                                  {inner}
                                  <span className="sr-only">Locked</span>
                                </div>
                              ) : (
                                <Link
                                  href={`/lesson/${l.slug}`}
                                  data-testid={`lesson-${l.slug}`}
                                  data-state={state}
                                  className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted"
                                >
                                  {inner}
                                  {state === "complete" && (
                                    <span className="sr-only">Completed</span>
                                  )}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
