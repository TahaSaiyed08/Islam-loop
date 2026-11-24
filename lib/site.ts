export const SITE_NAME = "The Roadmap";
export const SITE_TAGLINE =
  "Learn Islam through the Qur'an and the teachings of the Prophet and his family.";
export const SITE_DESCRIPTION =
  "Free, short lessons on Islam drawn from the Qur'an and the teachings of the Prophet and his family. Every quote is sourced and checked.";

export const BASE_REPO_URL = "https://github.com/sanidhyy/duolingo-clone";

/** Absolute site URL for metadata, sitemap and structured data. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const MECHANIC_LABEL: Record<string, string> = {
  scenario_dilemma: "Scenario",
  verse_decoder: "Decode",
  timeline_builder: "Put in order",
  root_word_match: "Word match",
  boss_checkpoint: "Checkpoint",
};
