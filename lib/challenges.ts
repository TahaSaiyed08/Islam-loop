import type { Source } from "@/content/schema";

import { type PlayableLesson, passMark } from "./content";

/**
 * The challenge types the ported quiz shell plays. SELECT and ORDER are
 * questions; SOURCE is a "read this first" card (quote, citation, link).
 */
export type Challenge =
  | {
      id: string;
      type: "SOURCE";
      title: string;
      source?: Source;
      hook?: string;
      objective?: string;
      note?: string;
    }
  | {
      id: string;
      type: "SELECT";
      question: string;
      options: { id: number; text: string; correct: boolean }[];
      explanation: string;
    }
  | {
      id: string;
      type: "ORDER";
      question: string;
      /** Listed in the correct order. */
      items: string[];
      explanation: string;
    };

export function lessonToChallenges(lesson: PlayableLesson): Challenge[] {
  const out: Challenge[] = [];
  const readable = lesson.sources.filter((s) => s.role !== "family");

  if (readable.length === 0) {
    // Checkpoints and site-only lessons: a short intro in place of a source card.
    const total = lesson.questions.length;
    out.push({
      id: `${lesson.slug}-intro`,
      type: "SOURCE",
      title: lesson.isCheckpoint ? "Checkpoint" : "Before you start",
      hook: lesson.hook,
      objective: lesson.objective,
      note: lesson.isCheckpoint
        ? `${total} questions from this tier. Pass with ${passMark(total)} of ${total}; try again as often as you like.`
        : undefined,
    });
  } else {
    readable.forEach((source, i) =>
      out.push({
        id: `${lesson.slug}-source-${i}`,
        type: "SOURCE",
        title: source.role === "cross" ? "Related text" : "Read the source",
        source,
        // The hook and objective sit on the first card only.
        hook: i === 0 ? lesson.hook : undefined,
        objective: i === 0 ? lesson.objective : undefined,
        note:
          i === 0 && lesson.isCheckpoint
            ? `${lesson.questions.length} questions follow. Pass with ${passMark(lesson.questions.length)}.`
            : undefined,
      })
    );
  }

  lesson.questions.forEach((q, i) => {
    const id = `${lesson.slug}-q${i}`;
    if (q.type === "select")
      out.push({
        id,
        type: "SELECT",
        question: q.prompt,
        options: q.options.map((text, n) => ({
          id: n + 1,
          text,
          correct: n === q.correct,
        })),
        explanation: q.explanation,
      });
    else
      out.push({
        id,
        type: "ORDER",
        question: q.prompt,
        items: q.items,
        explanation: q.explanation,
      });
  });
  return out;
}

export const isQuestion = (c: Challenge) => c.type !== "SOURCE";
