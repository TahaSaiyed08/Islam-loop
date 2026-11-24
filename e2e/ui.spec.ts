import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { hydrated, getCatalog, playLesson } from "./helpers";

const catalog = getCatalog();
const SHOTS = path.resolve(__dirname, "..", "docs", "screenshots");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

// B4.1
test("1280px: the sidebar sits at the left and the right column is about 368px with streak and points", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/learn");
  const sidebar = page.getByRole("navigation", { name: "Main" });
  await expect(sidebar).toBeVisible();
  const box = (await sidebar.boundingBox())!;
  expect(box.x).toBeLessThan(260);
  expect(box.x + box.width).toBeLessThanOrEqual(260);

  const col = (await page.getByTestId("sticky-column").boundingBox())!;
  expect(Math.abs(col.width - 368)).toBeLessThanOrEqual(2);
  await expect(
    page.getByTestId("sticky-column").getByTestId("streak")
  ).toBeVisible();
  await expect(
    page.getByTestId("sticky-column").getByTestId("points")
  ).toBeVisible();
});

// B4.2
test("Tier 1 path: round 70px buttons in a zigzag of at least 3 offsets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/learn");
  const buttons = page.locator('[data-testid^="lesson-button-1."]');
  expect(await buttons.count()).toBeGreaterThanOrEqual(3);
  const centres = new Set<number>();
  for (let i = 0; i < (await buttons.count()); i++) {
    const b = (await buttons.nth(i).boundingBox())!;
    expect(Math.abs(b.width - b.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(b.width - 70)).toBeLessThanOrEqual(2);
    centres.add(Math.round(b.x + b.width / 2));
  }
  expect(centres.size).toBeGreaterThanOrEqual(3);
});

// B4.3
test("the current lesson has the Start bubble and a progress ring; locked lessons cannot be clicked", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/learn");
  const current = page.getByTestId("current-lesson");
  await expect(current).toBeVisible();
  await expect(current).toContainText("Start");
  await expect(current.locator(".CircularProgressbar")).toBeVisible();

  const locked = page.locator('[data-state="locked"]').first();
  await expect(locked).toHaveCSS("pointer-events", "none");
  await expect(locked).toHaveAttribute("aria-disabled", "true");
  await locked.scrollIntoViewIfNeeded();
  const b = (await locked.boundingBox())!;
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await expect(page).toHaveURL(/\/learn\/?$/);
});

// B4.4
test("360px: sidebar hidden, mobile header shown, path renders", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/learn");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Menu bar" })
  ).toBeVisible();
  await expect(page.getByTestId("current-lesson")).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: /Find my level/i })
  ).toBeVisible();
});

// B4.5
test("in a lesson: 1 selects, Enter checks, the footer turns green or rose, the finish shows confetti and result cards", async ({
  page,
}) => {
  const l = catalog.bySlug.get("1.1.1")!;
  await page.goto(`/lesson/${l.slug}`);
  await hydrated(page);
  await page.keyboard.press("Enter"); // source card -> first question

  // correct answer by keyboard
  const q1 = l.questions[0];
  if (q1.type !== "select") throw new Error("expected a select question");
  await page.keyboard.press(String(q1.correct + 1));
  await expect(page.getByTestId(`option-${q1.correct}`)).toHaveAttribute(
    "aria-checked",
    "true"
  );
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("footer")).toHaveAttribute(
    "data-status",
    "correct"
  );
  await expect(page.getByTestId("footer-message")).toHaveText("Well done.");
  await expect(page.getByTestId("footer")).toHaveCSS(
    "background-color",
    /^rgb\(2\d\d, 2\d\d, 2\d\d\)|^rgb\(2[2-3]\d/
  );
  await page.keyboard.press("Enter");

  // wrong answer by keyboard
  const q2 = l.questions[1];
  if (q2.type !== "select") throw new Error("expected a select question");
  await page.keyboard.press(String(((q2.correct + 1) % 3) + 1));
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("footer")).toHaveAttribute(
    "data-status",
    "wrong"
  );
  await expect(page.getByTestId("footer-message")).toHaveText(
    "The correct answer is shown above."
  );
  await expect(page.getByTestId(`option-${q2.correct}`)).toHaveAttribute(
    "data-status",
    "correct"
  );
  await expect(page.getByTestId("explanation")).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page.getByTestId("lesson-done")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.getByTestId("result-points")).toBeVisible();
  await expect(page.getByTestId("result-score")).toContainText(
    "Lesson complete"
  );
});

// B4.6
test("the placement quiz uses the same footer and Check button as lessons", async ({
  page,
}) => {
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  await page.getByTestId("continue").click();
  const lessonFooter = await page
    .getByTestId("footer")
    .locator("button")
    .evaluate((el) => el.className);
  const lessonCheck = await page.getByTestId("check").textContent();

  await page.goto("/placement");
  await hydrated(page);
  await page.getByTestId("continue").click();
  await expect(page.getByTestId("footer")).toBeVisible();
  const placementCheck = page.getByTestId("check");
  await expect(placementCheck).toBeVisible();
  expect(await placementCheck.textContent()).toBe(lessonCheck);
  expect(await placementCheck.evaluate((el) => el.className)).toBe(
    lessonFooter
  );
  // and the same answer cards
  await expect(page.getByTestId("option-0")).toHaveAttribute("role", "radio");
});

// B4.7
for (const [name, size] of [
  ["1280", { width: 1280, height: 800 }],
  ["360", { width: 360, height: 740 }],
] as const) {
  test(`screenshots at ${name}px`, async ({ page }) => {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.setViewportSize(size);
    await page.goto("/learn");
    await expect(page.getByTestId("current-lesson")).toBeVisible();
    await page.screenshot({ path: path.join(SHOTS, `learn-${name}.png`) });
    await page.goto("/lesson/1.1.1");
    await hydrated(page);
    await page.screenshot({
      path: path.join(SHOTS, `lesson-source-${name}.png`),
    });
    await page.getByTestId("continue").click();
    await page.getByTestId("option-1").click();
    await page.getByTestId("check").click();
    await page.screenshot({
      path: path.join(SHOTS, `lesson-question-${name}.png`),
    });
  });
}

test("an already finished lesson opens the practice dialog", async ({
  page,
}) => {
  await playLesson(page, catalog.bySlug.get("1.1.1")!);
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  await expect(page.getByRole("dialog")).toContainText("Practice lesson");
  await page.getByRole("button", { name: "I understand" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("the exit dialog asks before leaving", async ({ page }) => {
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  await page.getByRole("button", { name: "Leave the lesson" }).click();
  await expect(page.getByRole("dialog")).toContainText("Leave for now?");
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.getByRole("button", { name: "Leave the lesson" }).click();
  await page.getByRole("button", { name: "Leave", exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/?$/);
});
