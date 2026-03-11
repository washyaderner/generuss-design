# Breakdown Page Directive

> How to create standalone HTML breakdown pages that explain how something was built. Think "visual walkthrough" - closer to a presentation deck than a blog post.

---

## What This Is For

Breakdown pages are self-contained HTML files that walk someone through a build - a website, an app, a tool, an agent. They're portfolio pieces, case studies, and teaching artifacts. The audience is potential clients and peers who want to understand the thinking, not just the output.

## Core Principle: Show, Don't Lecture

These are **visual walkthroughs**, not documentation. Every section should feel like a slide in a presentation:

- Lead with a visual component (diagram, comparison, code block, flow chart)
- Text explains the visual, not the other way around
- If a section is just paragraphs, it needs a visual or it needs to be cut
- Less wordy. Always less wordy. If you can say it in one line, don't use three.

---

## Complexity Should Match Scope

Not every breakdown needs 15 sections. Match depth to the thing being explained.

| Build Type                              | Sections | Depth                                                                                                    |
| --------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| Static site / landing page              | 5-8      | Design decisions, stack, notable techniques, lessons                                                     |
| Full-stack app / SaaS                   | 8-12     | Architecture, data flow, integrations, gotchas, costs                                                    |
| Complex system (agent, pipeline, infra) | 10-15    | Concept, research, architecture deep dive, build order, tools, autonomous behaviors, setup guides, costs |

**Rule of thumb:** If a section doesn't teach something or show something interesting, cut it. Empty sections with filler text are worse than fewer sections with substance.

---

## Required Structure

Every breakdown page follows this skeleton:

### 1. Hero

- Label: "Case Study / Full Build Breakdown" (or similar)
- Title: "How We Built [Project Name]"
- Subtitle: One sentence - what makes this build interesting (not what it is, but what's notable about how it was built)
- Stats bar: 3-5 key numbers (build time, commits, cost, lines of code, tools used - whatever's most impressive)

### 2. Sections (numbered, with IDs)

Each section gets:

- Section number + category label (e.g., "04 / Hero Effect")
- Title (short, punchy)
- Subtitle (one line of context - what this section explains)
- Visual content first, then supporting text
- Section ID for jump nav anchoring

### 3. Footer

- Built by credit
- Stack summary
- Link back to main site
- CTA (blog post link, booking link, etc.)

---

## Visual Component Library

Use these building blocks. Every section should use at least one.

| Component            | CSS Class                               | Use For                                           |
| -------------------- | --------------------------------------- | ------------------------------------------------- |
| Comparison grid      | `.compare-grid`                         | Before/after, this vs that, rejected vs chosen    |
| Architecture diagram | `.arch-diagram`                         | System overview, data flow, how pieces connect    |
| Stack table          | `.stack-table`                          | Technology choices with "why" column              |
| Build steps          | `.build-steps`                          | Ordered process with timestamps                   |
| Flow diagram         | `.flow`                                 | Decision trees, message flow, agent loops         |
| Code block           | `.code-block`                           | Key code snippets (syntax-highlighted via spans)  |
| File tree            | `.file-tree`                            | Project structure                                 |
| Gotcha cards         | `.gotcha-list`                          | Problems encountered + fixes (red left border)    |
| Cards (warn/success) | `.card.card-warn`, `.card.card-success` | Lessons learned                                   |
| Accordion            | `.accordion`                            | Setup guides, reference content (click to expand) |
| Cost table           | `.cost-table`                           | Real cost breakdowns                              |
| Conversation bubbles | `.convo`                                | Real messages showing the thing in action         |
| Quote blocks         | `.quote-block`                          | Standout quotes with attribution                  |
| Resource flow        | `.resource-flow`                        | Numbered resources/inputs with descriptions       |
| Timeline             | `.origin-timeline`                      | Chronological events with key moment highlights   |
| Tool grid            | `.tool-grid`                            | Cards for each tool/feature                       |
| Tier stack           | `.tier-stack`                           | Tiered systems (memory tiers, stack tiers)        |
| Prompt stack         | `.prompt-stack`                         | Layered systems (prompt assembly, config layers)  |
| Schedule rows        | `.schedule-row`                         | Time-based schedules (cron jobs, daily routines)  |

---

## Design System (Locked)

All breakdowns use the same design tokens. Don't deviate.

```css
:root {
  --accent: #00ffef;
  --accent-dim: rgba(0, 255, 239, 0.12);
  --accent-glow: rgba(0, 255, 239, 0.3);
  --accent-mid: rgba(0, 255, 239, 0.5);
  --bg: #111114;
  --bg-section: #16161a;
  --bg-card: #1e1e24;
  --bg-card-hover: #26262e;
  --bg-code: #0d0d10;
  --text: #e8e8e8;
  --text-muted: #8888a0;
  --text-dim: #555568;
  --border: #2a2a38;
  --red: #ff4d6a;
  --green: #4dff91;
  --yellow: #ffd84d;
  --blue: #4d9fff;
  --purple: #b44dff;
}
```

**Typography:** Monospace stack (`SF Mono`, `Fira Code`, `JetBrains Mono`, `Cascadia Code`). Sans-serif for nav logos only (`Inter`, system sans).

**Code syntax colors:** `--purple` for keywords, `--accent` for functions, `--green` for strings, `--text-dim` for comments, `--yellow` for types, `--red` for numbers.

**Section rhythm:** Alternating backgrounds (`--bg` and `--bg-section`) via `:nth-child(even)`.

---

## Navigation

Two nav layers:

1. **Site nav** (fixed top, 56px) - Logo + back link to generussdesign.com
2. **Jump nav** (sticky below site nav) - Section links, appears on scroll past hero, horizontal scroll on mobile

Active section tracking via IntersectionObserver or ScrollTrigger.

---

## Animation

Two approaches depending on complexity:

**Simple breakdowns (sites, tools):**

- Vanilla JS with IntersectionObserver
- `.reveal` class with CSS transitions
- No external dependencies

**Complex breakdowns (agents, systems):**

- GSAP + ScrollTrigger via CDN
- `.reveal` elements animated with `gsap.to()` on scroll
- Stat counter animations for hero numbers
- `prefers-reduced-motion` respected - show all content immediately

Both approaches use the same pattern: elements start hidden, reveal on scroll, fire once.

---

## Responsive

- Container: `max-width: 1080px`
- Padding: `0 2rem`
- Font sizes: `clamp()` for hero text, fixed small sizes for labels
- Grids collapse to single column below 600px
- Jump nav: horizontal scroll on mobile
- All spacing uses `clamp()` where appropriate

---

## Writing Rules

1. **Section subtitles are one sentence.** Not two. Not a paragraph. One line that tells the reader what they'll learn.
2. **No filler intros.** Don't say "In this section we'll explore..." - just show the thing.
3. **Numbers over adjectives.** "4 days, 16 commits, $15" beats "built quickly and cheaply."
4. **Decisions over descriptions.** "We chose X over Y because Z" beats "We used X."
5. **Lessons need teeth.** "Don't batch-build blind" beats "We learned the importance of iterative development."
6. **No em dashes.** Use hyphens, colons, or rephrase.

---

## Section Selection Guide

Pick sections based on what's interesting about the build, not a checklist. Common patterns:

**For any build:**

- Stack choices (with "why" column)
- Notable technical challenge (the hardest thing)
- Lessons learned

**For sites/apps:**

- Design decisions (what was rejected and why)
- Information architecture (order and intent)
- Key visual effects (with inline demos if possible)
- Mobile considerations
- Build timeline

**For complex systems:**

- Concept (what this is and isn't)
- Pre-build research/planning
- Architecture diagram
- Build order (dependency chain)
- Deep dive on the hardest subsystem
- Tools/features catalog
- Gotchas (problems that cost time)
- Real-world output (conversations, screenshots, logs)
- Cost reality

---

## File Conventions

- Filename: `{project-name}-breakdown.html` (or `{project-name}-breakdown-public.html` if a sanitized version)
- Self-contained: all CSS inline in `<style>`, all JS inline in `<script>`
- No external CSS frameworks
- External JS only for GSAP (CDN) when needed
- OG meta tags for social sharing
- Lives at project root or a dedicated breakdowns directory

---

## Anti-Patterns

- Wall of text with no visual break
- Sections that exist because "a breakdown should have this" but have nothing interesting to say
- Code blocks longer than 15 lines (show the key lines, not the whole file)
- Explaining obvious things ("We used HTML for the markup")
- Forcing complexity on a simple build
- Missing the "so what" - every section should answer why the reader should care
