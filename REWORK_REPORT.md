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
| `pnpm test:e2e` | 37 passed |

## Duolingo-style pass

After the port, a second pass matched the real app's feel without its brand: white canvas, Nunito, sinking 3D buttons, per-unit colours on the path, feedback in the coloured bar, stat cards on the finish screen. It found and fixed a real bug: the unit banners were rendering white-on-white because Tailwind was not scanning `lib/`. Details are in DECISIONS 31–39 and DESIGN.md; two new e2e tests guard the banner colours and the press mechanics.

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
| 1.1.1 | PREVIEW | pass: script, Qara'i file |  |
| 1.1.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 1.2.1 | PREVIEW | pass: script, Qara'i file |  |
| 1.2.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.2.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.3.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.3.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.3.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.4.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.4.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 1.4.3 | PREVIEW | pass: script, Qara'i file (unverified family/related quote hidden) |  |
| 2.1.1 | PREVIEW | pass: script, Qara'i file |  |
| 2.1.2 | PREVIEW | pass: script, Qara'i file (unverified family/related quote hidden) |  |
| 2.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 2.2.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 2.2.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 2.2.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 2.3.1 | PREVIEW | pass: script, Qara'i file |  |
| 2.3.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 2.3.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 2.4.1 | PREVIEW | pass: script, Qara'i file |  |
| 2.4.2 | PREVIEW | pass: script, Qara'i file (unverified family/related quote hidden) |  |
| 2.4.3 | PREVIEW | pass: script, Qara'i file (unverified family/related quote hidden) |  |
| 3.1.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.1.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.1.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.2.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.2.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.2.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.3.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.3.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.3.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.4.1 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.4.2 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 3.4.3 | DRAFT | not verified (source unreachable) | Page not readable from the cloud session; see MANUAL_FETCH.md |
| 4.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 4.1.2 | PREVIEW | pass: script, Qara'i file |  |
| 4.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 4.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 4.2.2 | PREVIEW | pass: script, Qara'i file |  |
| 4.2.3 | PREVIEW | pass: script, Qara'i file |  |
| 4.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 4.3.2 | PREVIEW | pass: script, Qara'i file |  |
| 4.3.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 4.4.1 | PREVIEW | pass: script, Qara'i file |  |
| 4.4.2 | PREVIEW | pass: script, Qara'i file |  |
| 4.4.3 | PREVIEW | pass (tier has verified lessons) |  |
| 5.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 5.1.2 | PREVIEW | pass: script, Qara'i file |  |
| 5.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 5.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 5.2.2 | PREVIEW | pass: script, Qara'i file |  |
| 5.2.3 | PREVIEW | pass: script, Qara'i file |  |
| 5.3.1 | PREVIEW | pass: script, Qara'i file |  |
| 5.3.2 | PREVIEW | pass: script, Qara'i file |  |
| 5.3.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 5.4.1 | PREVIEW | pass: script, Qara'i file |  |
| 5.4.2 | PREVIEW | pass: script, Qara'i file |  |
| 5.4.3 | PREVIEW | pass (tier has verified lessons) |  |
| 6.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.1.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.1.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.2.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.2.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.3.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.3.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.4.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.4.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 6.4.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.1.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.1.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.2.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.2.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.3.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.3.3 | PREVIEW | pass: script, Qara'i file |  |
| 7.4.1 | PREVIEW | pass: script, Qara'i file |  |
| 7.4.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 7.4.3 | PREVIEW | pass (tier has verified lessons) |  |
| 8.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 8.1.2 | PREVIEW | pass: script, Qara'i file |  |
| 8.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 8.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 8.2.2 | PREVIEW | pass: script, Qara'i file |  |
| 8.2.3 | PREVIEW | pass: script, Qara'i file |  |
| 8.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 8.3.2 | PREVIEW | pass: script, Qara'i file |  |
| 8.3.3 | PREVIEW | pass: script, Qara'i file |  |
| 8.4.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 8.4.2 | PREVIEW | pass: script, Qara'i file |  |
| 8.4.3 | PREVIEW | pass (tier has verified lessons) |  |
| 9.1.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.1.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.1.3 | PREVIEW | pass: script, Qara'i file |  |
| 9.2.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.2.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.2.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.3.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.3.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.4.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 9.4.2 | PREVIEW | pass (no outside quote) |  |
| 9.4.3 | PREVIEW | pass (tier has verified lessons) |  |
| 10.1.1 | PREVIEW | pass: script, Qara'i file |  |
| 10.1.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 10.1.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 10.2.1 | PREVIEW | pass: script, Qara'i file |  |
| 10.2.2 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 10.2.3 | PREVIEW | pass: script, Qara'i file |  |
| 10.3.1 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 10.3.2 | PREVIEW | pass: script, Qara'i file |  |
| 10.3.3 | DRAFT | not run (no quote yet) | No quote yet: source page not read; see MANUAL_FETCH.md |
| 10.4.1 | PREVIEW | pass: script, Qara'i file |  |
| 10.4.2 | PREVIEW | pass: script, Qara'i file |  |
| 10.4.3 | PREVIEW | pass (tier has verified lessons) |  |

Totals: 49 PREVIEW, 0 APPROVED, 71 DRAFT. Placement: 8 of 14 questions visible (Q1b, Q3b, Q7, Q8, Q10–Q13). Q1–Q6 stay hidden until their lessons verify; Q9 (Tier 6) cannot be written until a Tier 6 lesson is verified.

## Manual fetch list

`MANUAL_FETCH.md` (10 pages, 32 quotes, 45 stubs). Sahifa and Maqtal have no exact URLs yet; follow each book's contents page.

## Taha's next steps

1. **Unlock Al-Islam.org lessons.** Save each of the 10 pages from `MANUAL_FETCH.md` into `.cache/pages/` under the file name shown (or add two-confirmation WebFetch evidence from a network that can reach the site), then run `pnpm verify`. Lessons whose quotes match become PREVIEW and their placement questions appear.
2. **Fill the 45 stubs** the same way: read the page, screen the passage against SYLLABUS 1.2, copy an exact quote (25 words or fewer), write the summary and 2–3 questions, `pnpm verify`. Then add Q9.
3. **Review the PREVIEW lessons** (49 now) against their sources and set `APPROVED` by hand.
4. **Deploy** with `docs/DEPLOY_VERCEL.md` (`main` now has everything).
