# Rework report

**Branch:** `claude/the-roadmap-website-djd0th`, merged into `main`. Not deployed.

## Summary

| Part | Result |
|---|---|
| A2 Project skills | Done. Installed in `.claude/skills/`. They did not register as callable skills this session, so I read and followed them directly. Taste was not run; Impeccable's audit was done by hand. See DECISIONS 25 to 27. |
| B1/B2 Port the upstream UI | **Done.** Every file in the B2 table is ported, with the changes listed in DECISIONS.md ("Ported upstream files"). |
| B3 Design pass | Done by hand: contrast (axe), touch targets, overflow, keyboard, reduced motion. P1 findings fixed, structure unchanged. |
| B4 UI acceptance tests | **All 7 pass** (below). Full e2e: 35 of 35. |
| C1 Exact page URLs | Done: 32 Al-Islam.org sources updated. No quote text changed. |
| C2 Verify Al-Islam.org quotes (WebFetch) | **Not done: blocked.** The WebFetch route cannot resolve al-islam.org (`getaddrinfo ENOTFOUND`, both hosts). The verifier now accepts WebFetch evidence and is tested, but no evidence exists. |
| C3 Write the stubs, unlock hidden lessons, restore Q1–Q6, add Q9 | **Not done: blocked** by the same thing (the source pages cannot be read). |
| D Finish | Gates all pass. Merged to `main`. |

So the goal's condition "every Al-Islam.org lesson has an exact page URL **and a verify result**" is only half met: the URL is there, and the verify result is "not verified (source unreachable)". Nothing was marked verified without a check.

## Gates

| Check | Result |
|---|---|
| `pnpm lint` | exit 0 |
| `pnpm test` | 75 passed |
| `pnpm verify` | exit 0: 49 PREVIEW, 0 APPROVED, 71 DRAFT |
| `pnpm build` | exit 0 |
| `DEPLOY_TARGET=static pnpm build` | exit 0 |
| `pnpm test:e2e` | 35 passed |

## B4 acceptance tests (`e2e/ui.spec.ts`)

| # | Requirement | Test | Result |
|---|---|---|---|
| 1 | At 1280px the sidebar is at x < 260 and the right column is about 368px with streak and points | "1280px: the sidebar sits at the left and the right column is about 368px…" | pass |
| 2 | Tier 1 path: 3 or more round ~70px buttons, 3 or more different offsets | "Tier 1 path: round 70px buttons in a zigzag of at least 3 offsets" | pass |
| 3 | Current lesson has the Start bubble and a ring; locked lessons cannot be clicked | "the current lesson has the Start bubble and a progress ring; locked lessons cannot be clicked" | pass |
| 4 | At 360px the sidebar is hidden, the mobile header shows, the path renders | "360px: sidebar hidden, mobile header shown, path renders" | pass |
| 5 | `1` selects, `Enter` checks, footer turns green or rose with the right text; finish shows confetti and result cards | "in a lesson: 1 selects, Enter checks…" | pass |
| 6 | The placement quiz uses the same footer and Check button | "the placement quiz uses the same footer and Check button as lessons" | pass |
| 7 | Screenshots at 1280 and 360 | "screenshots at 1280px / 360px" | pass |

The rest of the suite (smoke, placement, checkpoint unlock, reset, blocked storage, crawl for 404s and banned words, overflow, axe on every page and lesson state, keyboard-only play) was updated for the new UI and passes.

### Screenshots

| | 1280px | 360px |
|---|---|---|
| `/learn` | [learn-1280.png](docs/screenshots/learn-1280.png) | [learn-360.png](docs/screenshots/learn-360.png) |
| Lesson, source card | [lesson-source-1280.png](docs/screenshots/lesson-source-1280.png) | [lesson-source-360.png](docs/screenshots/lesson-source-360.png) |
| Lesson, a checked question | [lesson-question-1280.png](docs/screenshots/lesson-question-1280.png) | [lesson-question-360.png](docs/screenshots/lesson-question-360.png) |

## What was ported

The full file-by-file list, with what changed in each, is in `DECISIONS.md` under "Ported upstream files (B1/B2)". Two deliberate departures from upstream's exact behaviour: the zigzag index continues across a tier's units, and the Enter shortcut no longer fires twice when a button has focus.

## How each lesson was verified

- **By script:** all 41 Qur'an-based lessons, quote by quote against the Tanzil Qara'i file (44 Qur'an quotes, 0 mismatches). These were checked in the first run and re-checked in this one. Spot-check these first.
- **By WebFetch:** none.
- **Not verified:** the 25 written Al-Islam.org lessons (32 quotes on 10 pages) and the 45 stubs. `MANUAL_FETCH.md` lists every page, the file name to save it under, and every quote.

## Lesson table

| Slug | Status | Verify result | Reason if DRAFT |
|---|---|---|---|

Totals: 49 PREVIEW, 0 APPROVED, 71 DRAFT. Placement: 8 of 14 questions visible (Q1b, Q3b, Q7, Q8, Q10–Q13). Q1–Q6 stay hidden until their lessons verify; Q9 (Tier 6) cannot be written until a Tier 6 lesson is verified.

## Manual fetch list

`MANUAL_FETCH.md` (10 pages, 32 quotes, 45 stubs). Sahifa and Maqtal have no exact URLs yet; follow each book's contents page.

## Taha's next steps

1. **Unlock Al-Islam.org lessons.** Save each of the 10 pages from `MANUAL_FETCH.md` into `.cache/pages/` under the file name shown (or add two-confirmation WebFetch evidence from a network that can reach the site), then run `pnpm verify`. Lessons whose quotes match become PREVIEW and their placement questions appear.
2. **Fill the 45 stubs** the same way: read the page, screen the passage against SYLLABUS 1.2, copy an exact quote (25 words or fewer), write the summary and 2–3 questions, `pnpm verify`. Then add Q9.
3. **Review the PREVIEW lessons** (49 now) against their sources and set `APPROVED` by hand.
4. **Deploy** with `docs/DEPLOY_VERCEL.md` (`main` now has everything).
