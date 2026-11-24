# The Roadmap: Syllabus (content rules)

Version 1.0 · 2026-11-24 · Owner: Taha

This file holds the content rules (Part 1) and the quiz rules (Part 3) that every lesson follows. The lessons themselves live in `content/tier-1.json` … `content/tier-10.json` (the original Part 2 plans and Part 4 locked lessons were converted into that JSON), and the placement questions in `content/placement.json`.

---

## PART 1: Content rules (apply to every lesson)

### 1.1 Accuracy

1. **Quotes are copied, never written.** Every quote must exist word for word on its source page, or in the Qara'i file for Qur'an verses. The verifier (`pnpm verify`) checks every quote. A lesson whose quote fails stays `DRAFT` and is hidden.
2. **Quote length:** 25 words maximum. Exception: a complete Qur'an verse may be longer.
3. **Summaries** may only restate what the quote and its page say. No outside facts, no interpretation beyond the text.
4. **Quiz questions** must be answerable from the lesson's quote and summary alone.
5. **Statuses:**
   - `DRAFT`: hidden.
   - `PREVIEW`: verified, shown with a "Preview — under review" label.
   - `APPROVED`: shown with no label, and set only by Taha.

### 1.2 Framing

6. The theme is learning Islam through the Qur'an and the teachings of the Prophet Muhammad and his family (Ahl al-Bayt), for anyone curious.
7. Site text never uses the words Shia, Shi'a, Twelver, Sunni, sect or madhhab. It never compares schools of thought.
8. **Never mention:** Abu Bakr, Umar, Uthman (the third caliph) or Mu'awiya. Also excluded:
   - succession, Imamate doctrine, Ghadir as succession, Fadak, Saqifa, Occultation;
   - Nahj al-Balagha Sermon 3 and letters addressed to Mu'awiya;
   - Ziyarat texts;
   - curses, and blame placed on any group of people;
   - verses with disputed interpretations between schools (including the scope of 33:33, 5:55 and 5:67).
9. **No fiqh rulings.** For practical method, the site says: "Learn it from a qualified teacher."
10. **Screening:** before quoting from a page, read the passage around the quote. If the quote only makes sense alongside excluded content, choose a different passage.

### 1.3 Approved sources (nothing else)

| Key | Source | Where | Rules |
|---|---|---|---|
| QURAN | The Qur'an. Arabic: Tanzil Uthmani. English: **Ali Quli Qara'i** | tanzil.net/trans (download); fallback api.alquran.cloud `en.qarai` | Credit "Qara'i translation, via Tanzil" and link tanzil.net. Translations are licensed for non-commercial use only. |
| NAHJ | Nahj al-Balagha, compiled by al-Sharif al-Radi, tr. Sayed Ali Reza, Al-Islam.org edition (480 sayings) | al-islam.org/nahjul-balagha-part-1-sermons and …-part-2-letters-and-sayings | Use this edition's numbering. Excluded: Sermon 3 and letters to Mu'awiya. |
| SAHIFA | Al-Sahifa al-Sajjadiyya, Imam Ali ibn al-Husayn Zayn al-Abidin, Al-Islam.org edition | al-islam.org (search "Sahifa al-Sajjadiyya") | Confirm each supplication's number and title on its page before quoting. |
| MIZAN | Al-Mizan Vol. 1, Allamah Tabataba'i, tr. Sayyid Sa'eed Akhtar Rizvi (WOFIS) | al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai | Quote Rizvi's wording as printed. Excluded: the essays on Compulsion and Delegation (2:26–27) and on Intercession (2:47–48). |
| MESSAGE | The Message, Ja'far Subhani (Islamic Seminary Publications) | al-islam.org/message-jafar-subhani | Cleared chapters: 9, 17, 23, 55. Any other chapter must be read in full and found free of every exclusion before use (log this in DECISIONS.md). Never use chapters on succession, Ghadir, Fadak or Saqifa. |
| MAQTAL | Maqtal al-Husayn, Abd al-Razzaq al-Muqarram, tr. Yasin T. al-Jibouri | al-islam.org (search "Maqtal al-Husayn Muqarram") | **Tier 7 only.** Quote only Imam Husayn's own words, and only where al-Muqarram cites a classical source (such as al-Tabari or al-Mufid). Skip chapters about Mu'awiya, curses, blame on groups (including the people of Kufa), graphic detail, miracle claims and poetry. Yazid is named only as the ruler who demanded allegiance. |

All Al-Islam.org content is for non-commercial use only, with the permission of its copyright holders. The site stays free.

### 1.4 Lesson template (every lesson has all of these)

`slug` · `title` · `objective` · `hook` (a question) · `sources[]` (book, author, translator, edition, locator, url, quote) · `summary` · `familyNote` (optional; only when quoting the Prophet or a member of his family) · `mechanic` · `questions[]` (2–3 SELECT questions, 3 options each, exactly one correct) · `status`

**Mechanics:**

- `scenario_dilemma`: pick the best response to a real-life situation.
- `verse_decoder`: match parts of the quote to their meaning.
- `timeline_builder`: put events or steps in order.
- `root_word_match`: match an Arabic root to its meaning.
- `boss_checkpoint`: the end-of-tier review, with 5 questions drawn from the tier's lessons.

---

## PART 3: Quizzes

### 3.1 Placement quiz (on the landing page and in the "Start" flow; about 90 seconds)

- **Q1–Q6** are the six questions drawn from Tiers 1–3.
- **Q7–Q13**: one per tier from 4 to 10, each a conceptual question built from a **verified** lesson in that tier, using only that lesson's quote and summary.
- **Placement rule:** a learner starts at the tier after the last tier whose questions they answered correctly in a row from Tier 1. Earlier tiers are marked "skipped". They aren't completed, and the learner can still open them.
- Learners can skip the quiz and start at Tier 1.

### 3.2 Lesson questions

Every lesson has 2–3 SELECT questions, 3 options each, exactly one correct, drawn only from its quote and summary. Wrong answers show the correct answer and a one-line explanation. No hearts and no penalties.

### 3.3 Tier checkpoints

Each tier ends with a `boss_checkpoint` lesson of 5 questions drawn from that tier's verified lessons. Passing (4 out of 5) unlocks the next tier. Learners can retry freely.
