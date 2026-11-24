"use client";

import { useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PlacementQuestion } from "@/content/schema";
import { computePlacement } from "@/lib/placement";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/use-progress";

type Props = {
  questions: PlacementQuestion[];
  tierNames: Record<number, string>;
};

export function PlacementQuiz({ questions, tierNames }: Props) {
  const save = useProgress((s) => s.savePlacement);
  const [i, setI] = useState(-1); // -1 = intro, questions.length = results
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    questions.map(() => null)
  );

  const finish = () => {
    const result = computePlacement(
      questions.map((q, n) => ({
        tier: q.tier,
        correct: picks[n] === q.correct,
      }))
    );
    save({
      startTier: result.startTier,
      answeredAt: new Date().toISOString(),
      skipped: false,
    });
    setI(questions.length);
  };

  if (i === -1) {
    return (
      <div>
        <h1 className="text-4xl font-bold leading-tight">Find my level</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {questions.length > 0
            ? `${questions.length} quick questions, about ninety seconds. You will start where the questions stop being easy. Earlier tiers stay open if you want them.`
            : "The placement questions are still being checked against their sources. You can start from the beginning."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {questions.length > 0 && (
            <Button
              size="lg"
              onClick={() => setI(0)}
              data-testid="placement-begin"
            >
              Begin
            </Button>
          )}
          <Button
            asChild
            size="lg"
            variant="outline"
            onClick={() =>
              save({
                startTier: 1,
                answeredAt: new Date().toISOString(),
                skipped: true,
              })
            }
          >
            <Link href="/learn" data-testid="placement-skip">
              Skip and start at Tier 1
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (i >= questions.length) {
    const result = computePlacement(
      questions.map((q, n) => ({
        tier: q.tier,
        correct: picks[n] === q.correct,
      }))
    );
    const start = result.startTier;
    return (
      <div data-testid="placement-result" data-start-tier={start}>
        <h1 className="text-4xl font-bold leading-tight">
          Start at Tier {start}
        </h1>
        <p className="mt-3 text-xl">{tierNames[start]}</p>
        <p className="mt-4 text-muted-foreground">
          {start > 1
            ? `Tiers 1 to ${start - 1} are marked skipped. They are not marked complete, and you can still open any of them.`
            : "You will begin at the first tier. Nothing is lost by starting here."}
        </p>
        <ul className="mt-6 space-y-1">
          {result.tiers.map((t) => (
            <li key={t.tier} className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold",
                  t.passed ? "text-success" : "text-danger"
                )}
              >
                {t.passed ? "Right" : "Missed"}
              </span>
              <span>
                Tier {t.tier} · {tierNames[t.tier]}
              </span>
            </li>
          ))}
        </ul>
        <Button asChild size="lg" className="mt-8">
          <Link href="/learn" data-testid="placement-go">
            Go to my path
          </Link>
        </Button>
      </div>
    );
  }

  const q = questions[i];
  return (
    <div>
      <Progress
        value={(i / questions.length) * 100}
        aria-label="Placement progress"
      />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Question {i + 1} of {questions.length}
      </p>
      <h1 className="mt-2 text-2xl font-bold leading-snug" id="pq">
        {q.prompt}
      </h1>
      <div role="radiogroup" aria-labelledby="pq" className="mt-6 grid gap-3">
        {q.options.map((opt, n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={picks[i] === n}
            data-testid={`placement-option-${n}`}
            onClick={() => setPicks((p) => p.map((v, k) => (k === i ? n : v)))}
            className={cn(
              "min-h-14 w-full rounded-xl border-2 bg-card px-4 py-3 text-left text-lg hover:bg-muted",
              picks[i] === n && "border-primary bg-primary/5"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-between gap-3">
        <Button variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
          Back
        </Button>
        {i < questions.length - 1 ? (
          <Button
            disabled={picks[i] === null}
            onClick={() => setI(i + 1)}
            data-testid="placement-next"
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={picks[i] === null}
            onClick={finish}
            data-testid="placement-finish"
          >
            See my level
          </Button>
        )}
      </div>
    </div>
  );
}
