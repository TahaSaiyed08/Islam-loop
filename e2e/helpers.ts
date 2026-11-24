import { type Page, expect } from "@playwright/test";

import { lessonToChallenges } from "../lib/challenges";
import type { PlayableLesson } from "../lib/content";

export { getCatalog } from "../lib/catalog";

/** Waits until React has attached handlers (SSR HTML is visible before it is interactive). */
export async function hydrated(page: Page) {
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible();
}

/** Plays a lesson through the real UI. `right` = answer correctly on the first try. */
export async function playLesson(
  page: Page,
  lesson: PlayableLesson,
  right = true
) {
  await page.goto(`/lesson/${lesson.slug}`);
  await hydrated(page);
  for (const c of lessonToChallenges(lesson)) {
    if (c.type === "SOURCE") {
      await page.getByTestId("continue").click();
      continue;
    }
    if (c.type === "SELECT") {
      const correct = c.options.findIndex((o) => o.correct);
      await page
        .getByTestId(`option-${right ? correct : (correct + 1) % 3}`)
        .click();
    } else {
      const order = right
        ? c.items.map((_, i) => i)
        : c.items.map((_, i) => c.items.length - 1 - i);
      for (const idx of order) await page.getByTestId(`pool-${idx}`).click();
    }
    await page.getByTestId("check").click();
    await expect(page.getByTestId("footer")).toHaveAttribute(
      "data-status",
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
