# Wins - generuss-design

### 2026-02-26 | approach

**Signal:** Full card print pipeline shipped in a single session - QR, artwork, gloss masks, all verified programmatically
**What worked:** Puppeteer-screenshots-the-HTML strategy eliminated all fidelity issues that plagued the Python reconstruction approach. One pivot killed four bug classes at once (period rendering, CMYK colors, icon precision, layout drift).
**Pattern:** When the source of truth already renders perfectly, screenshot it instead of reconstructing it. Push complexity into the tool that already solved the problem.

### 2026-02-26 | architecture

**Signal:** render-final.cjs survived being rewritten by another session and was quickly restored with improvements
**What worked:** The script's architecture is clean enough that it could be rebuilt from understanding alone - isolateCard, extractGloss, buildMaskHtml, sharp post-processing. Each function has one job.
**Pattern:** Small, single-purpose functions survive context loss. If you can explain the pipeline in 5 bullet points, the code can be reconstructed.

### 2026-02-26 | speed

**Signal:** QR generation with progressive fallback - styled version failed, rounded squares passed on first attempt
**What worked:** Building a fallback chain (full styled -> rounded dots no logo -> standard + logo -> standard) meant the script always produces a working QR. Didn't block on styling perfection.
**Pattern:** For generative assets, build progressive degradation into the script. Ship the best version that passes verification, not the ideal version that doesn't.

### 2026-02-26 | output-quality

**Signal:** Three verification catches before files went to print - 1px height, missing DPI metadata, anti-aliased gray pixels in masks
**What worked:** Running programmatic checks (dimensions, DPI, B/W purity) before declaring done. All three would have been invisible to eye but could cause print issues.
**Pattern:** Print files need automated verification at the spec level, not just visual QA. A pixel off, a missing metadata field, or a gray value in a B/W mask are all invisible but consequential.

### 2026-02-26 | output-quality

**Signal:** Final polish session - shadow depth, icon SVG details, QR logo centering - all shipped through rapid iteration with zero regressions
**What worked:** Iterative render-proof-review loop. Each change re-rendered in under 30s, opened proof for visual review, verified QR still scans. No manual file juggling, no broken intermediate states.
**Pattern:** When the render pipeline is solid, final polish becomes a tight feedback loop. Invest in the pipeline early so creative iteration is cheap later.

### 2026-02-26 | approach

**Signal:** SVG icon tweaks matched the brand logo precisely - clock hands, node diagram structure, corner radii
**What worked:** Using the actual logo as reference and translating its geometry into SVG path commands. Single-path clock hands with stroke-linejoin="round" for clean junctions. Arc-based bracket path for the node tree. Different rx values on terminal nodes to match brand's mixed-corner style.
**Pattern:** For brand consistency on print materials, reference the actual logo file and match geometry exactly. SVG paths with proper joins/caps produce cleaner results than overlapping line elements.

### 2026-02-26 | output-quality

**Signal:** "dude this is fucking immaculate!!! props to the nth degree!!" on the standalone timeline HTML
**What worked:** Replicated the site's TimelineBlogLayout in a self-contained HTML file with vanilla JS scroll tracking. 7 phases, stat cards, callout blocks, code snippets. Same visual language as the blog but zero framework dependencies.
**Pattern:** When you have a proven layout pattern (timeline blog), extract it into standalone HTML for non-blog use cases. The design system is portable - CSS tokens and structure work outside Astro.

### 2026-02-26 | initiative

**Signal:** "omg yes that's perfect!!!" when proposing /reflect as the learning-loop counterpart to /ship
**What worked:** Identifying a gap in the tooling - wins, lessons, memory, and journal updates were happening manually and inconsistently. Packaging them into a single slash command with a 7-step pipeline makes the learning loop as reliable as the deploy pipeline.
**Pattern:** When you notice yourself doing the same multi-step process repeatedly, package it into a command. The meta-work of building tools for the workflow is as valuable as the workflow itself.

### 2026-02-27 | architecture

**Signal:** "sweet! well done! nailed the full viewport!!" on the /connect bento hub page
**What worked:** Converting a standalone HTML prototype into a full Astro page with 3-breakpoint responsive grid (mobile single-col, tablet 2-col, desktop 3-col at 100dvh). Mapped bento tokens to scoped CSS variables, wired real links (Cal.com CTA, social profiles), removed the old redirect, and preserved all 5 CSS animations.
**Pattern:** When integrating a standalone prototype into an existing site, use the site's layout shell (BaseLayout) for consistency but keep all page-specific styles scoped. Define tokens on the page wrapper to avoid global conflicts. Full viewport = height: 100dvh + overflow: hidden on desktop, min-height on mobile.

### 2026-02-27 | initiative

**Signal:** "fuck it, let's set that up right now" - immediately greenlit the /connect page after strategic analysis of QR destination options
**What worked:** Laid out the three options (direct to site, direct to Cal.com, dedicated connect page) with tradeoffs, then recommended the middle ground. The "you own the URL" argument - change what /connect shows anytime without reprinting cards - was the clincher.
**Pattern:** When presenting options, lead with the one that preserves future flexibility. "You can change it later without reprinting" beats "here's the optimal destination right now."

### 2026-03-12 | architecture

**Signal:** "ok that's pretty cool!" on first seeing the Observatory canvas, then "let's push it to the site" with no revisions needed to the core animation
**What worked:** Deep-reading the actual Pharadoxa Observatory source code (all 7 source colors, metabolic rate formula, trip mode physics, circadian system) before writing a single line. The faithful recreation landed because it wasn't an approximation - it was the real parameters at a smaller scale.
**Pattern:** When recreating a complex visual system, read the actual source and extract the exact parameters. Approximation looks "off" even if you can't say why. Exact values look right immediately.

### 2026-03-12 | approach

**Signal:** "ok I'm happy with where that's at" after only two rounds of tuning (slower transitions + trip labels). Zero corrections to the core particle system, physics, or color logic.
**What worked:** Starting with the Lighthouse analysis before writing any code. The iframe-vs-canvas-vs-video discussion established the right approach (canvas) before any implementation. Then building a standalone HTML capture tool first, previewing it, and only integrating into the site after approval.
**Pattern:** For visual features, do the performance analysis first, build a standalone prototype second, get approval third, integrate fourth. Skipping straight to integration wastes time if the approach is wrong.

### 2026-03-21 | architecture

**Signal:** "fuck yeah" on the /mobile skill design, immediate /reflect trigger (session worth flushing)
**What worked:** Deep research pass before writing a single line - read all 12 existing commands, /ar skill, visual QA protocol, mobile testing protocol, Playwright scripts, site config. Then designed a skill (not a command) so /ar can self-improve it. Borrowed /ar methodology (binary evals, baseline, iterative fix loop, convergence detection) and embedded the actual Playwright JS checks inline.
**Pattern:** When building a new tool that fits into an existing tooling ecosystem, invest the research time to understand every adjacent tool's conventions and integration points first. The tool that slots cleanly into the system on first try is worth 3x the design time.

### 2026-03-21 | approach

**Signal:** "Excellent work. Very excited about this." on the 100x research memory unification
**What worked:** Audited all three storage layers (Supabase 50 rows, Obsidian 57 files, Desktop 11 files), identified the gap (Step 0 only reads Supabase, files are write-only), cross-referenced to find exactly 3 missing files, backfilled them, added `full_output` column, and updated the skill - all in one clean pass.
**Pattern:** When unifying data across multiple stores, audit all sources first, cross-reference to find gaps, then migrate toward the single source of truth. Don't just add a new read path - consolidate to one store and keep the others as convenience copies.

### 2026-03-21 | initiative

**Signal:** User asked for "a mobile slash command" - delivered a full skill with /ar integration, 10 automated Playwright checks, 5-phase pipeline, section-by-section isolation, convergence detection, and TSV logging. Zero corrections.
**What worked:** Reading "leverage the ar command" as a design constraint, not a literal invocation. Made it a skill (not command) so /ar can optimize it. Included the JS check code inline so the AI doesn't need a separate script. Worst-first section ordering and desktop regression checks were proactive additions.
**Pattern:** When building tools for the toolchain, design for composability. A skill that /ar can optimize is worth more than a command that runs once.

### 2026-03-21 | approach

**Signal:** "Fuck yeah, it's there." after 5 deploys to get the Pharallax services card visible
**What worked:** Stripping ALL GSAP from the services section and making it flat static HTML. The 100x research (5 parallel Opus agents) produced the strategy; the execution lesson was that GSAP ScrollTrigger cannot reliably animate elements that were previously inside pinned containers even after the pin is removed.
**Pattern:** When an animation framework is fighting you across multiple deploys, remove it. Content visibility > animation. Static HTML that works beats animated HTML that doesn't.

### 2026-03-21 | output-quality

**Signal:** "Love it. That sounds perfect." on the 100x synthesis for Pharallax services positioning
**What worked:** 5 parallel Opus agents (Layout, Messaging, Buyer Psychology, Competitive, Revenue) with a red team pass. The convergence map gave high-confidence findings (5/5 on headline change, no prices, distinct visual treatment). The buyer agent's contrarian take (don't make it a third equal card) led to the flipped pyramid that Russ chose.
**Pattern:** When agents disagree, the contradiction IS the insight. The buyer agent's pushback against the 3-column consensus produced the better layout.

### 2026-03-25 | output-quality

**Signal:** "that's 100% fucking perfect" on the final card revision with all sweetening passes complete
**What worked:** Proactively suggesting final-pass refinements after the core fixes were done - adding brand word + module labels to front gloss mask, text-rendering "THAT CONVERT" instead of rectangle, QR size bump, easter egg legibility fix. The gloss mask polarity inversion (the original Moo failure) was a simple bg/element color swap in the mask HTML builders. The three-beat tactile discovery arc (brand, pillars, CTA) came from thinking about the card as a physical object, not a screen layout.
**Pattern:** After fixing the reported problem, ask "what would make this better?" Print materials benefit from thinking about touch and physical discovery, not just visual hierarchy. Spot gloss on key text (not rectangles) creates a premium feel with surgical precision.

### 2026-03-25 | approach

**Signal:** "haha dude that's what's fucking UP!!!! so glad I had you do that" on the sweetening suggestions (brand word gloss, module label gloss, QR bump, easter egg fix)
**What worked:** Proactively offering final-pass refinements as a concise prioritized list (high impact vs small-but-worth-it vs leave-alone). Not a laundry list - a curated set with clear reasoning. The "leave alone" category was as important as the suggestions.
**Pattern:** When presenting improvement suggestions, categorize by impact and explicitly list what NOT to change. It builds trust and prevents scope creep. The user can approve the whole list at once.

### 2026-03-26 | approach

**Signal:** "that makes sense" then "perfect" then "this is looking really good" - zero corrections across the entire session. Every CSS change, font adjustment, and color unification landed first try.
**What worked:** Doing the full CSS-to-mm math upfront before proposing changes. Calculated every text element's pixel width against the new container width, identified the three elements that would overflow (back-brand, back-urls, identity padding), and proposed surgical compensating adjustments. Presented it as a table so Russ could see the full picture at once.
**Pattern:** For print layout changes, do the dimensional math exhaustively before touching code. Calculate every text element against its container. The cost of 5 minutes of math is zero iterations vs the cost of discovering overflow after rendering.

### 2026-03-31 | speed

**Signal:** Full conversion-first page restructure shipped from handoff to production in under 10 minutes. Section reorder, Principles removal, testimonial cleanup, Pharallax card shrink, copy alignment, GSAP cleanup - all in one pass.
**What worked:** Handoff doc had exact line numbers, clear priorities, and specific options (A/B/C for Pharallax). Used Python script for the section reorder (too many moving parts for sequential edits), then surgical Edit calls for content changes. Build-verified after structural change, then again after content changes.
**Pattern:** For large page restructures, use a script for the initial reorder (fragile with sequential edits), then use Edit for content-level changes. Verify build between structural and content phases.

## 2026-07-14: Astronaut A/B/C direction judging + the x-ray signature

Three real one-screen mocks (Workbench / Ledger / Night Shift) judged before any build code: the losing directions cost ~30 min total and made the winner defensible (and the Ledger's dotted-leader table + Night Shift's mood survived as adopted elements). The self-annotating "construction view" (body-class toggle + xr-\* classes + real token values) is a reusable technique: any craft-positioned site can ship a working-drawing layer. Also validated: OG images generated via the shot harness from an HTML template (zero new deps, on-brand plates, 14 images in one loop).
