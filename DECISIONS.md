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
