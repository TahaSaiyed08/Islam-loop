import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "What The Roadmap is, how its quotes are checked, and why it points you to a qualified teacher.",
};

export default function AboutPage() {
  return (
    <div className="px-6 pb-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight">About The Roadmap</h1>
        <div className="mt-6 space-y-5 text-lg">
          <p>
            The Roadmap is a free site for learning Islam through the
            Qur&apos;an and the teachings of the Prophet Muhammad and his
            family. It is for anyone who is curious, whatever you already know.
          </p>
          <p>
            Lessons are short. Each one rests on a single quote from a named
            source, and each ends with a couple of questions so you can see what
            stayed with you. There are no ads, no payments and no sign-up. It is
            not run for profit.
          </p>

          <h2 className="pt-4 text-2xl font-bold">How quotes are checked</h2>
          <p>
            Quotes are copied from the source, never written or reworded. A
            checker then looks each one up and requires an exact match. A lesson
            that fails the check stays hidden. One that passes is shown with a
            &ldquo;Preview — under review&rdquo; label until a person approves
            it. You can read more on the{" "}
            <Link
              href="/sources"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Sources
            </Link>{" "}
            page.
          </p>

          <h2 className="pt-4 text-2xl font-bold">
            What this site does not do
          </h2>
          <p>
            It does not give rulings on how to practise. Lessons are about
            meaning, character and understanding.{" "}
            <strong>For practice, learn from a qualified teacher.</strong>
          </p>

          <h2 className="pt-4 text-2xl font-bold">Your progress</h2>
          <p>
            Progress, points and your daily streak are saved in your own browser
            and nowhere else. You can clear them any time in{" "}
            <Link
              href="/settings"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
