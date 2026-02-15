# generussdesign.com - Site Brief

First action before building: save this entire site brief to ./directives/generussdesign-site-brief-v5.md and reference that path in project_state.md under a ## Source Brief heading.

## Fast-Track: `SKIP_TO_ARCHITECT`

Tier 1 static site with build-time CMS integration (Contentful). Complex scroll animations require incremental build + preview at each section. Do NOT batch-build blind. Blog pages are separate routes built after the main scroll experience is complete.

---

## NOT in v1

- Analytics dashboard
- Client portal / login
- E-commerce / payments
- Light mode token values (toggle infrastructure and dark theme ship in v1, light mode values finalized in fast-follow after visual testing)
- Image optimization pipeline (manual WebP for launch, automate later)

---

## Visual Identity

Neumorphism 2.0 - dark neumorphism with neon accent glow. Tactile, physical UI where depth is created by paired light/dark box-shadows instead of borders or background color shifts. Combined with a single neon weapon color ("the weapon") providing interactive state signaling and a signature glow aesthetic.

Full visual identity spec: `$BUILD_ROOT/_resources/directives/generuss-design-visual-identity.md`

### Core Mechanics

- **Raised state** (resting): `box-shadow: 6px 6px 14px rgba(0,0,0,0.7), -6px -6px 14px rgba(255,255,255,0.04)`
- **Inset state** (active/pressed): `box-shadow: inset 4px 4px 10px rgba(0,0,0,0.7), inset -4px -4px 10px rgba(255,255,255,0.04)`
- **Glow effect** (neon signature): `text-shadow: 0 0 10px #00FFEF60, 0 0 40px #00FFEF40, 0 0 80px #00FFEF20`

### State Language

- Raised = resting / clickable
- Inset = active / selected / pressed
- Inset + neon border = current selection
- Glow = emphasis / hero text / signature moments

### Weapon Rules

- USE for: CTA buttons, active nav states, one hero keyword, link hover states, logo punctuation, status indicators
- NEVER for: Backgrounds, borders on inactive elements, secondary text, decoration
- Accent budget: 5-8% of visible pixels
- Button text on accent: Dark (#0C0C0C) - cyan is high-luminance, needs dark text for contrast

---

## Tech Stack

- Astro (static site) + Cloudflare Pages
- Tailwind CSS v4 (`@theme {}` block for design tokens, `@import "tailwindcss"` syntax)
- `@tailwindcss/typography` plugin (blog prose styling with custom dark theme overrides)
- GSAP + ScrollTrigger for all animations
- Self-hosted Inter (sans) + JetBrains Mono (mono) fonts
- Contentful (headless CMS - blog content, build-time fetch via Contentful Delivery API)
- `contentful` JS SDK (Astro fetches at build time - no client-side JS, pages ship as static HTML)
- Contentful webhook triggers Cloudflare Pages rebuild on publish
- Formspree (contact form handler - external POST endpoint, no server-side code needed)
- `@astrojs/sitemap` (auto-generates sitemap including blog routes)
- `@astrojs/rss` (RSS feed for blog syndication)
- Template: `$BUILD_ROOT/_templates/astro-cloudflare/`
- Domain: generussdesign.com (Cloudflare DNS)

---

## Design Tokens (Tailwind v4 @theme)

Source of truth: Neumorphic Visual Identity spec. Background is `#1A1A1E` (not pure black) because neumorphic light shadows (`rgba(255,255,255,0.04)`) disappear on true black.

```css
@theme {
  /* Structure */
  --color-bg: #1a1a1e;
  --color-surface: #1a1a1e; /* same base - depth from shadows, not color */
  --color-bg-secondary: #1e1e22; /* subtle shift for section transitions */
  --color-text: #e8e8e8;
  --color-text-muted: #6b6b75;
  --color-white: #ffffff;
  --color-border: #222222; /* small UI elements like tags only, never section wrappers */

  /* Shadows */
  --shadow-dark: rgba(0, 0, 0, 0.7);
  --shadow-light: rgba(255, 255, 255, 0.04);

  /* The Weapon */
  --color-accent: #00ffef;
  --color-accent-dim: #00ffef20;
  --color-accent-mid: #00ffef40;
  --color-accent-glow: #00ffef60;

  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Spacing & Easing */
  --spacing-section: clamp(4rem, 10vw, 8rem);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Site Structure: Narrative Scroll

Single column, cinematic storytelling. One idea per viewport. Full-width. Vertical rhythm. Each scroll position is a "scene" in a story. No sidebars. No multi-column distractions. Forces the visitor into YOUR narrative sequence.

Scene flow: Problem (dark, tension) -> Solution (bright, relief) -> Proof (social, trust) -> CTA (urgent, clear)

Blog pages (`/blog`, `/blog/[slug]`) live outside this scroll experience as separate routes with their own layout.

Inspiration: quadangles.com, deeddelivery.com, buzzworthystudio.com/work/sling-shot, Apple product pages

---

## Navigation

Hidden during hero, fades in via ScrollTrigger after user scrolls past hero section.

- Fixed at top with backdrop blur (`backdrop-blur-md bg-bg/70`)
- Desktop: logo + section anchor links (Work, About, Blog) + "Book a Call" pill button (accent bg, dark text)
- Mobile: logo + CTA pill + hamburger -> full-screen overlay with stacked links
- Active section tracking via ScrollTrigger (accent underline or text color on current section)
- Blog link points to `/blog` (separate route, not an anchor scroll)
- "Book a Call" links to: https://app.cal.com/generuss/discovery-call
- Accessible: aria attributes, focus trapping in mobile overlay, skip-to-content link

---

## Section 1: Hero

Full-viewport hero with left-aligned content, no container max-width constraining the background. Padding via px-8 sm:px-12 lg:px-20 (not centered max-w-7xl mx-auto).

### Content

- Headline Line 1: "BUILDING GORGEOUS WEBSITES" - text-5xl sm:text-6xl md:text-7xl lg:text-8xl, font-black, tight tracking and leading. color: --color-text (#E8E8E8).
- Headline Line 2: "THAT CONVERT" - same massive type as Line 1. color: --color-accent (#00FFEF) with glow text-shadow.
- Tagline Line 3: "FLAWLESS BY DESIGN." - stepped-down scale: text-xl sm:text-2xl md:text-3xl lg:text-4xl, font-semibold, tracking-wide. color: --color-text-muted (#6B6B75).
- Subheadline: "Design that converts visitors into customers. Built fast. Looks sharp. No bloat." - muted text, max-w-xl, text-lg sm:text-xl md:text-2xl.

### Background

5 geometric shapes (triangles, parallelograms, pentagons, diamonds) using CSS clip-path, positioned absolutely at very low opacity (0.03-0.05). Accent-colored fills. 2 shapes hidden on mobile (hidden sm:block).

### Animations (GSAP, on page load, sequenced timeline)

1. Background shapes fade in with slight scale-up (stagger 0.1s)
2. Headline fades up (y: 40 -> 0)
3. Subheadline fades up
4. CTA fades up
5. Scroll indicator fades in
6. Shapes begin continuous floating animation (random y/x drift, slow rotation, yoyo, sine easing)

All animated elements start with a `.gsap-hidden` utility class (`opacity: 0; visibility: hidden;`) that GSAP removes when animating.

---

## Section 2: Problem -> Solution

Pinned full-viewport section. All 4 problem/solution pairs visible within one screen,
stacked vertically. Problems visible immediately. Solutions reveal one at a time, top to
bottom, as the user scrolls.

### Section Intro

Text fades in before the pin begins: "Your website has real problems." - accent on
"real problems." Fades out as the pinned grid takes over.

### Layout

4 rows, each a two-column split (problem left, solution right) within the pinned viewport.

- Desktop: 50/50 split
- Tablet: 50/50 split, smaller type
- Mobile: stack vertically - problem above solution per row, each reveal still sequential

Each row:

- **Left (problem):** Visible on pin entry. Muted text or slightly dimmed. Problem headline
  - 1-2 sentence description.
- **Right (solution):** Hidden on pin entry. Revealed via horizontal curtain wipe (clip-path
  inset or scaleX mask animating from left edge to full width). Solution headline in accent
  - 1-2 sentence description.

### Reveal Animation - "Curtain Wipe"

Each solution reveals via a horizontal mask wipe (left to right):

- CSS `clip-path: inset(0 100% 0 0)` -> `clip-path: inset(0 0% 0 0)` driven by ScrollTrigger
  scrub
- Solution text fades up (opacity 0 -> 1, y: 20 -> 0) slightly behind the wipe (0.1s delay)
- When a solution reveals, its paired problem shifts from muted to full brightness
  (opacity 0.5 -> 1) - visual confirmation the pair is now "resolved"
- Each pair wipe takes 25% of the total scroll distance (4 pairs = 100%)
- Easing: power3.inOut on the wipe, power2.out on the text

### The 4 Pairs

1. **Cookie-Cutter Stacks**
   - Problem: "Most agencies pick their tools before they hear your goals. Same framework,
     same template system, same stack - whether you're a therapist or a SaaS company."
   - Solution: "Every project starts with a tech stack audit, matching the tools to your
     business, not the other way around."

2. **Performance**
   - Problem: "Most agency sites score 40-60 on Lighthouse. Slow loads, bloated bundles,
     third-party script soup."
   - Solution: "Every Generuss build targets Lighthouse 90%+. Static-first architecture,
     zero unnecessary JavaScript."

3. **Conversion**
   - Problem: "Your site looks fine. But 'fine' doesn't convert. Most sites sit at a 2-3%
     conversion rate because nobody designed the page to guide people toward action."
   - Solution: "Every element on the page has a job. CTAs that are impossible to miss, forms
     that don't make people quit, and a layout that funnels attention exactly where it needs
     to go."

4. **Post-Launch Abandonment**
   - Problem: "The site launches, the invoice clears, and your agency ghosts. Something
     breaks six months later and you're Googling how to fix your own website."
   - Solution: "Every build ships with documentation, a walkthrough, and a direct line. No
     ticket queues, no support tiers - just a real person who built the thing."

`The narrative arc: Wrong tools -> Slow -> Doesn't convert -> Abandoned. Each one escalates the frustration, and the scroll resolves them one at a time. By the time all 4 curtain wipes have revealed, the visitor has seen a complete "we're not like that" story.`

### Pinning Behavior

The section is ScrollTrigger-pinned for +=200% scroll distance (enough runway for 4
sequential reveals + breathing room). The pin starts when the section hits the top of
the viewport.

### Completion State

After all 4 solutions are revealed, the full grid is visible - a complete
problem->solution matrix. Hold for ~20% of remaining scroll distance so the user absorbs
the complete picture.

### Section Outro

Below the grid, text fades in: "Those were the problems. Here's how we solve them." -
transitions into Section 3.

### Transition

During the last 15% of the pin, the entire section fades to opacity 0. Background shifts
from --color-bg to --color-bg-secondary via GSAP scrub.

### Animation Functions Needed

- `curtainWipe(selector, options)` - horizontal clip-path reveal with configurable direction
- Add to animations.js alongside existing functions

---

## Section 3: Design Principles

Two-part section that pins on scroll.

### Part A: Full-width sliding header

A massive oversized heading that slides in from off-screen left: "What Makes a Website Actually Good?" - text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl, font-black, whitespace-nowrap. "Actually Good?" in accent color. The heading is wider than the viewport - it's meant to overflow and feel cinematic. Wrapping div has overflow: hidden. Triggered on scroll, slides from x: -100% to x: 0%.

Implementation reference: `$BUILD_ROOT/_resources/directives/animation-specs/quadangles-marquee.json`
Adapt scrub factor, scroll runway height, and easing to match 2-header sequence.

### Part B: Pinned principles screen

Below the sliding header, a full-screen pinned section with:

1. Subheading that slides in from the right: "Most websites look fine. / The problem is 'fine' doesn't get you customers." - text-3xl sm:text-4xl md:text-5xl lg:text-6xl. "customers." in accent. Same overflow-hidden wrap + slide animation as the header but from right.
2. 6 principles in a 3-column grid (2-col on tablet, 1-col on mobile). Card-free per Key Style Rules - padding only (p-6 md:p-8) on the dark background.

Each principle has:

- Emoji icon (block, text-3xl, mb-4)
- Title (text-xl, font-bold, white)
- Stat line (font-mono, text-xs, accent color)
- Description (text-sm, text-muted, leading-relaxed)

The 6 principles:

1. ⚡ Speed - "53% leave if it takes 3+ seconds" - "Your site loads before they can blink. Performance isn't a feature - it's the foundation."
2. 📱 Mobile-First - "63%+ of web traffic is mobile" - "Designed for thumbs first, then scaled up. Not the other way around."
3. 👁️ Clear Hierarchy - "Users scan, they don't read" - "Every element has a job. Nothing on the page is decoration - it's all working."
4. 🔍 SEO Built In - "68% of online experiences start with search" - "Structured data, meta tags, fast loads, clean code. Google finds you, not the other way around."
5. 🎯 Conversion Focus - "Average site converts at 2-3%" - "Good design guides people to act. CTAs that work, forms that don't suck, zero friction."
6. ♿ Accessibility - "1 in 4 adults has a disability" - "Inclusive by default. More users, fewer lawsuits, better experience for everyone."

### Entrance animation - "Magnetic Assemble"

Cards start scattered off-screen at random positions (different x, y, rotation, scale 0.3-0.45 per card). On scroll-enter, they fly into their grid positions with elastic.out(1, 0.55) easing over 1.4s, staggered 0.07s apart. Scrolling faster during the animation boosts the timeScale (scroll velocity mapped to 1-4x speed).

### Pinning behavior

The .principles-pin wrapper is ScrollTrigger-pinned for +=100% scroll distance. During the last 30% of the pin (progress 0.7-1.0), the section fades to opacity 0.

### Background

Stays at --color-bg-secondary (carried from Section 2 transition).

---

## Section 4: Services

Two core offerings. Neumorphic raised cards - the only place on the site (besides portfolio) where card treatment is used.

---

### Section Intro

"What I Build." - accent on "Build." text-3xl sm:text-4xl md:text-5xl, font-bold, centered.

---

### Layout

Two cards side by side on desktop (grid-cols-2, gap-8), stacked on mobile (grid-cols-1). Cards use raised neumorphic treatment: rounded-2xl, paired box-shadows per design tokens. Accent glow on hover (subtle box-shadow addition, not background change).

---

### Card 1: Web Design & Development

Tagline: "Fast, clean sites that convert - built custom for your business."

Includes:

- Discovery call + tech stack audit
- Custom design and development (no templates)
- Mobile-first, Lighthouse 90%+ builds
- Static architecture - no CMS vulnerabilities, no plugin rot, no surprise security patches. It launches clean and stays clean.
- Launch documentation + walkthrough

---

### Card 2: AI Automation Consulting

Tagline: "Workflows that run themselves so you can focus on the work that matters."

Includes:

- Process audit and automation mapping
- Custom automation builds (n8n, Make.com, API integrations)
- AI tool selection and implementation
- Documentation + handoff

---

### Growth Partner Block

Sits below both cards, above the Section CTA. Centered text, max-w-2xl. text-lg, text-muted, leading-relaxed.

```
Consider me your growth partner - your site doesn't stop at launch. Need a lead form that triggers an email sequence? A booking flow that syncs to your CRM? I build the site and the systems behind it. One person, one bill, zero handoff chaos.

If your business needs go deeper than the site itself - workflow automation, AI tool integration, entire processes that run themselves - that's not a referral to someone else. That's the other half of what I do.
```

Animation: fade-up after cards, same stagger sequence. No card treatment - raw text on background per Key Style Rules.

---

### Section CTA

"Let's figure out what you need. ->" - accent on "what you need." Large pill button, accent bg, dark text, glow hover. Links to: https://app.cal.com/generuss/discovery-call

---

### Animation

Stagger fade-up on scroll: headline -> cards (0.15s offset between cards) -> growth partner block -> CTA button. Cards get subtle accent glow on hover consistent with raised -> hover state transition.

---

### Responsive

- Desktop: 2-col grid
- Tablet: 2-col grid, reduced padding
- Mobile: stacked, full-width cards
- Growth partner block: full-width, centered, padding matches section padding (px-8 sm:px-12 lg:px-20)

---

### Background

Stays at --color-bg-secondary (carried from Section 3).

---

## Section 5: Portfolio

Project showcases using a click/tap-to-expand modal pattern. Replaces the original pinned full-viewport cinematic scroll approach to reduce scroll fatigue (Sections 2 and 3 already use pinned sequences) and give visitors control over what they view.

---

### Design Rationale

The site already has two pinned scroll gauntlets (Problem/Solution and Design Principles). A third forced sequence risks fatigue and slows down visitors who are already ready to book. The modal pattern lets interested visitors explore projects on their own terms while keeping everyone else moving toward the CTA.

---

### Projects

1. **Crystal Seed Tarot** - crystalseedtarot.com - Next.js · Tailwind · Vercel
   - Description: "Full rebuild from a clunky WordPress site into a fast, multi-page hub for tarot services, events, blog, and client reviews. Built with a frosted glass UI and Contentful-powered blog so Holly can publish without touching code."

2. **Vibe N Thrive Therapy** - vibenthrivetherapy.com - Astro · Vercel
   - Description: "Wellness practice site built from scratch in 4 hours. Clean layout designed around one goal - getting sessions booked. Deployed and fine-tuned same day."

3. **generuss.com** - Next.js · Tailwind · Vercel
   - Description: "My own brand site for AI automation consulting. AI-powered chatbot, Contentful blog, embedded Cal.com booking, cursor glow effects, and a layout engineered to move visitors from social proof to conversion fast."

4. GitHub profile - github.com/washyaderner

---

### Layout

Horizontal grid of project thumbnails. Desktop: 3-col grid (GitHub gets a smaller card or inline link below the main 3). Tablet: 2-col. Mobile: stacked single column.

Each thumbnail card uses raised neumorphic treatment (consistent with Services cards):

- rounded-2xl, paired box-shadows per design tokens
- Contains: screenshot in browser-frame mockup, project name below, tech stack tags (accent border pills)

---

### Section Intro

"What I've Built." - accent on "Built." text-3xl sm:text-4xl md:text-5xl, font-bold, centered.

Brief subline below: "Click any project to see it up close." - text-muted, text-lg, centered.

---

### Desktop Hover State

- Screenshot scales up slightly (scale 1.03, 0.3s ease)
- Subtle accent glow added to card frame edge
- Frosted overlay slides up from bottom covering ~30% of the screenshot
  - Contains: project description text (1-2 sentences) + "View Project ->" in accent
  - Overlay background: bg-black/60 with backdrop-blur-sm
- Cursor changes to pointer

---

### Modal - Desktop

Triggered by clicking a thumbnail card.

**Overlay:**

- Full-screen dark overlay: bg-black/90, fades in (opacity 0 -> 1, 0.3s)
- Scroll locked on parent page while modal is open

**Content - centered on screen:**

- Large browser-frame mockup (neumorphic styled, rounded-2xl) showing desktop screenshot at full resolution
- Below the frame:
  - Project name (text-2xl, font-bold, white)
  - Project description (text-lg, text-muted, max-w-2xl)
  - Tech stack tags (accent border pills, font-mono, text-xs)
  - Two buttons side by side:
    - "Visit Live Site ->" - accent bg, dark text, glow hover, opens new tab with rel="noopener"
    - "Close" - outlined, text-muted, hover to white
- Close button (X) in top right corner of overlay - accent color, 44x44px tap target

**Entry animation (FLIP pattern):**

- Screenshot frame starts at the thumbnail's exact viewport coordinates and dimensions
- Animates to centered full-screen position over 0.4s
- Easing: power3.out
- Overlay fades in simultaneously

**Exit animation:**

- Reverse - frame scales back down to thumbnail position over 0.3s
- Overlay fades out simultaneously
- Triggered by: clicking X, clicking outside the frame, or pressing ESC

---

### Modal - Mobile

Triggered by tapping a thumbnail card.

**Key differences from desktop:**

- Uses mobile screenshot instead of desktop screenshot
- Phone-frame mockup instead of browser-frame mockup
- X button in top left corner (thumb-reachable)
- No hover states - card goes straight to modal on tap
- Buttons stack vertically (full-width) instead of side by side
- Tap outside frame or hit X to close

---

### Thumbnail Images

One hero screenshot per project, consistent format:

- Desktop: Full-width desktop screenshot at same resolution across all projects
- Mobile: Mobile screenshot captured at same device width across all projects
- Format: WebP, lazy loaded with blur-up placeholder
- Location: `public/images/portfolio/`

File naming convention:

- `crystal-seed-tarot-desktop.webp`
- `crystal-seed-tarot-mobile.webp`
- `vibethrive-desktop.webp`
- `vibethrive-mobile.webp`
- `generuss-desktop.webp`
- `generuss-mobile.webp`

---

### GitHub Link

Below the thumbnail grid, not in a card: "See more on GitHub ->" - text link, accent color, hover underline. Links to: github.com/washyaderner (opens new tab)

---

### Accessibility

- Modal: `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing to project name
- Focus trapped inside modal when open
- ESC key closes modal
- Close button has visible focus ring (accent outline)
- "Visit Live Site" uses `rel="noopener"` and `target="_blank"`
- `prefers-reduced-motion`: disable FLIP scale animation, use simple fade in/out only

---

### Animation

**Entrance (scroll-triggered):**

- Section heading fades up
- Thumbnail cards stagger fade-up (0.15s offset between cards)
- No pinning - section scrolls naturally

**Animation intensity: Moderate** - card entrances and modal transitions only, no scroll-driven mechanics. This section breathes after the heavy Sections 2 and 3.

---

### Background

Resets from --color-bg-secondary back to --color-bg.

---

### Responsive Summary

| Breakpoint        | Grid          | Screenshot         | Modal Frame   |
| ----------------- | ------------- | ------------------ | ------------- |
| Desktop (1024+)   | 3-col         | Desktop screenshot | Browser frame |
| Tablet (640-1023) | 2-col         | Desktop screenshot | Browser frame |
| Mobile (<640)     | 1-col stacked | Mobile screenshot  | Phone frame   |

---

## Section 6: About (Micro)

Centered block, ~50vh height, generous vertical padding. Human connection moment - calm pacing after portfolio energy.

- Circular photo with subtle accent ring border (`public/images/russ-headshot.webp` - use placeholder)
- Heading: "Hey, I'm Russ." - text-3xl, font-bold, white
- Bio: text-lg, muted text, max-w-xl, centered

```
I started as a music producer - making beats, mixing records, obsessing over every detail until it hit right. That same ear for precision followed me into web design. Two decades in sales taught me what makes people act. 15+ years in the studio taught me what makes something feel right. Now I build websites that do both... convert visitors into customers and look sharp doing it. Every project gets a custom stack, not a recycled template.
```

### Animation

Simple staggered fade-up: photo -> name -> bio. No complex scroll mechanics - this section breathes.

---

## Section 6.5: Why Me (insert between About and Reviews)

New micro-section. Same calm pacing as Section 6. No cards - text on dark background per Key Style Rules. Centered block, max-w-xl, generous vertical padding.

- Heading: "Why Me." - text-3xl, font-bold, white. Accent on "Me."
- Body: text-lg, muted text, max-w-xl, centered, leading-relaxed

```
Most developers build from a template and call it custom. I build from a blank canvas - the same way I approach a mix in the studio. Every element earns its place. That means I don't think in templates. I think in outcomes. What does the visitor need to feel? Where do they need to look? What makes them click instead of bounce? I've been answering those questions for two decades in sales and over a decade behind a mixing console. The medium changed. The instincts didn't. One of the most important things my clients love is my attentive communication every step of the way - that's not just a line, it's the thing my clients mention first.
```

### Animation

Simple staggered fade-up: heading -> body. Matches Section 6 pacing - no complex scroll mechanics.

### Background

Stays at --color-bg (carried from Section 6).

### Transition

Standard fade into Section 7 (Reviews). No background shift.

---

## Section 7: Reviews

Manually populated testimonials. All 5-star reviews. Adding more over time.

### Section Intro

"All killer. No filler." - accent on "killer."

### Display

Vertically stacked reviews, max-w-3xl centered. No cards - text on dark background per Key Style Rules.

Each review:

- 5 accent-colored star icons
- Blockquote text (text-lg, text-text, leading-relaxed)
- Attribution: name + context in mono (text-sm, text-muted, font-mono)

### Animation

Stagger fade-in on scroll. Stars animate 0.05s ahead of text.

### Reviews

Review 1 - AI-Powered Proposal Generator (5 stars)
"Working with Russell has been nothing short of outstanding, and we don't say that lightly, especially after working with hundreds of developers and freelancers! This was a tricky project with the potential to veer off in multiple directions, but Russell brought structure, clarity, and calm from day one. He went truly above and beyond-navigating complexity with precision, staying focused when others might have drifted, and delivering results that exceeded every expectation.

Russell is not only highly skilled and deeply logical, but also an absolute pleasure to work with. His communication is spot on, his work ethic is unmatched, and his ability to solve problems quickly and intelligently makes him a rare find. We'd love to keep working with Russ long term. I'd say 'don't hire him because he's ours,' but the truth is-every business deserves a secret weapon like Russell. Highly, highly recommended!!"
Jonny - Invincible Media

Review 2 - GTM/RevOps Proposal Builder Optimization (5 stars)
"This was our second time working with Russell, and once again, he delivered flawlessly. The project was a focused optimisation of our GPT-based GTM/RevOps proposal builder, and Russell approached it with the same clarity, structure, and commercial instinct that impressed us the first time around. He took an already-solid system and made it smarter, faster, and sharper.

His ability to balance logic, tone, and usability in prompt engineering is next-level. Nothing is ever too much trouble, and he remains thoughtful, fast, and genuinely enjoyable to work with. If anything, this second round confirmed what we already knew: Russell is a rare talent and an asset to any team. Still highly recommended - if not even more so now!"
Jonny - Invincible Media

Review 3 - Vibenthrive.com Website Rebuild (5 stars):
"In today's age, it's quite easy to find somebody to build you a website, but what is not easy is finding somebody that will build you an excellent website while providing thorough communication and thoughtful recommendations. I've had many websites built over the years and have never had anybody provides such detail to their work. I was absolutely blown away by the results, communication, and turnover time. Russ is an absolute professional."
Carson - Vibe N Thrive

Review 4 - Voodoo Bed & Twenty Poems Albums
"Russ is by far my favorite person to work with. Aside from his beats being top notch amazing, he's great at mixing and mastering and handling mixing duties on projects I bring him from other producers.

We made an EP together and I loved it, so when I wanted to do a separate project in a completely different direction, I asked him for some simple backing tracks since I knew he'd be the perfect fit. He exceeded my expectations by miles... Miles and miles, creating whole worlds for these songs. When I say he brought the project to life, it's a drastic understatement.

I would be happy to work with him on anything. On top of all that he's also a cool friendly person. I'm lucky to know him."
Leon McConnell - Resist Entertainment

Review 5 - Better Late Than Never Album

"That was so fucking good man. It came from me, so I know everything that you did - you took a simple small thing and you brought it to life. I can't pay you enough for that. I see all the love for music you pour into it. I'm wowed! I love what you did with the end of Concrete Illusions, and how you beefed up Sad Song for the new mix. The Potion sounds fucking good, and the rain sample you added to pushing daisies make it so much more cinematic."
Dirty Chai - Struggle Crew

**Holly:**
`TODO: Add review copy`

`TODO: Add additional reviews as they come in. Pattern supports easy additions - each review is the same component with different content.`

---

## Section 8: CTA / Contact

Full viewport, centered. The "urgent, clear" close of the narrative scroll. Minimal - no distractions.

### Primary CTA (Book a Call)

- Headline: "Ready to build something that CONVERTS?" - accent on "CONVERTS?"
- Subline: muted text, max-w-xl, centered

```
Your website should be your hardest working employee. If it's not pulling its weight, let's fix that. Book a discovery call - no pressure, no fluff. Helps us make sure we're on the same page.
```

- Button: "Let's Build Yours ->" - large pill, accent bg, dark text, glow hover
- Links to: https://app.cal.com/generuss/discovery-call
- Glow pulse on accent words (2.5s cycle - callbacks to Problem/Solution section glow treatment)
- Ambient radial gradient glow behind content (accent at 0.04 opacity)
- Focus state on button for a11y

### Secondary CTA (Contact Form)

Below the primary CTA, separated by visual breathing room (spacing-section / 2). A lightweight alternative for visitors who aren't ready to book a call but want to reach out.

- Divider text: "Or send me a message." - text-muted, text-sm, centered, with faint horizontal lines on either side (like a centered "or" break)
- Form uses neumorphic inset styling (input fields use inset box-shadow treatment per State Language)
- 3 fields only: Name, Email, Message (textarea, 3 rows)
- Submit button: "Send Message ->" - outlined style (border-accent, text-accent, hover fills to accent bg with dark text). Smaller than the primary CTA pill - visually subordinate.
- All fields use --color-text on --color-bg input backgrounds with inset shadows
- Placeholder text in --color-text-muted
- Focus state: accent border glow (subtle, 1px)
- Form action: Formspree endpoint (POST to https://formspree.io/f/{form_id})
- Success state: form replaced with "Message sent. I'll be in touch." - accent on "in touch.", fade transition
- Error state: inline validation, accent-colored error text below field
- Accessible: proper label associations, aria-describedby for errors, focus management on submit
- Spam protection: Formspree honeypot field (hidden input, no CAPTCHA - keeps UX clean)

### Animation

Primary CTA content fades up first (heading -> subline -> button), then secondary form fades up after (0.3s delay). Contact form entrance is calm - simple opacity fade, no y-transform. Keeps the primary CTA dominant.

### Responsive

- Desktop: form sits below CTA at max-w-md, centered
- Mobile: form goes full-width with section padding (px-8), fields stack naturally
- Submit button: full-width on mobile

---

## Section 9: Footer

Simple utility footer. No animation - link hover states only.

- Top border: 1px solid --color-border
- 3-column grid -> 2-col on tablet -> stacked on mobile
- Column 1: Logo + tagline ("AI Automation & Web Design")
- Column 2: Nav links - Home, Work, About, Blog, Book a Call
- Column 3: Connect - GitHub (washyaderner), Twitter/X (DegeneRussAI), Email (russ@generuss.com)
- Copyright: (c) 2026 generuss design

---

## Blog (Contentful-Powered, Separate Routes)

Blog pages live outside the main narrative scroll as standalone routes. They share the site's global nav and footer but use their own simplified layout - no GSAP ScrollTrigger, no pinned sections, no complex animations. People are here to read.

### Content Model (Contentful)

| Field          | Type              | Required | Notes                                                         |
| -------------- | ----------------- | -------- | ------------------------------------------------------------- |
| title          | Short text        | Yes      | Post title                                                    |
| slug           | Short text        | Yes      | URL-safe, unique. Validation: `^[a-z0-9]+(?:-[a-z0-9]+)*$`    |
| excerpt        | Short text        | Yes      | Used on blog index cards and meta description                 |
| body           | Rich text         | Yes      | Main post content. Supports embedded assets + code blocks     |
| featuredImage  | Media             | Yes      | Used on index card, post hero, and OG image                   |
| publishDate    | Date              | Yes      | Sort order + display. ISO 8601                                |
| tags           | Short text (list) | No       | For filtering/categorization. Rendered as accent border pills |
| seoTitle       | Short text        | No       | Override for `<title>` tag. Falls back to title               |
| seoDescription | Long text         | No       | Override for meta description. Falls back to excerpt          |

### Routes

- `/blog` - Index page (paginated post list)
- `/blog/[slug]` - Individual post pages (dynamic route, generated at build time via `getStaticPaths`)

### Blog Index (`/blog`)

- Page heading: "Blog" - text-3xl sm:text-4xl md:text-5xl, font-bold, white. Accent on "Blog" (optional - test visually)
- Post cards in a 2-col grid (desktop), 1-col stacked (mobile/tablet)
- Each card uses raised neumorphic treatment (consistent with Services/Portfolio cards):
  - Featured image (aspect-ratio 16/9, object-cover, rounded-t-2xl)
  - Title (text-xl, font-bold, white)
  - Publish date (font-mono, text-xs, text-muted)
  - Excerpt (text-sm, text-muted, line-clamp-3)
  - Tags as accent border pills (font-mono, text-xs)
  - Entire card is clickable (wrapped in `<a>`)
- Hover: subtle accent glow on card edge + slight scale (scale 1.02, 0.3s ease)
- Pagination: simple "Older Posts ->" / "<- Newer Posts" text links at bottom, accent color. 10 posts per page.
- Animation: simple stagger fade-up on cards. No GSAP ScrollTrigger - CSS transitions only.

### Blog Post (`/blog/[slug]`)

- Layout: centered column, max-w-prose (65ch), generous vertical padding
- Post hero: featured image (full-width within max-w-prose, rounded-2xl, neumorphic raised shadow)
- Title: text-3xl sm:text-4xl, font-bold, white
- Meta line: publish date + tags (font-mono, text-xs, text-muted, accent pills for tags)
- Body: styled via `@tailwindcss/typography` prose classes with dark theme overrides:
  - `prose-invert` base
  - Headings: --color-text
  - Body text: --color-text (not muted - long-form needs full contrast)
  - Links: --color-accent with hover underline
  - Code blocks: --color-bg-secondary background, --font-mono, accent for syntax highlights where supported
  - Blockquotes: left border in --color-accent-dim, text in --color-text-muted
  - Images: rounded-xl, neumorphic raised shadow
  - `hr`: --color-border
- Back link at top: "<- Back to Blog" - accent text link, above the title
- Reading time estimate: calculated from word count, displayed in meta line (font-mono, text-xs)

### SEO (All Blog Pages)

- `<title>`: `{seoTitle || title} | generuss design` (index: "Blog | generuss design")
- `<meta name="description">`: `{seoDescription || excerpt}`
- Open Graph tags: `og:title`, `og:description`, `og:image` (featured image URL from Contentful), `og:type: article`, `og:url`
- Twitter Card: `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- Canonical URL: `<link rel="canonical" href="https://generussdesign.com/blog/{slug}">`
- JSON-LD structured data per post:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{excerpt}",
  "image": "{featuredImage.url}",
  "datePublished": "{publishDate}",
  "author": {
    "@type": "Person",
    "name": "Russ",
    "url": "https://generussdesign.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "generuss design",
    "url": "https://generussdesign.com"
  }
}
```

- RSS feed at `/rss.xml` via `@astrojs/rss` (includes all published posts)
- Sitemap includes all `/blog/[slug]` routes via `@astrojs/sitemap`
- Internal linking strategy: blog posts should link back to relevant service/portfolio sections on the main page (e.g., a post about site speed links to `/#services`) to pass link equity

### Build-Time Data Fetching

Astro fetches all blog content from Contentful Delivery API at build time. No client-side API calls. Pages ship as static HTML.

```
src/
  lib/
    contentful.ts      # Contentful client + typed fetch helpers
  pages/
    blog/
      index.astro      # Blog index with pagination
      [slug].astro     # Dynamic post route (getStaticPaths)
  layouts/
    BlogLayout.astro   # Shared blog layout (nav + footer, no scroll animations)
  components/
    BlogCard.astro     # Reusable post card for index page
    BlogMeta.astro     # Date + tags + reading time line
```

### Rebuild Trigger

Contentful webhook -> Cloudflare Pages deploy hook. When you publish or update a post in Contentful, the site rebuilds automatically. No manual redeploy needed.

**Fallback**: If Contentful API is unreachable during build, the build should fail loudly (not silently skip blog content). This keeps the blog as a hard dependency so you notice issues immediately rather than shipping a site with missing posts.

### Blog Animation Rules

- No GSAP, no ScrollTrigger on blog pages
- Card hover effects via CSS transitions only (0.3s ease)
- Page entrance: simple CSS fade-in on body content (opacity 0 -> 1, 0.3s)
- Keeps blog pages lightweight and fast-loading (core SEO benefit)

---

## Site Orchestration

### Section Transitions

All pinned sections use fade to opacity 0 during the last 30% of pin progress for smooth handoffs. Background color shifts are GSAP-scrubbed to body backgroundColor - never abrupt cuts.

| Transition                     | Background Shift                   |
| ------------------------------ | ---------------------------------- |
| Hero -> Problem/Solution       | --color-bg (stays)                 |
| Problem/Solution -> Principles | --color-bg -> --color-bg-secondary |
| Principles -> Services         | --color-bg-secondary (stays)       |
| Services -> Portfolio          | --color-bg-secondary -> --color-bg |
| Portfolio -> About             | --color-bg (stays)                 |
| About -> Why Me                | --color-bg (stays)                 |
| Why Me -> Reviews              | --color-bg (stays)                 |
| Reviews -> CTA                 | --color-bg (stays)                 |

### Animation Intensity Curve

Controls pacing across the full scroll experience:

- **Hero:** Moderate - entrance sequence, then calm floating
- **Problem/Solution:** Peak - pinned scenes, crossfades, glow pulses, breathing drift
- **Principles:** Peak - magnetic assemble, sliding headers
- **Services:** Moderate - card entrances
- **Portfolio:** Moderate - card entrances, modal transitions
- **About:** Calm - simple fade-ups, breathing room
- **Why Me:** Calm - simple fade-ups, matches About pacing
- **Reviews:** Calm - stagger fade-ins
- **CTA:** Accent glow callback, otherwise calm
- **Footer:** None
- **Blog pages:** None (CSS transitions only)

### Heading Hierarchy

| Level       | Usage                                                                               | Size                                                      |
| ----------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| h1          | Hero headline only (one per page). On blog posts: post title                        | text-5xl -> text-8xl (hero) / text-3xl -> text-4xl (blog) |
| h2          | Section titles (sliding headers, section intros, "Why Me."). On blog index: "Blog"  | text-3xl -> text-6xl                                      |
| h3          | Subsection heads (principle titles, project names). In blog posts: content headings | text-xl -> text-2xl                                       |
| Mono labels | Stats, tags, metadata, blog dates                                                   | text-xs, font-mono                                        |

---

## Animation Architecture

Animations are split into two files:

- **animations.js** - pure, reusable animation functions (textReveal, fadeUp, staggerCards, magneticAssemble, floatShapes, slideInText, glowPulse, breatheDrift). Each accepts a CSS selector and options. Each removes .gsap-hidden from targets before animating.
- **scroll-manager.js** - orchestrator that imports animation functions and wires them to the correct selectors. Uses ScrollTrigger.matchMedia for responsive breakpoints (desktop >=1024, tablet 640-1023, mobile <640). Calls magneticAssemble('.principle-card') with reduced spread on smaller screens.

Blog pages do NOT load animations.js or scroll-manager.js. GSAP is excluded from blog routes entirely to keep bundle size minimal.

Easing convention: GSAP animations use GSAP native easings (power4.out, elastic.out, etc.). CSS transitions (hover, focus, micro-interactions) use --ease-out-expo. No cross-conversion between systems.

Animation reference for sliding headers: `$BUILD_ROOT/_resources/directives/animation-specs/quadangles-marquee.json`

---

## Key Style Rules

- Neumorphic card treatment (raised shadows, rounded-2xl) is used on interactive/featured elements: service cards, portfolio items, CTAs, UI components, blog post cards. NOT on section wrappers or full-width content areas.
- The Design Principles grid (Section 3) is deliberately card-free - content sits raw on the dark background with padding only (p-6 md:p-8). This lets the magnetic assemble animation read as content arriving, not containers flying around.
- border border-border is reserved for small inline elements (tag pills, button outlines) - never on section wrappers.
- Full-width edge-to-edge feel. Padding is px-8 sm:px-12 lg:px-20, not max-width centered containers.
- Blog layout is the exception: max-w-prose centered column for readability. Blog index uses max-w-4xl for the card grid.
- Grain overlay on the page (::before pseudo-element with SVG noise texture at 0.03 opacity, reduced to 0.015 on mobile).
- Thin custom scrollbar (6px, dark track, border-colored thumb).
- ::selection uses accent color at 0.3 opacity.
- `prefers-reduced-motion`: disable transforms, preserve opacity-only fades.

---

## Copy Voice

Scrape generuss.com before writing any copy. Analyze tone per section:

- Site copy (hero, services, CTAs) = professional direct
- About/bio = professionally casual
- Blog = conversationally technical

Reference: `Use site scraping tools to analyze generuss.com. Identify tone per section and match accordingly.`

---

## Pre-Build Research (Complete During Prep Phase)

These must be resolved before the preamble goes to Claude Code. Output feeds into copy and content:

- [ ] Scrape generuss.com for voice/tone analysis across all sections
- [x] ~~Research most common website types~~ (removed - existing copy is strong)
- [x] ~~Run ANIM-EXTRACT on inspiration sites~~ (completed separately)
- [x] ~~Verify stats~~ (verified Feb 2026 - two updates applied: Mobile-First 60%+ -> 63%+, Conversion Focus 2.35% -> 2-3%)

---

## Open TODOs Before Build

- [ ] Section 7: Add Holly's review + any additional reviews
- [ ] Portfolio: Capture screenshots of live sites for `public/images/portfolio/`
- [ ] About: Get headshot photo for `public/images/russ-headshot.webp`
- [ ] Formspree: Create form and get endpoint ID for Section 8 contact form
- [ ] Contentful: Create blog content model matching the schema in the Blog section
- [ ] Contentful: Set up Cloudflare Pages deploy hook + Contentful webhook
- [ ] Blog: Write and publish at least 1-2 seed posts before launch (site shouldn't ship with an empty blog)

---

## V4 -> V5 Changelog

| Area                   | V4                                                      | V5                                                                                        |
| ---------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Blog                   | Excluded from v1 ("migrate later")                      | Ships in v1 via Contentful                                                                |
| CMS                    | Excluded from v1 ("markdown only, no Sanity/Keystatic") | Contentful headless CMS, build-time fetch                                                 |
| Tech Stack             | Astro + Cloudflare + GSAP + Formspree                   | Added: Contentful SDK, @tailwindcss/typography, @astrojs/sitemap, @astrojs/rss            |
| SEO                    | Implicit (Design Principles mention SEO)                | Explicit: JSON-LD, OG tags, Twitter Cards, canonical URLs, RSS, sitemap, internal linking |
| Routes                 | Single-page scroll only                                 | Added: `/blog`, `/blog/[slug]`, `/rss.xml`, `/sitemap.xml`                                |
| Animation Architecture | GSAP loaded globally                                    | GSAP excluded from blog routes                                                            |
| Heading Hierarchy      | h1 = hero only                                          | h1 = hero on index, post title on blog posts                                              |
| Key Style Rules        | No prose/reading exceptions                             | Blog uses centered max-w-prose layout                                                     |
| Open TODOs             | 4 items                                                 | 7 items (added Contentful setup + seed posts)                                             |
