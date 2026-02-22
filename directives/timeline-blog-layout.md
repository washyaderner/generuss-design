# Timeline Blog Layout

Sticky sidebar timeline that tracks reading progress through a long-form blog post. Desktop shows a full-viewport sidebar with phase nodes and milestones. Mobile falls back to a thin progress bar.

## How It Works

### Activation

Set `layout: timeline` in the blog post frontmatter. The `[slug].astro` page checks `post.layout` and renders `TimelineBlogLayout.astro` instead of `BlogLayout.astro`.

```yaml
---
title: "Your Post Title"
layout: timeline
---
```

The content schema (`src/content.config.ts`) defines the enum:

```ts
layout: z.enum(["default", "timeline"]).default("default"),
```

### Architecture

```
src/
  content.config.ts          # Schema with layout enum
  layouts/
    TimelineBlogLayout.astro # The timeline layout (CSS + HTML + JS)
  pages/blog/[slug].astro    # Routes to correct layout based on frontmatter
```

## Layout Structure

### Desktop (>1024px)

Two-column flex layout:

- Left: sticky sidebar (300px, full viewport height from below nav to screen bottom)
- Right: blog article content (max 65ch)

### Mobile (<=1024px)

- Sidebar hidden entirely
- Fixed 3px progress bar at top of screen (below nav)
- Full-width article content

## Sidebar Anatomy

The sidebar contains a vertical timeline with two node types:

### Phase nodes (`.tl-day`)

Major sections marked with a numbered circle (01, 02, etc.), a title, and an optional subtitle. These are the primary waypoints.

```html
<div class="tl-day" data-phase="1">
  <div class="tl-day__circle">01</div>
  <div class="tl-day__title">Planning</div>
  <div class="tl-day__date">The Idea</div>
  <!-- optional subtitle -->
</div>
```

### Milestone nodes (`.tl-milestone`)

Smaller dots between phase nodes representing sub-sections.

```html
<div class="tl-milestone" data-phase="1">
  <div class="tl-milestone__dot"></div>
  <div class="tl-milestone__title">Brain dump</div>
</div>
```

### Node distribution

All nodes (phases and milestones) are **direct flex children** of `.tl-timeline`. The container uses `justify-content: space-between` to distribute them evenly from top to bottom. Do NOT wrap nodes in group divs - that clusters them instead of spacing them.

### The vertical line

Two absolute-positioned elements:

- `.tl-line-track` - dim background line (uses `--color-border`)
- `.tl-line-fill` - accent-colored progress line (uses `--color-accent` with glow)

JS clips the line to span exactly between the first and last phase circle centers. No line extends above the first circle or below the last one.

## Scroll Behavior

### Progress line

A GSAP ScrollTrigger watches the `#blog-article` element. As the user scrolls, `scaleY` on `.tl-line-fill` goes from 0 to 1 (with `transform-origin: top center`). Mobile progress bar width tracks the same value.

### Phase activation

The JS scans all `<h2>` headings in the article and maps them to phase numbers based on text content matching. When a heading enters the viewport (60% trigger point):

- That phase and all previous phases get `.active` class
- Active phase circles get accent border + glow
- Active milestones get accent dot + glow
- Inactive nodes stay dim (opacity 0.3-0.4)

Progressive activation means scrolling to Phase 3 lights up Phases 1, 2, and 3. Scrolling back deactivates forward phases.

## Adapting for a New Blog Post

### 1. Define your phases

Decide the narrative arc. Each phase gets a numbered circle. Milestones are optional sub-waypoints within a phase. Fewer total nodes = more vertical space between them.

### 2. Update the HTML

Replace the timeline nodes in `TimelineBlogLayout.astro` (or create a new layout file if you want both structures available). Every node must be a direct child of `.tl-timeline`:

```html
<div class="tl-timeline">
  <div class="tl-line-track"></div>
  <div class="tl-line-fill" id="tl-line-fill"></div>

  <!-- Phase 1 -->
  <div class="tl-day" data-phase="1">
    <div class="tl-day__circle">01</div>
    <div class="tl-day__title">Your Phase Title</div>
    <div class="tl-day__date">Subtitle</div>
  </div>
  <div class="tl-milestone" data-phase="1">
    <div class="tl-milestone__dot"></div>
    <div class="tl-milestone__title">Milestone label</div>
  </div>

  <!-- Phase 2 -->
  <div class="tl-day" data-phase="2">
    <div class="tl-day__circle">02</div>
    <div class="tl-day__title">Next Phase</div>
  </div>

  <!-- Last phase has no milestones = clean endpoint -->
  <div class="tl-day" data-phase="3">
    <div class="tl-day__circle">03</div>
    <div class="tl-day__title">Conclusion</div>
  </div>
</div>
```

### 3. Update the JS phase detection

The `headings.forEach` block matches H2 text to phase numbers. Update the string matches to correspond to your article's H2 headings:

```ts
headings.forEach((h2) => {
  const text = h2.textContent?.toLowerCase() || "";
  if (text.includes("your phase 1 keyword")) {
    currentPhase = 1;
  } else if (text.includes("your phase 2 keyword")) {
    currentPhase = 2;
  } else if (text.includes("your phase 3 keyword")) {
    currentPhase = 3;
  }
  // ...
});
```

Once a phase is set, all subsequent H2s remain in that phase until a new match triggers. This means H2s between phase triggers (like sub-sections) inherit the current phase and still advance the progress.

### 4. Write your markdown

Set `layout: timeline` in frontmatter. Structure H2 headings to match your phase detection keywords. H3s and below don't affect phase activation.

## Design Tokens Used

| Token                  | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `--color-border`       | Inactive line track, circle borders, milestone dots |
| `--color-accent`       | Active line fill, active circle border/text         |
| `--color-accent-glow`  | Glow on active elements                             |
| `--color-accent-dim`   | Subtle glow on circles                              |
| `--color-bg-secondary` | Circle background fill                              |
| `--color-text`         | Active title text                                   |
| `--color-text-muted`   | Inactive text, dates, subtitles                     |
| `--font-mono`          | Circle numbers, date subtitles                      |

## Gotchas

- **Don't wrap nodes in group divs.** Flex `space-between` only distributes direct children. Wrapping phases in `<div class="group">` clusters nodes instead of spacing them evenly.
- **Line positioning is JS-dependent.** The track/fill default to `top: 0; height: 100%` in CSS. JS overrides to clip between first and last circle centers. If JS fails, you get small nubs above/below - acceptable fallback.
- **Nav height assumption.** Sidebar uses `top: 4rem` and `height: calc(100vh - 4rem)` assuming the nav is `h-16` (4rem). If nav height changes, update both values.
- **Phase detection is text-based.** If you rename an H2 heading in the markdown, the phase detection JS may stop matching. Always verify after editing headings.
- **Reduced motion.** The entire GSAP block is wrapped in a `prefers-reduced-motion` check. Users with reduced motion get a static sidebar (no progress tracking, no activation).
