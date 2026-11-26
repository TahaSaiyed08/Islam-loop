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

- **Buttons** (`components/ui/button.tsx`): every upstream variant, matched to measured Duolingo geometry (`h-[50px]` `lg` height, `16px` horizontal padding, `0.8px` uppercase tracking, `16px` radius). The 3D edge is a 4px bottom border (8px on path nodes). On press the edge moves to a transparent top border, so the face sinks while the box keeps its height and nothing around it moves (tested).
- **Answer cards** (`app/lesson/card.tsx`): `12px` radius (`rounded-[12px]`), `2px` border with a `4px` bottom, `24px` desktop padding, `19px` desktop option text, number badge. Selected is amber; correct is teal with `duo-pop`; wrong is coral with `duo-shake`; the right answer is revealed after a miss.
- **Progress bar**: `16px` grey track, bright teal fill with a light highlight stripe.
- **Feedback bar** (`app/lesson/footer.tsx`): `140px` desktop height; after Check, the bar turns teal or coral with `duo-slide-up`, an icon disc, a bold `24px/30px` verdict, the one-line reason, and a `150px+` `17px` uppercase Continue button (full width on phones).
- **Modals** (`components/modals/`): `400px` max-width, `20px` radius, `32px` padding, centered `22px/28px` title, stacked `50px` 3D primary CTA and flat uppercase secondary action.
- **Path & Navigation** (`app/(main)/learn/`, `components/mobile-bottom-nav.tsx`): 70px round nodes with an 8px edge in a zigzag (cycle of 8, 40px steps), a bouncing Start bubble and a progress ring on the current lesson, a crown on the checkpoint, Daily Quests card in the sticky rail, and a fixed `64px` bottom tab bar on mobile (`< lg`).
- **Sidebar**: original flat colour icons in place of the upstream art.

## Interaction

- No sounds (rule 4). Confetti uses the site colours and is off with reduced motion; the Start bubble, shake, pop, and slide-up animations respect `prefers-reduced-motion`.
- Colour is never the only signal: right and wrong also use icons and words.
- Keyboard: 1–3 pick an option, Enter checks and continues; focus moves to each new step's heading (`focus-visible:ring-0` on the programmatic heading); every interactive control has a visible focus ring.
- Touch targets are at least 44px. Layouts are tested at 360px and 1280px.

