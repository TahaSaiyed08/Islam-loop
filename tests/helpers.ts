import type { Lesson } from "@/content/schema";
import { quoteHash } from "@/lib/text";

export const QUOTE = "Read in the Name of your Lord who created;";

export function makeLesson(over: Partial<Lesson> = {}): Lesson {
  const sources: Lesson["sources"] = [
    {
      key: "QURAN",
      role: "primary",
      book: "The Holy Qur'an",
      author: "Revealed text",
      translator: "Ali Quli Qara'i",
      locator: "96:1",
      url: "https://tanzil.net",
      quote: QUOTE,
    },
  ];
  return {
    slug: "2.1.1",
    tier: 2,
    unit: 1,
    title: "Beginning with Read",
    objective: "Examine 96:1.",
    hook: "Why is the first word read?",
    sources,
    summary: "Reading is tied to the Creator.",
    mechanic: "scenario_dilemma",
    questions: [1, 2].map((n) => ({
      type: "select" as const,
      prompt: `Question ${n}?`,
      options: ["a", "b", "c"],
      correct: 0,
      explanation: "Because.",
    })),
    status: "PREVIEW",
    verification: { passed: true, checkedAt: "2026-11-24", quoteHashes: [quoteHash(QUOTE)] },
    ...over,
  };
}

export function tierFile(tier: number, lessons: Lesson[]) {
  return { tier, name: `Tier ${tier}`, units: [{ unit: 1 }], lessons };
}
