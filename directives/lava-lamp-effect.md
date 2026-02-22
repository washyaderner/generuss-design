# Lava Lamp Effect

The animated hero background on generussdesign.com. Teal blobs rise, wobble, and fall back into a pool at the bottom of the viewport. Overlapping blobs merge via a "goo" filter effect.

## Architecture

Three files, one section:

| File                            | Role                                                                |
| ------------------------------- | ------------------------------------------------------------------- |
| `src/pages/index.astro`         | SVG filter definitions, CSS filter override, `#lava-lamp` container |
| `src/scripts/animations.js`     | `initLavaLamp()` - creates blobs, pool, GSAP timelines              |
| `src/scripts/scroll-manager.js` | Calls `initLavaLamp()` inside `setupHero()`                         |

Only appears on the homepage hero. Blog pages use `BlogLayout` (no GSAP, no lava lamp). `scroll-manager.js` guards with `if (lavaContainer)` before calling.

---

## Desktop (>= 640px)

**Filter:** SVG goo filter `url(#goo)`

- `feGaussianBlur stdDeviation="12"`
- `feColorMatrix` alpha values: multiply 18, offset -7

**Blobs:** 28 rising + 5 delayed = 33 total

- Size: 50-180px diameter
- Starting position: `bottom: -5% to 10%`
- Rise: `-h * 0.5` to `-h * 0.85` upward, wobble +/-80px
- Fall target: `y: 0-20px` (back to pool zone)
- Rise duration: 8-18s, fall: 5-10s
- Scale range: 0.8x-1.2x
- `will-change: transform` enabled

**Pool:** 80px tall, `bottom: -40px`, 120% width, `hsl(176, 100%, 47%)`

**Opacity:** Fades in to `0.07` over 1.2s

---

## Mobile (< 640px)

**Filter:** CSS `blur(10px) contrast(20)` with `background: black`

- Defined in CSS `@media (max-width: 639px)` block - NOT inline style
- SVG filter is NOT used on mobile (iOS Safari doesn't render feColorMatrix)

**Blobs:** 10 rising + 2 delayed = 12 total

- Size: 40-120px diameter
- Starting position: `bottom: -5% to 3%` (tighter range for tall viewports)
- Rise: same formula as desktop
- Fall target: `y: 20-50px` (further down to reach pool merge zone)
- Rise/fall durations: same as desktop
- `will-change: transform` disabled for performance

**Pool:** 140px tall, `bottom: -70px`, 120% width

**Opacity:** Fades in to `0.05` over 1.2s

**Hero height:** Uses `min-h-screen min-h-[100dvh]` (both classes) to prevent Chrome URL bar from pushing pool below fold.

---

## How the Goo Effect Works

### Desktop (SVG)

`feGaussianBlur` softens blob edges into a fuzzy halo. `feColorMatrix` thresholds the alpha channel - multiply by 18 creates sharp cutoff, offset -7 removes low-alpha fuzz. When two blobs' blur halos overlap, their combined alpha exceeds the threshold, creating a merged solid shape.

### Mobile (CSS)

`blur(10px)` softens edges (same role as feGaussianBlur). `contrast(20)` re-sharpens them by pushing values toward 0 or 1 (same role as feColorMatrix threshold). Black background is required - contrast needs dark surroundings to create the binary threshold effect. Without it, blobs appear as blurry circles.

---

## Critical Gotchas

1. **iOS Safari ignores SVG feColorMatrix** - the goo merge effect simply doesn't render. Blobs appear as blurry circles instead of merging. Solution: CSS `blur() + contrast()` on mobile.

2. **Inline `style="filter:"` fights CSS overrides on Chrome** - if the filter is set via inline style on the container, Chrome's cascade makes the CSS `@media` override lose. Filter MUST live in the stylesheet only.

3. **`100vh` includes Chrome mobile URL bar** - the pool renders below the visible fold. Use `100dvh` for hero height. We keep both `min-h-screen` and `min-h-[100dvh]` for fallback.

4. **Tall viewports (iPhone 16 Pro Max, 932px height)** - blobs starting at `bottom: 10%` = 93px from pool, too far to merge. Cap at `3%` on mobile so blobs stay in the merge zone.

5. **`#goo-mobile` SVG filter is vestigial** - still defined in `index.astro` but unused since mobile switched to CSS filters. Removing it is safe but not urgent.

---

## Shared Parameters

| Parameter          | Desktop             | Mobile              |
| ------------------ | ------------------- | ------------------- |
| Hue                | 176                 | 176                 |
| Saturation         | 85-100%             | 85-100%             |
| Lightness          | 30-60%              | 30-60%              |
| Wobble X           | +/-80px             | +/-80px             |
| Scale range        | 0.8-1.2x            | 0.8-1.2x            |
| Rise duration      | 8-18s               | 8-18s               |
| Fall duration      | 5-10s               | 5-10s               |
| Pool color         | hsl(176, 100%, 47%) | hsl(176, 100%, 47%) |
| Pool width         | 120%                | 120%                |
| Initial spread     | -h \* 0.6           | -h \* 0.6           |
| Delayed blob delay | 1-4s                | 1-4s                |
