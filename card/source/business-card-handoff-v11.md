# Business Card Project - Handoff Prompt (2026-02-26)

## Resume With

Upload `business-card-v11.html` + this file. Say: "Continue from the handoff doc. Here's the latest prototype."

---

## Project State: v11 - Near Final

Building a single business card for generuss (Russ Gardner's parent brand covering web design + AI automation). Dark neumorphic bento dashboard aesthetic. Moo Super Business Cards, Soft Touch matte + Raised Spot Gloss.

**Core concept:** Front = RAISED neumorphism (capabilities projecting outward). Back = DEEP RECESSED neumorphism (information wells, like terminal data readouts). Same grid, inverted depth. Two different tactile experiences on one card.

## Design System (Source of Truth)

- Base: `#1A1A1E` | Surface: `#222226` | Shadow dark: `#0D0D0F` | Shadow light: `#2E2E33`
- Accent ("The Weapon"): `#00FFEF` - uniform across both brands
- Text primary: `#E8E8E8` | Text secondary: `#9A9AA0` | Text muted: `#6B6B75`
- Contact text: `#9A9AA0` (bumped from muted for print legibility)
- Font: JetBrains Mono throughout
- Noise texture: 2-3% opacity SVG overlay
- Corner brackets: all 4 corners, both sides, 14px L-shapes at 25% opacity

## Card Dimensions (Prototype)

- Card: 800px x 450px (CSS vars `--card-w` / `--card-h`)
- Both sides use these dimensions
- Prototype is scaled up from print for screen legibility

## Front Layout (Raised)

- "generuss" centered top, 26px weight 600, text-secondary grey, 12px letter-spacing
- Two raised modules below (286x253, 16px radius, 28px gap between)
  - Multi-pass drop shadows, top-edge shine (12% white gradient), left-edge catch (5% white), surface specular sweep (155deg diagonal, 4% white)
  - Icons use cropped viewBoxes (`6 0 150 66` design, `10 0 160 66` automation) for true vertical centering - no dead space
  - `justify-content: center`, no padding hacks
- Left module: browser window + phone (rule of thirds at 1/3 and 2/3 horizontal)
  - Browser: 72x54 rect starting at y=6, matches phone height
  - Phone: 34x54 rect, dot grid (3x4) for home screen, notch bar + home indicator
  - No connectors between icons
- Right module: clock + workflow node diagram (same rule of thirds)
- Module labels: "design" / "automation" at 19px, weight 500, text-secondary, 5px letter-spacing
- Status zone: 600px wide, centered below modules
  - Tagline row: 3 lit dots (6px, cyan with glow) + 2 dim dots (6px, muted 25%) + "flawless by design" at 13px, text-secondary
  - Glow line: 3px cyan with heavy bloom (15% up, 10% down) + white specular highlight
- CTA: "flip card. scan code. let's build." - 13px, weight 500, 3px letter-spacing, "let's build." in cyan weight 600
- Shine layers: primary vignette top-left (6.5%), secondary specular top-center (3.5%), cyan ambient from bar upward (4%), edge catches top + left
- SHIPPED 2026 micro version bottom-right (offset left to clear corner bracket)

## Back Layout (Deep Recessed)

All modules use inverted shadows (inset box-shadow, shadow-dark fill, inner light catches top-left).

- Grid: `186px 1fr`, 12px gap, 20px padding
- Left column: QR zone (recessed well)
  - QR box: 130x130, dark bg, "scan to connect" label at 9px
  - Target: `generuss.com/connect` (server-side redirect, future-proof)
  - **Note:** QR grid-row should be `1 / -1` for full height (currently `1 / 2`)
- Right column top: Identity well (flex column, `space-between`, 20px 22px padding)
  - All 5 text lines are direct children (no wrapper div) for even distribution
  - Text taper with hierarchy:
    - "generuss design & automation" (26px, weight 600, text-primary white, 1.5px letter-spacing, fills well width)
    - "BUILDING GORGEOUS WEBSITES THAT CONVERT" (17px, weight 600, text-secondary grey, "THAT CONVERT" in weapon cyan with text-shadow glow, `white-space: nowrap`)
    - "Russell Gardner" (22px, weight 500, text-secondary, reaches ~half width)
    - "russ@generuss.com" (18px, contact-text) - **assembled via JS runtime** to bypass Cloudflare email obfuscation
    - "503.734.5502" (17px, contact-text)
- Right column middle: Status well (14px 22px padding)
  - "Design" flush left + cyan dot (9px) right
  - Heartbeat SVG line between dots (2px stroke, spike at ~65% from left, static full cyan with double drop-shadow glow bloom, `viewBox="0 0 200 24"`, 28px height)
  - Cyan dot (9px) left + "Automation" flush right
  - Status labels: 16px, weight 500, text-secondary, 3px letter-spacing
  - All elements static - no animations (print card)
- Right column bottom: URLs well (14px 22px padding)
  - "generussdesign.com" + dot (4px) + "generuss.com" + dot + "YT @generussai"
  - All 14px, contact-text color, 1.5px letter-spacing, 14px gap
- Circuit traces: partial PCB lines on edges with node dot terminators
- Edge darkening vignette for depth
- SHIPPED 2026 micro version bottom-right (offset left to clear corner bracket)

## Contact Data

```
Brand: generuss design & automation
Website Tagline: BUILDING GORGEOUS WEBSITES THAT CONVERT
Front Tagline: flawless by design
Name: Russell Gardner
Email: russ@generuss.com
Phone: 503.734.5502 (dots not parens)
URL 1: generussdesign.com
URL 2: generuss.com
YouTube: YT @generussai
QR Target: generuss.com/connect (server-side redirect, future-proof)
GitHub: routed through /connect (handle washyaderner doesn't match brand)
```

## Print Spec

- Moo Super Business Cards, standard size: 84mm x 55mm (3.31" x 2.17")
- Bleed: 0.125" (3.175mm)
- Soft Touch matte finish
- Raised Spot Gloss (separate B/W mask PDF per side)
- Front gloss: glow bar, lit progress dots, optionally logos
- Back gloss: tagline "THAT CONVERT" text, status dots, heartbeat spike, separator dots
- Gloss coverage: 8-12% per side (under 20% limit)
- Resolution: 600dpi
- Color: CMYK for artwork, B/W for gloss mask

## Kit (Claude Code) Directive

A competition directive exists (`card-competition-directive-v5.md`) that spawns two agent teams:

- Team Alpha (Pillow Pro): Pure Python/Pillow compositing with multi-pass shadows
- Team Bravo (Hybrid Engine): CairoSVG + Pillow pipeline
  Both race to render the card, outputs compared, winner produces final print PDFs.

Key Python techniques: multi-pass Gaussian shadows (3 passes), inner shadow generation for recessed wells, cyan glow spill (bar as light source), noise texture at native 600dpi, subpixel text (2x render + LANCZOS downscale), ambient vignettes, edge darkening.

**Directive needs updating** to reflect v11 changes.

## Decisions Locked

- Uniform `#00FFEF` across both brands
- Russ A Buss OFF the card (lives on /connect bento page)
- `/connect` as QR target (routes LinkedIn, Cal.com, GitHub, portfolio)
- No Twitter/X on card
- No GitHub on card (handle mismatch, routed through /connect)
- Dark card = intentional filter for tech/startup clients
- Front raised / back recessed duality
- Spot Gloss on raised surfaces (front) and inside recessed channels (back)
- Front text stays text-secondary grey (generuss, labels, tagline, CTA)
- Back brand name pops white, tagline base grey, "THAT CONVERT" weapon cyan
- All heartbeat/status elements static (no animations - print card)
- Browser icon matches phone height (both 54 units tall)
- Phone uses dot grid (3x4) for home screen aesthetic
- Email assembled via JS to bypass Cloudflare obfuscation in prototypes

## v11 Changelog (from v10b)

- Card dimensions: 700x400 → 800x450
- Front modules: 216x196 → 286x253 (two rounds of 10% bumps)
- Front icons: viewBox cropped to content bounds (was `0 0 180 100`, dead space below), SVGs at 260x170
- Browser icon: enlarged from 62x48 → 72x54, matches phone height
- Phone screen: content lines replaced with 3x4 dot grid
- Front text scaled: generuss 13→26px, labels 10→19px, tagline 10→13px, CTA 8.5→13px
- Back fully scaled: brand 19→26px fills well width, taper preserved proportionally
- Back tagline changed: "FLAWLESS BY DESIGN" (cyan) → "BUILDING GORGEOUS WEBSITES THAT CONVERT" (grey + cyan)
- Back tagline color: text-primary → text-secondary (grey base, weapon cyan on "THAT CONVERT")
- Name bumped: 14→22px, reaches ~half width
- Contact flattened: removed wrapper div, all 5 lines direct children of space-between
- Status well: labels 12→16px, dots 7→9px, heartbeat 24→28px
- URLs: 10.5→14px, separator dots 3→4px
- QR box: 114→130px
- Heartbeat: removed all animations, static full cyan with glow bloom
- Pulse dots: static, matching heartbeat intensity
- Email: JS runtime assembly to defeat Cloudflare obfuscation

## What Might Still Need Work

- QR zone `grid-row: 1 / -1` for full-height left column
- Actual QR code generation (placeholder in prototype)
- Kit directive update to match v11 spec
- Final logo SVGs (currently icon-only line art, actual brand logos are open-hand motifs)
- Print-ready PDF generation (Kit pipeline)

## Technical Notes

- Cloudflare's email protection layer aggressively re-obfuscates email addresses on every serve, even after fixing in source. Solution: email is assembled at runtime via JS using `String.fromCharCode(64)` for the @ symbol. No email pattern exists in HTML source.
- SVG icon centering was blocked by oversized viewBoxes with dead space below drawn content. Fix: crop viewBox to actual content bounds rather than CSS padding hacks.

## Reference Images Available

- `gemini_neumorph.jpeg` - 3D render of front (target depth/glow quality)
- `generuss_design_logo.png` - Design logo (hand holding browser+phone)
- `generuss_logo_cyan_flipped.png` - Automation logo (hand holding clock+nodes, flipped)
- `Screenshot_2026-02-26_at_8_54_29_AM.png` - generuss website hero (color reference for tagline)
- `Screenshot_2026-02-26_at_9_10_13_AM.png` - v11 front mid-progress (icon centering reference)
