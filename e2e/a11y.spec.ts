import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { hydrated } from "./helpers";

const PAGES = [
  "/",
  "/learn",
  "/placement",
  "/sources",
  "/about",
  "/settings",
  "/lesson/1.1.1",
];

for (const path of PAGES) {
  test(`axe finds no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`
      )
    ).toEqual([]);
  });
}

test("axe: lesson question, feedback and done screens", async ({ page }) => {
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  const run = async () =>
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`
    );
  const found: string[] = [];
  await page.getByTestId("continue").click();
  found.push(...(await run()));
  await page.getByTestId("continue").click();
  found.push(...(await run()));
  await page.getByTestId("option-1").click();
  await page.getByTestId("check").click(); // wrong answer: red feedback panel
  found.push(...(await run()));
  await page.getByTestId("continue").click();
  await page.getByTestId("option-0").click();
  await page.getByTestId("check").click();
  found.push(...(await run()));
  await page.getByTestId("continue").click();
  found.push(...(await run()));
  expect(found).toEqual([]);
});

test("keyboard: a lesson can be played with the keyboard alone", async ({
  page,
}) => {
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  await page.keyboard.press("Enter"); // Begin
  await page.keyboard.press("Enter"); // source -> questions
  await page.keyboard.press("1"); // choose option 1
  await page.keyboard.press("Enter"); // check
  await expect(page.getByTestId("feedback")).toBeVisible();
  await page.keyboard.press("Enter"); // continue
  await page.keyboard.press("1");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("lesson-done")).toBeVisible();
});
