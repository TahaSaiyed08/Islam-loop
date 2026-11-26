# Decisions

Every place where the build brief left a choice open, or where the environment forced a different path. Newest sections last.

## What the base repo was (plain-English map)

`sanidhyy/duolingo-clone` (MIT) is a language-learning app: Next.js App Router with Clerk login, a Neon Postgres database through Drizzle, Stripe subscriptions, hearts, quests, a leaderboard and a react-admin panel. Its lesson screen (`app/lesson/*`) is a quiz with a progress bar, a footer with a check button and a result screen. Everything else (auth, database, payments, admin, mascot art, audio) was removed in Phase 1. What survived is the shadcn/ui button, dialog and progress primitives, the Tailwind setup, and the *shape* of the lesson flow (header with progress, choice cards, a check-then-continue footer). The lesson player itself was rewritten because the original is coupled to the database and to hearts.

## Environment and process

1. **Cloud session, not local.** The brief asks for a local session with plugins. This run is a cloud session, so Superpowers, Impeccable, GStack, Archify, HyperFrames, Understand Anything, Ponytail and the other plugins were not available. Their jobs were done directly: tests first, a root-cause approach to debugging, a manual design pass, an axe accessibility suite in place of Impeccable's audit, a manual security pass in place of `/cso`. One fresh-context subagent reviewed the Tier 1–3 content against the syllabus (the Phase 5 review gate); it found no P0 and its P1/P2 items were fixed.
2. **Network.** The cloud network blocked tanzil.net, api.alquran.cloud and al-islam.org. With the user's approval the environment allowlist was extended with those four hosts. Tanzil and Al Quran Cloud then worked. **Al-Islam.org answers automated clients with a Cloudflare challenge (HTTP 403, `cf-mitigated: challenge`).** I did not try to get around it. Consequence: no quote from Nahj al-Balagha, Al-Mizan or The Message could be verified here, so those lessons stay `DRAFT` (reason: "Not yet verified"), as rule 1 requires.
3. **Branch.** Work was pushed to `claude/the-roadmap-website-djd0th`, not `main`, because the session may push only to its development branch. Merge to `main` when ready.
4. **Push protection.** GitHub flagged `.env.example` line 22 of the upstream import (`sk_test_XXXX…`, a placeholder) as a secret. The file was deleted in Phase 1 anyway, so I removed it from the three *unpushed local* commits before the first push. No remote history was rewritten. The first commit therefore differs from upstream by one file.
5. **Stack versions.** Next.js 16, React 19, Tailwind 3.4 (kept from the base so `tailwind.config.ts` works as the brief describes), zod 4, TypeScript 5.9, pnpm 10 (the base pinned pnpm 11, which is not installed here).
6. **Fonts.** System font stacks only (a serif stack for quotes). No Google Fonts, so builds never need the network and the page sends no third-party requests.

## Content model

7. **Source roles.** Each source is `primary`, `family` or `cross`. A lesson stands on its primary sources. Family-note and cross-reference quotes are shown only if they themselves verified, so an unverified quote is never displayed even when the lesson is. `verification.quoteHashes` is aligned with `sources` and holds `null` for a source that did not verify.
8. **Hash guard.** A lesson that is not `DRAFT` is shown only if each primary quote still hashes to its recorded `quoteHashes` entry. Edit a quote after verifying and the lesson silently drops back to hidden.
9. **Family-note prose.** The syllabus family notes that *are* quotes (e.g. Saying 5 in 2.1.2) are stored as `family` sources, with a short lead-in in `familyNote`. If the quote is hidden and the lead-in ends in a colon, the note is hidden too. The Saying 125 note on 1.3.3 contains an ellipsis and so can never match a page as an exact substring; it is parked in `candidates` until it is split into two exact quotes.
10. **URLs.** The syllabus gives no per-page URLs. Al-Islam.org lessons use the book-level URLs from SYLLABUS 1.3. **A book index page does not contain the quote text, so these lessons will fail verification even on a machine that can read the site until each `url` is replaced with the exact chapter/page URL.** Qur'an sources link to `https://tanzil.net/#trans/en.qarai/<surah>:<ayah>`.
11. **Qur'an quotes** are clauses of 25 words or fewer, or complete verses, copied from the Qara'i file. Where the syllabus plan named a Sahifa supplication alongside a verse (4.2.2, 4.3.2, 5.3.1, 5.3.2) the lesson is built on the verse alone and the Sahifa passage is recorded in `candidates`, because no Sahifa text could be read.
12. **Stubs.** Tiers 4–10 lessons whose candidate source is not the Qur'an exist as `DRAFT` entries (title, objective, mechanic, candidate locator, no quote, no questions). Nothing was invented for them. Counting stubs, there are 120 lessons.
13. **8.3.3** "boss-style recap" has no matching mechanic in the schema; it uses `verse_decoder`.
14. **9.4.2 How This Site Checks Quotes** has no outside quote, so it is `siteOnly` and passes verification vacuously. Its text describes what this site actually does.
15. **Checkpoints.** A checkpoint's questions are generated at build time from its tier's visible lessons (round-robin, up to 5; pass mark 4 of 5, proportionally rounded up when fewer exist). A checkpoint with no verified lesson in its tier is hidden. The syllabus gives Tier 1–3 checkpoints their own Al-Islam.org quote; it is stored with role `cross`, so the checkpoint is visible without it and the quote appears once verified.
16. **Unlocking.** Lessons open in order inside a tier. A tier opens when the previous tier's checkpoint is passed; if that tier has no visible checkpoint, when all its visible lessons are done; if it has no visible lessons, immediately. Placement opens everything up to the start tier. Locked lessons are not gated by URL: anyone can open `/lesson/x.y.z` directly. That is deliberate for a free site with no accounts.
17. **Points and streak.** 10 points per question answered correctly on the first try. Completing a lesson counts for the daily streak (local calendar day). Wrong answers cost nothing.

## Placement quiz

18. A question is shown only if its lesson is visible **and every quote in that lesson is verified**. Q1–Q6 are all built on Al-Islam.org sources, so none can show yet.
19. To keep the quiz meaningful meanwhile, two Qur'an-based questions were added: **Q1b** (Tier 1, from 1.2.1) and **Q3b** (Tier 2, from 2.1.3). They are additions to the syllabus's 13.
20. **Q9 (Tier 6) does not exist.** Every Tier 6 lesson depends on an Al-Islam.org source, so there is no verified lesson to build it from. The quiz has 14 questions in the file and 8 are visible today (Q1b, Q3b, Q7, Q8, Q10–Q13).
21. **Scoring.** A tier is passed when every visible question in it is right. Tiers with no visible question are stepped over. The first missed tier stops the walk. Start tier = last passed tier + 1, capped at 10. Each question is tagged with its lesson's tier (so Q6, from lesson 1.4.3, counts toward Tier 1 although the syllabus calls it "Tier 5/10 readiness").

## Tooling

22. **Verifier page cache.** If a page cannot be fetched, save it by hand as `.cache/pages/<name>.html` (the verifier prints the exact name) and run `pnpm verify` again. It uses the saved file as the page, and the same exact-substring rule applies.
23. **Banned words** are matched as whole words, case-insensitively. `curse(s)` is included.
24. **Architecture diagram and demo video.** Archify and HyperFrames were unavailable. `docs/architecture.html` is hand-written and `docs/demo.mp4` was recorded with Playwright and encoded with ffmpeg.

## Rework (REWORK.md)

### Skills
25. **Installed as project skills in `.claude/skills/`** (licences kept): Superpowers (14 skills, prefixed `superpowers-`), Matt Pocock `research`, `handoff`, `improve-codebase-architecture`, Ponytail (`ponytail`, `-audit`, `-review`), Taste, Impeccable, UI UX Pro Max, Humanizer, six Marketing skills (seo-audit, ai-seo, schema, copywriting, copy-editing, cro), Understand-Anything (`understand`), Archify. Not copied: the rest of Matt Pocock's repo (only the three jobs named in PLAN.md), Impeccable's per-editor duplicates, GStack and HyperFrames (they need a desktop browser or native renderer). All ten repos cloned fine; GitHub was not blocked.
26. **They did not register as callable skills in this session** ("Unknown skill"), so I read their instruction files directly and followed them. **Taste was not run:** it is a builder for photo-led company sites with a browser gate, and its rules (one section per screen, real photographs, no captions) conflict with a fixed, ported app structure. **Impeccable's audit was done by hand** from `reference/audit.md`: axe (WCAG A/AA, 7 pages and every lesson state), a touch-target scan at 360px (fixed: menu button 24px, exit button 32px, mobile footer and header buttons 36px, footer links 20px, all now 44px), horizontal-overflow checks, focus and keyboard tests. Impeccable's `critique`, `adapt` and `polish` commands were not run as such.
27. Files over 1 MB were not removed from the skills (a first attempt deleted three script files by mistake and they were restored from the source repos).

### Network, again
28. Al-Islam.org is still unreadable. From the shell it is a Cloudflare challenge (HTTP 403). The WebFetch route (used through the `web-fetch` agent) fails earlier: `getaddrinfo ENOTFOUND` for both `al-islam.org` and `www.al-islam.org`, although both are on the environment's allowlist and the shell can reach them. That route evidently runs under a separate network policy that this session cannot change. I did not spoof headers, did not drive a browser through the challenge, and did not mark any quote verified without a check. So REWORK.md C2 and C3 (verify Al-Islam.org quotes, write the stubs) could not be done. `MANUAL_FETCH.md` lists every page and quote still to check.
29. **What was built for C2 anyway:** `pnpm verify` accepts WebFetch evidence from `content/webfetch-evidence.json` (`{slug, source, checkedAt, confirmations, evidence}`). A record counts only if `confirmations` is at least 2 and the evidence sentence contains the quote exactly once after whitespace and quote-mark normalisation. A passing lesson gets `verification.method = "webfetch"` and the sentence in `verification.evidence`. Six unit tests cover it, and the wiring was proved in a throwaway copy of the repo (a two-confirmation record unlocked a lesson, a one-confirmation record was rejected). No evidence records exist in the real repo.
30. **C1 URLs applied:** every non-Qur'an source now carries the exact page URL from REWORK.md (32 sources). No quote text changed. Sahifa and Maqtal have no URL yet (no lesson with those sources has been written; they are stubs).

### Ported upstream files (B1/B2)
All from the "Initial import from sanidhyy/duolingo-clone" commit. Mapped colours: upstream green becomes brand teal, sky becomes teal tints or sand, orange becomes sand. Fonts stay system fonts (decision 6).

| Upstream | Now | What changed |
|---|---|---|
| `app/(main)/layout.tsx` | same path | Kept as is; added a skip link and `id="main"`. |
| `components/sidebar.tsx` | same | Clerk `UserButton` and the mascot removed; our mark and name; five items (Learn, Find my level, Sources, About, Settings); credit block ("Free and non-commercial", "Based on sanidhyy/duolingo-clone (MIT)") where the user button was; `nav` landmark. |
| `components/sidebar-item.tsx` | same | Image icons replaced by lucide icons, passed by name so the sidebar stays a server component; `aria-current`. |
| `components/mobile-header.tsx`, `mobile-sidebar.tsx` | same | `bg-green-500` to `bg-brand`; menu button given a 44px target, an accessible name and a hidden sheet title. **Extra:** site name and a streak/points readout (`mobile-stats.tsx`), because the right column is desktop only. |
| `components/feed-wrapper.tsx` | same | Unchanged. |
| `components/sticky-wrapper.tsx` | same | Added a `data-testid` only. |
| `components/user-progress.tsx` | same | Course picker and hearts removed; streak and points from the ProgressStore. |
| `components/promo.tsx` | same | "Upgrade to Pro" became the "Find my level" card. |
| `components/quests.tsx` | same | Quests became the "Your tier" card (`TierCard`). |
| `app/(main)/learn/header.tsx` | same | Back arrow removed; one sticky header per tier; top offset for the mobile bar. |
| `app/(main)/learn/unit-banner.tsx` | same | Teal banner; "Continue" opens the unit's next open lesson (hidden if none); small "Preview" chip. |
| `app/(main)/learn/unit.tsx` | same | Database types removed; states come from the unlock logic. **The zigzag index continues across a tier's units** (upstream restarts at 0 in each unit). With few lessons open per unit, restarting would give Tier 1 only two offsets. |
| `app/(main)/learn/lesson-button.tsx` | same | Same zigzag (cycle 8, 40px), 70px round `border-b-8` buttons, Start bubble and progress ring. Lesson id became a slug; the checkpoint gets the Crown; the ring shows the unit's share finished; locked buttons are not focusable; accessible names; `motion-reduce` on the bounce. |
| `app/(main)/learn/page.tsx` | `page.tsx` + `learn-view.tsx` | Server page builds the data from the catalog; the client view reads progress and composes the ported pieces. |
| `components/ui/button.tsx` | same | Every variant and the 3D press kept; colours mapped (secondary teal, primary sand, danger rose-600 for contrast). `super*` recoloured though unused. |
| `components/ui/progress.tsx`, `sheet.tsx`, `dialog.tsx` | same | Colours only. |
| `app/lesson/layout.tsx`, `question-bubble.tsx` | same | Layout unchanged; the mascot is our mark; the bubble carries the lesson's hook. |
| `app/lesson/header.tsx` | same | Hearts removed; the X is a real 44px button. |
| `app/lesson/quiz.tsx` | same | Same none/correct/wrong flow, `onNext`, `onContinue`, percentage bar, finish screen with confetti and result cards. Server actions, hearts, hearts modal and audio removed; a wrong answer shows the right one and moves on; completion goes to the ProgressStore; confetti uses site colours and is off for reduced motion. The finish screen adds the summary and family note. |
| `app/lesson/challenge.tsx`, `card.tsx` | same | Two types added in the same shell: SOURCE (quote card) and ORDER (tap to order). Audio and images removed; keyboard access (role, tabIndex, Space) added; answer text 16px+; options use one column because they are sentences. |
| `app/lesson/footer.tsx` | same | Texts "Well done." and "The correct answer is shown above."; Enter shortcut kept but no longer double-fires when a button has focus; sticky; buttons are at least 44px. |
| `app/lesson/result-card.tsx` | same | Variants are points and score ("Lesson complete"); icons are lucide. |
| `components/modals/exit-modal.tsx`, `practice-modal.tsx`; `store/use-exit-modal.ts`, `use-practice-modal.ts` | same | Wording and mark changed; `isClient` state replaced by a hydration hook. Practice opens when a lesson is already finished. |
| `app/(marketing)/layout.tsx`, `header.tsx`, `footer.tsx`, `page.tsx` | same | Clerk, banner, login and GitHub icon removed; Sources and About links; the language buttons became the credit line; the hero image became an original SVG (`hero-illustration.tsx`); our copy and buttons. |
| `app/layout.tsx`, `app/globals.css` | same | Clerk, toaster, hearts modal and Nunito removed; exit and practice modals mounted; `h-full` restored; theme tokens kept. |

**Not ported (not applicable):** `db/`, `actions/`, hearts modal, banner, the courses, shop, quests and leaderboard pages, all audio, all upstream images. The placement quiz is new but built entirely from the ported shell (`Header`, `Challenge`, `Footer`, `ResultCard`).

## Duolingo-style pass ("try again")

31. **Style, not brand.** The request was to match Duolingo's style. CLAUDE.md rule 4 bans Duolingo's name, owl, colours, sounds, fonts and art, so the pass copies the *system* (white canvas, grey scale, rounded heavy type, sinking 3D buttons, per-unit colours on the path, feedback bar layout, stat cards) and keeps our own hues, font, icons and mark. The neutral greys are generic and shared with many apps.
32. **Font:** Nunito, self-hosted via `@fontsource-variable/nunito`. It is what upstream used and is not Duolingo's font. Self-hosting keeps builds offline-safe.
33. **Palette** chosen by measured contrast (DESIGN.md): text colours reach 4.5:1, bright fills (path nodes) 3:1. Duolingo's own white-on-green fails AA; ours does not.
34. **Press mechanics:** upstream's `active:border-b-0` made buttons *shrink* (the face stayed put and everything below jumped up 4px). The face now sinks via a transparent top border, the way the real app feels. A test holds a node down and checks the node below does not move.
35. **Feedback** moved the one-line explanation from under the cards into the coloured footer, next to the verdict, as in the real app.
36. **Mobile bar** is white with the streak and points, matching Duolingo's mobile web; still the upstream structure (fixed 50px bar, sheet menu).
37. **Bug found and fixed:** unit colour classes live in `lib/unit-theme.ts`, but Tailwind only scanned `app/` and `components/`, so every unit banner rendered white text on white. All tests had passed, because none checked a computed colour. `lib/` is now scanned, and a regression test checks every banner has a colour and 4.5:1 text.
38. **Active sidebar item** text moved from brand teal to the deeper teal ink: axe measured 4.44:1 on the pale fill.
39. **Al-Islam.org is still unreachable** in this session: the WebFetch route still fails with `getaddrinfo ENOTFOUND al-islam.org`. Content is unchanged.

## `clone-website` extraction pass

40. **Skill installed locally:** Copied `JCodesMore/ai-website-cloner-template`'s `clone-website` skill (`SKILL.md`, `references/`, `LICENSE`) into `.agents/skills/clone-website/` and `.claude/skills/clone-website/`, audited as markdown-only, and updated `CLAUDE.md` rule 4 + `AGENTS.md`.
41. **Measured Duolingo extraction:** Inspected `https://www.duolingo.com` public landing, guest lesson (`/lesson`), and exit-lesson modal via headless Chromium at `1280px` and `360px` (`docs/research/duolingo/BRIEF.md`). Applied exact measurements: `50px` primary/CTA button height, `0.8px` uppercase tracking, `12px` answer card radius with `24px` desktop padding and `19px` option text, `32px/40px` lesson heading, `140px` feedback bar with `24px/30px` verdict and `17px` Continue CTA, and `400px` / `20px`-radius modals.
42. **Brand fidelity (Rule 4):** Kept The Roadmap's own brand palette (`DESIGN.md` teal, sand, unit colours), Nunito font, original icons, and zero sound effects (removed the temporary Web Audio sounds and green/sky palette from earlier commit `93b166d`).
43. **Logged-in `/learn` boundary:** `https://www.duolingo.com/learn` redirects unauthenticated guests back to onboarding; `/learn` retains the existing ported geometry plus the new `DailyQuests` rail card and `MobileBottomNav` tab bar until a signed-in capture is provided.

