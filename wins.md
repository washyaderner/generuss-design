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
