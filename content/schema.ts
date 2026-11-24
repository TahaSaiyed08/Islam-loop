import { z } from "zod";

import { wordCount } from "../lib/text";

export const STATUSES = ["DRAFT", "PREVIEW", "APPROVED"] as const;
export const MECHANICS = [
  "scenario_dilemma",
  "verse_decoder",
  "timeline_builder",
  "root_word_match",
  "boss_checkpoint",
] as const;
export const SOURCE_KEYS = [
  "QURAN",
  "NAHJ",
  "SAHIFA",
  "MIZAN",
  "MESSAGE",
  "MAQTAL",
] as const;

export const MAX_QUOTE_WORDS = 25;

export const sourceSchema = z.object({
  key: z.enum(SOURCE_KEYS),
  /** primary: the lesson stands on it. family/cross: shown only if verified. */
  role: z.enum(["primary", "family", "cross"]),
  book: z.string().min(1),
  author: z.string().optional(),
  translator: z.string().optional(),
  edition: z.string().optional(),
  locator: z.string().min(1),
  url: z.url().refine((u) => u.startsWith("https://"), "url must be https"),
  quote: z.string().min(1),
});

const selectQuestion = z.object({
  type: z.literal("select"),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).length(3),
  correct: z.number().int().min(0).max(2),
  explanation: z.string().min(1),
});

/** Tap-to-order question: `items` are listed in the correct order. */
const orderQuestion = z.object({
  type: z.literal("order"),
  prompt: z.string().min(1),
  items: z.array(z.string().min(1)).min(3).max(5),
  explanation: z.string().min(1),
});

export const questionSchema = z.discriminatedUnion("type", [
  selectQuestion,
  orderQuestion,
]);

export const verificationSchema = z.object({
  passed: z.boolean(),
  checkedAt: z.string().min(1),
  /** Aligned with `sources`; null when that source did not verify. */
  quoteHashes: z.array(z.string().nullable()),
});

export const lessonSchema = z
  .object({
    slug: z.string().regex(/^\d+\.\d+\.\d+$/),
    tier: z.number().int().min(1).max(10),
    unit: z.number().int().min(1),
    title: z.string().min(1),
    objective: z.string().min(1),
    hook: z.string().optional(),
    sources: z.array(sourceSchema),
    summary: z.string().optional(),
    familyNote: z.string().optional(),
    /** A lesson about the site itself: no outside quote to verify. */
    siteOnly: z.boolean().optional(),
    mechanic: z.enum(MECHANICS),
    questions: z.array(questionSchema),
    status: z.enum(STATUSES),
    /** Notes on sources still to be read and added; never displayed. */
    candidates: z.array(z.string()).optional(),
    draftReason: z.string().optional(),
    verification: verificationSchema.optional(),
  })
  .superRefine((l, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message: `${l.slug}: ${message}` });

    const [tier, unit] = l.slug.split(".").map(Number);
    if (tier !== l.tier || unit !== l.unit) issue("slug does not match tier/unit");

    for (const s of l.sources) {
      const isVerse = s.key === "QURAN";
      if (!isVerse && wordCount(s.quote) > MAX_QUOTE_WORDS)
        issue(`quote over ${MAX_QUOTE_WORDS} words (${s.locator})`);
      if (isVerse && !/^\d+:\d+(?:[–-]\d+)?$/.test(s.locator))
        issue(`bad Qur'an locator "${s.locator}"`);
    }

    const isBoss = l.mechanic === "boss_checkpoint";
    if (isBoss && l.questions.length > 0)
      issue("checkpoint questions are generated, not stored");
    if (!isBoss && l.questions.length > 3) issue("at most 3 questions");

    if (l.status === "DRAFT") return;

    // PREVIEW / APPROVED lessons must be complete and verified.
    if (!l.hook) issue("missing hook");
    if (!l.summary) issue("missing summary");
    if (!isBoss && l.questions.length < 2) issue("needs 2-3 questions");
    if (!isBoss && !l.siteOnly && !l.sources.some((s) => s.role === "primary"))
      issue("needs a primary source");
    if (l.mechanic === "timeline_builder" && !l.questions.some((q) => q.type === "order"))
      issue("timeline_builder needs an order question");
    if (!l.verification?.passed) issue("not verified");
    if (l.verification && l.verification.quoteHashes.length !== l.sources.length)
      issue("quoteHashes must align with sources");
  });

export const tierFileSchema = z
  .object({
    tier: z.number().int().min(1).max(10),
    name: z.string().min(1),
    units: z.array(z.object({ unit: z.number().int(), name: z.string().optional() })),
    lessons: z.array(lessonSchema),
  })
  .superRefine((t, ctx) => {
    for (const l of t.lessons)
      if (l.tier !== t.tier)
        ctx.addIssue({ code: "custom", message: `${l.slug} is in the wrong tier file` });
    const slugs = t.lessons.map((l) => l.slug);
    if (new Set(slugs).size !== slugs.length)
      ctx.addIssue({ code: "custom", message: "duplicate slugs" });
  });

export const placementQuestionSchema = z.object({
  id: z.string().min(1),
  tier: z.number().int().min(1).max(10),
  /** Slug of the lesson this question is built from; hidden unless that lesson is visible. */
  lesson: z.string().regex(/^\d+\.\d+\.\d+$/),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).length(3),
  correct: z.number().int().min(0).max(2),
  explanation: z.string().min(1),
});

export const placementFileSchema = z.object({
  questions: z.array(placementQuestionSchema),
});

export type Source = z.infer<typeof sourceSchema>;
export type Question = z.infer<typeof questionSchema>;
export type SelectQuestion = z.infer<typeof selectQuestion>;
export type OrderQuestion = z.infer<typeof orderQuestion>;
export type Lesson = z.infer<typeof lessonSchema>;
export type TierFile = z.infer<typeof tierFileSchema>;
export type PlacementQuestion = z.infer<typeof placementQuestionSchema>;
