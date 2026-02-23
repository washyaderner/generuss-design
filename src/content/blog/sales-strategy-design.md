---
title: "How To Use Sales Strategy When Thinking About Design (And How AI Made It Possible)"
excerpt: "Sales instincts built over 20 years quietly shaped every design decision on generussdesign.com. This is the methodology behind the collaboration, and why systems thinking compressed through AI created something I couldn't have built alone."
publishDate: "2026-02-22"
tags: ["methodology", "sales", "AI-assisted development", "web design"]
featuredImage: "/images/blog/sales-strategy-design-og.svg"
layout: timeline
timeline:
  - phase: 1
    title: "The Stack"
    subtitle: "Foundation"
    milestones:
      - "Stack audit"
      - "Working with AI"
  - phase: 2
    title: "The Craft"
    subtitle: "Identity"
    milestones:
      - "Weapon color"
      - "Frameworks"
  - phase: 3
    title: "In Practice"
    subtitle: "Decisions"
    milestones:
      - "Design choices"
      - "Impostor syndrome"
  - phase: 4
    title: "The Takeaway"
    milestones: []
---

# How To Use Sales Strategy When Thinking About Design (And How AI Made It Possible)

## TLDR

I'm a top 3% sales rep at my 9-5. Almost all of my spare time is spent building websites, automations and AI tools on the side. I spent two weeks planning my generussdesign.com site with Claude after the first attempt failed miserably.

This is what prompted a more thorough design process. The planning process revealed something I didn't expect: sales and marketing instincts I'd built over 20 years were quietly shaping every design decision - I just didn't have the vocabulary for them until the AI gave me one.

This is about the methodology behind the collaboration, the moments where things clicked, and why the compound effect of systems thinking, pattern recognition, and AI compression created something I couldn't have built alone.

---

## The Tech Stack Audit Nobody Talks About

Is this your stack?
Next.js, Tailwind CSS, Shadcn UI, deploy to Vercel.
Might be time to rethink that...

There's a reason I want to start here... After watching interviews with people like DHH, ThePrimeagen, and Pieter Levels - developers who've shipped real things at real scale - I started noticing a pattern. None of them were reaching for the trendy stack. They were reaching for the boring one. The proven one. The one that doesn't break at 3 AM because some dependency updated.

That stuck with me, because every time I sat down with AI to plan a project, I got handed the same thing: Next.js, Supabase, Tailwind CSS, shadcn/ui. Didn't matter what I was building. The AI's version of "think like a senior developer" was just a reflection of whatever stack dominated its training data. And the most common prompting advice - "You are a senior developer. Act like one." - doesn't fix that. It just gives you the default with more confidence.

What actually works is using the AI to study what the pros are saying and why, instead of asking it to role-play as one. There's a difference between telling an AI to act senior and using an AI to research how senior developers actually think about tool selection. The first approach gives you the most popular answer. The second gives you the most deliberate one.

That distinction changed how I approach every build.

Now, I'm not saying that you should never use this stack. What I am saying is make sure it's the right stack. Before I wrote a single line of code for generussdesign.com, I spent weeks doing something that felt counterintuitive for someone eager to build: I audited the tools, and planned each section of my page out one at a time. I dug into what professional developers use at scale, what technologies are foundational enough to survive the next five years, and what's adding complexity without earning its place in the stack.

That audit changed everything about how I build.

Take deployment. The default AI recommendation is Vercel. It's slick, it integrates well, and it's genuinely good for certain use cases. But when I started researching deployment options specifically for client projects - sites I'd be handing off or maintaining long-term - Vercel's pricing model became a problem. The surprise charges that show up at scale are well-documented. One traffic spike on a client site and suddenly you're explaining an invoice you didn't see coming. Cloudflare Pages has a free tier that's genuinely generous, and when you do hit paid features, the pricing is predictable. For client work, predictable beats slick every time. That's not a technical opinion. That's a business decision.

Then there's CSS. When I first started building, I deliberately wrote vanilla CSS. Not because I enjoyed it - because I needed to understand what was actually foundational before I let a framework abstract it away. The research kept telling me the same thing: learn the real language first, or you'll never know when the tool is helping you and when it's hiding problems from you.

Tailwind CSS was the obvious next step, but the complexity it layered on top of CSS never sat right with me during that research phase. It felt like trading one set of problems for another. Then Tailwind v4 dropped, and the architecture had fundamentally changed. CSS-first configuration. `@theme` directives. `@layer` support. Native CSS features doing the heavy lifting instead of JavaScript tooling. It stopped feeling like an abstraction and started feeling like CSS with a better workflow. That's when it earned its place in my stack.

The audit produced a simple rule that governs every project now: default to the simplest stack that solves the actual problem, and only add complexity when the project specifically demands it. My site runs on Astro, Tailwind v4, and Cloudflare Pages. No React runtime. No database for a contact form. No server-side rendering for a site that doesn't need it. Every tool in the stack is there because it survived the audit - not because an AI suggested it.

---

## How I Actually Work With AI

You don't know what you don't know. I approach my conversations with AI as a collaborative effort that teaches me along the way. This wasn't a "tell the AI what to build" situation. It was closer to a strategic partnership where each side brings different strengths. My job was the vision, the gut instinct, the "this doesn't feel right" radar, and the business logic. Claude's job was the technical scaffolding, the design theory vocabulary, the ability to generate ten production-quality documents back to back, and the patience to iterate without ego.

There's a pattern I've noticed in how the best moments happen - Exposure, Compression, Ownership.

**Exposure** is when you hit something outside your current skill boundary. For me, that was everything from terminal commands to Python scripts to animation physics to design token architecture. In a normal learning path, each of those would be months of tutorials and gradual comfort.

**Compression** is what the AI collaboration does. It doesn't skip the learning. It compresses the timeline. I still had to understand _why_ a decision mattered. I still had to make the call. But instead of spending weeks circling an insight, the conversation structure got me there in minutes. The AI holds the technical scaffolding steady while you climb.

**Ownership** is the part most people miss. It's the moment the knowledge stops being "something Claude told me" and becomes "something I know." When I set up bsync to synchronize my development environment between my Mac Studio and MacBook, the terminal stopped being scary. When I scraped a YouTube transcript using a Python tool I generated through natural language, I never thought I'd hear a sentence like that coming from my brain. But I did. And it stuck. That tool is mine now. That capability is mine.

The weapon color was this pattern in miniature. Exposure (shadow physics), Compression (ninety seconds instead of an afternoon), Ownership (I now know why pure black kills neumorphism and I'll never forget it). This pattern repeated dozens of times across the generussdesign.com project. Each time, the gap between what I could do and what I believed I could do got a little smaller.

---

## The Weapon Color

When Claude and I were building the visual identity for generussdesign.com, we needed to choose an accent color. The site runs on a dark neumorphic design language - deep matte backgrounds, paired shadows that create tactile depth, and a very deliberate sense of physical presence. Think high-end audio equipment. Matte black hardware with one LED indicator.

That LED is the accent color. We started calling it "the weapon."

The psychology behind a weapon color is restraint. Most sites treat color like a buffet - accent here, highlight there, gradient over here, different color for every button state. The result is visual noise. Nothing stands out because everything is trying to stand out.

A weapon color works the opposite way. You pick one color. You starve the design of it. And then when it does appear, it hits. The eye has nowhere else to go. Every instance of that color becomes a signal: this matters. Look here. Do this.

There's a direct parallel to how I've sold for 20 years. One ask per conversation. One CTA. One thing you want the person to do. If you give someone three asks, you've given them zero - because nobody knows which one matters. The weapon color is that same principle applied to a screen instead of a phone call.

We capped its usage at 5-8% of visible pixels on any given screen. CTAs get the weapon. Active states get the weapon. One keyword per headline gets the weapon. Everything else stays structural gray. That ratio wasn't pulled from a textbook. It's what happens when design theory and sales instinct arrive at the same answer from different directions.

If you're building your own site, the takeaway isn't my specific color. It's the discipline. Pick one accent. Define where it's allowed to appear. Then protect that rule like your conversion rate depends on it - because it does. Every time you dilute the weapon with a second accent or a decorative splash of color, you're splitting the user's attention between the thing you want them to do and the thing you thought looked cool.

When I hear "weapon color" I don't think about hex codes. I think about the moment when you stop talking and let the silence do the work. That pause where the one thing you don't say makes everything you did say land harder.

That's what 5-8% of visible pixels actually means.

---

## The Frameworks That Make This Repeatable

Before generussdesign.com, my approach to AI-assisted building was what most people's looks like: throw a prompt at the tool, see what comes back, iterate until it's close enough. Sometimes it worked. Sometimes it didn't. I had no way to predict which outcome I'd get.

Now I have three interlocking systems that changed everything.

**D.O.E.** stands for Directive, Orchestration, Execution. Directives are the specs and rules - the source of truth documents that tell any AI agent exactly what to build and how. Orchestration is the sequencing - which directives get activated when, what order things happen in, how context flows between sessions. Execution is the actual build - the code, the deploys, the tangible output.

**PILOT** is the lifecycle framework that sits on top of D.O.E. - Each phase has a specific job and specific exit criteria. The critical piece is Prep, which forces you to answer five questions before any building starts: North Star (what's the singular goal?), Integrations (what connects to what?), Input (what data goes in?), Output (what comes out?), and NOT in v1 (what are we explicitly not building?).

That last one - NOT in v1 - is the scope creep firewall. It protects the build from the most common failure mode in any project: every good idea during execution becomes a requirement that blocks shipping. By defining what's out, you protect what's in.

**Context handoffs** are the third piece - structured documents that capture every decision, file path, and current status so that when a conversation ends or the AI's context window fills up, nothing gets lost. This one emerged from a painful lesson. During the planning phase, I rewrote the entire Problem/Solution section of my site brief in one conversation. Then I needed it in a different conversation to continue the work. Claude searched seven different times trying to find it across my chat history and couldn't. It had never been saved to a file. The rewrite existed only in a conversation that the new session couldn't access.

That's when something clicked that changed how I work permanently: conversations die, but files on disk survive. Every important decision from that point forward got saved as a directive file, referenced by path, and included in the handoff document. It's institutional memory for a one-person operation.

None of these systems are complicated on their own. But layered together, they create a compounding effect. The directives make the AI's output predictable. The lifecycle makes the sequence reliable. The handoff makes the knowledge durable. Each one solves a different failure mode, and together they eliminate the randomness that makes most AI-assisted projects feel like gambling.

---

## Design Decisions With Teeth

Let me walk through a few choices from the generussdesign.com build that show how instinct, design theory, and AI collaboration collide in practice.

**The portfolio curation decision.** Midway through planning, I had a tool called Outlier Sniper - a full-stack YouTube analytics platform I built with FastAPI, SQLite, and an AI pipeline. Technically impressive. Claude and I debated whether to include it in the portfolio. The case for it was strong: it shows depth, engineering chops, and range.

I killed it in about three seconds.

Does this help or confuse the person I'm trying to convert? A potential client looking for a web designer sees three beautiful websites, then suddenly sees a data analytics dashboard with API architecture diagrams. That's a distraction. That's a reason to pause instead of a reason to act. Portfolio stays tight. Three sites. Clear story. No confusion. Outlier Sniper lives on my automation site where the audience actually cares about API architecture.

This is where pattern recognition earns its keep. The decision was instant because the signal was obvious - if you've spent years reading people and watching attention shift, you develop a reflex for what creates clarity and what creates noise. The AI gave me the analytical framing after the fact. The instinct was already there.

**The problem/solution pairs.** Section 5 of the site presents four problems and four solutions. The problems are visible immediately when you scroll into the section. The solutions reveal one at a time via a horizontal curtain wipe animation as you continue scrolling. When a solution reveals, its paired problem shifts from dim to full brightness - a visual confirmation that the issue is "resolved."

This one is pure emotional sequencing. You don't present the answer before someone feels the question. You let the tension sit. You let them see all four problems at once and feel the weight. Then you resolve them one by one, building momentum. By the time all four are revealed, the user has experienced resolution four times in a row.

Claude suggested the curtain wipe mechanic. I defined the emotional arc it needed to follow. The implementation is a technical collaboration. The logic underneath it - the idea that relief is more powerful when tension comes first - that's something you learn from any discipline that involves moving people toward a decision. Sales taught it to me. Theater teaches the same thing. So does a good sermon.

**The section order.** The nine sections of generussdesign.com aren't arranged by design convention. They follow a narrative logic: establish credibility fast (hero), make the ask accessible immediately (booking), show what you offer (services), prove it works (portfolio), differentiate from the competition (problem/solution), show how you think (design principles), build connection (about), let others vouch (reviews).

I didn't plan this sequence consciously. I arranged it the way that "felt right," and then Claude's analysis of the structure showed me what my gut already knew. The vocabulary was different - "section orchestration," "animation intensity curve," "scroll-driven narrative" - but the underlying architecture was a story with a beginning, middle, and end designed to earn trust before asking for commitment. Moving the booking section high was a sales instinct - don't make someone scroll to the bottom of the page to take action if they're already convinced. And placing services before portfolio means visitors understand the scope of what I do before they see examples. The problem/solution section landed further down because it works better as reinforcement than as a hook - by the time someone reaches it, they've already seen the work, and now the comparison drives the point home.

---

## Impostor Syndrome and the Evidence Problem

Impostor syndrome isn't an emotion problem. It's an evidence problem. There's a lag between what you _can_ do and what you _believe_ you can do, and the lag exists because you don't have enough proof to close it.

The framework I built with Claude doesn't just organize projects. It generates evidence.

Every directive file is proof that I understood a concept well enough to codify it. Every brief version is proof that I can hold a complex system in my head and improve it incrementally. Every successful deploy is proof that the methodology produces results. The system creates its own receipts, and those receipts accumulate.

When I generated a Python script through natural language to scrape a YouTube transcript, the boundary between "developer" and "non-developer" got blurry in a way it never had before. When I deprecated my own starter-prompts system because I recognized it was a crutch preventing a better system from emerging - that's not something someone without real technical judgment does.

None of these moments happened because the AI did the work for me. They happened because the AI compressed the learning curve enough for me to actually reach the insight before my attention or motivation ran out. The ownership is real. The understanding is real. The identity shift is real.

Five versions of a site brief. Sixteen directive files. A visual identity spec that accounts for shadow physics. A deployment pipeline automated with a single command. A reusable Python toolkit for extracting scroll animations from any website. A context management protocol that prevents knowledge loss between sessions.

I built all of that. With help. And the "with help" part doesn't diminish it any more than having a good coach diminishes an athlete's performance. The coach didn't run the miles. They made the training more efficient.

---

## The Compound Effect

Any one piece of this story is interesting on its own. A non-developer learns design theory in real time. An AI collaboration produces unexpected results. A framework makes projects more predictable.

But the real value is in the compound. Pattern recognition from years of reading people informs design decisions that the AI gives vocabulary to. The vocabulary becomes directives that make the next conversation smarter. Smarter conversations produce better frameworks. Better frameworks reduce the randomness. Reduced randomness builds confidence. Confidence accelerates the next project.

Every cycle gets faster. Every project teaches the system something. Every insight gets codified so it doesn't have to be re-learned. That's not AI replacing human thinking. That's AI amplifying a very specific kind of human thinking - the kind that comes from years of reading rooms, managing tension, and knowing when to push and when to shut up and listen.

The generussdesign.com build took 30 hours across one weekend. But the system it was built on represents hundreds of hours of conversations, failures, framework iterations, and deliberate practice at working alongside AI as a creative and strategic partner.

The site is one output. The methodology is the actual product.

---

## What This Means If You're Building With AI

If you're a developer, the tactical takeaway is the framework stack - D.O.E. for structure, PILOT for lifecycle, context handoffs for knowledge persistence. These are steal-able. They'll make your AI-assisted builds more predictable immediately.

If you're a freelancer or solopreneur, the takeaway is different. You already have instincts from your primary skill that translate to building. You just don't have the vocabulary yet. The salesperson thinks in funnels. The teacher thinks in lesson plans. The chef thinks in mise en place. The AI can give you the technical vocabulary for what you already know intuitively - but only if you bring the instinct to the conversation. "Build me a website" produces generic output. "Build me a website where every element either moves someone toward the CTA or gets removed" produces something that converts.

If you're a potential client reading this, now you know how I think. Every design choice has a reason. Every animation has a purpose. Every section exists because it earns its place in the flow. The portfolio isn't decoration - it's proof. The process isn't a mystery - it's documented, repeatable, and designed to produce results.

You don't have to know how to do something in order to do it. I'm not the best designer in the world. I'm not the best developer, or even the best salesperson. But the intersection of all three, compressed through AI and systematized through frameworks that get smarter every project? That's a killer toolkit.

This is the framework I'm building from.

---

I appreciate you taking the time to read through how my brain works. If you're interested in working together, talking shop about AI workflows, or just want to see what we build next, fill out the form on my [website](https://generuss.com/contact) or check out my YouTube channel [@generussai](https://www.youtube.com/@GeneRussAutomation).
