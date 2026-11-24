"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { CheckCircle2, XCircle, X } from "lucide-react";

import { PreviewBadge } from "@/components/lesson/preview-badge";
import {
  type Answer,
  QuestionView,
  emptyAnswer,
  isAnswered,
  isCorrect,
} from "@/components/lesson/question-view";
import { SourceCard } from "@/components/lesson/source-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { passMark, type PlayableLesson } from "@/lib/content";
import { POINTS_PER_CORRECT } from "@/lib/lesson-ui";
import { MECHANIC_LABEL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/use-progress";

type Step =
  | { kind: "intro" }
  | { kind: "source"; i: number }
  | { kind: "question"; i: number }
  | { kind: "done" };

type Props = {
  lesson: PlayableLesson;
  nextSlug: string | null;
  tierName: string;
};

export function LessonPlayer({ lesson, nextSlug, tierName }: Props) {
  const complete = useProgress((s) => s.completeLesson);

  const readSources = useMemo(
    () =>
      lesson.sources
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.role !== "family"),
    [lesson.sources]
  );
  const familySources = lesson.sources.filter((s) => s.role === "family");

  const steps = useMemo<Step[]>(
    () => [
      { kind: "intro" },
      ...readSources.map((_, i) => ({ kind: "source" as const, i })),
      ...lesson.questions.map((_, i) => ({ kind: "question" as const, i })),
      { kind: "done" },
    ],
    [readSources, lesson.questions]
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() =>
    lesson.questions.map(emptyAnswer)
  );
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState<boolean[]>(() =>
    lesson.questions.map(() => false)
  );
  const [exitOpen, setExitOpen] = useState(false);
  const recorded = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const step = steps[stepIdx];
  const total = lesson.questions.length;
  const correctCount = firstTry.filter(Boolean).length;
  const points = correctCount * POINTS_PER_CORRECT;
  const passed = lesson.isCheckpoint ? correctCount >= passMark(total) : true;
  const question = step.kind === "question" ? lesson.questions[step.i] : null;
  const answer = step.kind === "question" ? answers[step.i] : null;

  // Record completion once, when the learner reaches the end screen.
  useEffect(() => {
    if (step.kind === "done" && !recorded.current) {
      recorded.current = true;
      if (passed) complete(lesson.slug, points);
    }
  }, [step.kind, passed, complete, lesson.slug, points]);

  // Move focus to the new heading for keyboard and screen-reader users.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIdx]);

  const onCheck = useCallback(() => {
    if (step.kind !== "question" || !question || !answer) return;
    setFirstTry((f) =>
      f.map((v, i) => (i === step.i ? isCorrect(question, answer) : v))
    );
    setChecked(true);
  }, [step, question, answer]);

  const onContinue = useCallback(() => {
    setChecked(false);
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const restart = () => {
    recorded.current = false;
    setAnswers(lesson.questions.map(emptyAnswer));
    setFirstTry(lesson.questions.map(() => false));
    setChecked(false);
    setStepIdx(0);
  };

  const primaryAction = useCallback(() => {
    if (step.kind === "question") {
      if (!checked) {
        if (question && answer && isAnswered(question, answer)) onCheck();
      } else onContinue();
    } else if (step.kind !== "done") onContinue();
  }, [step.kind, checked, question, answer, onCheck, onContinue]);

  // Keyboard: Enter checks/continues, 1-3 choose an option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (exitOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        e.key === "Enter" &&
        t &&
        (t.tagName === "BUTTON" || t.tagName === "A")
      )
        return;
      if (e.key === "Enter") {
        e.preventDefault();
        primaryAction();
      } else if (
        question?.type === "select" &&
        !checked &&
        ["1", "2", "3"].includes(e.key)
      ) {
        setAnswers((a) =>
          a.map((v, i) =>
            step.kind === "question" && i === step.i
              ? { kind: "select", choice: Number(e.key) - 1 }
              : v
          )
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primaryAction, question, checked, step, exitOpen]);

  const percent = Math.round((stepIdx / (steps.length - 1)) * 100);
  const right =
    checked && question && answer ? isCorrect(question, answer) : false;
  const showFamilyNote =
    !!lesson.familyNote &&
    (!lesson.familyNote.trim().endsWith(":") || familySources.length > 0);

  return (
    <div
      className="flex min-h-screen flex-col"
      data-testid="lesson-player"
      data-lesson={lesson.slug}
    >
      <header className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Leave lesson"
          onClick={() => setExitOpen(true)}
        >
          <X aria-hidden />
        </Button>
        <Progress
          value={percent}
          aria-label="Lesson progress"
          className="h-3"
        />
        {lesson.status === "PREVIEW" && (
          <PreviewBadge className="hidden shrink-0 sm:inline-flex" />
        )}
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-40 pt-8">
        {step.kind === "intro" && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {tierName} · Lesson {lesson.slug} ·{" "}
              {MECHANIC_LABEL[lesson.mechanic]}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-2 text-3xl font-bold leading-tight outline-none sm:text-4xl"
            >
              {lesson.title}
            </h1>
            {lesson.status === "PREVIEW" && <PreviewBadge className="mt-3" />}
            <p className="mt-5 text-lg">
              <strong className="font-semibold">By the end:</strong>{" "}
              {lesson.objective}
            </p>
            {lesson.hook && (
              <p
                className="mt-5 rounded-xl bg-secondary/60 p-5 font-quote text-xl leading-snug"
                data-testid="hook"
              >
                {lesson.hook}
              </p>
            )}
            {lesson.isCheckpoint && (
              <p className="mt-5 text-muted-foreground">
                {total} questions from this tier. You pass with{" "}
                {passMark(total)} of {total}, and you can try again as often as
                you like.
              </p>
            )}
          </section>
        )}

        {step.kind === "source" && (
          <section>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-4 text-2xl font-bold outline-none"
            >
              {readSources[step.i].s.role === "cross"
                ? "Related text"
                : "Read the source"}
            </h1>
            <SourceCard source={readSources[step.i].s} />
          </section>
        )}

        {step.kind === "question" && question && answer && (
          <section>
            <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Question {step.i + 1} of {total}
            </h1>
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              aria-hidden
            >
              Question {step.i + 1} of {total}
            </p>
            <QuestionView
              question={question}
              answer={answer}
              checked={checked}
              onChange={(a) =>
                setAnswers((all) => all.map((v, i) => (i === step.i ? a : v)))
              }
            />
          </section>
        )}

        {step.kind === "done" && (
          <section data-testid="lesson-done">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-bold outline-none"
            >
              {lesson.isCheckpoint
                ? passed
                  ? "Checkpoint passed"
                  : "Not quite yet"
                : "Lesson complete"}
            </h1>
            <p className="mt-3 text-lg" data-testid="score">
              {correctCount} of {total} right on the first try.
              {passed && points > 0 && (
                <>
                  {" "}
                  <strong data-testid="points-earned">+{points} points</strong>
                </>
              )}
            </p>
            {lesson.isCheckpoint && !passed && (
              <p className="mt-2 text-muted-foreground">
                You need {passMark(total)} of {total} to pass. Try again
                whenever you are ready.
              </p>
            )}
            <h2 className="mt-8 text-xl font-bold">In short</h2>
            <p className="mt-2 text-lg">{lesson.summary}</p>
            {showFamilyNote && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">
                  From the Prophet&apos;s family
                </h2>
                <p className="mt-2 text-lg">{lesson.familyNote}</p>
                <div className="mt-4 grid gap-4">
                  {familySources.map((s, i) => (
                    <SourceCard key={i} source={s} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t bg-background",
          checked &&
            (right
              ? "border-success/30 bg-success-soft"
              : "border-danger/30 bg-danger-soft")
        )}
      >
        <div className="mx-auto w-full max-w-2xl px-4 py-4">
          {checked && question && (
            <div
              className="mb-3 flex items-start gap-3"
              role="status"
              data-testid="feedback"
              data-result={right ? "correct" : "wrong"}
            >
              {right ? (
                <CheckCircle2
                  className="mt-0.5 size-6 shrink-0 text-success"
                  aria-hidden
                />
              ) : (
                <XCircle
                  className="mt-0.5 size-6 shrink-0 text-danger"
                  aria-hidden
                />
              )}
              <div>
                <p
                  className={cn(
                    "text-lg font-bold",
                    right ? "text-success" : "text-danger"
                  )}
                >
                  {right ? "Correct" : "Not quite"}
                </p>
                {!right && question.type === "select" && (
                  <p className="text-base">
                    Right answer: {question.options[question.correct]}
                  </p>
                )}
                <p className="text-base">{question.explanation}</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {step.kind === "done" ? (
              <>
                <Button
                  variant="outline"
                  onClick={restart}
                  data-testid="practise-again"
                >
                  Practise again
                </Button>
                {passed ? (
                  <Button asChild data-testid="continue">
                    <Link href={nextSlug ? `/lesson/${nextSlug}` : "/learn"}>
                      {nextSlug ? "Next lesson" : "Back to the path"}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="sand">
                    <Link href="/learn">Back to the path</Link>
                  </Button>
                )}
              </>
            ) : step.kind === "question" ? (
              checked ? (
                <Button onClick={onContinue} data-testid="continue">
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={onCheck}
                  disabled={
                    !question || !answer || !isAnswered(question, answer)
                  }
                  data-testid="check"
                >
                  Check
                </Button>
              )
            ) : (
              <Button onClick={onContinue} data-testid="continue">
                {step.kind === "intro" ? "Begin" : "Continue"}
              </Button>
            )}
          </div>
        </div>
      </footer>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave this lesson?</DialogTitle>
            <DialogDescription>
              Your answers in this lesson will be lost. Lessons you have
              finished stay finished.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Keep going</Button>
            </DialogClose>
            <Button asChild variant="sand">
              <Link href="/learn">Leave</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
