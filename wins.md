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
