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
