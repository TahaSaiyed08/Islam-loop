import { expect, test, type Page } from "@playwright/test";

import { findBanned } from "../lib/banned";
import { computePlacement } from "../lib/placement";

import { getCatalog, hydrated, playLesson, visibleText } from "./helpers";

const catalog = getCatalog();
const lesson = (slug: string) => {
  const l = catalog.bySlug.get(slug);
  if (!l) throw new Error(`lesson ${slug} is not visible`);
  return l;
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test("landing page loads with no console errors and both calls to action", async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Learn Islam through the Qur'an"
  );
  await expect(page.getByTestId("cta-placement")).toBeVisible();
  await expect(page.getByTestId("cta-start")).toBeVisible();
  await page.goto("/learn");
  await page.goto("/lesson/1.1.1");
  expect(errors).toEqual([]);
});

test("lesson 1.1.1 plays through and is still complete after a reload", async ({
  page,
}) => {
  const l = lesson("1.1.1");
  await playLesson(page, l);
  await expect(page.getByTestId("score")).toContainText(
    `${l.questions.length} of ${l.questions.length}`
  );
  await page.goto("/learn");
  await expect(page.getByTestId("lesson-1.1.1")).toHaveAttribute(
    "data-state",
    "complete"
  );
  await page.reload();
  await expect(page.getByTestId("lesson-1.1.1")).toHaveAttribute(
    "data-state",
    "complete"
  );
});

test("points and the daily streak update", async ({ page }) => {
  const l = lesson("1.1.1");
  await playLesson(page, l);
  await page.goto("/learn");
  await expect(page.getByTestId("points")).toHaveText(
    String(l.questions.length * 10)
  );
  await expect(page.getByTestId("streak")).toHaveText("1");
});

test("a wrong answer shows the correct answer and explanation, and costs nothing", async ({
  page,
}) => {
  const l = lesson("1.1.1");
  await playLesson(page, l, false);
  await expect(page.getByTestId("score")).toContainText(
    `0 of ${l.questions.length}`
  );
  await page.goto("/learn");
  await expect(page.getByTestId("lesson-1.1.1")).toHaveAttribute(
    "data-state",
    "complete"
  );
  await expect(page.getByTestId("points")).toHaveText("0");
});

test("a timeline (order) question works", async ({ page }) => {
  const l = [...catalog.bySlug.values()].find((x) =>
    x.questions.some((q) => q.type === "order")
  );
  test.skip(!l, "no visible timeline lesson");
  await playLesson(page, l!);
  await expect(page.getByTestId("score")).toContainText(
    `${l!.questions.length} of ${l!.questions.length}`
  );
});

test("a checkpoint pass unlocks the next tier; a fail does not", async ({
  page,
}) => {
  const tier1 = catalog.tiers[0].lessons;
  const cp = tier1.find((l) => l.isCheckpoint);
  test.skip(!cp, "tier 1 has no visible checkpoint");
  const regular = tier1.filter((l) => !l.isCheckpoint);
  for (const l of regular) await playLesson(page, l);

  await page.goto("/learn");
  await expect(page.getByTestId("tier-2")).toHaveAttribute(
    "data-open",
    "false"
  );

  await playLesson(page, cp!, false);
  await expect(
    page.getByRole("heading", { name: "Not quite yet" })
  ).toBeVisible();
  await page.goto("/learn");
  await expect(page.getByTestId("tier-2")).toHaveAttribute(
    "data-open",
    "false"
  );

  await playLesson(page, cp!, true);
  await expect(
    page.getByRole("heading", { name: "Checkpoint passed" })
  ).toBeVisible();
  await page.goto("/learn");
  await expect(page.getByTestId("tier-2")).toHaveAttribute("data-open", "true");
  const firstTier2 = catalog.tiers[1].lessons[0];
  await expect(page.getByTestId(`lesson-${firstTier2.slug}`)).toHaveAttribute(
    "data-state",
    "available"
  );
});

test("the placement quiz runs to the end and lands on the right tier", async ({
  page,
}) => {
  const qs = catalog.placement;
  expect(qs.length).toBeGreaterThan(0);
  const expected = computePlacement(
    qs.map((q) => ({ tier: q.tier, correct: true }))
  ).startTier;
  await page.goto("/placement");
  await hydrated(page);
  await page.getByTestId("placement-begin").click();
  for (let i = 0; i < qs.length; i++) {
    await page.getByTestId(`placement-option-${qs[i].correct}`).click();
    await page
      .getByTestId(i === qs.length - 1 ? "placement-finish" : "placement-next")
      .click();
  }
  await expect(page.getByTestId("placement-result")).toHaveAttribute(
    "data-start-tier",
    String(expected)
  );
  await page.getByTestId("placement-go").click();
  await expect(page.getByTestId(`tier-${expected}`)).toHaveAttribute(
    "data-open",
    "true"
  );
  if (expected > 1) await expect(page.getByTestId("skipped-1")).toBeVisible();
});

test("placement with every answer wrong starts at Tier 1, and skipping works", async ({
  page,
}) => {
  const qs = catalog.placement;
  await page.goto("/placement");
  await hydrated(page);
  await page.getByTestId("placement-begin").click();
  for (let i = 0; i < qs.length; i++) {
    await page
      .getByTestId(`placement-option-${(qs[i].correct + 1) % 3}`)
      .click();
    await page
      .getByTestId(i === qs.length - 1 ? "placement-finish" : "placement-next")
      .click();
  }
  await expect(page.getByTestId("placement-result")).toHaveAttribute(
    "data-start-tier",
    "1"
  );
  await page.goto("/placement");
  await hydrated(page);
  await page.getByTestId("placement-skip").click();
  await expect(page).toHaveURL(/\/learn\/?$/);
});

test("reset clears progress, with an in-page confirmation and no browser dialog", async ({
  page,
}) => {
  await playLesson(page, lesson("1.1.1"));
  let dialogs = 0;
  page.on("dialog", (d) => {
    dialogs++;
    void d.dismiss();
  });
  await page.goto("/settings");
  await hydrated(page);
  await expect(page.getByTestId("stat-completed")).toHaveText("1");
  await page.getByTestId("reset-open").click();
  await page.getByTestId("reset-confirm").click();
  await expect(page.getByTestId("reset-done")).toBeVisible();
  await expect(page.getByTestId("stat-completed")).toHaveText("0");
  await page.reload();
  await expect(page.getByTestId("stat-completed")).toHaveText("0");
  await expect(page.getByTestId("points")).toHaveText("0");
  expect(dialogs).toBe(0);
});

test("progress still works when localStorage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const errors = watchConsole(page);
  await playLesson(page, lesson("1.1.1"));
  await expect(page.getByTestId("lesson-done")).toBeVisible();
  expect(errors).toEqual([]);
});

test("PREVIEW labels show on cards and lesson pages", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByTestId("preview-badge").first()).toBeVisible();
  await page.goto("/lesson/1.1.1");
  await expect(page.getByTestId("preview-badge").first()).toBeVisible();
});

test("every source link is an absolute https URL and external links are safe", async ({
  page,
}) => {
  for (const l of catalog.lessons)
    for (const s of l.sources) expect(s.url).toMatch(/^https:\/\//);
  await page.goto("/lesson/1.1.1");
  await hydrated(page);
  await page.getByTestId("continue").click();
  const link = page.getByRole("link", { name: /Read the full text/ });
  await expect(link).toHaveAttribute("href", /^https:\/\//);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(page.getByTestId("citation")).toContainText("The Holy Qur'an");
  await expect(page.getByRole("link", { name: "Tanzil" })).toHaveAttribute(
    "href",
    "https://tanzil.net"
  );
  await page.goto("/sources");
  const hrefs = await page
    .locator('main a[href^="http"]')
    .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
});

test("crawling from / finds no 404s and no banned words", async ({
  request,
}) => {
  const seen = new Set<string>();
  const queue = [
    "/",
    "/learn",
    "/placement",
    "/sources",
    "/about",
    "/settings",
    ...catalog.lessons.map((l) => `/lesson/${l.slug}`),
  ];
  const bad: string[] = [];
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await request.get(path);
    if (res.status() !== 200) {
      bad.push(`${path} -> ${res.status()}`);
      continue;
    }
    const html = await res.text();
    const banned = findBanned(visibleText(html));
    if (banned) bad.push(`${path} contains banned word "${banned}"`);
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g))
      if (!m[1].startsWith("/_next") && !seen.has(m[1])) queue.push(m[1]);
  }
  expect(bad).toEqual([]);
  expect(seen.size).toBeGreaterThan(catalog.lessons.length);
  expect((await request.get("/definitely-not-a-page")).status()).toBe(404);
  expect((await request.get("/lesson/9.9.9")).status()).toBe(404);
});

test("sitemap and robots exist", async ({ request }) => {
  const sm = await (await request.get("/sitemap.xml")).text();
  expect(sm).toContain("/lesson/1.1.1");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap");
});

for (const [name, size] of [
  ["360px phone", { width: 360, height: 740 }],
  ["desktop", { width: 1280, height: 800 }],
] as const) {
  test(`no horizontal overflow on ${name}`, async ({ page }) => {
    await page.setViewportSize(size);
    for (const path of [
      "/",
      "/learn",
      "/placement",
      "/sources",
      "/about",
      "/settings",
      "/lesson/1.1.1",
    ]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(
        overflow,
        `${path} overflows by ${overflow}px`
      ).toBeLessThanOrEqual(0);
    }
  });
}
