"use client";

import { Flame, Star } from "lucide-react";

import { useProgress } from "@/store/use-progress";

/** Streak and points in the mobile bar (the right-hand column is desktop only). */
export const MobileStats = () => {
  const { ready, streak, points } = useProgress();
  return (
    <div className="ml-auto flex items-center gap-x-4 text-base font-extrabold">
      <span
        className="flex items-center gap-1 text-sand-ink"
        title="Daily streak"
      >
        <Flame className="size-6 fill-sand text-sand-dark" aria-hidden />
        <span data-testid="streak-m">{ready ? streak : 0}</span>
        <span className="sr-only"> day streak</span>
      </span>
      <span className="flex items-center gap-1 text-[#5B2EC7]" title="Points">
        <Star className="size-6 fill-[#8B5CF6] text-[#6236C4]" aria-hidden />
        <span data-testid="points-m">{ready ? points : 0}</span>
        <span className="sr-only"> points</span>
      </span>
    </div>
  );
};
