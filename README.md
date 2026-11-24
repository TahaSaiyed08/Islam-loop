# The Roadmap

A free, non-commercial website for learning Islam through the Qur'an and the teachings of the Prophet Muhammad and his family. Lessons are short and sit along a path of ten tiers. Each one rests on a single quote from a named source, followed by two or three questions. There are no accounts, no database, no ads and no payments. Progress stays in the learner's own browser.

Every quote is copied from its source and checked by a script. A lesson whose quote does not match stays hidden.

## Where things stand

- 120 lessons are planned across 10 tiers. They all exist in `content/`.
- 49 are visible today, all marked "Preview — under review". They are the lessons built on the Qur'an (checked against the Qara'i translation file), plus tier checkpoints.
- 71 are hidden `DRAFT`. 25 of those are fully written but wait for verification, because their sources are on Al-Islam.org, which blocks automated readers. The other 46 are stubs: title, objective and a candidate source, with no quote yet.
- Nothing is `APPROVED`. Only a person sets that, after reading a lesson against its source.

See `docs/verify-report.md` for the latest verification run, `REWORK_REPORT.md` for the current lesson table, and `MANUAL_FETCH.md` for what still needs checking against Al-Islam.org.

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Other commands:

| Command | What it does |
|---|---|
| `pnpm lint` | ESLint and a TypeScript check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm verify` | Check every quote against its source |
| `pnpm build` | Production build |
| `pnpm build:static` | Static export into `out/` |
| `pnpm test:e2e` | Browser tests (Playwright). Run `pnpm build` first |

Node 22 or newer and pnpm are needed.

## Verifying quotes

```bash
pnpm verify
```

For Qur'an quotes it looks inside `content/sources/en.qarai.txt` (Ali Quli Qara'i's translation, downloaded from Tanzil). For everything else it fetches the lesson's source page (at most one request a second, cached in `.cache/`), strips the HTML, and requires the quote to appear as an exact substring. Only spacing, curly versus straight quotation marks and non-breaking spaces are ignored.

A quote that passes moves its lesson to `PREVIEW`. A quote that fails sends it back to `DRAFT`, and the script prints the slug, the locator, the expected quote and the closest match on the page.

If a site refuses the script (Al-Islam.org currently does), open the page in your browser, save it as HTML, and put it at the path the script prints (`.cache/pages/<name>.html`). Run `pnpm verify` again and it will use your file. Each Al-Islam.org lesson's `url` also needs to be the exact page that holds the quote, not the book's index page.

## Adding a lesson

1. Add the lesson to the right `content/tier-N.json`. Copy the quote exactly from the source. The shape is checked by `content/schema.ts`.
2. Run `pnpm verify`. If the quote matches, the lesson becomes `PREVIEW`.
3. Read the lesson against its source. When you are satisfied, change its `status` to `APPROVED` by hand.
4. Run `pnpm lint && pnpm test && pnpm build`, then commit.

The rules every lesson follows are in `SYLLABUS.md` (Part 1).

## Folder map

```
app/(marketing)/     Landing page (ported from the upstream marketing layout)
app/(main)/          Sidebar layout: learn (zigzag path), sources, about, settings
app/lesson/          The lesson quiz shell (ported): header, challenge, card, footer, quiz
app/placement/       The placement quiz, built from the same shell
components/          Sidebar, mobile header, right-column cards; ui/ the base button, dialog, sheet, progress
content/             tier-1.json … tier-10.json, placement.json, schema.ts, sources/ (Qara'i file)
lib/content.ts       Which lessons may be shown (never DRAFT; hash guard)
lib/progress.ts      The ProgressStore interface and its localStorage implementation
lib/path.ts          Lesson and tier unlocking
lib/placement.ts     Placement scoring
lib/banned.ts        Words that must never appear on the site
scripts/             The quote verifier
store/               The small zustand store the UI uses for progress
e2e/, tests/         Playwright and Vitest tests
docs/                Deploy guide, architecture diagram, demo video, verification report
```

## Deploying

See `docs/DEPLOY_VERCEL.md`. The default build works on Vercel with no settings. `DEPLOY_TARGET=static pnpm build` writes a static site to `out/`.

## Sources and licences

- Code: MIT (see `LICENSE`). Based on [sanidhyy/duolingo-clone](https://github.com/sanidhyy/duolingo-clone) (MIT). All Duolingo-style branding, mascots, sounds, login, database and payments were removed.
- Qur'an text: Ali Quli Qara'i's English translation, via [Tanzil](https://tanzil.net). Tanzil's text is licensed CC BY 3.0 and must not be changed; its translations are for non-commercial use only.
- Al-Islam.org content (Nahj al-Balagha, Al-Sahifa al-Sajjadiyya, Al-Mizan, The Message, Maqtal al-Husayn) is used for non-commercial purposes with the permission of its copyright holders. This site stays free.

The site does not give rulings on how to practise. For practice, learn from a qualified teacher.
