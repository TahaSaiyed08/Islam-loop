import { createHash } from "node:crypto";

/**
 * The only normalisation applied when comparing a quote with its source:
 * whitespace, curly vs straight quotes/apostrophes, and non-breaking spaces.
 * Nothing else may differ.
 */
export function normalizeText(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[‘’ʼ´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[   ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function quoteHash(quote: string): string {
  return createHash("sha256")
    .update(normalizeText(quote))
    .digest("hex")
    .slice(0, 16);
}

export function wordCount(text: string): number {
  return normalizeText(text).split(" ").filter(Boolean).length;
}
