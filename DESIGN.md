# Design

Calm, readable, unhurried. A deep teal and warm sand palette on an off-white page, large type, generous spacing. Nothing flashes, nothing is scored against the learner.

## Tokens

Defined as CSS variables in `app/globals.css` and mapped in `tailwind.config.ts`.

| Token | HSL | Use |
|---|---|---|
| `background` | 42 40% 97% | Page (warm off-white) |
| `foreground` | 190 42% 11% | Body text |
| `primary` | 184 66% 21% | Deep teal: buttons, progress, links |
| `secondary` | 38 62% 85% | Pale sand: hooks, preview badge |
| `accent` | 36 70% 62% | Warm sand: streak/points icons, quote rule |
| `muted` / `muted-foreground` | 40 28% 92% / 190 16% 32% | Quiet surfaces and secondary text |
| `success` / `danger` | 152 52% 25% / 8 62% 36% | Feedback (with soft backgrounds) |
| `border` | 38 24% 82% | Hairlines |

Contrast: all text pairs are checked by axe (WCAG 2 A/AA) in `e2e/a11y.spec.ts`.

## Ported UI

The learning screens are ported from sanidhyy/duolingo-clone (MIT): fixed 256px sidebar, a two-column learn page with a 368px right column, the zigzag lesson path with 3D round buttons, and the lesson quiz shell with a coloured footer. Colours are mapped to extra tokens: `brand` (teal 184 62% 26%, secondary buttons, banners, progress) with `brand-dark` for the 3D edge, and `sand` (36 72% 66%, primary buttons) with `sand-dark` and `sand-ink` (text on white).

## Type and space

- Body 16px minimum; questions and quotes 20–24px. Quotes use a serif stack (`font-quote`); everything else uses the system sans stack.
- Line length capped near 65 characters (`max-w-3xl`).
- Buttons are at least 44px tall.

## Interaction

- No sounds, no confetti, no timers. Wrong answers show the right answer and a one-line reason.
- Colour is never the only signal: right and wrong also use icons and words.
- Focus is visible everywhere; focus moves to each new step's heading. Keyboard: Enter checks or continues, 1–3 pick an option.
- `prefers-reduced-motion` disables animation.
- Layouts are checked at 360px.

## Mark

An original geometric mark: a winding road ending in a dot (`components/logo.tsx`, `app/icon.svg`).
