import { describe, expect, it } from "vitest";

import { lessonSchema } from "@/content/schema";
import {
  buildCatalog,
  effectiveStatus,
  isVisible,
  passMark,
} from "@/lib/content";
import { quoteHash } from "@/lib/text";

import { makeLesson, tierFile } from "./helpers";

const none = { questions: [] };

describe("lesson schema", () => {
  it("accepts a complete verified lesson", () => {
    expect(lessonSchema.safeParse(makeLesson()).success).toBe(true);
  });

  it("rejects an invalid lesson (two correct-looking options is impossible: 4 options)", () => {
    const bad = makeLesson({
      questions: [
        {
          type: "select",
          prompt: "q",
          options: ["a", "b", "c", "d"] as never,
          correct: 0,
          explanation: "x",
        },
        {
          type: "select",
          prompt: "q2",
          options: ["a", "b", "c"],
          correct: 3 as never,
          explanation: "x",
        },
      ],
    });
    expect(lessonSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a PREVIEW lesson with no verification", () => {
    expect(
      lessonSchema.safeParse(makeLesson({ verification: undefined })).success
    ).toBe(false);
  });

  it("rejects a non-Qur'an quote over 25 words", () => {
    const long = Array.from({ length: 26 }, (_, i) => `w${i}`).join(" ");
    const l = makeLesson({
      status: "DRAFT",
      sources: [
        {
          ...makeLesson().sources[0],
          key: "NAHJ",
          locator: "Saying 1",
          quote: long,
        },
      ],
    });
    expect(lessonSchema.safeParse(l).success).toBe(false);
  });

  it("requires an order question for timeline_builder", () => {
    expect(
      lessonSchema.safeParse(makeLesson({ mechanic: "timeline_builder" }))
        .success
    ).toBe(false);
  });
});

describe("visibility", () => {
  it("never returns DRAFT lessons", () => {
    const draft = makeLesson({ status: "DRAFT" });
    const c = buildCatalog([tierFile(2, [draft])], { questions: [] });
    expect(c.lessons).toHaveLength(0);
  });

  it("returns PREVIEW and APPROVED lessons", () => {
    const a = makeLesson();
    const b = makeLesson({ slug: "2.1.2", status: "APPROVED" });
    const c = buildCatalog([tierFile(2, [a, b])], { questions: [] });
    expect(c.lessons.map((l) => l.slug)).toEqual(["2.1.1", "2.1.2"]);
  });

  it("drops a lesson back to DRAFT when its quote no longer matches its hash", () => {
    const l = makeLesson();
    l.sources[0].quote = "Read in the Name of your Lord who created it;";
    expect(isVisible(l)).toBe(false);
    expect(effectiveStatus(l)).toBe("DRAFT");
    expect(
      buildCatalog([tierFile(2, [l])], { questions: [] }).lessons
    ).toHaveLength(0);
  });

  it("tolerates curly vs straight apostrophes in the hash", () => {
    const l = makeLesson();
    l.sources[0].quote = "It’s fine";
    l.verification!.quoteHashes = [quoteHash("It's fine")];
    expect(isVisible(l)).toBe(true);
  });

  it("shows a family source only if it verified", () => {
    const fam = {
      ...makeLesson().sources[0],
      role: "family" as const,
      quote: "Other words.",
    };
    const l = makeLesson({ sources: [makeLesson().sources[0], fam] });
    l.verification!.quoteHashes = [quoteHash(l.sources[0].quote), null];
    const c = buildCatalog([tierFile(2, [l])], { questions: [] });
    expect(c.lessons[0].sources).toHaveLength(1);
  });
});

describe("checkpoints", () => {
  const boss = (over = {}) =>
    makeLesson({
      slug: "2.4.3",
      unit: 4,
      title: "Checkpoint",
      mechanic: "boss_checkpoint",
      sources: [],
      ...none,
      verification: { passed: true, checkedAt: "x", quoteHashes: [] },
      ...over,
    });

  it("builds up to 5 questions from the tier's visible lessons", () => {
    const ls = [
      makeLesson(),
      makeLesson({ slug: "2.1.2" }),
      makeLesson({ slug: "2.1.3" }),
    ];
    const c = buildCatalog([tierFile(2, [...ls, boss()])], { questions: [] });
    expect(c.bySlug.get("2.4.3")?.questions).toHaveLength(5);
  });

  it("is hidden when the tier has no visible lessons", () => {
    const c = buildCatalog(
      [tierFile(2, [boss(), makeLesson({ status: "DRAFT" })])],
      { questions: [] }
    );
    expect(c.lessons).toHaveLength(0);
  });

  it("passes at 4 of 5, proportionally for fewer", () => {
    expect(passMark(5)).toBe(4);
    expect(passMark(4)).toBe(4);
    expect(passMark(2)).toBe(2);
    expect(passMark(1)).toBe(1);
  });
});

describe("placement questions", () => {
  it("are hidden unless their lesson is visible", () => {
    const q = (lesson: string) => ({
      id: lesson,
      tier: 2,
      lesson,
      prompt: "p",
      options: ["a", "b", "c"],
      correct: 0,
      explanation: "e",
    });
    const c = buildCatalog(
      [
        tierFile(2, [
          makeLesson(),
          makeLesson({ slug: "2.1.2", status: "DRAFT" }),
        ]),
      ],
      {
        questions: [q("2.1.1"), q("2.1.2")],
      }
    );
    expect(c.placement.map((p) => p.id)).toEqual(["2.1.1"]);
  });
});
