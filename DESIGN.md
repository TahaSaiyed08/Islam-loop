# Design

The learning screens are a port of sanidhyy/duolingo-clone (MIT), tuned to feel like the real Duolingo app: white canvas, rounded heavy type, chunky 3D buttons that sink when pressed, a colourful zigzag path, and a coloured feedback bar. The brand itself is ours: no Duolingo name, owl, green, sounds, font or art.

## Palette

Neutrals follow a Duolingo-style grey scale; the hues are our own. Every text colour is checked against its background (ratios below are measured, WCAG AA needs 4.5:1 for text, 3:1 for graphics and large text).

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `eel` / `foreground` | #4B4B4B | Text | 8.7 on white |
| `wolf` / `muted-foreground` | #6B6B6B | Secondary text, labels | 5.3 on white |
| `hare` | #AFAFAF | Locked and disabled icons only | decorative |
| `swan` / `border` | #E5E5E5 | Borders, progress track | |
| `polar` / `muted` | #F7F7F7 | Hover fills | |
| `brand` | #0B7C80 | Main buttons (white text) | 5.0 |
| `brand-dark` | #075A5D | 3D edge of brand buttons | |
| `primary` | #0B6B6E | Teal text on tints, logo | 5.6 on brand-soft |
| `sand` / `sand-dark` / `sand-ink` | #F2A93B / #C98318 / #8A5300 | Accent buttons (dark text, 6.9), selected answers (ink on tint 5.7) | |
| `success` on `success-soft` | #0B6B6E on #D7F5F3 | Correct feedback | 5.5 |
| `danger` on `danger-soft` | #B42328 on #FFE3E1 | Wrong feedback | 5.4 |

**Unit colours** (`lib/unit-theme.ts`) cycle teal, violet, coral and amber, like the units on a Duolingo path. Each has a deep shade for the banner, which carries white text at 5.0, 5.1, 5.0 and 5.0, and a bright shade for the path nodes, graphics at 3.1 to 4.2 against white.

## Type

Nunito (self-hosted with `@fontsource-variable/nunito`, so builds need no network). It is a rounded face, as upstream used, not Duolingo's own font. Headings and buttons are 800 weight; buttons are uppercase with wide tracking. Body text is 16px and up.

## Components

- **Buttons** (`components/ui/button.tsx`): every upstream variant. The 3D edge is a 4px bottom border (8px on path nodes). On press the edge moves to a transparent top border, so the face sinks while the box keeps its height and nothing around it moves (tested).
- **Answer cards** (`app/lesson/card.tsx`): rounded-2xl, 2px border with a 4px bottom, number badge. Selected is amber; correct is teal; wrong is coral; the right answer is revealed after a miss.
- **Progress bar**: grey track, bright teal fill with a light highlight stripe.
- **Feedback bar** (`app/lesson/footer.tsx`): after Check, the bar turns teal or coral, with an icon disc, a bold verdict and the one-line reason. The button fills the width on phones.
- **Path** (`app/(main)/learn/`): 70px round nodes with an 8px edge in a zigzag (cycle of 8, 40px steps), a bouncing Start bubble and a progress ring on the current lesson, and a crown on the checkpoint.
- **Sidebar**: original flat colour icons in place of the upstream art.

## Interaction

- No sounds. Confetti uses the site colours and is off with reduced motion; the Start bubble stops bouncing too.
- Colour is never the only signal: right and wrong also use icons and words.
- Keyboard: 1–3 pick an option, Enter checks and continues; focus moves to each new step's heading; every control has a visible focus ring.
- Touch targets are at least 44px. Layouts are tested at 360px and 1280px.
