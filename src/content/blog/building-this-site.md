---
title: "Building This Site in 30 Hours"
excerpt: "A full portfolio site - 9 animated sections, dark neumorphic design system, GSAP scroll cinematics, and edge deployment - built in 3 days with Claude Code. Every decision, blocker, and pivot, timestamped."
publishDate: "2026-02-18"
tags: ["case study", "web design", "AI-assisted development"]
featuredImage: "/images/placeholder.svg"
layout: timeline
---

# Building This Site in 30 Hours

## TLDR

I built generussdesign.com - 9 scroll-animated sections, a dark neumorphic design system, and a blog with RSS - across a single weekend. 59 commits, 18 merged PRs, ~30 hours of active work. Claude Code wrote the code. I wrote the 970-line brief that made it possible. Here's the full story, and the storytelling decisions behind every section you scrolled through to get here.

---

## The Brief Is the Blueprint

Saturday, February 15, 2026. 1:34 PM PST.

I had a 970-line site brief, an empty repo, and Claude Code. The brief was version 5 - I'd been refining the spec for weeks before writing a single line of code. That's the part nobody talks about. The build was fast because the planning was slow.

Here's what the brief contained: every section's purpose, the order they'd appear in, the animation specs, the copy tone, the design tokens, the deployment target. Not "build me a portfolio site." More like "here are the 9 sections in this exact order, here's why each one exists, here's how each one connects to the next, and here's the single accent color that ties it all together."

The stack was already decided: Astro 5, Tailwind v4, GSAP with ScrollTrigger, Cloudflare Pages. Tier 1 in my system - static site, edge deployment, no server runtime. No experiments on a client-facing project.

The design language was locked: dark neumorphism with a single neon accent (#00FFEF). Depth from paired light/dark box-shadows instead of borders. Every interaction state mapped - raised for resting, inset for active, glow for emphasis. One accent color at 5-8% of visible pixels. Enough to guide the eye. Not enough to fatigue it.

Why am I telling you this? Because this is exactly the process I'd use for your site. The brief is the architecture. Get it right and the build is execution. Get it wrong and you're redesigning mid-sprint.

---

## Why This Order

The 9 sections on generussdesign.com aren't in arbitrary order. They follow a persuasion arc. If you scrolled through the homepage before landing on this post, you experienced it without realizing it.

**Hero** hooks with the outcome: "Websites That Actually Work." Not what I do. What you get.

**Problem/Solution** creates tension. Four problem cards pin to the viewport and reveal solutions one by one with a curtain wipe animation. You see your own frustrations reflected back, then resolved. By the time you scroll past this section, you're nodding.

**Design Principles** establishes credibility. Six principles, each with a stat and an explanation. This section says "I don't just build sites, I have a methodology." The principles section pins too - all 6 cards assemble magnetically from random off-screen positions with elastic easing. You see the thinking, literally coming together.

**Services** shows what's offered. But notice - it comes after trust is built, not before. If Services were Section 2, you'd bounce. Nobody cares what you offer until they believe you understand their problem.

**Portfolio** proves it. Real projects, live iframe previews on desktop. This isn't "trust me" - it's "see for yourself."

**About** is the human connection. "Hey, I'm Russ." This comes after the professional proof because the visitor needs to respect the work before they care about the person.

**Reviews** are social proof from real clients. Long-form, unedited. The length is the signal - genuine enthusiasm can't be faked in 15 words.

**CTA/Contact** is the ask. And it comes last, after earning it. The visitor has seen the problem, the solution, the principles, the services, the proof, the person, and the endorsements. Now the CTA writes itself.

Every section references something from the one before it. Hero mentions bloated sites, Problem/Solution unpacks it. PS resolves with solutions, Principles shows the thinking behind them. Principles establishes methodology, Services shows what you actually get. This connective tissue is what separates a site that converts from a site that gets bounced.

That's not accidental. That's the brief.

---

## Viewport-to-Viewport Flow

Each section was designed to fill exactly one viewport, with pinning where appropriate. The scroll experience is cinematic - you're watching a story unfold, not scanning a page.

The Problem/Solution section pins and reveals 4 pairs sequentially. You can't skip ahead. Each curtain wipe forces you to see the problem before the solution. That's intentional friction - the good kind.

The Principles section pins too. All 6 cards are visible at once after the magnetic assembly animation. One viewport, one complete thought: "here's my entire design philosophy, and you can see all of it without scrolling."

The lava lamp hero fills the first viewport completely. 28 blobs rising and merging through an SVG goo filter. It's eye candy, but it serves a purpose - it holds your attention long enough to read the headline and subheadline before you scroll into the content.

Between the heavy sections there's a pattern interrupt: the burn-away joke. Text appears, says something cheeky, then burns away character by character in a left-to-right sweep. The real heading fades up after. It breaks the rhythm just enough to re-engage your attention before the next section pins.

All of this is in the brief. "Section 2 pins. 4 sequential reveals. Curtain wipe left-to-right. Solution card rises with shadow on reveal." When you spec animations at this level, the build is just implementation.

---

## Day 1: Foundation to First Deploy

As you can see in the timeline to your left, Day 1 was pure velocity. First commit at 1:34 PM, first PR merged by 7:15 PM.

### The Sprint Start

Twelve commits in 3 hours. The entire scaffold - Astro project, Tailwind v4 config with all custom tokens, GSAP integration, Contentful blog skeleton, all 9 sections stubbed. By 1:49 PM, 15 minutes in, Contentful fields were mapped, Formspree was wired, and OG metadata was in place.

This is what a thorough brief enables. No decisions to make during the build. Just execute.

### The Shadow Bug

The first real obstacle. Every neumorphic card uses `box-shadow` for depth - that's the entire design language. But the Problem/Solution section uses `clip-path` for the curtain wipe animation. Here's what nobody tells you about CSS: any non-`none` clip-path clips box-shadow. My solution cards were revealing with zero depth. Flat. Dead.

The fix (`8532675`, 4:53 PM): clear `clip-path` to `none` after the wipe completes. GSAP's `onComplete` callback handles it. Shadow pops in the instant the wipe finishes. 20 minutes to diagnose, 2 minutes to fix.

This is the kind of bug that eats hours if you don't know where to look. I didn't know - but Claude Code diagnosed it from the CSS spec. That's the value of the tool: it reads specs faster than I do.

### QA Before Deploy

Before pushing anything to production, I set up Playwright for automated visual QA (`1bb8d04`, 4:35 PM). Per-section screenshots at desktop, tablet, and mobile viewports. This matters because GSAP animations mean most content starts with `opacity: 0` - a single full-page screenshot captures almost nothing.

### Mobile Optimization

Last commit of Day 1 (`ac81ebe`, 7:15 PM): the Problem/Solution section's pinned scroll behavior was broken on mobile. Pinning a full-viewport section and expecting phone users to scrub through 4 sequential reveals? No. Mobile gets per-pair scroll reveals with no pinning. Tighter padding, proportionally scaled shadows.

Here's the principle: the experience adapts, the narrative doesn't. Mobile visitors see the same problem-then-solution arc. They just scroll through it instead of scrubbing.

**Day 1 totals:** 12 commits, ~6 hours. Site was functional but rough.

---

## Day 2: The Marathon

The timeline beside you just hit Day 2. This was 13 hours of building, from noon through 1 AM. The site went from "functional" to "actually good."

### Morning QA Sweep

Started with a 5-pass code review (`75a777d`, 12:12 PM). Five fixes before anything else:

1. **robots.txt** - didn't exist. SEO 101.
2. **404 page** - branded error page instead of Cloudflare's default.
3. **CLS fix** - explicit `width`/`height` on all portfolio images. Cumulative Layout Shift is a Core Web Vital.
4. **GSAP tree-shaking** - blog pages were loading ~45KB of GSAP they never used. Switched to dynamic imports.

That last one mattered. Blog pages exist for SEO. Loading a scroll animation library on a page with no scroll animations tanks your Lighthouse score.

In retrospect, I should have run this review after every PR merge instead of batching it. The GSAP tree-shaking issue had been shipping since Day 1.

### The Icon Iterations

This one burned more time than it should have. The Design Principles section has 6 cards, each with an icon. Three iterations to get it right:

1. **Emojis** (brief spec) - looked like a student project.
2. **Hand-drawn SVGs** (`0b0b856`, 2:54 PM) - custom inline SVGs at 40% opacity in the accent color. Better, but some icons lacked detail.
3. **Lucide icon paths** (`5a1e3b8`, 3:17 PM) - open-source SVG paths. Clean, consistent stroke weight, scale perfectly.

Five commits to land 6 icons. Design is iteration. The brief can't spec taste - that's the part that requires eyes on screen.

### The Principles Pin Fix

The Design Principles section pins to the viewport - you're supposed to see the heading, subheading, and all 6 cards in one view. But the heading was outside the pinned wrapper. When the pin activated, the heading scrolled away and you saw 6 cards with no context.

Fix (`3c4e9b7`, 2:44 PM): move the heading inside `.principles-pin`. Two files, 11 insertions, 11 deletions. Small diff, big visual impact. This is the viewport-filling principle in action - every pinned section needs to be a complete thought within one viewport.

### The Midnight Restructure

The biggest single commit of the project: `1e61fea` at 11:45 PM. 1,350 insertions, 1,099 deletions. This was the "throw away the scaffolding" commit:

- **Lava lamp hero** - replaced geometric shapes with SVG goo filter and 28 rising/merging blobs. Accent color only.
- **Iframe portfolio modal** - desktop gets live site previews in a browser chrome frame. Mobile falls back to screenshots.
- **Section consolidation** - Why Me merged into About. Two thin sections became one stronger one.
- **Lava lamp blobs hidden on mobile** for performance.

Everything before this commit was building toward a structure. This commit reshaped the structure itself. Sometimes you have to build the wrong thing to discover the right thing.

**Day 2 totals:** ~25 commits, ~13 hours, 5 PRs merged. The site was visually complete.

---

## Day 3: Ship

The timeline just crossed into the final day. Five hours to polish and deploy.

### The Cal.com Rip-and-Replace

The biggest pivot of the build. Cal.com offers a JavaScript SDK for embedding their scheduler. I'd been wrestling with it since Day 1:

- Required `is:inline` workarounds for Astro's script handling
- Loaded external JS I couldn't tree-shake
- Styling fought with the design system
- Showed branding I couldn't control

The replacement (`702a780`, 5:52 PM): a plain iframe. `<iframe src="https://app.cal.com/generuss/discovery-call">` wrapped in neumorphic styling with lazy loading via IntersectionObserver.

Three follow-up commits for border styling. The simpler approach won.

The lesson: if a third-party SDK is fighting your design system, check if an iframe does the job. It usually does, and you control every pixel around it. I lost 3+ hours across the build before making this call. Should have started there.

### Final Polish

The home stretch:

- **Glowing scribble-out** (`98fefff`) - SVG animation on the word "filler" in the reviews heading "All killer. No filler." GSAP draws it on with a 1.2s delay so you read the word before it gets crossed out. A detail nobody consciously notices. Everyone subconsciously does.
- **Dash spacing** (`774cf57`) - the brief said "never use em dashes." Regex find-and-replace across all sections.
- **About section redesign** (`6fdd080`) - raised card treatment, updated copy, booking CTA.

Last commit: `95e12b5` at 8:38 PM. Site deployed to production.

**Day 3 totals:** ~20 commits, ~5 hours, 6 PRs merged.

---

## The Stack Decisions

### Astro over Next.js

This is a portfolio site. Zero client-side interactivity beyond GSAP animations and a contact form POST. Next.js would ship a React runtime for nothing. Astro ships zero JS by default. Every kilobyte of JavaScript on this site is intentional.

### GSAP, Not CSS Animations

The Problem/Solution section has 4 sequential curtain wipes driven by scroll position. The Principles section has a magnetic assembly animation where 6 cards fly in from random off-screen positions with elastic easing. The hero has 28 blobs with SVG goo filter merging. Try doing any of that with `@keyframes`. GSAP with ScrollTrigger is the only production-ready option for scroll-driven choreography at this complexity.

### Tailwind v4

Tailwind v4 changed the config system. No more `tailwind.config.js` - everything lives in CSS with `@theme {}` blocks. Design tokens as CSS custom properties. This matters because the neumorphic design system is token-heavy - 15+ custom values for colors, shadows, spacing, and easing. All defined once, used everywhere.

### Cloudflare Pages

Static HTML served from 300+ edge locations worldwide. No origin server, no cold starts. The fastest possible architecture for content that doesn't change between requests. Deploy time: about 30 seconds.

---

## What Claude Code Actually Did

I need to be specific because "I used AI" means nothing.

Claude Code was the executor. I was the architect and reviewer. The 3-layer system separates concerns:

**Layer 1 - Directives:** I wrote the 970-line site brief, the visual identity spec, the animation specs. These are the "what."

**Layer 2 - Orchestration:** Claude Code reads directives, makes implementation decisions, handles errors, self-corrects. This is the "how."

**Layer 3 - Execution:** Deterministic scripts for QA, deployment, builds. These are the "do."

In practice: I'd describe what I wanted ("the PS section needs a burn-away joke that reverses on scroll-back"), Claude would implement it, I'd review via Playwright screenshots, and we'd iterate. The longest back-and-forth was the icon work - 3 rounds of "that's not right, try this approach."

Claude Code wrote the GSAP animations, the Astro components, the Tailwind configurations, the blog integration, the Playwright QA scripts, and the deployment pipeline. I wrote the brief, made the design decisions, reviewed every commit, and decided when something was done.

59 commits with zero copy-paste from Stack Overflow, zero template cloning, zero "generate a portfolio site" prompts. Every line traced to a specific directive in the brief.

---

## The Numbers

| Metric                 | Value                              |
| ---------------------- | ---------------------------------- |
| Total commits          | 59 (40 working + 19 merges)        |
| Merged PRs             | 18                                 |
| Lines inserted         | 21,790                             |
| Lines deleted          | 2,079                              |
| Calendar days          | 3 (Feb 15-17, 2026)                |
| Working sessions       | 3 (6h + 13h + 5h)                  |
| Active hours           | ~30                                |
| Sections built         | 9                                  |
| Scroll animations      | 15+ distinct GSAP timelines        |
| Custom SVG icons       | 6                                  |
| Portfolio projects     | 4 (3 with iframe previews)         |
| Largest commit         | 1,350 insertions / 1,099 deletions |
| Smallest meaningful PR | 0 additions / 11 deletions         |

---

## The Blockers, Ranked

1. **clip-path killing box-shadow** - CSS spec behavior. Any non-`none` clip-path clips shadows. ~20 minutes to diagnose. Fix: clear clip-path on animation complete.

2. **Cal.com SDK** - external JS fighting the design system. ~3 hours wasted across the build. Fix: iframe embed. Should have started there.

3. **Section overlap wars** - two ScrollTrigger pins too close together. ~45 minutes across 3 PRs. Fix: remove one pin, z-index the other.

4. **Principles heading outside pin** - heading scrolled away when pin activated. ~15 minutes. Fix: move heading inside the pin wrapper.

5. **Icon iterations** - five commits to land on the right approach. ~1 hour. Not a blocker, but the kind of design iteration that eats time invisibly.

---

## What I'd Build For You

Everything in this post - the brief-first process, the persuasion arc, the viewport-by-viewport flow, the animation choreography, the edge deployment - that's not specific to my portfolio. That's the process.

Your site would get the same treatment: a thorough brief before a single line of code. Sections ordered to tell your story, not just list your features. Animations that serve the narrative, not just look cool. A static-first architecture that loads in under a second anywhere in the world.

The build was 30 hours because the brief was thorough. Your brief would be thorough too. That's the service.

If you scrolled this far, you've seen the process from the inside. The timeline to your left tracked every milestone. The site you're reading this on is the proof.

Ready to build yours? [Let's talk](/contact).

---

## Notes

**SEO keywords:** building a website with AI, AI-assisted web development, portfolio site case study, Claude Code web development, Astro GSAP scroll animations, dark neumorphic design system, website build process, vibe coding, scroll-driven website animations, Cloudflare Pages deployment, Tailwind v4 design tokens

**Cross-post targets:** generussdesign.com/blog, generuss.com/blog, dev.to, LinkedIn article

**Related topics:** "Discovery Calls Are Requirements Gathering" (existing draft), AI-assisted development workflows, the case for static-first architecture

**Source material:** git log (washyaderner/generuss-design), 18 merged PR descriptions, site brief v5, build timeline artifact

**Raw PR reference:** #1 (shadows + mobile + QA, +549/-67), #2 (QA upgrade, +62/-8), #3 (5 review fixes, +100/-61), #4 (hero + PS tuning, +28/-62), #5 (principles pin, +11/-11), #6 (SVG icons + raised cards, +189/-27), #7 (burn-away + shadows, +273/-182), #8 (burn-away reversible, +10/-12), #9 (lava lamp + layout restructure, +1350/-1099), #10 (booking polish, +55/-35), #11 (about copy swap, +0/-38), #12 (remove booking pin, +0/-11), #13 (services z-index, +2/-2), #14 (Cal.com iframe, +11/-7), #15 (scribble-out + dashes, +139/-50), #16 (/ship command, +46/-0), #17 (build timeline, +1173/-0), #18 (timeline hero tweak, +2/-2)
