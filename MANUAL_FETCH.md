# Manual fetch list

Al-Islam.org could not be read from the cloud session: the script gets a Cloudflare bot challenge (HTTP 403), and the WebFetch route could not resolve the host at all (`getaddrinfo ENOTFOUND`, for both `al-islam.org` and `www.al-islam.org`, even though both are on the environment allowlist). Nothing was bypassed and no quote was marked verified without a check.

Everything below still needs a check against the live page. Two ways to do it:

**A. Save the page, run the script (best).** In a browser, open the URL, save the page as HTML into `.cache/pages/` under the file name shown, then run `pnpm verify`. The script reads the saved page and applies the exact-substring rule.

**B. WebFetch evidence.** For each quote, ask WebFetch twice, in two separate calls: "Does this exact text appear on the page, word for word? If YES, quote the full sentence that contains it." If both say YES, add an entry to `content/webfetch-evidence.json` (shape below), then run `pnpm verify`. The script accepts it only if `confirmations` is at least 2 and the evidence sentence contains the quote exactly once.

```json
{ "entries": [ { "slug": "1.2.2", "source": 0, "checkedAt": "2026-11-24", "confirmations": 2, "evidence": "<the sentence returned, as written>" } ] }
```

`source` is the index of the quote within the lesson's `sources` (shown below). Never reword a quote to make it pass.

## Pages and quotes to check (32 quotes on 10 pages)

### https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/selections-sayings-and-preaching-amir-al-muminin-ali

Save as: `.cache/pages/al_islam_org_nahjul_balagha_part_2_letters_and_sayings_selections_sayings_and_preaching_amir_al_muminin_ali.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 1.1.2 | 0 | primary | Saying 54 | There is no wealth like wisdom, no destitution like ignorance, no inheritance like refinement and no support like consultation. |
| 1.3.1 | 0 | primary | Saying 82 | no one should feel ashamed of saying 'I do not know' when he is asked a matter which he does not know |
| 1.3.2 | 0 | primary | Saying 98 | When you hear a tradition test it according to the criterion of intelligence not that of mere hearing |
| 1.3.3 | 0 | primary | Saying 227 | Belief means appreciation with the heart, acknowledgement with the tongue, and action with the limbs. |
| 1.4.2 | 0 | primary | Saying 237 | Still another group worshipped Allah out of gratefulness; this is the worship of free men. |
| 2.1.2 | 1 | family | Saying 5 | Knowledge is a venerable estate; good manners are new dresses; and thinking is clear mirror. |
| 2.3.3 | 0 | primary | Saying 313 | The Qur'an contains news about the past, foretellings about the future and commandments for the present. |

### https://al-islam.org/nahjul-balagha-part-1-sermons/sermon-1-praise-due-allah-whose-worth-cannot-be-described

Save as: `.cache/pages/al_islam_org_nahjul_balagha_part_1_sermons_sermon_1_praise_due_allah_whose_worth_cannot_be_described.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 1.2.2 | 0 | primary | Sermon 1 | He is with everything but not in physical nearness. He is different from everything but not in physical separation. |
| 1.2.3 | 0 | primary | Sermon 1 | The foremost in religion is the acknowledgement of Him, the perfection of acknowledging Him is to testify Him |

### https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/letter-31-advice-one-his-sons-after-returning-battle

Save as: `.cache/pages/al_islam_org_nahjul_balagha_part_2_letters_and_sayings_letter_31_advice_one_his_sons_after_returning_battle.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 1.4.1 | 0 | primary | Letter 31 | Do not be the slave of others for Allah had made you free. |
| 1.4.1 | 1 | family | Letter 31 | the heart of a young man is like uncultivated land. It accepts whatever is strewn on it. |
| 2.4.2 | 1 | family | Letter 31 | Make yourself the measure (for dealings) between you and others. Thus, you should desire for others what you desire for yourself |

### https://al-islam.org/nahjul-balagha-part-2-letters-and-sayings/letter-53-order-malik-al-ashtar

Save as: `.cache/pages/al_islam_org_nahjul_balagha_part_2_letters_and_sayings_letter_53_order_malik_al_ashtar.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 1.4.3 | 0 | cross | Letter 53 | they are of two kinds, either your brother in religion or one like you in creation. |
| 2.3.3 | 1 | family | Letter 53 | Referring to Allah means to act according to what is clear in His Book. |

### https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/surah-al-fatiha-verses-1-5

Save as: `.cache/pages/al_islam_org_al_mizan_exegesis_quran_volume_1_sayyid_muhammad_husayn_tabatabai_surah_al_fatiha_verses_1_5.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 2.2.1 | 0 | primary | Vol. 1, Surah al-Fatiha 1:1-5 (Traditions) | ar-Rahman (the Beneficent) is a special name with a general attribute; and ar-Rahim (the Merciful) is a general name with a special attribute. |
| 2.2.2 | 0 | primary | Vol. 1, Surah al-Fatiha, verse 5 commentary | The true worship, therefore, is that in which the worshipped and the worshipper both are present. |
| 2.2.3 | 0 | primary | Vol. 1, Surah al-Fatiha, verse 1 commentary | every chapter is a single unit in structure and in fullness of meaning |
| 2.4.3 | 0 | cross | Vol. 1, Surah al-Fatiha, verse 5 commentary | Nothing in the creation can hide the divine presence, nor should looking at these things make one forgetful of Allah. |

### https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/foreword

Save as: `.cache/pages/al_islam_org_al_mizan_exegesis_quran_volume_1_sayyid_muhammad_husayn_tabatabai_foreword.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 2.3.2 | 0 | primary | Vol. 1, Foreword | the author made a detailed plan to explain the Qur'an with the help of the Qur'an itself |

### https://al-islam.org/message-jafar-subhani/chapter-9-sheperd-merchant

Save as: `.cache/pages/al_islam_org_message_jafar_subhani_chapter_9_sheperd_merchant.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 3.1.1 | 0 | primary | Ch. 9 | All the Prophets have been shepherds for some time before attaining to the position of prophethood |
| 3.1.2 | 0 | primary | Ch. 9 | The thing which has inspired my regard for you is your truthfulness, honesty and good morals. |
| 3.1.3 | 0 | primary | Ch. 9 | yet wealth is a passing shadow, and origin and lineage is something permanent |

### https://al-islam.org/message-jafar-subhani/chapter-17-first-migration

Save as: `.cache/pages/al_islam_org_message_jafar_subhani_chapter_17_first_migration.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 3.2.1 | 0 | primary | Ch. 17 | on account of the presence of a mighty and just ruler, nobody is oppressed there |
| 3.2.2 | 0 | primary | Ch. 17 | He also ordered us to return the things entrusted to us by others; to avoid impurities, to behave well with our kinsmen and neighbours |
| 3.2.3 | 0 | primary | Ch. 17 | God has not taken any bribe from me while giving me this authority. |

### https://al-islam.org/message-jafar-subhani/chapter-23-journey-taif

Save as: `.cache/pages/al_islam_org_message_jafar_subhani_chapter_23_journey_taif.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 3.3.1 | 0 | primary | Ch. 23 | O Lord! I present my weakness and lack of strength before You. You are the kind Nourisher. You are the helper of the weak. |
| 3.3.1 | 1 | family | Ch. 23 | Don't cry. Allah is the Protector of your father. |
| 3.3.2 | 0 | primary | Ch. 23 | My brother Yunus was Allah's Prophet like myself |
| 3.3.3 | 0 | primary | Ch. 23 | Muhammad should come straight to my house. |

### https://al-islam.org/message-jafar-subhani/chapter-55-prophet-mourning-his-son

Save as: `.cache/pages/al_islam_org_message_jafar_subhani_chapter_55_prophet_mourning_his_son.html`

| Lesson | Source # | Role | Locator | Quote |
|---|---|---|---|---|
| 3.4.1 | 0 | primary | Ch. 55 | Be gentle to your children and display kind sentiments for them. |
| 3.4.2 | 0 | primary | Ch. 55 | Whenever anyone of you does a job he should endeavour to do it in a solid way |
| 3.4.3 | 0 | cross | Ch. 55 | They are not eclipsed on account of the death or birth of anyone. |

## Lessons with no quote yet (45 stubs)

These need a source page read, a screened quote (25 words or fewer), a summary and 2-3 questions. The candidate source is the one SYLLABUS.md Part 2 names. Where no exact page URL was supplied (Sahifa and Maqtal), open the book's contents page on al-islam.org and follow the link to the supplication or chapter, then record the URL in DECISIONS.md.

| Lesson | Title | Candidate source |
|---|---|---|
| 4.1.1 | Present in Worship | MIZAN Vol. 1, al-Fatiha 1:5 commentary (a passage not used in 2.2.2) |
| 4.2.1 | Beginning in God's Name | MIZAN Vol. 1, al-Fatiha 1:1 commentary |
| 4.3.1 | Morning and Evening | SAHIFA Supplication 6 (morning and evening, candidate) |
| 4.3.3 | Finishing the Book | SAHIFA Supplication 42 (completing the Qur'an, candidate) |
| 5.1.1 | Think Before You Speak | NAHJ Saying 40 (candidate: the wise person's tongue is behind his heart) |
| 5.2.1 | Asking for Noble Character | SAHIFA Supplication 20 (noble moral traits, candidate) |
| 5.3.3 | A Father's Advice | NAHJ Letter 31 (a passage not used in Tiers 1-2) |
| 6.1.1 | Khadijah's Trust | MESSAGE Ch. 9 (a passage not used in Tier 3) |
| 6.1.2 | The Year of Sorrow | MESSAGE Ch. 23 (passage on their deaths) |
| 6.1.3 | Abu Talib's Protection | MESSAGE Ch. 9 or Ch. 23 (Abu Talib passages) |
| 6.2.1 | A Simple Marriage | MESSAGE Ch. 28 (read in full and screen first; if it fails screening, the lesson stays DRAFT) |
| 6.2.2 | Habituate Your Heart to Mercy | NAHJ Letter 53 (candidate: passage on mercy toward the people) |
| 6.2.3 | Knowledge for the Young | NAHJ Letter 31 (passage on youth and learning) |
| 6.3.1 | Ja'far, the Spokesman | MESSAGE Ch. 17 (a passage not used in Tier 3) |
| 6.3.2 | Refugees With Dignity | MESSAGE Ch. 17 |
| 6.3.3 | Family in Hardship | MESSAGE Ch. 23 (or another cleared chapter) |
| 6.4.1 | The Teacher in Supplication | SAHIFA introduction or Supplication 1 |
| 6.4.2 | Praying for Others | SAHIFA (a supplication for others; confirm its number and title) |
| 7.1.1 | Reform, Not Ambition | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply), chapter "The Will" (his will stating his aim) |
| 7.1.2 | Refusing Coerced Allegiance | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply), "Departure from Medina" |
| 7.1.3 | Leaving With Family | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply), "Departure from Medina" |
| 7.2.1 | In Mecca | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply), "In Mecca" |
| 7.2.2 | Free to Leave | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply) (the night before 'Ashura, when he releases his companions) |
| 7.2.3 | Loyal Companions | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply) (the companions' reply) |
| 7.3.1 | An Appeal to Conscience | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply) (Husayn's address on 'Ashura) |
| 7.3.2 | Dignity Over Humiliation | MAQTAL (Tier 7 rules in SYLLABUS 1.3 apply) (candidate: his words on dignity and humiliation) |
| 7.4.2 | Prayer After Tragedy | SAHIFA (a supplication in hardship; confirm its number) |
| 8.1.1 | Knowledge Guards You | NAHJ Saying 147 (candidate: the saying to Kumayl) |
| 8.2.1 | Choice and Responsibility | NAHJ Saying 78 (candidate; check the OCR typo, and if the text is corrupted, pick another saying on this theme) |
| 8.3.1 | Beyond Comparison | NAHJ Sermon 1 (a passage not used in Tier 1) |
| 8.4.1 | Justice for the Weak | NAHJ Letter 53 (candidate: passage on the lowest classes) |
| 9.1.1 | The Qur'an Explains Itself | MIZAN Foreword (a passage not used in 2.3.2) |
| 9.1.2 | Chapters as Wholes | MIZAN Vol. 1, al-Fatiha commentary |
| 9.2.1 | Who Compiled Nahj al-Balagha | NAHJ Al-Islam.org introduction page |
| 9.2.2 | Numbers Differ by Edition | NAHJ introduction / edition note (if no source states it, the lesson stays DRAFT) |
| 9.2.3 | Reading a Saying Closely | NAHJ Saying 82 (full five teachings) |
| 9.3.1 | Reading Supplications | SAHIFA introduction |
| 9.3.2 | Ethics Inside Prayer | SAHIFA Supplication 20 (a passage not used in 5.2.1) |
| 9.3.3 | Praying in Your Own Words | SAHIFA Supplication 1 |
| 9.4.1 | Reading Biography Critically | MESSAGE (preface or a cleared chapter) |
| 10.1.2 | Viral Quotes | NAHJ Saying 98 (reuse, with a new scenario) |
| 10.1.3 | Saying "I Don't Know" Online | NAHJ Saying 82 |
| 10.2.2 | Brother in Faith, Equal in Creation | NAHJ Letter 53 (two kinds) |
| 10.3.1 | Truth Over Superstition | MESSAGE Ch. 55 (eclipse) |
| 10.3.3 | Do Every Job Well | MESSAGE Ch. 55 ("solid way") |
