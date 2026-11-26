# Duolingo UI Inspection Brief

Extracted via Playwright (`google-chrome`, headless) on `https://www.duolingo.com` (public landing, guest lesson, and exit-lesson modal) at `1280x800` and `360x740`.

## Screenshots Captured
- `landing/landing-1280.png` — Public landing page (1280px)
- `lesson/lesson-question-1280.png` — Live lesson question state (1280px)
- `lesson/lesson-selected-1280.png` — Live lesson selected option state (1280px)
- `lesson/lesson-checked-1280.png` — Live lesson checked feedback bar (1280px)
- `lesson/lesson-360.png` — Live lesson mobile layout (360px)
- `modals/exit-1280.png` — Live exit-lesson confirmation modal (1280px)

## Extracted Computed Styles (Exact Values)

| Element | Width / Height | Typography | Radius / Border | Spacing / Motion |
|---|---|---|---|---|
| Landing H1 | `max-w: 480px`, `h: 88px` | `32px`, weight `700` | — | — |
| Landing Primary CTA | `w: 330px`, `h: 50px` | `15px`, weight `700`, `uppercase`, `letter-spacing: 0.8px` | `12px`, `border: 0 0 4px` | `padding: 0 16px` |
| Landing Secondary CTA | `w: 330px`, `h: 50px` | `15px`, weight `700`, `uppercase`, `letter-spacing: 0.8px` | `12px`, `border: 2px 2px 4px` | `padding: 0 16px` |
| Lesson Progress Bar | `h: 16px` (`w: 886px` @ 1280px) | — | pill (`9999px`) | smooth width/transform fill |
| Lesson Close (`×`) | `18px` glyph inside hit target | — | — | `transition: filter 0.2s` |
| Lesson H1 | `max-w: 600px`, `h: 40px` | `32px`, weight `700`, `line-height: 40px` | — | — |
| Lesson Answer Card | `border-radius: 12px` | `19px`, `line-height: 20px` | `border: 2px 2px 4px` | `padding: 24px`, bottom edge sinks on press |
| Lesson Check / Continue Button | `min-w: 150px`, `h: 50px` | `17px`, weight `700`, `line-height: 20.4px`, `uppercase`, `letter-spacing: 0.8px` | `16px`, `border: 0 0 4px` | `padding: 0 16px` |
| Lesson Footer Bar | `h: 140px` (desktop) | Verdict H2: `24px`, weight `700`, `line-height: 30px` | `border-top: 2px` (`0` when checked) | `transition: max-height 0.3s ease-in-out` |
| Exit Modal | `~380px` wide white card | Centered bold title (`20px–24px`), centered stacked buttons | `20px` radius, no corner `×` | Full-width 3D primary button + flat uppercase danger link button below |

## Unavailable Without Login
- Logged-in `/learn` path (`https://www.duolingo.com/learn` redirects guests back to onboarding). Existing ported measurements in `DESIGN.md` and `app/(main)/learn/` remain the baseline for `/learn` until inspected in a signed-in session.
