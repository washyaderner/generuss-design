# Card Competition Directive v6 - generuss Business Card v11

## Mission

Two agent teams race to render a print-ready generuss business card (front + back) at 600dpi CMYK. Each team produces artwork PDFs and Spot Gloss mask PDFs. Outputs are compared for fidelity against the HTML prototype (`business-card-v11.html`). Winner's files go to print.

---

## Teams

### Team Alpha - Pillow Pro

Pure Python/Pillow compositing pipeline. All rendering done through PIL image operations, text rendering, and manual shadow/glow compositing.

### Team Bravo - Hybrid Engine

CairoSVG for vector elements (icons, heartbeat line, circuit traces) rasterized at native 600dpi, composited into Pillow for final output. Best of both worlds - vector precision where it matters, bitmap compositing for effects.

---

## Output Requirements

### Files Per Team (6 total)

1. `front-artwork.pdf` - CMYK, 600dpi, with bleed
2. `back-artwork.pdf` - CMYK, 600dpi, with bleed
3. `front-gloss-mask.pdf` - B/W only, 600dpi, with bleed
4. `back-gloss-mask.pdf` - B/W only, 600dpi, with bleed
5. `front-proof.png` - RGB preview for screen comparison
6. `back-proof.png` - RGB preview for screen comparison

### Dimensions

- Trim: 84mm x 55mm (3.31" x 2.17")
- Bleed: 3.175mm (0.125") each side
- Total canvas: 90.35mm x 61.35mm
- At 600dpi: 2134 x 1449 px

### Color

- Artwork: CMYK with embedded ICC profile (FOGRA39 or US Web Coated SWOP v2)
- Gloss masks: Grayscale, white = gloss, black = no gloss
- All RGB-to-CMYK conversions must use ICC profile, NOT naive math conversion

---

## Design System - CMYK Color Map

RGB source values with target CMYK equivalents. Teams MUST use the CMYK values for artwork PDFs, not auto-converted RGB.

```
Token            RGB Hex     CMYK Target (C/M/Y/K)     Usage
─────────────────────────────────────────────────────────────
base             #1A1A1E     C:60 M:50 Y:40 K:90       Card background (rich black)
surface          #222226     C:55 M:45 Y:38 K:85       Raised module fill
shadow-dark      #0D0D0F     C:65 M:55 Y:45 K:95       Shadow passes, recessed wells
shadow-light     #2E2E33     C:48 M:40 Y:34 K:78       Light shadow edge
cyan (weapon)    #00FFEF     C:80 M:0 Y:20 K:0         Accent color (closest gamut match)
text-primary     #E8E8E8     C:0 M:0 Y:0 K:10          Brand name, headings
text-secondary   #9A9AA0     C:0 M:0 Y:0 K:42          Labels, generuss, tagline base
text-muted       #6B6B75     C:0 M:0 Y:0 K:58          Corner brackets, micro text
contact-text     #9A9AA0     C:0 M:0 Y:0 K:42          Email, phone, URLs
```

### Critical: Weapon Cyan

`#00FFEF` is out of CMYK gamut. Target `C:80 M:0 Y:20 K:0` is the closest achievable match. Test print this color early. If it shifts too green, bump Magenta to M:5. If too dull, drop Yellow to Y:15. This is the single most important color decision for the card.

### Critical: Rich Black

Do NOT use `K:100` alone for the base. It prints as a washed-out dark grey. Rich black (`C:60 M:50 Y:40 K:90`) gives depth. Total ink coverage stays under 280% (Moo's likely limit is 300%).

---

## Font

- **JetBrains Mono** - all text, both sides
- Must be installed locally for Pillow text rendering
- Download: https://github.com/JetBrains/JetBrainsMono/releases
- Weights needed: 400 (Regular), 500 (Medium), 600 (SemiBold)

### Subpixel Text Rendering

Render all text at 2x target resolution (1200dpi equivalent), then downscale with LANCZOS resampling to 600dpi. This produces cleaner edges and better kerning than native 600dpi rendering. Critical for small text (micro version, QR label, URL text).

---

## Front Layout Spec

### Canvas

Background: `base` color filling full canvas including bleed.

### Corner Brackets

- All 4 corners, 14px L-shapes (scale to print: ~2.4mm)
- Color: `text-muted` at 25% opacity
- Offset: 12px from card edge (inside trim, not bleed)

### Noise Texture

- Generate fractal noise at native 600dpi (do NOT upscale from lower res)
- 2-3% opacity overlay across full canvas
- This provides the matte surface texture visible on the physical card

### Brand Word - "generuss"

- Centered horizontally, positioned above modules
- 26px screen = ~4.4mm print height
- Weight: 600 (SemiBold)
- Color: `text-secondary`
- Letter-spacing: 12px screen = ~2mm print
- Lowercase

### Raised Modules (x2)

- 286x253 screen = ~48.5mm x 42.9mm print
- 28px gap between = ~4.75mm
- Centered horizontally as a pair
- Corner radius: 16px = ~2.7mm
- Fill: `surface`

#### Module Shadow (Multi-Pass)

Three Gaussian blur passes composited beneath each module:

1. **Pass 1 (primary):** Offset +8,+8px, color `shadow-dark`, blur radius 16px
2. **Pass 2 (secondary):** Offset -4,-4px, color `shadow-light`, blur radius 10px
3. **Pass 3 (inset):** Inset 0,1px, white at 6% opacity, blur 0px (top edge shine)

#### Module Surface Effects

- **Top-edge shine:** 1px line, white gradient 0%->12%->6%->0% left to right, top 8%-92% of width
- **Left-edge catch:** 1px line, white gradient 0%->5%->0% top to bottom, left 8%-85% of height
- **Specular sweep:** 155deg diagonal, white at 4%->1.5%->0%, full module area

#### Design Module Icons (Left)

ViewBox content area: `6 0 150 66` (cropped, no dead space)

**Browser window:**

- Rect: 72x54 starting at (20,6), rx=5, stroke 2.2px cyan
- Title bar line: y=19, full width, 1.4px cyan
- Three dots: cx=27/34/41, cy=12.5, r=2, fill cyan 55%
- Code lines: 4 lines at y=28/35/42/49, varying widths, 1.3px stroke, opacity 25%/18%/15%/12%

**Phone:**

- Rect: 34x54 at (108,6), rx=6, stroke 2.2px cyan
- Notch bar: y=13, 1.3px, 40% opacity
- Home indicator: y=52, 1.5px, 25% opacity
- Dot grid (3x4): centers at cx=117/125/133, cy=23/30/37/44, r=1.8, fill cyan, opacity fading 30%->25%->20%->15% per row

#### Automation Module Icons (Right)

ViewBox content area: `10 0 160 66` (cropped, no dead space)

**Clock:**

- Circle: cx=50, cy=36, r=26, stroke 2.2px cyan
- Hour hand: (50,36)->(50,19), 2px stroke
- Minute hand: (50,36)->(63,42), 1.6px stroke
- Center dot: r=2.8, fill cyan 50%
- Tick marks: 4 cardinal positions, 1.2px, 30% opacity

**Node diagram:**

- Hub circle: cx=130, cy=16, r=9, stroke 2px cyan
- Hub dot: r=2.5, fill cyan 40%
- Trunk line: (130,25)->(130,40), 1.8px
- Branch lines: (130,40)->(114,40) and (130,40)->(146,40), 1.8px
- Terminal nodes: 18x18 rects at (105,40) and (137,40), rx=3, 1.8px stroke
- Terminal dots: r=2.2, fill cyan 30%

#### Module Labels

- "design" and "automation" centered below icons in each module
- 19px screen = ~3.2mm
- Weight: 500, `text-secondary`, letter-spacing 5px = ~0.85mm
- Lowercase

### Tagline Row

- Centered, 600px zone width (matching module span)
- 3 lit dots: 6px diameter, fill `cyan`, glow shadow
- 2 dim dots: 6px diameter, fill `text-muted` at 25%
- Gap between dots: 10px
- Text: "flawless by design" - 13px = ~2.2mm, weight 500, `text-secondary`, 4px letter-spacing
- Lowercase

### Glow Line

- Full 600px width, 3px height = ~0.5mm
- Fill: `cyan`
- Bloom effect above: 26px upward gradient, cyan at 15% to transparent, 6px blur
- Bloom effect below: 16px downward gradient, cyan at 10% to transparent, 4px blur
- Surface specular: 1px white gradient across top, peaks at 50%-60% opacity center

### CTA

- "FLIP CARD. SCAN CODE. LET'S BUILD." centered below glow line
- 13px = ~2.2mm, weight 500, `text-secondary`, 3px letter-spacing
- "LET'S BUILD." portion: `cyan`, weight 600
- Uppercase
- Margin-top: 16px from glow line

### Card-Level Shine Layers

Composited as separate transparent layers above the card base, below content:

1. **Primary vignette:** Ellipse, top-left origin (-32%,-16%), 62%x72% size, white 6.5% center to transparent
2. **Secondary specular:** Ellipse, top-center (15%,-20%), 35%x40%, white 3.5% center to transparent
3. **Cyan ambient:** Ellipse, bottom-center, 8%-92% width, 45% height, cyan 4% center to transparent
4. **Top edge catch:** 1px, left 3% to right 60%, white gradient peaking at 6%
5. **Left edge catch:** 1px, top 3% to 50%, white gradient 4% to transparent

### Micro Version

- "SHIPPED 2026" - 6px = ~1mm
- `text-muted`, 45% opacity, 2px letter-spacing
- Bottom-right, offset right: 32px from edge (clears corner bracket)

---

## Back Layout Spec

### Canvas

Background: `base` with edge darkening vignette (radial gradient, transparent center 40%, black 15% at edges).

### Corner Brackets

Same as front.

### Circuit Traces

Thin PCB-style lines on edges with node dot terminators:

- Horizontal: top-right (32px wide at y=48), bottom-left (25px wide at y=bottom-55)
- Vertical: top-right (20px tall at x=right-48), bottom-left (16px tall at x=55)
- Node dots: 3px circles at line endpoints, `text-muted` at 14%
- Line color: `text-muted` at 10%

### Grid Layout

- CSS grid: `186px 1fr` columns, 12px gap, 20px padding
- QR zone: left column, full height (`grid-row: 1 / -1`)
- Right column: 3 wells stacked vertically with 10px gap

### QR Zone (Recessed Well)

- Full left column height
- Recessed shadow treatment (see Recessed Module Shadows below)
- QR code box: 130x130px = ~22mm square
  - Inverted QR: dark background, white/light modules
  - Target URL: `generuss.com/connect`
  - Box has inner shadow, 6px radius, 1px white border at 4%
- Label: "scan to connect" - 9px = ~1.5mm, `text-muted`, 2.5px letter-spacing, uppercase

### Recessed Module Shadows

All right-column wells use this inverted shadow treatment:

- Fill: `shadow-dark`
- Inset shadow 1: 6px 6px 14px, black at 70%
- Inset shadow 2: -3px -3px 10px, rgb(60,60,68) at 10%
- Inset shadow 3: 2px 2px 6px, black at 50%
- Outer catch: 1px 1px 2px, white at 1.5%
- Border: 1px, white at 2%
- Inner top-left light catch: 1px white gradient at 6%, fading right
- Inner left catch: 1px white gradient at 4%, fading down
- Corner radius: 10px = ~1.7mm

### Identity Well (Right Column Top)

- Padding: 20px 22px (= ~3.4mm x ~3.7mm)
- Flex column, `justify-content: space-between`
- 5 direct children (no wrapper divs), evenly distributed:

1. **Brand:** "generuss design & automation"
   - 26px = ~4.4mm, weight 600, `text-primary` (white), 1.5px letter-spacing
   - `white-space: nowrap`, fills well width edge to edge

2. **Tagline:** "BUILDING GORGEOUS WEBSITES THAT CONVERT"
   - 17px = ~2.9mm, weight 600, `text-secondary` (grey), 1.5px letter-spacing
   - "THAT CONVERT" span: `cyan` with text-shadow glow (0 0 10px cyan at 25%)
   - `white-space: nowrap`, uppercase

3. **Name:** "Russell Gardner"
   - 22px = ~3.7mm, weight 500, `text-secondary`, 2.5px letter-spacing
   - Reaches approximately half the well width

4. **Email:** "russ@generuss.com"
   - 18px = ~3mm, `contact-text`, 1.5px letter-spacing

5. **Phone:** "503.734.5502"
   - 17px = ~2.9mm, `contact-text`, 1px letter-spacing

### Status Well (Right Column Middle)

- Padding: 14px 22px
- Flex row, align center

Layout (left to right):

1. "Design" label - 16px = ~2.7mm, weight 500, `text-secondary`, 3px letter-spacing, uppercase
2. Cyan dot - 9px = ~1.5mm diameter, `cyan` fill, glow shadow (0 0 6px cyan 35%, 0 0 14px cyan 20%)
3. Heartbeat SVG line - flex fill remaining width, 28px height
   - Flat line at y=12, spike at ~65% from left: peaks at y=3, dips to y=20, settles y=8, returns y=12
   - 2px stroke, `cyan`, full opacity, static (no animation)
   - Drop-shadow glow: 0 0 6px cyan 70% + 0 0 12px cyan 30%
4. Cyan dot - same as #2
5. "Automation" label - same spec as "Design"

### URLs Well (Right Column Bottom)

- Padding: 14px 22px
- Flex row, centered, 14px gap

Content: "generussdesign.com" + dot + "generuss.com" + dot + "YT @generussai"

- All text: 14px = ~2.4mm, `contact-text`, 1.5px letter-spacing
- Separator dots: 4px = ~0.7mm, `cyan` fill at 45%, glow shadow (0 0 3px cyan 15%)

### Micro Version

Same as front: "SHIPPED 2026"

---

## Spot Gloss Masks

Separate B/W PDFs. White areas receive Raised Spot Gloss treatment. Black areas remain Soft Touch matte only.

### Front Gloss Mask

- Glow line: full 600px width, 3px + slight bloom expansion (~1px each side)
- 3 lit progress dots (not the 2 dim ones)
- Optional: module top-edge shine lines

**Target coverage: ~8-10%** (well under Moo's 20% limit)

### Back Gloss Mask

- "THAT CONVERT" text in tagline
- Both status pulse dots (9px)
- Heartbeat spike section (the peak portion, not the flat line)
- Separator dots between URLs

**Target coverage: ~6-8%**

---

## Rendering Pipeline

### Both Teams Must Implement

1. **Canvas creation** at 2134x1449 native (no upscaling)
2. **Background fill** with CMYK rich black
3. **Noise generation** at native 600dpi (fractal, 2-3% opacity)
4. **Shadow compositing** - multi-pass Gaussian, composited before content
5. **Vector rendering** - icons, heartbeat, circuit traces at native res
6. **Text rendering** - 2x oversample + LANCZOS downscale for all text
7. **Shine/glow layers** - separate transparent layers, composited in order
8. **Cyan glow spill** - treat the front glow bar as a light source casting upward
9. **Edge darkening** (back only) - radial vignette
10. **CMYK conversion** - via ICC profile, embedded in output PDF
11. **Gloss mask generation** - separate B/W render pass

### Evaluation Criteria

Both teams' outputs will be compared against the HTML prototype:

| Criterion                                             | Weight |
| ----------------------------------------------------- | ------ |
| Color fidelity (especially cyan and rich black)       | 25%    |
| Shadow quality (depth, softness, multi-pass accuracy) | 20%    |
| Text sharpness (especially small text)                | 20%    |
| Icon precision (stroke weights, proportions)          | 15%    |
| Glow/shine accuracy (bloom, specular, ambient)        | 10%    |
| Noise texture quality (grain, opacity)                | 5%     |
| Gloss mask accuracy (coverage, alignment)             | 5%     |

---

## Execution

### Dependencies

```
pip install Pillow reportlab pillow-heif
pip install CairoSVG  # Team Bravo only
```

Font: JetBrains Mono must be in system fonts or referenced by path.

### Run

```
python3 team_alpha.py --input business-card-v11.html --output ./alpha/
```

```
python3 team_bravo.py --input business-card-v11.html --output ./bravo/
```

### Compare

Open both teams' proof PNGs side by side with the HTML prototype. Score against criteria. Winner's PDFs go to Moo.

---

## Reference Files

- `business-card-v11.html` - Source prototype
- `business-card-handoff-v11.md` - Full project spec and history
- `render-card.js` - Puppeteer RGB proof script (for quick layout checks)
