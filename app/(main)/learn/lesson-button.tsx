"use client";

import { Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import type { UnitTheme } from "@/lib/unit-theme";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

type LessonButtonProps = {
  slug: string;
  title: string;
  /** Position along the tier's path; the zigzag continues across its units. */
  index: number;
  state: "complete" | "available" | "locked";
  current?: boolean;
  /** The tier checkpoint gets the crown. */
  isCheckpoint?: boolean;
  percentage: number;
  isFirst?: boolean;
  theme: UnitTheme;
};

// Ported from sanidhyy/duolingo-clone (MIT): the same zigzag (cycleLength 8, 40px
// steps), 70px round 3D buttons, Start bubble and progress ring. The lesson id
// became a slug and the states come from the ProgressStore.
export const LessonButton = ({
  slug,
  title,
  index,
  state,
  current,
  isCheckpoint,
  percentage,
  isFirst,
  theme,
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const locked = state === "locked";
  const isCompleted = state === "complete";

  const Icon = isCompleted ? Check : isCheckpoint ? Crown : Star;
  const label = `${title}, lesson ${slug}${isCheckpoint ? ", checkpoint" : ""}, ${
    isCompleted
      ? "completed"
      : locked
        ? "locked"
        : current
          ? "start here"
          : "open"
  }`;

  const button = (
    <Button
      size="rounded"
      variant={locked ? "locked" : "secondary"}
      className={cn(
        "h-[70px] w-[70px] border-b-8 active:border-t-8",
        !locked && theme.node
      )}
      tabIndex={-1}
      aria-label={label}
      data-testid={`lesson-button-${slug}`}
    >
      <Icon
        className={cn(
          "h-10 w-10",
          locked
            ? "fill-hare stroke-hare text-hare"
            : "fill-primary-foreground text-primary-foreground",
          isCompleted && "fill-none stroke-[4]"
        )}
      />
    </Button>
  );

  return (
    <Link
      href={`/lesson/${slug}`}
      prefetch={locked ? false : undefined}
      aria-disabled={locked}
      tabIndex={locked ? -1 : undefined}
      data-testid={`lesson-${slug}`}
      data-state={state}
      data-current={current ? "true" : undefined}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div
            className="relative h-[102px] w-[102px]"
            data-testid="current-lesson"
          >
            <div
              className={`absolute -top-6 left-2.5 z-10 animate-bounce rounded-xl border-2 border-swan bg-white px-3 py-2.5 font-extrabold uppercase tracking-wide motion-reduce:animate-none ${theme.ink}`}
            >
              Start
              <div
                className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                aria-hidden
              />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: theme.ring,
                },
                trail: {
                  stroke: "#E5E5E5",
                },
              }}
            >
              {button}
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          button
        )}
      </div>
    </Link>
  );
};
