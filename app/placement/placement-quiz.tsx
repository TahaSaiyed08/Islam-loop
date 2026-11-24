"use client";

import { useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useMedia, useWindowSize } from "react-use";

import { Challenge } from "@/app/lesson/challenge";
import { Footer } from "@/app/lesson/footer";
import { Header } from "@/app/lesson/header";
import { ResultCard } from "@/app/lesson/result-card";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import type { PlacementQuestion } from "@/content/schema";
import type { Challenge as ChallengeData } from "@/lib/challenges";
import { CONFETTI_COLORS } from "@/lib/lesson-ui";
import { computePlacement } from "@/lib/placement";
import { useHydrated } from "@/lib/use-hydrated";
import { useExitModal } from "@/store/use-exit-modal";
import { useProgress } from "@/store/use-progress";

type Props = {
  questions: PlacementQuestion[];
  tierNames: Record<number, string>;
};

// The placement quiz runs in the same shell as a lesson: Header, Challenge, Footer
// and ResultCard from app/lesson.
export const PlacementQuiz = ({ questions, tierNames }: Props) => {
  const router = useRouter();
  const hydrated = useHydrated();
  const { width, height } = useWindowSize();
  const reduceMotion = useMedia("(prefers-reduced-motion: reduce)", false);
  const save = useProgress((s) => s.savePlacement);
  const { isOpen: exitOpen } = useExitModal();

  const [index, setIndex] = useState(-1); // -1 intro, questions.length results
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [answers, setAnswers] = useState<{ tier: number; correct: boolean }[]>(
    []
  );
  const saved = useRef(false);

  const skip = () =>
    save({ startTier: 1, answeredAt: new Date().toISOString(), skipped: true });

  const wrapper = (children: React.ReactNode) => (
    <div
      className="flex min-h-screen flex-col"
      data-testid="placement"
      data-hydrated={hydrated}
    >
      {children}
    </div>
  );

  // ---- intro
  if (index === -1) {
    return wrapper(
      <>
        <Header percentage={0} />
        <div className="flex-1">
          <div className="flex h-full items-center justify-center">
            <div className="flex w-full flex-col gap-y-8 px-6 py-8 lg:min-h-[350px] lg:w-[600px] lg:px-0">
              <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
                Find my level
              </h1>
              <p className="text-base text-neutral-600 lg:text-lg">
                {questions.length > 0
                  ? `${questions.length} quick questions, about ninety seconds. You start where the questions stop being easy. Earlier tiers stay open if you want them.`
                  : "The placement questions are still being checked against their sources. You can start from the beginning."}
              </p>
              <Button
                asChild
                variant="primaryOutline"
                size="lg"
                className="w-full border-2 border-b-4"
              >
                <Link href="/learn" onClick={skip} data-testid="placement-skip">
                  Skip and start at Tier 1
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer
          status="none"
          label="Continue"
          onCheck={() =>
            questions.length > 0 ? setIndex(0) : (skip(), router.push("/learn"))
          }
        />
      </>
    );
  }

  // ---- results
  if (index >= questions.length) {
    const result = computePlacement(answers);
    const right = answers.filter((a) => a.correct).length;
    return wrapper(
      <>
        {!reduceMotion && (
          <Confetti
            recycle={false}
            numberOfPieces={300}
            colors={CONFETTI_COLORS}
            tweenDuration={8_000}
            width={width}
            height={height}
          />
        )}
        <div
          data-testid="placement-result"
          data-start-tier={result.startTier}
          className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-y-4 px-6 py-8 text-center lg:gap-y-8"
        >
          <LogoMark className="size-[100px]" />
          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Start at Tier {result.startTier}
          </h1>
          <p className="text-base text-neutral-600 lg:text-lg">
            {tierNames[result.startTier]}.{" "}
            {result.startTier > 1
              ? `Tiers 1 to ${result.startTier - 1} are marked skipped. They are not marked complete, and you can still open any of them.`
              : "You begin at the first tier. Nothing is lost by starting here."}
          </p>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard
              variant="score"
              label="Starting tier"
              value={`Tier ${result.startTier}`}
            />
            <ResultCard
              variant="points"
              label="Questions right"
              value={`${right}/${answers.length}`}
            />
          </div>
          <ul className="w-full space-y-1 text-left text-base text-neutral-700">
            {result.tiers.map((t) => (
              <li key={t.tier}>
                <strong className={t.passed ? "text-success" : "text-danger"}>
                  {t.passed ? "Right" : "Missed"}
                </strong>{" "}
                Tier {t.tier} · {tierNames[t.tier]}
              </li>
            ))}
          </ul>
        </div>
        <Footer
          status="completed"
          doneLabel="Go to my path"
          practiceLabel="Retake the quiz"
          onCheck={() => router.push("/learn")}
          onPractice={() => {
            saved.current = false;
            setAnswers([]);
            setStatus("none");
            setSelectedOption(undefined);
            setIndex(0);
          }}
        />
      </>
    );
  }

  // ---- a question
  const q = questions[index];
  const challenge: ChallengeData = {
    id: q.id,
    type: "SELECT",
    question: q.prompt,
    options: q.options.map((text, n) => ({
      id: n + 1,
      text,
      correct: n === q.correct,
    })),
    explanation: q.explanation,
  };

  const onContinue = () => {
    if (exitOpen) return;
    if (status !== "none") {
      const next = index + 1;
      setStatus("none");
      setSelectedOption(undefined);
      setIndex(next);
      if (next >= questions.length && !saved.current) {
        saved.current = true;
        const startTier = computePlacement(answers).startTier;
        save({
          startTier,
          answeredAt: new Date().toISOString(),
          skipped: false,
        });
      }
      return;
    }
    if (!selectedOption) return;
    const ok = !!challenge.options.find((o) => o.id === selectedOption)
      ?.correct;
    setAnswers((a) => [...a, { tier: q.tier, correct: ok }]);
    setStatus(ok ? "correct" : "wrong");
  };

  return wrapper(
    <>
      <Header percentage={Math.round((index / questions.length) * 100)} />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 py-8 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-neutral-600">
                Find my level · Question {index + 1} of {questions.length}
              </p>
              <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
                {q.prompt}
              </h1>
            </div>
            <div>
              <Challenge
                challenge={challenge}
                status={status}
                selectedOption={selectedOption}
                onSelect={(id) => status === "none" && setSelectedOption(id)}
                placed={[]}
                onPlace={() => {}}
                onUnplace={() => {}}
              />
              {status !== "none" && (
                <p
                  className="mt-4 text-base text-neutral-700"
                  data-testid="explanation"
                >
                  {q.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};
