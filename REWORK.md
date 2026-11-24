# REWORK: Restore the Duolingo-style structure and finish all content

Applies to this repo, branch `claude/the-roadmap-website-djd0th`. The first run built a working site but **rebuilt the UI from scratch** instead of reusing the upstream lesson UI, and it ran where Al-Islam.org could not be read. This rework fixes both. `PLAN.md` and `SYLLABUS.md` still apply except where this file is more specific.

Goal line: complete every step of this file. Done when: the UI acceptance tests in B4 pass; `pnpm lint`, `pnpm test`, `pnpm verify`, `pnpm build` and `pnpm test:e2e` all exit 0; every Al-Islam.org lesson has an exact page URL and a verify result; and the branch is merged into `main` and pushed. Never edit a quote to make it pass. Stop after 200 turns and write `REWORK_REPORT.md` with what remains.

## A2. First things in this session

1. Save this file as `REWORK.md` and commit it.
2. Install skills as project skills inside `.claude/skills/` (this is a cloud session, so app plugins are not available). Clone each skill repo with `git clone --depth 1` into a temp folder and copy its skill folders, keeping each repo's LICENSE inside its skill folder: `obra/superpowers` (its `skills/`), `mattpocock/skills`, `DietrichGebert/ponytail`, `Leonxlnx/taste-skill`, `pbakaus/impeccable`, `nextlevelbuilder/ui-ux-pro-max-skill`, `blader/humanizer`, `coreyhaines31/marketingskills` (only seo-audit, ai-seo, schema, copywriting, copy-editing, cro), `Egonex-AI/Understand-Anything`, `tt-a1i/archify`. Commit as "Add project skills". Skip anything that needs a desktop browser or native app (GStack's browser, HyperFrames rendering); use Playwright for browser QA. Record what was skipped in `DECISIONS.md`.
3. If GitHub, npm or a skill repo is blocked, record it in `DECISIONS.md` and continue.

## B. Restore the upstream UI (port it, don't rebuild it)

### B1. The rule

The learning UI must be the upstream `sanidhyy/duolingo-clone` components, adapted, not new designs. Get the originals from this repo's history (`git show faa45df:<path>`, the "Initial import from sanidhyy/duolingo-clone" commit) or a fresh clone. For each file: copy it back, then change **only**:

- the data source (static content and `ProgressStore` instead of Clerk, Drizzle and server actions);
- hearts, subscription and shop code (remove it);
- colours (map to our theme tokens; no Duolingo green, no "Lingo", no mascot);
- the extras listed in B2.

Keep structure, class names, sizes, spacing and interaction logic. In `DECISIONS.md`, list every upstream file ported and what changed.

### B2. Components to port

| Upstream file | Becomes | Keep | Change |
|---|---|---|---|
| `app/(main)/layout.tsx` | main layout | Fixed left sidebar (256px) on desktop, mobile header below `lg`, `lg:pl-[256px]`, `max-w-[1056px]` | none |
| `components/sidebar.tsx`, `sidebar-item.tsx`, `mobile-header.tsx`, `mobile-sidebar.tsx` | the sidebar | Layout, item style, `sidebar`/`sidebarOutline` variants, mobile sheet | Our logo and name. Items: Learn, Find my level, Sources, About, Settings. Remove `UserButton`. |
| `components/feed-wrapper.tsx`, `sticky-wrapper.tsx` | same | Two-column learn page: `flex flex-row-reverse gap-[48px]`, right column 368px, sticky | none |
| `components/user-progress.tsx` | stats bar in the right column | Layout | Streak and points from `ProgressStore`. No hearts, no course picker. |
| `components/promo.tsx`, `quests.tsx` (layout only) | two right-column cards | Card styling | "Your tier" card (current tier and checkpoint progress) and a "Find my level" card linking to the placement quiz |
| `app/(main)/learn/header.tsx` | sticky tier header | Sticky header style | Shows the current tier: "Tier 1 · Architecture of Meaning" |
| `app/(main)/learn/unit-banner.tsx` | unit banner | Coloured banner with title, description and a "Continue" button | Banner colour from our theme. Small "Preview" chip if any lesson in the unit is PREVIEW. |
| `app/(main)/learn/unit.tsx`, `lesson-button.tsx` | the lesson path | **The zigzag path exactly**: `cycleLength = 8`, indentation x 40px, 70px round 3D buttons with `border-b-8`, Star/Check/Crown icons, the current lesson wrapped in `CircularProgressbarWithChildren` with the bouncing "Start" bubble | `href` = `/lesson/[slug]`. Locked/current/completed from `ProgressStore` and the unlock logic. The tier checkpoint uses the Crown icon. |
| `components/ui/button.tsx` | the button | Every `cva` variant, the 3D `border-b-4 active:border-b-0` press, uppercase bold | Colours only: `secondary` becomes brand teal (darker teal border); `primary` becomes our accent; `locked` stays neutral; `danger` stays rose |
| `app/lesson/layout.tsx`, `header.tsx` | lesson header | Exit X and progress bar | Remove hearts display |
| `app/lesson/quiz.tsx` | the lesson player | `status` none/correct/wrong flow, `onContinue`, `onNext`, percentage bar, finish screen with `react-confetti` and `ResultCard`s | Replace server actions with `ProgressStore.markComplete` and `addPoints`. Remove hearts, `reduceHearts`, hearts modal, audio. A wrong answer shows the correct one and continues. |
| `app/lesson/question-bubble.tsx` | question bubble | Speech-bubble layout | Our logo mark replaces the mascot |
| `app/lesson/challenge.tsx`, `card.tsx` | answer cards | Grid layout, number shortcuts (1-3), selected/correct/wrong styles | Add two challenge types in the same shell: **SOURCE** (large source card with quote, citation, "Read the full text" link; button "Continue") and **ORDER** (tap-to-order, same Card style) |
| `app/lesson/footer.tsx` | lesson footer | Check/Continue/Retry button, green/rose bars, Enter shortcut | Our colours. Correct: "Well done." Wrong: "The correct answer is shown above." |
| `app/lesson/result-card.tsx` | finish cards | Layout | Points earned and "Lesson complete" |
| `components/modals/exit-modal.tsx`, `practice-modal.tsx`, `store/use-exit-modal.ts`, `use-practice-modal.ts` | exit and practice dialogs | As they are | Our wording |

Also: the placement quiz runs inside the same lesson player shell (Header, Challenge, Footer, results screen from `ResultCard`), not a separate page. Landing page: port the upstream `app/(marketing)` page and header layout, with our copy and logo and a simple original illustration. Remove the hand-built learn page and lesson player once the ported ones work. Keep `lib/content.ts`, `lib/progress.ts`, unlock and placement logic, the verifier, and every test.

### B3. Design pass

After porting, run Taste, then Impeccable critique/audit/adapt/polish. Fix P0/P1 findings without changing the B2 structure.

### B4. UI acceptance tests (Playwright; all must pass)

1. At 1280px the sidebar is visible at x < 260 and the learn page has a right column of about 368px with the streak and points.
2. Tier 1's path has at least 3 round lesson buttons (width equals height, about 70px) and at least 3 different horizontal offsets (the zigzag).
3. The current lesson shows the "Start" bubble and a circular progress ring. Locked lessons cannot be clicked.
4. At 360px the sidebar is hidden, the mobile header shows, and the path renders.
5. In a lesson: `1` selects option 1, `Enter` checks, and the footer turns green or rose with the right text. The finish screen shows the confetti canvas and result cards.
6. The placement quiz uses the same footer and Check button as lessons.
7. Screenshots of `/learn` and one lesson at 1280px and 360px are saved in `docs/screenshots/` and linked in `REWORK_REPORT.md`.

## C. Finish the content

### C1. Exact page URLs

- Nahj al-Balagha, all 480 sayings (one page): `https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/selections-sayings-and-preaching-amir-al-muminin-ali`
- Nahj Sermon 1: `https://al-islam.org/nahjul-balagha-part-1-sermons/sermon-1-praise-due-allah-whose-worth-cannot-be-described`
- Nahj Letter 31: `https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/letter-31-advice-one-his-sons-after-returning-battle`
- Nahj Letter 53: `https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/letter-53-order-malik-al-ashtar`
- Al-Mizan Vol. 1, al-Fatiha: `https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/surah-al-fatiha-verses-1-5`
- Al-Mizan Vol. 1, Foreword: `https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/foreword`
- The Message, Ch. 9: `https://al-islam.org/message-jafar-subhani/chapter-9-sheperd-merchant`
- The Message, Ch. 17: `https://al-islam.org/message-jafar-subhani/chapter-17-first-migration`
- The Message, Ch. 23: `https://al-islam.org/message-jafar-subhani/chapter-23-journey-taif`
- The Message, Ch. 28 (screen first): `https://al-islam.org/message-jafar-subhani/chapter-28-events-second-year-migration`
- The Message, Ch. 55: `https://al-islam.org/message-jafar-subhani/chapter-55-prophet-mourning-his-son`
- Sahifa and Maqtal: open the book's contents page and follow links to the exact chapter or supplication page. Record each URL in `DECISIONS.md`.

Put the exact page URL in every lesson's `sources[].url`, replacing book index pages.

### C2. Verifying Al-Islam.org quotes from a cloud session

The verifier script cannot load Al-Islam.org from here (Cloudflare challenge). Do not spoof headers or get round it. Use the WebFetch route instead:

1. For each Al-Islam.org quote, WebFetch the exact page URL with the prompt: "Does this exact text appear on the page, word for word? Answer YES or NO. If YES, quote the full sentence that contains it, exactly as written." Include the quote. For long pages use `offset` to read on until found or the page ends.
2. A quote passes only if **two separate WebFetch calls** both answer YES, and the returned sentence contains the quote exactly once whitespace and quote marks are normalised.
3. Store the result in the lesson's `verification`: `method: "webfetch"`, `checkedAt`, `evidence` (the returned sentence) and `quoteHashes`.
4. Update `pnpm verify` to accept `method: "webfetch"` records whose evidence contains the quote, and keep re-checking Qur'an quotes against the Tanzil file. Add tests for both.
5. A quote that fails or cannot be found stays DRAFT and is logged. Never reword it.
6. In `REWORK_REPORT.md`, list which lessons passed by script and which by WebFetch, so Taha knows which to spot-check first.

### C3. Write the 46 stubs and unlock the hidden lessons

1. For every DRAFT lesson, open its exact source page and follow SYLLABUS.md Part 2 and PLAN.md: screen the passage, copy an exact quote, write a summary limited to what the page says, write 2-3 questions.
2. Run `pnpm verify`. Lessons that pass become PREVIEW.
3. Restore placement Q1-Q6 once their lessons verify. Add Q9 (Tier 6) from a verified Tier 6 lesson.
4. Review gate per tier: a fresh subagent re-opens 3 random source pages, confirms the quotes, and checks summaries for unsupported claims.

## D. Finish

1. Run `pnpm lint && pnpm test && pnpm verify && pnpm build && DEPLOY_TARGET=static pnpm build && pnpm test:e2e`. All must exit 0.
2. Playwright QA on the built site (each page, each lesson type, desktop and phone width); fix what it finds.
3. Merge the branch into `main` and push `main`. **Do not deploy.**
4. Write `REWORK_REPORT.md`: every ported upstream file and what changed; acceptance test results and screenshots; a lesson table (slug | status | verify result | reason if DRAFT); any URLs left in `MANUAL_FETCH.md`; Taha's next steps (review PREVIEW lessons and set APPROVED, then deploy with `docs/DEPLOY_VERCEL.md`).
