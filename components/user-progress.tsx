"use client";

import { Flame, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/store/use-progress";

// Ported from sanidhyy/duolingo-clone (MIT): the same row of ghost buttons.
// Course picker and hearts are gone; the streak and points come from the
// ProgressStore. As in the real app, each stat is a coloured icon and a number.
export const UserProgress = () => {
  const { ready, streak, points } = useProgress();

  return (
    <div
      className="flex w-full items-center justify-between gap-x-2"
      data-testid="stats"
    >
      <Button
        variant="ghost"
        className="cursor-default text-lg text-sand-ink"
        title="Daily streak"
      >
        <Flame aria-hidden className="mr-2 size-7 fill-sand text-sand-dark" />
        <span data-testid="streak">{ready ? streak : 0}</span>
        <span className="sr-only"> day streak</span>
      </Button>

      <Button
        variant="ghost"
        className="cursor-default text-lg text-[#5B2EC7]"
        title="Points"
      >
        <Star
          aria-hidden
          className="mr-2 size-7 fill-[#8B5CF6] text-[#6236C4]"
        />
        <span data-testid="points">{ready ? points : 0}</span>
        <span className="sr-only"> points</span>
      </Button>
    </div>
  );
};
