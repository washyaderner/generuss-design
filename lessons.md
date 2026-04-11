# Lessons - generuss-design

### 2026-02-26 | tooling

**Correction:** jsQR cannot scan cyan (#00e5ff) on white - the color is too bright to register as "dark" modules
**Rule:** When verifying colored QR codes with jsQR, always negate+flatten first: `sharp(file).negate({ alpha: false }).flatten({ background: "#ffffff" })`

### 2026-02-26 | tooling

**Correction:** Puppeteer rounds fractional clip dimensions down, causing 1px shortfall (536.41 -> 536 -> 1393px instead of 1394)
**Rule:** Set viewport to ceil(target/scale), screenshot at full viewport, then crop to exact dimensions with sharp. Never rely on Puppeteer clip for sub-pixel precision.

### 2026-02-26 | tooling

**Correction:** Puppeteer does not embed DPI metadata in PNG screenshots
**Rule:** Always post-process Puppeteer PNGs with `sharp().withMetadata({ density: DPI })` for print output. Without this, print services may interpret at 72dpi.

### 2026-02-26 | tooling

**Correction:** Browser-rendered gloss masks have anti-aliased gray pixels on rounded shapes and SVG strokes
**Rule:** Always threshold mask PNGs with `sharp().grayscale().threshold(128)` before converting to PDF. Spot gloss masks must be pure B/W - gray values cause unpredictable partial application.

### 2026-02-26 | approach

**Correction:** Circular QR modules (border-radius: 50%) fail to scan because circles only fill ~78% of module area. Gaps between circles break timing patterns.
**Rule:** For styled QR codes, use rounded squares (rx/ry ~35% of module size) not circles. Preserves fill area while still looking styled. Keep finder patterns as standard squares.

### 2026-02-26 | approach

**Correction:** Python reconstruction of an HTML design (competition approach) produced four simultaneous bug classes that took two iterations to partially fix
**Rule:** If the design already renders correctly in a browser, screenshot it via Puppeteer instead of reconstructing programmatically. Only build programmatically what doesn't exist in the DOM (gloss masks, QR codes).

### 2026-02-26 | architecture

**Correction:** Another session rewrote render-final.cjs with viewport=2079x1394 at deviceScaleFactor=1, which doesn't work because the card CSS is 800px wide
**Rule:** The card renders at 800px CSS width. The correct approach is VP_W=800 + deviceScaleFactor=SCALE (2.599) + crop. Document the viewport/scale relationship in the script header so future sessions don't reinvent it wrong.

### 2026-02-26 | approach

**Correction:** Overlapping SVG lines at junctions (clock hands, node tree branches) create visible nubs, sharp corners, and fragmented intersections at print scale
**Rule:** When SVG elements share a junction point, combine them into a single `<path>` with `stroke-linejoin="round"`. Never use overlapping `<line>` elements - the linecap overlap is always visible at high DPI. For curved corners in bracket/tree structures, use arc commands (`A rx,ry`) in the path rather than separate lines.

### 2026-02-26 | approach

**Correction:** The QR "g" was shifted DOWN (dy="+0.05em") when it needed to go UP to optically center the descender. Had to reverse direction to dy="-0.12em".
**Rule:** Lowercase letters with descenders (g, j, p, q, y) need negative dy to optically center in a container. The descender pulls the visual center down - compensate upward, not downward.

### 2026-03-09 | approach

**Correction:** Spent 7+ iterations trying to connect gloss mask heartbeat line to pulse dots with CSS div connector bars. Threshold step (grayscale + threshold(128)) makes matching SVG stroke width to div height nearly impossible - anti-aliasing differences create visible seams at every ratio.
**Rule:** Don't try to bridge separate rendering methods (CSS divs vs SVG strokes) in thresholded B/W masks. If elements need to connect seamlessly, render them as a single SVG path. If that's not feasible, accept them as separate gloss elements. Know when to revert - 3 failed approaches means the technique is wrong.

### 2026-03-12 | process

**Correction:** Edited the case study HTML to remove the top Observatory but user still saw it - dev server was serving cached static files from `public/`.
**Rule:** After editing static HTML in `public/`, always tell the user to hard refresh (Cmd+Shift+R). Dev server caching for static assets is aggressive. Better yet, kill and restart the dev server for `public/` changes.

### 2026-03-21 | architecture

**Correction:** GSAP ScrollTrigger animations on the Pharallax card failed across 5 consecutive deploys. Every approach (pin + fadeUp, no pin + fadeUp, no pin + custom gsap.from, no pin + no gsap-hidden) left the card invisible on the live site. The gap kept growing while the card stayed at opacity 0.
**Rule:** When GSAP ScrollTrigger fails for an element that was previously inside a pinned container, don't iterate on the animation - remove it entirely. The pin's position calculations poison subsequent ScrollTrigger calculations for sibling/adjacent elements even after the pin is removed. Make the content static and visible first. Add animation back only after visibility is confirmed on production.

### 2026-03-21 | process

**Correction:** Shipped 5 PRs (#78-#82) for the same broken feature. Each "fix" added complexity without verifying on the live site first. Should have circuit-breakered after the second failed deploy.
**Rule:** If the same element is invisible after 2 deploys, the approach is wrong. Stop iterating on the same pattern. Strip everything back to static HTML, confirm it works on production, THEN layer enhancements. Two failed deploys = re-plan, not re-try.

### 2026-03-25 | tooling

**Correction:** Moo Raised Spot Gloss masks require black = gloss areas, white = no gloss. Our masks had the opposite (white elements on black background), causing gloss to cover the entire card surface.
**Rule:** For Moo spot gloss masks: black on white. Black pixels = where gloss is applied. White pixels = no gloss. Verify polarity by checking that white pixels are >90% of the mask (gloss should be a small percentage of surface area). Build a polarity check into the QA pipeline.

### 2026-03-25 | approach

**Correction:** Gloss mask for "THAT CONVERT" was rendered as a filled rectangle (bounding box) instead of text letterforms. The front "LET'S BUILD." was already rendered as text but the back wasn't.
**Rule:** Always render gloss mask text as actual text with matching font properties (family, size, weight, letter-spacing), not as bounding-box rectangles. Extract computed styles from the DOM element and replicate them in the mask HTML. Rectangles of gloss behind text look cheap; letterform gloss looks premium.

### 2026-03-26 | tooling

**Correction:** render-final.cjs calls `pngToPdf()` for gloss masks but NOT for artwork. Artwork PDFs were stale (yesterday's timestamp) while PNGs were fresh. Had to manually convert.
**Rule:** After running render-final.cjs, always check timestamps on ALL 4 PDFs. If artwork PDFs are stale, regenerate them from the fresh PNGs. Consider adding artwork PDF conversion to the main pipeline.

### 2026-03-26 | approach

**Correction:** Card CSS had two different cyans - `--cyan: #00FFEF` in the card HTML vs `QR_COLOR = "#00e5ff"` in the QR generator. Both the hex values AND rgba equivalents (0,255,239 vs 0,229,255) needed updating.
**Rule:** When unifying a color across a print pipeline, check three places: CSS custom properties, hardcoded hex in inline SVGs, and rgba() values in shadows/glows. A hex find-replace misses the rgba form.
