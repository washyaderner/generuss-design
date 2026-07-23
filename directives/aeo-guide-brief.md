# AEO Guide Writing Brief (generussdesign.com, wave 1)

You are writing markdown guide files for the `guides` content collection of generussdesign.com, a hand-coded web design + automation studio run by one operator (Russ Gardner, brand "generuss design"). Audience: small service-business owners (trades, wellness, events, food, local B2B). These pages exist to be cited by AI assistants and ranked by search engines, and every one funnels to a free tool.

## The exemplar (match this standard)

Read `src/content/guides/above-the-fold-checklist.md` before writing anything. Match its: frontmatter shape, answer-first opening (first paragraph directly answers the title's implied question), H2 structure, plain direct voice, concrete examples over abstractions, and honesty (recommending against hiring when DIY genuinely wins builds more trust than selling).

## File contract (every file, exactly)

- Path: `src/content/guides/<slug>.md`
- Frontmatter fields, all required unless marked: `title`, `description` (140-160 chars, no colon-spam), `parent` (the pillar id given per guide), `relatedTool` (path given per guide), `relatedToolName` (given per guide), `faqs` (exactly 3 items, each `q` + `a`, answers 40-70 words, self-contained), `publishedAt: "2026-07-23"`
- Body: 600-900 words of markdown. H2 sections (`##`), question-shaped where natural. NO H1 (the layout renders the title). First paragraph = the direct answer, no throat-clearing.
- Internal links: link the parent pillar once (`/insights/<parent>`), link 1-2 sibling guides from the same pillar where natural (`/guides/<slug>`), and you may link ONE site page where it genuinely fits: /paths, /compare, /process, /automation, /free-build, /event-websites, /seo, /tools. Do not link the related tool in the body; the layout renders a tool CTA automatically after the body.

## Hard rules (violations get the file rejected)

1. NO em dashes and NO en dashes anywhere. Use commas, colons, periods, or the word "to".
2. NO invented statistics. No "studies show 47%...", no named-study citations, no specific percentages or dollar figures presented as research findings. Reason from mechanisms ("leads decay by the hour", "visitors triage, they don't read") instead of fake numbers.
3. The ONLY prices you may mention, verbatim, when relevant: $500 Launch Page, $4,500+ full custom build (Flagship), $750/month Growth Engine, $197 Website Taste Audit. No other dollar figures except obviously-illustrative round examples in math walkthroughs ("say a job is worth $800 to you").
4. Never name any employer, day job, or platform history of the operator. Never mention Upwork.
5. No hype words ("genuinely", "honestly", "game-changing", "unlock", "elevate", "empower", "supercharge"). No emoji.
6. Do not oversell: at most two generuss-specific references per guide (the pillar link + one site page link). These are answer pages, not sales pages. The sell is the competence.
7. Lighthouse is never named. Say "speed test" or "performance measurement" if needed.
8. Titles and headings must not wrap awkwardly: keep headings under ~60 characters where possible.
9. American English. Second person ("you", "your business"). Contractions are fine.

## Voice in one line

A sharp, honest operator explaining something to a smart friend who owns a small business: direct answer first, mechanisms over statistics, concrete over abstract, and willing to say "don't buy this" when it's true.
