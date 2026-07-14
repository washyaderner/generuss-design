---
title: "How I Built a Full Website in 30 Hours (After Failing Spectacularly the First Time)"
seoTitle: "How I Built a Full Website in 30 Hours"
excerpt: "I spent two weeks planning a website with Claude before writing a single line of code. Then I built it in 30 hours across one weekend. But the real story isn't the build weekend - it's the complete failure that forced me to rethink how I work with AI from the ground up."
metaDescription: "Two weeks of planning with Claude, one failed start, then a full custom website built in 30 hours. The AI workflow lessons are the real story."
publishDate: "2026-02-18"
tags: ["case study", "web design", "AI-assisted development"]
featuredImage: "/images/blog/building-this-site-og.svg"
layout: timeline
timeline:
  - phase: 1
    title: "Planning"
    subtitle: "The Idea"
    milestones:
      - "Brain dump"
      - "The failure"
  - phase: 2
    title: "The Brief"
    subtitle: "Iteration"
    milestones:
      - "V2 planning"
      - "Section 2 saga"
      - "V3-V5 evolution"
  - phase: 3
    title: "The Build"
    subtitle: "30 Hours"
    milestones:
      - "Day 1: Foundation"
      - "Day 2: Craft"
      - "Day 3: Ship"
  - phase: 4
    title: "Reflection"
    milestones: []
---

# How I Built a Full Website in 30 Hours (After Failing Spectacularly the First Time)

## TLDR

I spent two weeks planning a website with Claude before writing a single line of code. Then I built it in 30 hours across one weekend - 38 commits, 13 PRs merged, 9 sections, deployed to Cloudflare Pages. But the real story isn't the build weekend. It's everything that happened before it - including a complete failure that forced me to start over and rethink how I work with AI from the ground up.

---

## The Brain Dump That Started Everything

The first version of the plan for generussdesign.com was embarrassingly simple. I was so excited to get started. The only thing I fully prepped for was what the theme was going to look like and what kind of scroll triggers, pinning, and animation were going to be done based off some sites I saw on godly.website. I opened a new Claude conversation and basically said: "I bought the domain. I want to showcase design skills. Here are some sites I like. Make it lol." I had some notes, some selling points, but it was super basic and I only had the problem-solution section nailed down. That lack of preparation led to a painful first pass.

I threw in a table of my existing sites - generuss.com, crystalseedtarot.com, vibenthrivetherapy.com - and a list of inspiration URLs like quadangles.com, buzzworthystudio.com, and deeddelivery.com. I told Claude to scrape those sites to figure out what animation tools they were using. I mentioned wanting scroll-triggered transitions between sections, something about Alex Hormozi's brand alignment philosophy, and the fact that I wanted to explain what makes good web design.

That initial dump was maybe 400 words of actual direction. No design tokens. No section specs. No copy. No animation architecture. Just vibes.

And honestly? The conversation that followed was productive. Claude came back with a full analysis of the inspiration sites - GSAP + ScrollTrigger as the animation backbone, Locomotive Scroll for smooth scrolling, dark backgrounds with high-contrast accents, oversized typography, full-viewport section models. It identified the common thread across all of them and mapped it to a recommended structure.

We classified the project as Astro + Tailwind v4 + Cloudflare. No auth, no database, no backend. Pure frontend with heavy animation work. We scraped Upwork to identify the most common website types clients request, which shaped the "What I Do" section. We even built a Python/Playwright toolkit to extract GSAP ScrollTrigger configurations from any URL, and I turned that into a reusable directive.

By the end of that first planning session, I had a site structure, animation inspiration data, a quadangles.com animation spec in JSON, and a pile of ideas. What I didn't have was anything close to a buildable plan.

---

## The Failure (and Why It Matters)

Here's where it gets real.

I took that initial plan and tried to build the site. This was the same day Opus 4.6 dropped. I was ready to use my recently perfected Brain Dump -> PILOT Prompt -> Claude Code pipeline, which structures my ideas into digestible data while asking me discovery questions that ensure we're thorough. The direction we took instead was 11 sequenced prompts - bite-sized instructions for Claude Code to execute one at a time. Scaffold the project. Build the nav. Build the hero. Build the Problem/Solution section. And so on, all the way through to a final polish pass.

It looked organized. It felt methodical. It was a disaster.

The fundamental problem: I was building blind. Each prompt was 10-15 implementation decisions that compound before you see anything. By prompt 4, I'm 40+ decisions deep with zero visual feedback. I hit the context limit - burned through the entire token window - before I could even preview what had been built.

And when I finally could see it? It wasn't what I wanted. I was recording the build for YouTube.

The design was flat. Edge-to-edge layouts with no depth. The whole point was a neumorphic visual identity - tactile, physical UI with paired light/dark box-shadows - and what got built was an editorial blog layout. The foundation was wrong, and every section built on top of it inherited that wrongness.

I scrapped the entire thing and started over.

That experience taught me the single most important lesson of this whole project: **Do not batch-build blind.** It became a literal directive that I wrote into every version of the site brief from that point forward. Build a section, preview it, confirm it's right, then move to the next one. No exceptions.

---

## V2: Actually Planning This Time

The second attempt was different. Instead of a brain dump and a prayer, I sat down and wrote a real site brief.

This is where Claude and I started going deep. We weren't just listing sections anymore - we were speccing every detail. Design tokens got locked: `#1A1A1E` for the background (not pure black, because neumorphic light shadows at `rgba(255,255,255,0.04)` disappear entirely on true black), `#00FFEF` as the single accent color (I call it "the weapon"), Inter for headlines, JetBrains Mono for labels.

We defined the state language - raised for resting/clickable, inset for active/pressed, inset + neon border for current selection, glow for emphasis. Shadow values were specified down to the pixel. The accent budget was capped at 5-8% of visible pixels. These aren't arbitrary constraints - they're what makes the design feel intentional instead of random.

Claude asked me the right questions in that session. Ones I hadn't thought about:

- "Are you positioning this as 'Generuss Design' the studio, or 'Russ builds your site' the personal brand?"
- "Blog on this site, or keep content on generuss.com and make this a pure conversion machine?"
- "Packages visible, or keep pricing behind the discovery call?"

Each answer shaped the architecture. Book a discovery call became the singular CTA. Dark + bold won the visual mood vote. Three portfolio sites - an AI/automation brand, a spiritual/creative brand, and a therapy practice - to show range without cluttering the message.

The V2 brief was about 400 lines vs the original 400 words. Nine sections fully specced. Animation architecture split into `animations.js` for reusable functions and `scroll-manager.js` for orchestration. A section-by-section intensity curve to prevent everything from feeling the same energy level. And the `SKIP_TO_ARCHITECT` flag at the top, because there was nothing to discover in Prep - the brief had already done that work.

---

## The Section 2 Saga

If any single section shows what the planning process was actually like, it's Section 2: Problem/Solution.

The first version used a crossfade approach - four pinned scenes, each with a problem dissolving into a solution. Scroll-driven, with glow pulse and breathing drift animations. It looked good on paper.

Then I rewrote it. Completely.

The new version uses a pinned viewport with all four problems visible at once, stacked vertically. Solutions reveal one at a time via a horizontal curtain wipe - `clip-path: inset(0 100% 0 0)` animating to `inset(0 0% 0 0)`, driven by ScrollTrigger scrub. When a solution reveals, its paired problem shifts from muted to full brightness as visual confirmation the pair is "resolved."

The rewrite happened in one conversation. Then I needed it in another conversation to continue the brief work. Claude searched every past chat trying to find it - ran seven different search queries - and couldn't locate it because we'd never saved it to a file. I'd agreed to copy-paste it into the brief myself and hadn't done it yet.

That's when the handoff document system really clicked for me. Context gets lost between conversations. Files on disk don't. Every important decision from that point forward got saved as a file, not just discussed in chat.

The four problem/solution pairs themselves went through iterations too. Started with "AI Stack Bias" and "Performance." Pairs 3 and 4 were TODOs for weeks. Eventually they became "Conversion" (your site looks great but doesn't convert) and "Post-Launch Abandonment" (the agency ghosts after the invoice clears). Those last two are the ones that resonate most with potential clients, and they only emerged because I let them sit instead of forcing placeholder copy.

---

## V3, V4, V5: The Brief That Wouldn't Stop Evolving

Each version of the brief represented real decisions, not just formatting changes.

**V3** was the cleanup pass. I deprecated the starter-prompts system entirely and moved to a directive-driven build flow fed through PILOT. The light mode strategy got smart - ship the toggle infrastructure and dark theme in V1, defer light mode token values to a fast-follow. The em dashes got replaced with hyphens (a small thing that drove me crazy in generated copy). Duplicate sections got merged. Stale TODOs got cleared.

**V4** was the content pass. This is where the site got its personality. The Services section evolved into two cards - Web Design and AI Automation - with a "Growth Partner" block underneath positioning long-term relationships. The portfolio section switched from pinned scroll with iframe embeds to a modal overlay system (way cleaner, no cross-origin headaches). A "Why Me" section appeared between About and Reviews. The About bio went from placeholder to "Hey, I'm Russ. 20 years in sales. 15+ in audio engineering. Now I build websites and automation systems."

One conversation during V4 is worth highlighting. Claude and I debated whether to put my Outlier Sniper tool (an AI-powered automation project) in the portfolio. The argument for: it shows technical depth. The argument against: it's out of left field for a web design portfolio. We decided to keep the portfolio tight - three websites, clear story, no confusion. Outlier Sniper lives on generuss.com where it actually makes sense. That kind of "what to leave out" decision is just as important as what goes in.

**V5** was the biggest structural addition. I decided to add a blog with Contentful as the CMS, plus full SEO infrastructure - JSON-LD, Open Graph tags, canonical URLs, RSS feed, sitemap, internal linking strategy. This version also added the constraint that blog pages exclude GSAP entirely - CSS transitions only. The blog needed to be fast and simple, not a showcase for scroll animations.

By V5, the brief was around 800 lines. Dense enough that it ate a significant chunk of Claude Code's context window on paste. That's when we developed the context management protocol - save the brief to disk on first paste, reference it by file path in `project_state.md`, compact the context when it gets heavy, reload the brief from disk after compacting. Three-step process that became reusable across all projects.

---

## The Build System That Made It Possible

Behind all of this was a system I'd been developing called PILOT - Prep, Link, Build, Style, Deploy. It's a lifecycle framework for AI-assisted builds. The Prep phase extracts five answers from your idea dump: North Star, Integrations, Input, Output, and "NOT in v1." That last one is the firewall.

For generussdesign.com, the brief was so detailed that PILOT Prep was unnecessary. The brief _was_ the prep output. So we used `SKIP_TO_ARCHITECT` to jump straight to building.

But the PILOT Prompt still earned its keep. It enforces build discipline - specifically the "test early, no 10-step blind builds" rule and a mobile verification gate after each section. With GSAP scroll animations, neumorphic shadows, and pinned viewport sections, those incremental checks saved me from repeating the V1 failure.

The broader system I use is called D.O.E. - Directive, Orchestration, Execution. Directives are the specs and rules. Orchestration is how they get sequenced. Execution is the actual build. For this project, the directives folder contained 16 files - everything from `design-tokens.md` to `tone-guide.md` to individual section specs. Claude Code reads those files and builds accordingly, rather than working from memory or a single massive prompt.

I also developed a scope creep protocol: if something comes up during the build that isn't in the brief, small fixes just get done. New features or sections stop the build entirely - they go back to a new brief version and re-enter the pipeline. "Nice to haves" get logged in `project_state.md` under a "Post-Launch" section. This is the LAUNCHPAD/BLAST rule, and it kept me from turning a 30-hour build into a 90-hour one.

---

## The 30-Hour Build Weekend

With V5 locked and the brief saved to disk, I opened Claude Code on a Sunday morning and started building.

**Day 1 - Foundation (Sunday, February 15)**

The morning session was all scaffold work. Astro 5 project with Tailwind v4, GSAP, ScrollTrigger, Contentful blog system, and all 8 page sections stubbed out. One commit, entire architecture in place. Zero to deployed in one day was the goal, and getting the foundation right first was the lesson I'd learned the hard way.

By midday I was deep in config - Formspree contact form wired up, Contentful field mapping fixed, environment variables set, meta image set, Cal.com scheduler embedded. The afternoon was about QA infrastructure - Playwright screenshot pipeline for automated visual QA, Cal embed widened, fallback link added, CTA styling unified across all sections.

By evening, the first deploy happened. Wrangler config replaced, card shadows fixed sitewide, mobile problem/solution layout optimized. First PR merged to main. The site was live, rough, but live.

**Day 2 - Craft (Monday, February 16)**

This was the obsessive refinement day. Five critical items fixed in one commit that morning - robots.txt, custom 404, placeholder content, CLS optimization, GSAP tree-shaking. QA capture upgraded to per-section screenshots instead of full-page.

The midday design overhaul was significant. Emoji icons got replaced with hand-drawn SVGs, then upgraded again to Lucide icon paths. The Principles grid got rebuilt with raised cards and knockout gaps. Three iterations to get it right.

Afternoon was all animation. Problem/solution cards got a rising shadow effect. The burn-away joke animation landed. Services section pin got tuned. Scroll fragment navigation got fixed. The evening brought the biggest restructure - full page layout reworked, iframe portfolio modal added for live project previews, a lava lamp hero effect built with blob physics and delayed pool detach.

**Day 3 - Ship (Tuesday, February 17)**

Morning was rapid-fire fixes. Hero animation tuning, booking section polish, section z-index and background fixes to prevent overlap. Six PRs merged in one session. The Why Me content got merged into the About section.

The Cal.com rebuild was the biggest midday task. Ripped out the JS SDK entirely and replaced it with a contained iframe embed. Neumorphic styling applied, size tuned, scrollbar removed. Border iterated three times to match the design system. Sometimes the simplest things take the most iterations.

The final afternoon polish pass: About section redesigned with a raised card and booking CTA. Glowing scribble-out effect added to the reviews section. Dash spacing fixed sitewide. Deploy pipeline automated with a `/ship` command.

---

## The Numbers

30 hours. 38 commits. 13 PRs merged. 9 sections. Built on Astro 5 + Tailwind v4 + GSAP + Cloudflare Pages.

But the real numbers are the ones you don't see in the commit log. Five versions of the site brief. Dozens of planning conversations across two weeks. A complete scrapped first attempt. Individual sections that went through three or four design iterations in conversation before a single line of code was written.

The 30-hour build weekend was the payoff. The planning was the investment.

---

## What I'd Tell Someone Starting a Similar Project

**Plan more than you think you need to.** My initial brain dump was 200 words. The final brief was 800 lines. Every line existed because a vague instruction in an earlier version produced the wrong output.

**Don't build blind.** The single biggest mistake I made was letting an AI write 40+ implementation decisions before I looked at any of them. Build a section. Look at it. Confirm it's right. Then move on. This applies whether you're working with Claude Code, Cursor, or any AI tool.

**Save decisions to files, not just conversations.** Context gets lost between chat sessions. Files on disk survive. Every important decision should exist as a directive or spec file that can be referenced by path, not reconstructed from memory.

**Define what's NOT in V1.** This is the scope creep firewall. Without it, every good idea during the build becomes a blocker. With it, good ideas get logged for later and the build stays on track.

**Let the copy breathe.** Some of my best section copy - particularly the Conversion and Post-Launch Abandonment problem/solution pairs - only emerged because I left them as TODOs for days instead of forcing them immediately. Not everything needs to be decided in one sitting.

**Build systems, not one-off projects.** The directive-driven approach, the PILOT lifecycle, the context management protocol, the compound docs knowledge base - all of these were built or refined during the generussdesign.com project. They'll make the next build faster, and the one after that even faster.

---

## What's Next

The site is live. Phase 4 (responsive optimization, accessibility audit, Lighthouse scoring, cross-browser testing) and Phase 5 (production deploy to Cloudflare Pages with full DNS configuration) are in progress. Holly's review copy still needs to be added. The headshot needs a format conversion. Some stats need reconciliation between the brief and the build.

But the thing is up. It exists. People can see it.

And honestly, that's the whole point of "Build First, Learn Fast." You can plan forever. You can iterate on briefs until they're perfect. But at some point you have to open the terminal, paste the prompt, and start building.

The planning made the build possible. The build made the site real.

---

I appreciate you taking the time to check out this deep dive on the process behind building generussdesign.com. If you're interested in working together or want to keep in touch, fill out the form on my [website](https://generuss.com/contact) or check out my YouTube channel [@generuss](https://www.youtube.com/@GeneRussAutomation).
