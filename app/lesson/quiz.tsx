"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useMedia, useWindowSize } from "react-use";

import { LogoMark } from "@/components/logo";
import { PreviewBadge } from "@/components/preview-badge";
import { lessonToChallenges } from "@/lib/challenges";
import { passMark, type PlayableLesson } from "@/lib/content";
import { CONFETTI_COLORS, POINTS_PER_CORRECT } from "@/lib/lesson-ui";
import { useHydrated } from "@/lib/use-hydrated";
import { useExitModal } from "@/store/use-exit-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { useProgress } from "@/store/use-progress";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";
import { SourceCard } from "./source-card";

type QuizProps = {
  lesson: PlayableLesson;
  nextSlug: string | null;
  tierName: string;
};

// Ported from sanidhyy/duolingo-clone (MIT): the same none/correct/wrong flow,
// onNext / onContinue, percentage bar and finish screen. Server actions, hearts,
// audio and the subscription are gone; progress goes to the ProgressStore, and a
// wrong answer shows the right one and moves on.
export const Quiz = ({ lesson, nextSlug, tierName }: QuizProps) => {
  const { width, height } = useWindowSize();
  const reduceMotion = useMedia("(prefers-reduced-motion: reduce)", false);
  const hydrated = useHydrated();
  const router = useRouter();

  const complete = useProgress((s) => s.completeLesson);
  const progressReady = useProgress((s) => s.ready);
  const alreadyDone = useProgress((s) => s.completed.includes(lesson.slug));
  const { open: openPracticeModal, isOpen: practiceOpen } = usePracticeModal();
  const { isOpen: exitOpen } = useExitModal();

  const challenges = useMemo(() => lessonToChallenges(lesson), [lesson]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [results, setResults] = useState<Record<string, boolean>>({});

  const practiceChecked = useRef(false);
  const recorded = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // A lesson that is already finished opens as practice.
  useEffect(() => {
    if (progressReady && !practiceChecked.current) {
      practiceChecked.current = true;
      if (alreadyDone) openPracticeModal();
    }
  }, [progressReady, alreadyDone, openPracticeModal]);

  const challenge = challenges[activeIndex];
  const questions = challenges.filter((c) => c.type !== "SOURCE");
  const total = questions.length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const points = correctCount * POINTS_PER_CORRECT;
  const passed = lesson.isCheckpoint ? correctCount >= passMark(total) : true;
  const percentage = challenge
    ? Math.round((activeIndex / challenges.length) * 100)
    : 100;

  // Record the finished lesson once.
  useEffect(() => {
    if (!challenge && !recorded.current) {
      recorded.current = true;
      if (passed) complete(lesson.slug, points);
    }
  }, [challenge, passed, complete, lesson.slug, points]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [activeIndex]);

  const onNext = () => setActiveIndex((current) => current + 1);

  const reset = () => {
    setStatus("none");
    setSelectedOption(undefined);
    setPlaced([]);
  };

  const onContinue = () => {
    if (!challenge || practiceOpen || exitOpen) return;

    if (challenge.type === "SOURCE") {
      onNext();
      return;
    }

    if (status !== "none") {
      onNext();
      reset();
      return;
    }

    let ok: boolean;
    if (challenge.type === "SELECT") {
      if (!selectedOption) return;
      ok = !!challenge.options.find((o) => o.id === selectedOption)?.correct;
    } else {
      if (placed.length !== challenge.items.length) return;
      ok = placed.every((idx, pos) => idx === pos);
    }
    setResults((r) => ({ ...r, [challenge.id]: ok }));
    setStatus(ok ? "correct" : "wrong");
  };

  const onPractice = () => {
    recorded.current = false;
    setResults({});
    setActiveIndex(0);
    reset();
  };

  const familySources = lesson.sources.filter((s) => s.role === "family");
  const showFamilyNote =
    !!lesson.familyNote &&
    (!lesson.familyNote.trim().endsWith(":") || familySources.length > 0);

  if (!challenge) {
    return (
      <div
        className="flex min-h-screen flex-col"
        data-testid="lesson-player"
        data-hydrated={hydrated}
        data-lesson={lesson.slug}
      >
        {passed && !reduceMotion && (
          <Confetti
            recycle={false}
            numberOfPieces={500}
            colors={CONFETTI_COLORS}
            tweenDuration={10_000}
            width={width}
            height={height}
          />
        )}
        <div
          data-testid="lesson-done"
          className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-y-4 px-6 py-8 text-center lg:gap-y-8"
        >
          <LogoMark className="size-[100px]" />

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-bold text-neutral-700 outline-none lg:text-3xl"
          >
            {lesson.isCheckpoint ? (
              passed ? (
                "Checkpoint passed"
              ) : (
                "Not quite yet"
              )
            ) : (
              <>
                Great job! <br /> You&apos;ve completed the lesson.
              </>
            )}
          </h1>
          <p className="text-base text-neutral-600" data-testid="score">
            {correctCount} of {total} right on the first try.
            {lesson.isCheckpoint &&
              !passed &&
              ` You need ${passMark(total)} of ${total} to pass.`}
          </p>

          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={points} />
            <ResultCard
              variant="score"
              label={passed ? "Lesson complete" : "Pass mark"}
              value={
                passed
                  ? `${correctCount}/${total}`
                  : `${passMark(total)}/${total}`
              }
            />
          </div>

          <div className="w-full space-y-3 text-left">
            <h2 className="text-xl font-bold text-neutral-700">In short</h2>
            <p className="text-base text-neutral-700 lg:text-lg">
              {lesson.summary}
            </p>
            {showFamilyNote && (
              <>
                <h2 className="pt-4 text-xl font-bold text-neutral-700">
                  From the Prophet&apos;s family
                </h2>
                <p className="text-base text-neutral-700 lg:text-lg">
                  {lesson.familyNote}
                </p>
                {familySources.map((s, i) => (
                  <SourceCard key={i} source={s} />
                ))}
              </>
            )}
          </div>
        </div>

        <Footer
          status="completed"
          onCheck={() =>
            router.push(passed && nextSlug ? `/lesson/${nextSlug}` : "/learn")
          }
          onPractice={onPractice}
          practiceLabel={passed ? "Practise again" : "Try again"}
          doneLabel={
            passed
              ? nextSlug
                ? "Next lesson"
                : "Back to the path"
              : "Back to the path"
          }
        />
      </div>
    );
  }

  const title =
    challenge.type === "SOURCE" ? challenge.title : challenge.question;
  const disabled =
    challenge.type === "SELECT"
      ? !selectedOption
      : challenge.type === "ORDER"
        ? placed.length !== challenge.items.length
        : false;
  const explanation =
    challenge.type !== "SOURCE" && status !== "none"
      ? challenge.explanation
      : null;

  return (
    <div
      className="flex min-h-screen flex-col"
      data-testid="lesson-player"
      data-hydrated={hydrated}
      data-lesson={lesson.slug}
    >
      <Header percentage={percentage} />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 py-8 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <div className="space-y-3">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wide text-neutral-600">
                <span>
                  {tierName} · Lesson {lesson.slug}
                </span>
                {lesson.status === "PREVIEW" && <PreviewBadge />}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="text-center text-lg font-bold text-neutral-700 outline-none lg:text-start lg:text-3xl"
              >
                {title}
              </h1>
              {challenge.type === "SOURCE" && challenge.objective && (
                <p className="text-base text-neutral-600 lg:text-lg">
                  <strong className="font-semibold">{lesson.title}.</strong>{" "}
                  {challenge.objective}
                </p>
              )}
            </div>

            <div>
              {challenge.type === "SOURCE" && challenge.hook && (
                <QuestionBubble question={challenge.hook} />
              )}
              {challenge.type === "SOURCE" && challenge.note && (
                <p className="mb-6 text-base text-neutral-600">
                  {challenge.note}
                </p>
              )}

              <Challenge
                challenge={challenge}
                status={status}
                selectedOption={selectedOption}
                onSelect={(id) => status === "none" && setSelectedOption(id)}
                placed={placed}
                onPlace={(i) =>
                  status === "none" && setPlaced((p) => [...p, i])
                }
                onUnplace={(i) =>
                  status === "none" &&
                  setPlaced((p) => p.filter((x) => x !== i))
                }
              />

              {explanation && (
                <p
                  className="mt-4 text-base text-neutral-700"
                  data-testid="explanation"
                >
                  {explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer
        disabled={disabled}
        status={status}
        label={challenge.type === "SOURCE" ? "Continue" : "Check"}
        onCheck={onContinue}
      />
    </div>
  );
};
