# Final report

**Repo:** https://github.com/TahaSaiyed08/Islam-loop, branch `claude/the-roadmap-website-djd0th` (not merged to `main`).
**Deployed:** no. The code is ready for Vercel (`docs/DEPLOY_VERCEL.md`).

## The short version

The whole site is built and every check is green. But **only 49 of the 120 lessons are visible**, because Al-Islam.org blocks automated readers and the verifier cannot confirm any quote from Nahj al-Balagha, Al-Mizan or The Message from this environment. Those lessons are written and waiting, not lost. Per the content rules, a quote that has not been verified is not shown. Section "Taha's next steps" says how to unlock them.

## Test counts

| Check | Result |
|---|---|
| `pnpm lint` (ESLint + `tsc`) | exit 0 |
| `pnpm test` (Vitest) | 64 passed in 5 files |
| `pnpm verify` | exit 0. 49 PREVIEW, 0 APPROVED, 71 DRAFT. 44 Qur'an quotes checked, 0 mismatches |
| `pnpm build` | exit 0, 60 static pages |
| `DEPLOY_TARGET=static pnpm build` | exit 0, `out/` produced; also checked with `BASE_PATH=/roadmap` (links and assets carry the prefix) |
| `pnpm test:e2e` (Playwright) | 25 passed |
| `pnpm audit --prod`, `depcheck` | no vulnerabilities, no unused dependencies |

The e2e suite covers: landing without console errors; placement to the end and landing on the computed tier; a lesson played through and still complete after a reload; a checkpoint fail and pass unlocking the next tier; an order (timeline) question; points and streak; reset with an in-page confirmation; blocked localStorage; PREVIEW labels; every source link absolute https with `rel="noopener"`; a crawl from `/` with no 404s and no banned words; 360px and desktop overflow; axe WCAG 2 A/AA on every page and on each lesson state; keyboard-only play.

## What was built, phase by phase

0. **Setup.** Base repo imported (MIT, credited). Upstream funding, workflow and policy files removed.
1. **Strip.** Stripe, hearts, quests, leaderboard, admin, Clerk, Neon/Drizzle, language courses, audio and mascot all gone. No match for those words remains in the source.
2. **Pipeline.** `content/schema.ts` (zod), `lib/content.ts` (never returns DRAFT; hash guard), `lib/progress.ts` (`ProgressStore` + `LocalProgressStore`), `scripts/verify-content.ts`, banned-words matcher. Tests were written alongside each piece.
3. **Brand.** Teal and sand design system (`DESIGN.md`), original mark, landing page, footer with the MIT credit.
4. **Learning experience.** Path grouped by tier and unit, lesson player (intro, source cards, select and tap-to-order questions, end screen with "Practise again"), checkpoints (4 of 5), placement quiz, points, daily streak, "Continue where you left off", reset in Settings, Sources, About, 404, PREVIEW labels.
5. **Tiers 1–3.** All 36 lessons and the placement questions loaded from the syllabus.
6. **Tiers 4–10.** The 84 lessons exist. The ones built on the Qur'an are fully written and verified. The rest are DRAFT stubs with a candidate source and no quote (nothing was invented).
7. **Build and tests.** Normal and static builds, Playwright suite.
8. **Security.** No tracked secrets, no `.env` files, security headers on the normal build, the one `dangerouslySetInnerHTML` is JSON-LD with `<` escaped, `pnpm audit` clean. A fresh-context review compared the Tier 1–3 content with the syllabus: no P0; its P1/P2 findings were fixed.
9. **Improve.** Metadata, Open Graph, `sitemap.xml`, `robots.txt`, `LearningResource` JSON-LD per lesson. Dependencies pruned. Button colour transitions removed after axe caught a mid-transition contrast reading.
10. **Docs.** README, DEPLOY_VERCEL, `docs/architecture.html`, `docs/demo.mp4` (42 s), this report.

## Content table (all 120 lessons)

Status is what the site does today. "Verify result" is the last `pnpm verify` run.

| Slug | Title | Status | Verify result | Reason if DRAFT |
|---|---|---|---|---|
| 1.1.1 | The Innate Compass (Fitrah) | PREVIEW | pass (all primary quotes matched) |  |
| 1.1.2 | Wisdom, Refinement & Consultation | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 54: source unreachable: HTTP 403 |
| 1.1.3 | The Formula Against Loss | PREVIEW | pass (all primary quotes matched) |  |
| 1.2.1 | Pure Oneness (Surah al-Ikhlas) | PREVIEW | pass (all primary quotes matched) |  |
| 1.2.2 | With Everything, Beyond Physical Limits | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Sermon 1: source unreachable: HTTP 403 |
| 1.2.3 | Acknowledgement Leads to Testimony | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Sermon 1: source unreachable: HTTP 403 |
| 1.3.1 | The Courage to Say "I Do Not Know" | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 82: source unreachable: HTTP 403 |
| 1.3.2 | Testing What You Hear | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 98: source unreachable: HTTP 403 |
| 1.3.3 | Heart, Tongue, and Limbs | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 227: source unreachable: HTTP 403 |
| 1.4.1 | Created Free | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Letter 31: source unreachable: HTTP 403 |
| 1.4.2 | The Worship of Free People | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 237: source unreachable: HTTP 403 |
| 1.4.3 | Tier 1 Boss Checkpoint: Two Kinds of Humanity | PREVIEW | pass (all primary quotes matched) |  |
| 2.1.1 | Beginning with "Read" | PREVIEW | pass (all primary quotes matched) |  |
| 2.1.2 | The Pen & Knowledge | PREVIEW | pass (all primary quotes matched) |  |
| 2.1.3 | The Trap of Self-Sufficiency | PREVIEW | pass (all primary quotes matched) |  |
| 2.2.1 | Names of Mercy: al-Rahman and al-Rahim | DRAFT | not verified (source unreachable) | Not yet verified: MIZAN Vol. 1, Surah al-Fatiha 1:1-5 (Traditions): source unreachable: HTTP 403 |
| 2.2.2 | Presence in Worship (1:5) | DRAFT | not verified (source unreachable) | Not yet verified: MIZAN Vol. 1, Surah al-Fatiha, verse 5 commentary: source unreachable: HTTP 403 |
| 2.2.3 | Reading a Chapter as a Unified Whole | DRAFT | not verified (source unreachable) | Not yet verified: MIZAN Vol. 1, Surah al-Fatiha, verse 1 commentary: source unreachable: HTTP 403 |
| 2.3.1 | Readiness for Guidance (2:2-3) | PREVIEW | pass (all primary quotes matched) |  |
| 2.3.2 | Explaining the Qur'an with the Qur'an | DRAFT | not verified (source unreachable) | Not yet verified: MIZAN Vol. 1, Foreword: source unreachable: HTTP 403 |
| 2.3.3 | Past, Future, and Present | DRAFT | not verified (source unreachable) | Not yet verified: NAHJ Saying 313: source unreachable: HTTP 403 |
| 2.4.1 | Feasible, Steady Recitation (73:20) | PREVIEW | pass (all primary quotes matched) |  |
| 2.4.2 | Living What You Recite (2:44) | PREVIEW | pass (all primary quotes matched) |  |
| 2.4.3 | Tier 2 Boss Checkpoint: Seeing Signs Without Forgetting the Creator | PREVIEW | pass (all primary quotes matched) |  |
| 3.1.1 | The Shepherd's School of Patience | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 9: source unreachable: HTTP 403 |
| 3.1.2 | Earned Trust: Khadijah's Regard | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 9: source unreachable: HTTP 403 |
| 3.1.3 | Character Over Wealth | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 9: source unreachable: HTTP 403 |
| 3.2.1 | Seeking Refuge Under a Just Ruler | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 17: source unreachable: HTTP 403 |
| 3.2.2 | Ja'far's Portrait of Prophetic Ethics | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 17: source unreachable: HTTP 403 |
| 3.2.3 | Integrity That Cannot Be Bought | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 17: source unreachable: HTTP 403 |
| 3.3.1 | Prayer in the Garden of Ta'if | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 23: source unreachable: HTTP 403 |
| 3.3.2 | Kinship Across Faith: The Encounter with 'Adas | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 23: source unreachable: HTTP 403 |
| 3.3.3 | Never Forgetting a Kindness | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 23: source unreachable: HTTP 403 |
| 3.4.1 | Tears of Mercy: Gentleness Toward Children | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 55: source unreachable: HTTP 403 |
| 3.4.2 | Excellence in Every Task | DRAFT | not verified (source unreachable) | Not yet verified: MESSAGE Ch. 55: source unreachable: HTTP 403 |
| 3.4.3 | Tier 3 Boss Checkpoint: Truth Over Superstition | DRAFT | not verified (source unreachable) | No verified lessons in this tier yet. |
| 4.1.1 | Present in Worship | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 4.1.2 | "I Am Near" | PREVIEW | pass (all primary quotes matched) |  |
| 4.1.3 | Hearts at Rest | PREVIEW | pass (all primary quotes matched) |  |
| 4.2.1 | Beginning in God's Name | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 4.2.2 | Praise Before Asking | PREVIEW | pass (all primary quotes matched) |  |
| 4.2.3 | Gratitude Increases | PREVIEW | pass (all primary quotes matched) |  |
| 4.3.1 | Morning and Evening | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 4.3.2 | Turning Back | PREVIEW | pass (all primary quotes matched) |  |
| 4.3.3 | Finishing the Book | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 4.4.1 | Prayer Shapes Conduct | PREVIEW | pass (all primary quotes matched) |  |
| 4.4.2 | Giving as Worship | PREVIEW | pass (all primary quotes matched) |  |
| 4.4.3 | Tier 4 Checkpoint | PREVIEW | pass (tier has verified lessons) |  |
| 5.1.1 | Think Before You Speak | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 5.1.2 | No Mockery, No Spying | PREVIEW | pass (all primary quotes matched) |  |
| 5.1.3 | Kind Words | PREVIEW | pass (all primary quotes matched) |  |
| 5.2.1 | Asking for Noble Character | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 5.2.2 | Swallowing Anger | PREVIEW | pass (all primary quotes matched) |  |
| 5.2.3 | Patience and Prayer | PREVIEW | pass (all primary quotes matched) |  |
| 5.3.1 | Honouring Parents | PREVIEW | pass (all primary quotes matched) |  |
| 5.3.2 | Neighbours and Friends | PREVIEW | pass (all primary quotes matched) |  |
| 5.3.3 | A Father's Advice | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 5.4.1 | Fair Even Against Yourself | PREVIEW | pass (all primary quotes matched) |  |
| 5.4.2 | Fair to Those You Dislike | PREVIEW | pass (all primary quotes matched) |  |
| 5.4.3 | Tier 5 Checkpoint | PREVIEW | pass (tier has verified lessons) |  |
| 6.1.1 | Khadijah's Trust | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.1.2 | The Year of Sorrow | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.1.3 | Abu Talib's Protection | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.2.1 | A Simple Marriage | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.2.2 | Habituate Your Heart to Mercy | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.2.3 | Knowledge for the Young | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.3.1 | Ja'far, the Spokesman | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.3.2 | Refugees With Dignity | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.3.3 | Family in Hardship | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.4.1 | The Teacher in Supplication | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.4.2 | Praying for Others | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 6.4.3 | Tier 6 Checkpoint | DRAFT | not verified (source unreachable) | No verified lessons in this tier yet. |
| 7.1.1 | Reform, Not Ambition | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.1.2 | Refusing Coerced Allegiance | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.1.3 | Leaving With Family | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.2.1 | In Mecca | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.2.2 | Free to Leave | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.2.3 | Loyal Companions | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.3.1 | An Appeal to Conscience | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.3.2 | Dignity Over Humiliation | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.3.3 | Standing for Right | PREVIEW | pass (all primary quotes matched) |  |
| 7.4.1 | Patience in Loss | PREVIEW | pass (all primary quotes matched) |  |
| 7.4.2 | Prayer After Tragedy | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 7.4.3 | Tier 7 Checkpoint | PREVIEW | pass (tier has verified lessons) |  |
| 8.1.1 | Knowledge Guards You | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 8.1.2 | Those Who Know | PREVIEW | pass (all primary quotes matched) |  |
| 8.1.3 | Reflecting on Creation | PREVIEW | pass (all primary quotes matched) |  |
| 8.2.1 | Choice and Responsibility | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 8.2.2 | Each Soul's Effort | PREVIEW | pass (all primary quotes matched) |  |
| 8.2.3 | No Compulsion | PREVIEW | pass (all primary quotes matched) |  |
| 8.3.1 | Beyond Comparison | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 8.3.2 | Signs for People of Reason | PREVIEW | pass (all primary quotes matched) |  |
| 8.3.3 | Oneness Revisited | PREVIEW | pass (all primary quotes matched) |  |
| 8.4.1 | Justice for the Weak | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 8.4.2 | God Commands Justice | PREVIEW | pass (all primary quotes matched) |  |
| 8.4.3 | Tier 8 Checkpoint | PREVIEW | pass (tier has verified lessons) |  |
| 9.1.1 | The Qur'an Explains Itself | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.1.2 | Chapters as Wholes | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.1.3 | Context Before Conclusions | PREVIEW | pass (all primary quotes matched) |  |
| 9.2.1 | Who Compiled Nahj al-Balagha | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.2.2 | Numbers Differ by Edition | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.2.3 | Reading a Saying Closely | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.3.1 | Reading Supplications | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.3.2 | Ethics Inside Prayer | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.3.3 | Praying in Your Own Words | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.4.1 | Reading Biography Critically | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 9.4.2 | How This Site Checks Quotes | PREVIEW | pass (no outside quote) |  |
| 9.4.3 | Tier 9 Checkpoint | PREVIEW | pass (tier has verified lessons) |  |
| 10.1.1 | Verify Before You Share | PREVIEW | pass (all primary quotes matched) |  |
| 10.1.2 | Viral Quotes | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 10.1.3 | Saying "I Don't Know" Online | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 10.2.1 | Made to Know One Another | PREVIEW | pass (all primary quotes matched) |  |
| 10.2.2 | Brother in Faith, Equal in Creation | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 10.2.3 | Fair Disagreement | PREVIEW | pass (all primary quotes matched) |  |
| 10.3.1 | Truth Over Superstition | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 10.3.2 | Study the Heavens and Earth | PREVIEW | pass (all primary quotes matched) |  |
| 10.3.3 | Do Every Job Well | DRAFT | not run (no quote yet) | Source not yet read: the exact passage and quote still need to be confirmed from the source page (Al-Islam.org could not be read by the build environment). |
| 10.4.1 | Don't Waste | PREVIEW | pass (all primary quotes matched) |  |
| 10.4.2 | The Middle Way With Money | PREVIEW | pass (all primary quotes matched) |  |
| 10.4.3 | Final Checkpoint and Next Steps | PREVIEW | pass (tier has verified lessons) |  |

Totals: 49 PREVIEW, 0 APPROVED, 71 DRAFT. Of the DRAFT lessons, 25 are fully written and waiting for verification (their source is on Al-Islam.org), and 46 are stubs with no quote yet.

## Placement quiz coverage

The file has 14 questions: Q1–Q6, Q1b, Q3b, Q7, Q8 and Q10–Q13 (no Q9). **8 are visible today:** Q1b (Tier 1), Q3b (Tier 2), Q7 (Tier 4), Q8 (Tier 5), Q10 (Tier 7), Q11 (Tier 8), Q12 (Tier 9), Q13 (Tier 10).

- Q1–Q6, the syllabus's Tier 1–3 questions, are all built on Al-Islam.org sources and stay hidden until those lessons verify. Q1b and Q3b are two Qur'an-based questions I added so the early tiers can be assessed meanwhile.
- **Q9 (Tier 6) does not exist.** Every Tier 6 lesson depends on an Al-Islam.org source, so there was nothing verified to build it from.

## Open issues

1. **Al-Islam.org cannot be read by the verifier** (Cloudflare bot challenge). No Nahj al-Balagha, Al-Mizan or The Message quote is verified. I did not try to bypass the challenge.
2. **Page URLs for Al-Islam.org lessons are book-level.** The syllabus gave none per page. Even on a machine that can read the site, these lessons will fail verification until each `url` points to the exact page holding the quote.
3. **46 stubs** need a source read, a screened quote, a summary and questions (Tier 6 entirely, most of Tier 7, parts of Tiers 4, 5, 8, 9, 10, and the Sahifa and Maqtal lessons).
4. **Tier 3 and Tier 6 are empty** on the live path, and the Tier 3 checkpoint is hidden. Learners step past them automatically.
5. The Saying 125 family note on 1.3.3 is parked in `candidates` (the syllabus text has an ellipsis; split it into two exact quotes).
6. **Plugins.** The cloud session had none of the planned skills (Superpowers, Impeccable, GStack, Archify, HyperFrames and others). The work was done directly; see `DECISIONS.md` item 1. HyperFrames and Archify outputs were replaced by a Playwright/ffmpeg walkthrough and a hand-written diagram.
7. **Playwright's own video recorder** needs an ffmpeg build that is not installed, so the demo is stitched from screenshots, not a screen recording.

## DECISIONS.md in brief

Network allowlist extended for Tanzil and Al-Islam.org (with approval); work is on a feature branch; one local-only commit rewrite removed an upstream `.env.example` placeholder that GitHub's push protection flagged; family and cross-reference quotes show only if they verified; a lesson drops to hidden if its quote no longer matches its recorded hash; checkpoints are generated from verified lessons and hidden when there are none; tiers open by checkpoint, by "all done" when there is no checkpoint, or by placement; placement questions need every quote in their lesson verified; fonts are system fonts; the verifier accepts pages you save by hand.

## Taha's next steps

1. **Unlock the Al-Islam.org lessons.** On your own machine (a normal network, `pnpm install`):
   - For each lesson in `docs/verify-report.md` marked "source unreachable", find the exact Al-Islam.org page that holds the quote and put its address in the lesson's `url` in `content/tier-N.json`.
   - Run `pnpm verify`. If the site still refuses the script, open the page, save it as HTML at the path the script prints (`.cache/pages/<name>.html`), and run it again.
   - Fix any quote that truly fails by recopying from the page. Never edit a quote to make it pass.
2. **Review the PREVIEW lessons** (49 now, more after step 1). Read each against its source and set `"status": "APPROVED"` by hand.
3. **Fill the stubs** (Tier 6, most of Tier 7, the Sahifa and Maqtal lessons, and the others). The same process applies: read the source, screen it against SYLLABUS 1.2, copy an exact quote of 25 words or fewer, write the summary and 2–3 questions, then `pnpm verify`.
4. **Merge the branch to `main` and deploy** using `docs/DEPLOY_VERCEL.md`. Set `NEXT_PUBLIC_SITE_URL` if you add a custom domain.
