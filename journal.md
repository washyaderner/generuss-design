# Project Journal - generuss-design

> Auto-generated build journal. Captures commits, decisions, friction, and lessons.

## 2026-02-23 | SHIP | e1bd4ca...545c4aa

Shipped: Claude's retrospective blog post (third post) and portfolio video player replacement
Commits: 125 since project start
Key changes:

- Added "Claude's Retrospective On Working With Me" as third blog post using default layout
- Replaced portfolio iframe modal with embedded video player
- Generated lava lamp SVG thumbnail for new post

## 2026-02-26 | SHIP | 545c4aa...9aa9418

Shipped: Business card print pipeline - full Moo Super card artwork, branded QR, spot gloss masks, automated verification, /connect redirect
Commits: 2 since last ship
Key changes:

- Complete render pipeline (render-final.cjs) producing 600dpi print-ready PNGs and gloss mask PDFs from HTML source
- Branded QR code with cyan rounded-dot modules, "g" lettermark, progressive fallback, programmatic scan verification
- SVG icon polish matching brand logo - single-path clock hands, arc-cornered node tree, mixed-radius terminal nodes
  Lesson: For print-quality SVG, never use overlapping line elements at junctions. Single paths with stroke-linejoin="round" and arc commands produce clean results at 600dpi where separate lines create visible artifacts.

## 2026-02-26 21:34 | post-ship

Decision: Built standalone timeline.html for the business card build (card/timeline.html)
Friction: None - the TimelineBlogLayout pattern translated cleanly to vanilla JS
Lesson: The site's design system (CSS tokens, timeline structure) is portable outside Astro. Standalone HTML with the same tokens produces identical visual output.

## 2026-02-26 21:45 | SESSION

**Context:** Continued card print pipeline from previous session - final polish and ship
**Outcome:** Shipped PR #52 (card pipeline + /connect redirect), built standalone build timeline (card/timeline.html), created /reflect slash command for learning loop flush
**Signal:** Strong positive throughout. "legitimately perfect", "moneyyyyyyy", "fucking immaculate", "LOVE working with you, Kit". Timeline HTML was the highlight - instant enthusiasm on first render.
**Friction:** SVG icon polish took ~6 iterations (shadow depth, edge catches, clock hands, node diagram structure, corner radii, junction smoothing). Each was small but the cumulative back-and-forth was the longest chain. Pipeline made iteration cheap though.
**Carries forward:** Print files ready for Moo upload. /reflect command is new - first real run was this session. Two compound-docs candidates flagged (SVG junctions, design system portability).

## 2026-02-27 | SHIP | 9aa9418...d44c863

Shipped: /connect bento hub landing page - QR code destination is now a real page with full context instead of an external redirect
Commits: 2 since last ship
Key changes:

- New src/pages/connect.astro with responsive bento grid (3-col desktop at 100dvh, 2-col tablet, 1-col mobile)
- Removed /connect redirect from astro.config.mjs, replaced with actual page using BaseLayout
- CTA wired to Cal.com discovery call, social icons linked to real profiles, all 5 CSS animations preserved

## 2026-02-27 01:30 | SESSION

**Context:** QR code destination strategy - business card points to /connect, needed a real page instead of external redirect
**Outcome:** Shipped PR #53. Built /connect bento hub from polished HTML prototype, integrated into Astro site with 3-breakpoint responsive grid. Removed old redirect. Full deploy pipeline clean.
**Signal:** Strong positive. "nailed the full viewport!!" on first render. Immediate greenlight on the strategic recommendation ("fuck it, let's set that up right now"). Clean session - zero corrections needed.
**Carries forward:** Page is live at generussdesign.com/connect. Polish opportunities: real portfolio screenshots instead of CSS art previews, LinkedIn URL, dark mode Cal.com embed (still unsolved from earlier). Blog post draft (what-your-ai-needs-from-you) sitting untracked.

## 2026-02-27 08:25 | SESSION

**Context:** Preparing to order Moo Super business cards - needed upload instructions
**Outcome:** Compiled Moo upload guide from handoff spec and render pipeline docs. Product selection (Super, Soft Touch, Raised Spot Gloss), file mapping (4 files in card/print/), mask upload instructions (white = gloss, black = matte), and gotchas (bleed included, RGB is correct, coverage under 20% limit).
**Carries forward:** Cards ready to order on Moo. Print files unchanged since last session. Blog post draft still untracked.

## 2026-02-27 | SHIP | d44c863...c6957b1

Shipped: Journal, wins, and blog post updates - learning loop flush from /connect build sessions plus new AI collaboration blog post
Commits: 5 since last ship
Key changes:

- AI collaboration blog post with lava lamp thumbnail
- Journal and wins entries from /connect bento hub and Moo prep sessions

## 2026-03-01 | SHIP | c6957b1...8e697d4

Shipped: Portfolio slideshow component with auto-advancing crossfade across 3 project cards, visibility-aware auto-advance, and updated business card print spec
Commits: 6 since last ship
Key changes:

- Added multi-slide portfolio cards with dot navigation, hover pause, and 4s crossfade intervals
- IntersectionObserver gates slideshow timers so off-screen cards don't cycle wastefully

## 2026-03-01 | SHIP | 8e697d4...874b313

Shipped: iPhone 16 Pro Max mockups alongside desktop slideshows in portfolio section
Commits: 2 since last ship
Key changes:

- CSS iPhone frame with Dynamic Island, neumorphic shadow, accent glow on hover next to each desktop slideshow
- Portfolio container widened to max-w-6xl for side-by-side layout

## 2026-03-04 | SHIP | 874b313...7649d7f

Shipped: Fresh portfolio screenshots with dual slideshow layout - desktop and mobile slideshows per project card
Commits: 4 since last ship
Key changes:

- Replaced all portfolio images with cropped 5K desktop and iPhone screenshots (27 webp files)
- Mobile slideshow inside phone mockup runs independently alongside desktop slideshow per card
- Image processing script (execution/process-portfolio-screenshots.cjs) for repeatable crop/resize/convert pipeline

## 2026-03-06 | SHIP | 7649d7f...b8e0ea1

Shipped: Housekeeping - journal sync and .vscode added to gitignore
Commits: 2 since last ship
Key changes:

- Added previous ship entry to journal.md
- Added .vscode/ to .gitignore to keep editor config out of repo

## 2026-03-07 | SHIP | b8e0ea1...ffaa53f

Shipped: Pharadoxa case study card in portfolio section and standalone breakdown page, plus portfolio phone mockup refinements
Commits: 2 since last ship
Key changes:

- Pharadoxa case study card with stats grid and link to /case-studies/pharadoxa/ breakdown page
- Desktop and mobile slideshows now sync within each portfolio card (shared timer, dot clicks control both)
- Phone mockup proportions tightened (smaller bezel, flex-stretch to match desktop height)
- Business card updated to v16 design with regenerated 600dpi print assets

## 2026-03-09 09:20 | SESSION

**Context:** Spot gloss mask refinement for back of business card - wanted heartbeat line to connect through pulse dots
**Outcome:** Attempted 7+ iterations of connector bars (CSS divs bridging SVG to dots). Threshold step made matching widths intractable - always slightly too thick or too thin. Reverted to original spike-only heartbeat mask. Cards ordered on Moo with existing design.
**Signal:** Patient through iterations, decisive on revert. "It's fine if we just have the pulse and the dots highlighted." Clean call to stop.
**Friction:** CSS div height vs SVG stroke-width in a thresholded B/W context. Anti-aliasing differences between the two rendering methods meant no ratio produced a seamless join after threshold(128).
**Carries forward:** Cards ordered. Design source is now v17 (business-card-v17.html). Render pipeline pointed at v17.
