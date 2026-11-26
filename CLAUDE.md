# The Roadmap: instructions for Claude Code

A free, non-commercial site for learning Islam through the Qur'an and the teachings of the Prophet and his family. Next.js App Router, TypeScript, Tailwind, zod, zustand, Vitest, Playwright. No login, no database.

## Rules that override everything

1. **Content accuracy first** (SYLLABUS.md Part 1). Never write, paraphrase or "fix" a quote. Copy it from the source page, or from `content/sources/en.qarai.txt` for Qur'an verses. A quote that fails verification leaves its lesson `DRAFT` and is logged. You may set `PREVIEW` only after `pnpm verify` passes. **Never set `APPROVED`**: only Taha does.
2. **Framing and exclusions** (SYLLABUS.md 1.2). `lib/banned.ts` holds the banned words; the e2e crawl scans every page.
3. **Free:** no payments, donations, ads or sign-up walls.
4. **Branding:** Match Duolingo's layout, spacing, sizing, radii, shadows, motion and interactions as exactly as you can (use the clone-website skill). Keep our own brand: no Duolingo name, logo, owl or other mascot art, colours, fonts, sounds, images or copy. When the skill says to use the source's real assets, map them to our tokens in DESIGN.md (palette, Nunito, our own icons) instead.
5. **Licence:** keep the MIT `LICENSE`. Credit "Based on sanidhyy/duolingo-clone (MIT)" in the README and footer.
6. **Attribution:** every quote shows book · locator · translator, with a link. Qur'an quotes say "Qara'i translation, via Tanzil" and link tanzil.net.
7. **Git:** commit after each step. Never commit secrets, never force-push, never change repo settings, never deploy.
8. **Keep state:** keep `PROGRESS.md` and `DECISIONS.md` current. After a compaction or resume, read both first.
9. **Debugging:** find the root cause. After 3 failed attempts on one problem, log it in `FINAL_REPORT.md` under "Open issues" and move on. Never delete or skip tests, never weaken the verifier.
10. **Keep it simple.** No features beyond PLAN.md and SYLLABUS.md.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm lint` | ESLint + `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm verify` | Check every quote against its source; rewrites `content/tier-*.json` statuses and `docs/verify-report.md` |
| `pnpm build` | Normal Next.js build (Vercel-ready) |
| `pnpm build:static` | Static export to `out/` (`DEPLOY_TARGET=static`, optional `BASE_PATH`) |
| `pnpm test:e2e` | Playwright against `pnpm start` (build first) |

## Layout

`content/` lessons (JSON) + `schema.ts` + `sources/` · `lib/content.ts` visibility rules · `lib/progress.ts` the `ProgressStore` interface · `lib/path.ts` unlocking · `lib/placement.ts` · `scripts/verify-*.ts` the verifier · `app/lesson/` the ported quiz shell (`quiz.tsx`), `app/(main)/learn/` the ported path · `e2e/` Playwright.

When compacting, keep PROGRESS.md status and the list of modified files.
