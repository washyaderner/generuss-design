# ART-DIRECTION.md - generussdesign.com v2 "The Workbench"

Committed 2026-07-14 (astronaut run, direction A of 3; B "Ledger" and C "Night Shift" lost and live in .tmp/directions/).

## The thesis, one sentence

The site is the working drawing of itself: a hand-coder proves the craft claim by shipping construction-documented pages, with dimension lines, margin figures, and a signed titleblock, on warm drafting paper instead of the category's dark void.

## The one feeling

"I am looking at the actual workbench of the person who will build mine." Inspectable, precise, warm, human. Drawn, not generated.

## The signature moment (what a visitor screenshots)

THE X-RAY TOGGLE: a "construction view" switch on the homepage that flips the hero (and section chrome) into its own annotated working drawing: grid lines appear, spacing tokens label themselves, the easing curve draws itself next to the CTA, real token values pinned like specimens. The site inspecting itself is the sales pitch nobody in the category makes.

## Never-shipped technique (constraint box)

1. Self-annotating construction layer driven by a single CSS class toggle + CSS custom properties (the x-ray view). Never shipped before this build.
2. CSS scroll-driven annotations (animation-timeline: view()) for margin figures that draw in as they enter, JS-free where supported.

## Banned crutch (named for this build)

Recycling the current layout with new colors. Concretely: no neumorphic raised/inset cards, no dark-void + cyan, no reuse of the current section compositions. The composition system is new: sheet margins, annotation rail, dimension lines, figure plates.

## Palette (locked)

- paper: oklch(0.965 0.008 85) bg
- paper-deep: oklch(0.93 0.012 85) surface (cards, plates)
- paper-shade: oklch(0.895 0.015 85) surface-raised borders/wells
- ink: oklch(0.22 0.015 60) text + panels
- ink-soft: oklch(0.42 0.012 60) muted text
- draft (accent): oklch(0.52 0.085 245) drafting blue, annotations + accents only, under 15% of surface
- seal: oklch(0.55 0.16 35) vermilion, ONLY for the titleblock stamp + one signature accent per page (approve/sold moments)
- Dark ink panels (inverted sections) use paper text on ink bg; max 2 per page.

## Type (locked)

- Display: Fraunces variable (opsz 9..144, weight 380..620, italics for the measured phrase). It has hands.
- Annotation/mono: IBM Plex Mono 400/500 (figures, dims, labels, code).
- Body: Archivo (400/500/600) for long-form paragraphs; mono stays for annotations only so body copy breathes.
- Scale: modular 1.333, coupled leading per pilot-polish tokens.

## Motion vocabulary (locked)

- Easing: --ease-out-expo cubic-bezier(0.16, 1, 0.3, 1) everywhere; nothing on a default curve.
- Entrances: rise (translateY 18px + fade), staggered 80-120ms; hero choreography under 1s.
- Dimension lines and rules DRAW (scaleX from 0) on entry; figures fade in after their rule.
- Compositor-only. prefers-reduced-motion: everything visible, nothing moves.

## Composition system

- Every page is a numbered SHEET with a titleblock (top: project, sheet no.; bottom: signed RG + tolerance line).
- Registration marks at corners of the viewport (fixed, subtle).
- One thin margin rule left; annotation rail right on desktop (collapses to inline figure cards on mobile).
- Sections are PLATES: FIG. 01 HERO, FIG. 02 LEAKS (problem), FIG. 03 BUILT WORK (portfolio), FIG. 04 BILL OF MATERIALS (offer ladder, adopts B's dotted-leader table), FIG. 05 METHOD (process), FIG. 06 FIELD REPORTS (testimonials), FIG. 07 THE DRAFTSMAN (about), FIG. 08 THE GUARANTEE (seal moment), FIG. 09 BOOKING.
- No two adjacent plates share composition. Ink panels: FIG. 08 guarantee + one more max.

## The anti-brief (three things this build will NOT do)

1. No dark-tech hero, no glow gradients, no cyan. The warmth IS the differentiation.
2. No annotation soup: max 3 margin figures per viewport; annotations are jewelry, not wallpaper. When in doubt, delete the note.
3. No fake precision: every dimension, easing value, and token shown must be the REAL value from this codebase. If we display cubic-bezier(0.16, 1, 0.3, 1), that is the curve actually running.

## Constraints carried from the audit (never regress)

- Money paths intact: Cal.com booking (#booking + /call-confirmed), 3-tier offer ladder, /seo page, /taste-audit Stripe $197.
- Section anchors preserved: #hero #proof #problem-solution #portfolio #offer #process #reviews #about #guarantee #booking.
- Every URL keeps or improves title, meta description, schema graph, H1/H2 structure, internal links.
- Phase-2 SEO carries: answer-first FAQ block on home, per-page OG images, LCP diet (target mobile 95+), /event-websites + /compare + /process gap pages in the same visual system.
- FLOOR all 17 points; no widows; no em or en dashes; llms.txt updated at ship.

---

## Critique log (evidence, FLOOR #17)

Three hostile passes, shots on disk under .tmp/pass1, .tmp/pass2, .tmp/pass3 + .tmp/sweep (coherence pass over every other page). Both viewports each pass.

**Pass 1 caught:** Fraunces roman/italic files swapped at download (every serif slanted; refetched per-style, verified in pixels). Dead grid cell in the built-work bento (filled with the reserved plate + flat-file card, which also added a conversion moment). Booking calendar cramped in a split column (went full-width, forms below). Seal ring text started mid-ring. Crawler artifacts separately fixed in the /seo skill (attribute regex + entity decode).
**Upgrade 1:** scroll-driven entrances via animation-timeline: view() with IO fallback.

**Pass 2 caught:** FAQ right half was a dead zone (added the Fig. 09a at-a-glance rail, sticky). "Hover any plate" copy lied on touch (rewrote). New-page heroes lacked the margin-note rail (added one figure each). Duplicated proof line on the event hero (cut).
**Upgrade 2:** construction-view margin ruler ticks down the left sheet edge.

**Pass 3 caught:** guarantee seal appeared statically (now stamps in on scroll, reduced-motion safe). Touch targets (footer links, nav CTA, inline email link) brought to 44px. Ink-panel small text raised to paper/75. xr-tag padding snapped to the 4pt grid.
**Upgrade 3:** the seal stamp-in moment.

**Gates:** pilot-qa floor 25/30 (target 22) PASS. Logged deviations, each examined: typographic hero is the thesis (F3); below-fold "invisible" images are the content-visibility render-skip artifact, verified rendered on scroll; 12 type sizes are one 1.333 modular system with an annotation register (PD3); PD4 flag is an oklch parsing artifact in the eval, flagged elements hand-verified AAA; 11.5px strings are mono captions, body copy is 16px+ (F5). Taste gate: T 10/10, P 6/8, combined 16/18 (production band); POV verdict SHIP: the working-drawing thesis is committed, category-escaping, and sustained across 11 plates + 3 service sheets; signature x-ray verified live with zero console errors.
