"use client";

import { Flame, Star } from "lucide-react";

import { useProgress } from "@/store/use-progress";

export function ProgressBadges() {
  const { ready, streak, points } = useProgress();
  return (
    <div
      className="flex items-center gap-4 text-sm font-semibold"
      data-testid="badges"
    >
      <span
        className="flex items-center gap-1.5"
        aria-label={`Daily streak: ${ready ? streak : 0}`}
        title="Daily streak"
      >
        <Flame className="size-5 text-accent" aria-hidden />
        <span data-testid="streak">{ready ? streak : 0}</span>
      </span>
      <span
        className="flex items-center gap-1.5"
        aria-label={`Points: ${ready ? points : 0}`}
        title="Points"
      >
        <Star className="size-5 text-accent" aria-hidden />
        <span data-testid="points">{ready ? points : 0}</span>
      </span>
    </div>
  );
}
