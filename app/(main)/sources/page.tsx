import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "The six sources used on The Roadmap, with authors, translators, links and licence notes.",
};

type Src = {
  name: string;
  by: string;
  note: string;
  links: { label: string; href: string }[];
};

const SOURCES: Src[] = [
  {
    name: "The Qur'an",
    by: "English translation by Ali Quli Qara'i, text supplied by Tanzil.",
    note: "Verses are copied from the Qara'i translation file and checked against it. Arabic text is not shown in this version.",
    links: [{ label: "tanzil.net", href: "https://tanzil.net" }],
  },
  {
    name: "Nahj al-Balagha",
    by: "Compiled by al-Sharif al-Radi, translated by Sayed Ali Reza (Al-Islam.org edition, 480 sayings).",
    note: "Numbering follows this edition. Numbers can differ between editions.",
    links: [
      {
        label: "Sermons",
        href: "https://www.al-islam.org/nahjul-balagha-part-1-sermons",
      },
      {
        label: "Letters and sayings",
        href: "https://www.al-islam.org/nahjul-balagha-part-2-letters-and-sayings",
      },
    ],
  },
  {
    name: "Al-Sahifa al-Sajjadiyya",
    by: "Imam Ali ibn al-Husayn Zayn al-Abidin (Al-Islam.org edition).",
    note: "Each supplication's number and title are confirmed on its page before it is quoted.",
    links: [{ label: "al-islam.org", href: "https://www.al-islam.org" }],
  },
  {
    name: "Al-Mizan: An Exegesis of the Qur'an, Vol. 1",
    by: "Allamah Tabataba'i, translated by Sayyid Sa'eed Akhtar Rizvi (WOFIS).",
    note: "Quoted in the translator's wording as printed.",
    links: [
      {
        label: "Al-Mizan Vol. 1",
        href: "https://www.al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai",
      },
    ],
  },
  {
    name: "The Message",
    by: "Ja'far Subhani (Islamic Seminary Publications). The translator is not credited on Al-Islam.org.",
    note: "Only chapters that have been read in full are used.",
    links: [
      {
        label: "The Message",
        href: "https://www.al-islam.org/message-jafar-subhani",
      },
    ],
  },
  {
    name: "Maqtal al-Husayn",
    by: "Abd al-Razzaq al-Muqarram, translated by Yasin T. al-Jibouri.",
    note: "Used in Tier 7 only, and only where the author cites a classical source.",
    links: [{ label: "al-islam.org", href: "https://www.al-islam.org" }],
  },
];

export default function SourcesPage() {
  return (
    <div className="px-6 pb-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight">Sources</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Nothing else is quoted. Every quote on a lesson shows its book, its
          place in the book, its translator and a link to the full text.
        </p>

        <ul className="mt-10 space-y-5">
          {SOURCES.map((s) => (
            <li
              key={s.name}
              className="rounded-xl border bg-card p-6"
              data-testid="source-entry"
            >
              <h2 className="text-xl font-bold">{s.name}</h2>
              <p className="mt-1">{s.by}</p>
              <p className="mt-2 text-muted-foreground">{s.note}</p>
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {s.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-bold">How quotes are checked</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg">
          <li>
            Quotes are copied from the source page, or from the Qara&apos;i file
            for Qur&apos;an verses. They are never reworded.
          </li>
          <li>
            A checker looks each quote up. It must match word for word. Only
            spacing, curly versus straight quotation marks and non-breaking
            spaces are ignored.
          </li>
          <li>A lesson that fails stays hidden.</li>
          <li>
            A lesson that passes is shown with a &ldquo;Preview — under
            review&rdquo; label until a person reviews it and approves it.
          </li>
        </ol>

        <h2 className="mt-14 text-2xl font-bold">Licences</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-lg">
          <li>
            Al-Islam.org content is used for non-commercial purposes, with the
            permission of its copyright holders. This site stays free.
          </li>
          <li>
            Tanzil&apos;s Qur&apos;an text is licensed under CC BY 3.0 and may
            not be changed. Its translations are licensed for non-commercial use
            only.
          </li>
          <li>
            The site code is MIT licensed and based on{" "}
            <a
              href="https://github.com/sanidhyy/duolingo-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4"
            >
              sanidhyy/duolingo-clone
            </a>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
