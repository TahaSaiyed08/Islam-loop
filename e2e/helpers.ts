import { type Page, expect } from "@playwright/test";

import type { PlayableLesson } from "../lib/content";

export { getCatalog } from "../lib/catalog";

/** Plays a lesson through the real UI. `right` = answer correctly on the first try. */
export async function playLesson(
  page: Page,
  lesson: PlayableLesson,
  right = true
) {
  await page.goto(`/lesson/${lesson.slug}`);
  await expect(page.getByTestId("lesson-player")).toBeVisible();
  await page.getByTestId("continue").click(); // Begin
  const readable = lesson.sources.filter((s) => s.role !== "family");
  for (let i = 0; i < readable.length; i++) {
    await expect(page.getByTestId("source-card")).toBeVisible();
    await page.getByTestId("continue").click();
  }
  for (const q of lesson.questions) {
    if (q.type === "select") {
      const pick = right ? q.correct : (q.correct + 1) % 3;
      await page.getByTestId(`option-${pick}`).click();
    } else {
      const order = right
        ? q.items.map((_, i) => i)
        : q.items.map((_, i) => q.items.length - 1 - i);
      for (const idx of order) await page.getByTestId(`pool-${idx}`).click();
    }
    await page.getByTestId("check").click();
    await expect(page.getByTestId("feedback")).toHaveAttribute(
      "data-result",
      right ? "correct" : "wrong"
    );
    await page.getByTestId("continue").click();
  }
  await expect(page.getByTestId("lesson-done")).toBeVisible();
}

export function visibleText(html: string): string {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}
