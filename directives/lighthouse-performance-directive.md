# Directive: Lighthouse Performance & Best Practices Optimization

> generussdesign.com | Phase 4 | Feb 21, 2026
> Baseline: Performance 65 | Accessibility 96 | Best Practices 58 | SEO 100
> Target: Performance 85+ | Accessibility 100 | Best Practices 85+ | SEO 100

---

## Baseline Metrics (Mobile - Moto G Power Emulation, Slow 4G)

| Metric           | Current | Target  | Notes                                                              |
| ---------------- | ------- | ------- | ------------------------------------------------------------------ |
| FCP              | 1.2s    | < 1.0s  | Acceptable, will improve with render-block removal                 |
| LCP              | 3.3s    | < 2.5s  | Critical chain: CSS (283ms) + GSAP (452ms) + ScrollTrigger (420ms) |
| TBT              | 1,030ms | < 200ms | **Primary offender.** GSAP/ScrollTrigger forced reflows dominate   |
| CLS              | 0       | 0       | Perfect. Do not regress.                                           |
| SI               | 5.9s    | < 3.5s  | Will improve as byproduct of TBT and LCP fixes                     |
| Main-thread work | 3.8s    | < 2.0s  | 2.2s is JS execution alone                                         |
| Long tasks       | 10      | < 3     | Direct consequence of synchronous GSAP loading                     |

---

## Fix 1: Disable Cloudflare Email Obfuscation

**Impact:** Eliminates ~490ms render-blocking script
**Effort:** 5 minutes, no code changes
**Risk:** Low - email becomes visible in source. Spam filters handle this fine.

### Steps

1. Log in to Cloudflare dashboard
2. Select `generussdesign.com` domain
3. Navigate to **Security > Settings** (formerly Scrape Shield)
4. Toggle **Email Address Obfuscation** to **Off**
5. Purge cache: **Caching > Configuration > Purge Everything**

### Verification

- Run PageSpeed Insights
- Confirm `cloudflare-static/email-decode.min.js` no longer appears in the network waterfall
- Confirm render-blocking requests audit drops from 330ms est savings to ~0

---

## Fix 2: Defer GSAP + ScrollTrigger to Post-First-Paint

**Impact:** Largest single TBT reduction. Eliminates forced reflows during initial load. Targets the 2.2s JS execution and 10 long tasks.
**Effort:** 30-60 minutes
**Risk:** Medium - animations will initialize slightly after page paint. Users on slow connections see static content first, then animations activate. This is the correct UX tradeoff.

### Current Problem

GSAP core (`index.CMq3EfTn.js`, 28.72 KiB) and ScrollTrigger (`ScrollTrigger.CrR5uyL1.js`, 18.85 KiB) load synchronously in the critical path. ScrollTrigger triggers forced reflows totaling 160ms+ as it measures element positions during initial layout. These are the top entries in the forced reflow audit:

- `index.CMq3EfTn.js` - 86ms reflow
- `ScrollTrigger.CrR5uyL1.js` - 33ms reflow + dozens of 1-11ms reflows

### Implementation

**Option A: Dynamic Import with Idle Callback (Recommended)**

Replace the current GSAP script loading with a deferred initialization pattern. The animations module should not execute until after the browser has finished initial paint and has idle time.

```astro
<!-- In layout or page component -->
<script>
  // Wait for page to be fully painted and idle before loading animations
  const initAnimations = async () => {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    // All animation setup goes here
    // Move existing animation code into this block
  };

  // requestIdleCallback with fallback for Safari
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => initAnimations(), { timeout: 2000 });
  } else {
    setTimeout(() => initAnimations(), 200);
  }
</script>
```

**Option B: Split Hero vs Scroll Animations**

If some animations are above-the-fold (hero) and others are below-fold (sections), split them into two loading paths:

```javascript
// Hero animations: load after first paint with minimal delay
const initHeroAnimations = async () => {
  const { gsap } = await import("gsap");
  // Hero-only animations (no ScrollTrigger needed for hero entrance)
};
requestAnimationFrame(() => {
  requestAnimationFrame(() => initHeroAnimations());
});

// Scroll-triggered animations: load only when user starts scrolling
const initScrollAnimations = async () => {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  // All ScrollTrigger-based animations here
};

// Fire on first scroll or after 3s, whichever comes first
let scrollInitDone = false;
const triggerScrollInit = () => {
  if (scrollInitDone) return;
  scrollInitDone = true;
  initScrollAnimations();
};
window.addEventListener("scroll", triggerScrollInit, {
  once: true,
  passive: true,
});
setTimeout(triggerScrollInit, 3000);
```

### Animation Property Rules (Prevent Forced Reflows)

Audit every GSAP animation and ensure they ONLY animate **composite-friendly properties**:

**Allowed (GPU composited, no layout/paint):**

- `transform` (translate, scale, rotate)
- `opacity`

**Forbidden (triggers layout recalculation):**

- `width`, `height`
- `top`, `right`, `bottom`, `left`
- `margin`, `padding`
- `font-size`
- `offsetWidth`, `offsetHeight` (reading these triggers reflow)

If any animation currently uses layout-triggering properties, refactor:

```javascript
// BAD - triggers layout
gsap.to(el, { width: "100%", top: 50 });

// GOOD - GPU composited
gsap.to(el, { scaleX: 1, y: 50 });
```

Add `will-change` in CSS for elements that will be animated, but remove it after animation completes to free GPU memory:

```css
.animate-target {
  will-change: transform, opacity;
}
```

### Verification

- TBT should drop below 300ms
- Long tasks should drop from 10 to < 4
- JS execution time should drop from 2.2s to < 1.0s
- Forced reflow audit should show minimal entries
- Visually confirm all animations still fire correctly on scroll

---

## Fix 3: Remove or Lazy-Load Cal.com Embed

**Impact:** Best Practices 58 -> 85+. Secondary performance benefit from reduced initial JS payload.
**Effort:** 15-30 minutes
**Risk:** Low for Option A, Medium for Option B

### Current Problem

Cal.com embed causes all three Best Practices failures:

- Deprecated `SharedStorage` API usage
- 3 third-party cookies (`__cf_bm`, `__Secure-next-auth.csrf-token`, `__Secure-next-auth.callback-url`)
- Chrome DevTools Issues panel warnings

These are Cal.com's problems, not yours, but they tank your score.

### Option A: Replace Embed with Direct Link (Recommended)

Remove the Cal.com embed entirely. Replace with a styled CTA button linking to the hosted booking page. You already have the fallback link in place.

```astro
<!-- Replace the entire Cal.com embed block with: -->
<div class="flex flex-col items-center gap-6">
  <a
    href="https://app.cal.com/generuss/discovery-call"
    target="_blank"
    rel="noopener"
    class="inline-flex items-center gap-2 px-8 py-4 bg-accent text-[#0C0C0C] font-bold rounded-xl
           hover:shadow-[0_0_20px_rgba(0,255,239,0.4)] transition-[box-shadow,transform] duration-300"
  >
    Book a Discovery Call →
  </a>
  <p class="text-text-muted text-sm">
    Opens Cal.com in a new tab - pick a time that works for you.
  </p>
</div>
```

**Tradeoff:** User leaves your site to book. This is standard practice and avoids all third-party cookie/API issues.

### Option B: Lazy-Load Embed on Scroll (Compromise)

Keep the embed but only load it when the booking section enters the viewport. This fixes the performance penalty but does NOT fix the deprecated API or cookie warnings - Best Practices will still be penalized.

```astro
<div id="cal-container" class="min-h-[500px]">
  <p class="text-text-muted text-sm text-center">Loading calendar...</p>
</div>

<script>
  const calContainer = document.getElementById("cal-container");
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const script = document.createElement("script");
        script.src = "https://app.cal.com/embed/embed.js";
        script.async = true;
        script.onload = () => {
          Cal("init", { origin: "https://app.cal.com" });
          Cal("inline", {
            elementOrSelector: "#cal-container",
            calLink: "generuss/discovery-call",
          });
        };
        document.head.appendChild(script);
        observer.disconnect();
      }
    },
    { rootMargin: "200px" }, // Start loading 200px before section is visible
  );
  observer.observe(calContainer);
</script>
```

### Recommendation

Go with **Option A**. The embed is not worth the Best Practices penalty. Booking conversion won't meaningfully change - people who want to book will click the link.

### Verification

- Best Practices score should jump to 85+ (Option A) or remain ~65-70 (Option B)
- Confirm no Cal.com entries in third-party cookies audit
- Confirm deprecated API warning disappears
- Confirm booking flow still works end-to-end

---

## Fix 4: Inline Critical CSS + Async Load Remainder

**Impact:** Reduces LCP by eliminating CSS render-blocking (currently 283ms)
**Effort:** 30-45 minutes
**Risk:** Low-Medium - must correctly identify above-the-fold styles

### Current Problem

`_slug_.CJ4yrfTL.css` (10.1 KiB) is render-blocking. The browser cannot paint anything until this file downloads completely.

### Implementation

**Option A: Extract with `critical` Package**

```bash
npm install --save-dev critical
```

Create extraction script at `execution/extract-critical-css.mjs`:

```javascript
import { generate } from "critical";
import { writeFileSync } from "fs";

const { css, uncritical } = await generate({
  src: "https://generussdesign.com",
  width: 375, // Mobile viewport
  height: 812, // iPhone viewport height
  inline: false, // Extract only, don't inline yet
});

writeFileSync("src/styles/critical.css", css);
writeFileSync("src/styles/non-critical.css", uncritical);
```

Then in the Astro layout:

```astro
---
import criticalCSS from "../styles/critical.css?raw";
---

<html>
  <head>
    <!-- Critical CSS inlined - no network request needed -->
    <style set:html={criticalCSS}></style>

    <!-- Non-critical CSS loaded async -->
    <link
      rel="preload"
      href="/_astro/_slug_.CJ4yrfTL.css"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript>
      <link rel="stylesheet" href="/_astro/_slug_.CJ4yrfTL.css" />
    </noscript>
  </head>
</html>
```

**Option B: Simple Media Trick (Lighter Touch)**

If the `critical` package is overkill, use the media swap pattern to make the existing CSS non-blocking:

```html
<link
  rel="stylesheet"
  href="/_astro/_slug_.CJ4yrfTL.css"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link rel="stylesheet" href="/_astro/_slug_.CJ4yrfTL.css" />
</noscript>
```

The browser loads it as a print stylesheet (non-blocking), then switches to `all` once loaded. Tradeoff: possible flash of unstyled content (FOUC) if hero styles are in that file.

### Verification

- Render-blocking requests audit should no longer list the CSS file
- FCP should drop below 1.0s
- Visually confirm no FOUC on hero section
- If FOUC occurs, more styles need to be inlined (use Option A)

---

## Fix 5: Bump Text-Muted Contrast Ratio

**Impact:** Accessibility 96 -> 100
**Effort:** 5 minutes
**Risk:** None

### Current Problem

`--text-muted: #6B6B75` on `--background: #1A1A1E` has a contrast ratio of ~3.4:1. WCAG AA requires 4.5:1 for normal text.

Failing elements:

- Hero subtitle
- "SCROLL" indicator
- "Or send me a message" text
- Comparison grid "problem" headings and body text
- All footer links, copyright, tagline

### Implementation

Update the CSS custom property:

```css
/* Old */
--text-muted: #6b6b75;

/* New - passes WCAG AA at 4.5:1 against #1A1A1E */
--text-muted: #8e8e98;
```

Verify with a contrast checker that the new value passes 4.5:1 against `--background` (#1A1A1E). Adjust by 1-2 hex values if needed.

**Note:** If the comparison grid's "problem" column is intentionally dimmer for design reasons, create a separate token (`--text-dim`) and add `aria-hidden="true"` or `role="presentation"` to those elements.

### Verification

- Accessibility score should hit 100
- No contrast-related findings in the audit
- Visually confirm muted text still reads as secondary/subdued

---

## Fix 6: Convert Headshot to WebP

**Impact:** Minor LCP/payload improvement (~25-35% smaller file)
**Effort:** 10 minutes
**Risk:** None

### Current State

`/images/russ-headshot2.JPG` - uppercase extension, likely unoptimized.

### Implementation

**Preferred: Use Astro's Image component**

```astro
---
import { Image } from "astro:assets";
import headshot from "../images/russ-headshot2.JPG";
---

<Image src={headshot} alt="Russ" width={400} format="webp" quality={80} />
```

This handles format conversion, responsive sizing, and `width`/`height` attributes automatically.

**Manual alternative:**

```bash
cwebp -q 80 public/images/russ-headshot2.JPG -o public/images/russ-headshot.webp
```

Then update all references from `/images/russ-headshot2.JPG` to `/images/russ-headshot.webp`.

### Verification

- Confirm old `.JPG` path is no longer referenced in the codebase
- Confirm image renders correctly at same visual size
- Check that "Improve image delivery" remains in passed audits

---

## Execution Order

| Step | Fix                                    | Time Est  | Deps                         |
| ---- | -------------------------------------- | --------- | ---------------------------- |
| 1    | Disable Cloudflare email obfuscation   | 5 min     | None (dashboard only)        |
| 2    | Defer GSAP/ScrollTrigger               | 30-60 min | None                         |
| 3    | Replace Cal.com embed with direct link | 15 min    | None                         |
| 4    | Inline critical CSS / async load rest  | 30-45 min | After Fix 2 (bundle changes) |
| 5    | Bump `--text-muted` contrast           | 5 min     | None                         |
| 6    | Convert headshot to WebP               | 10 min    | None                         |

Fixes 1, 3, 5, 6 can be done independently in any order. Fix 2 should precede Fix 4 because deferring GSAP changes the critical rendering path.

---

## Post-Fix Validation Checklist

- [ ] Run PageSpeed Insights mobile test
- [ ] Performance >= 85
- [ ] Accessibility = 100
- [ ] Best Practices >= 85
- [ ] SEO = 100
- [ ] TBT < 300ms
- [ ] LCP < 2.5s
- [ ] CLS = 0 (no regression)
- [ ] Zero render-blocking resources in audit
- [ ] Zero third-party cookie warnings
- [ ] Zero deprecated API warnings
- [ ] All animations fire correctly on scroll
- [ ] Booking flow works end-to-end
- [ ] No FOUC on initial load
- [ ] Hero lava lamp animation unaffected
- [ ] Mobile responsive behavior unchanged
- [ ] Cross-browser spot check (Chrome, Safari, Firefox)

---

## Known Issue: Stats Discrepancy (Pre-existing, Not in Scope)

This directive does not address the content discrepancies flagged in project known issues:

- Mobile-First stat: site says "Nearly 60%" vs brief "63%+"
- SEO stat: site says "93%" vs brief "68%"
- Headshot format: `.JPG` vs brief `.webp` (Fix 6 resolves this one)

Reconcile in a separate content review pass.

---

## Compound Doc Candidates (Propose After Completion)

- **patterns.md:** GSAP deferred loading pattern for Astro sites
- **gotchas.md:** Cal.com embed kills Best Practices score - prefer direct link
- **gotchas.md:** Cloudflare email obfuscation is render-blocking - disable for performance-critical sites
- **decisions.md:** `--text-muted` minimum value for WCAG AA against dark backgrounds
