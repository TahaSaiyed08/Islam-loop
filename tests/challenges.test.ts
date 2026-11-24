import { describe, expect, it } from "vitest";

import { lessonToChallenges } from "@/lib/challenges";
import { buildCatalog } from "@/lib/content";
import { quoteHash } from "@/lib/text";

import { makeLesson, tierFile } from "./helpers";

const play = (over = {}) =>
  buildCatalog([tierFile(2, [makeLesson(over)])], { questions: [] }).lessons[0];

describe("lessonToChallenges", () => {
  it("starts with the source card carrying the hook and objective, then the questions", () => {
    const c = lessonToChallenges(play());
    expect(c.map((x) => x.type)).toEqual(["SOURCE", "SELECT", "SELECT"]);
    const first = c[0];
    expect(first.type === "SOURCE" && first.hook).toContain("first word");
    expect(first.type === "SOURCE" && first.source?.locator).toBe("96:1");
  });

  it("numbers options from 1 and marks exactly one correct", () => {
    const sel = lessonToChallenges(play()).find((x) => x.type === "SELECT")!;
    if (sel.type !== "SELECT") throw new Error();
    expect(sel.options.map((o) => o.id)).toEqual([1, 2, 3]);
    expect(sel.options.filter((o) => o.correct)).toHaveLength(1);
  });

  it("turns order questions into ORDER challenges", () => {
    const l = play({
      mechanic: "timeline_builder",
      questions: [
        {
          type: "order",
          prompt: "p",
          items: ["a", "b", "c"],
          explanation: "e",
        },
        {
          type: "select",
          prompt: "q",
          options: ["a", "b", "c"],
          correct: 1,
          explanation: "e",
        },
      ],
    });
    expect(lessonToChallenges(l).map((x) => x.type)).toEqual([
      "SOURCE",
      "ORDER",
      "SELECT",
    ]);
  });

  it("shows family quotes nowhere in the challenges (they go on the finish screen)", () => {
    const base = makeLesson();
    const fam = {
      ...base.sources[0],
      role: "family" as const,
      quote: "Other.",
    };
    const l = makeLesson({ sources: [base.sources[0], fam] });
    l.verification!.quoteHashes = [
      quoteHash(base.sources[0].quote),
      quoteHash("Other."),
    ];
    const lesson = buildCatalog([tierFile(2, [l])], { questions: [] })
      .lessons[0];
    expect(
      lessonToChallenges(lesson).filter((x) => x.type === "SOURCE")
    ).toHaveLength(1);
  });

  it("gives source-less lessons an intro card", () => {
    // a boss needs a visible regular lesson in the same tier
    const cat = buildCatalog(
      [
        tierFile(2, [
          makeLesson(),
          makeLesson({
            slug: "2.4.3",
            unit: 4,
            mechanic: "boss_checkpoint",
            sources: [],
            questions: [],
            verification: { passed: true, checkedAt: "x", quoteHashes: [] },
          }),
        ]),
      ],
      { questions: [] }
    );
    const cp = cat.bySlug.get("2.4.3")!;
    const c = lessonToChallenges(cp);
    expect(c[0].type === "SOURCE" && c[0].note).toMatch(/Pass with 2 of 2/);
    expect(c).toHaveLength(1 + cp.questions.length);
  });
});
