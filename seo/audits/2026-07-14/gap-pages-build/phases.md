# Phases: 4 content/SEO units for generussdesign.com

Build root: this worktree (branch worktree-agent-a4693e100bb497d8b). Source of truth:
seo/audits/2026-07-14/AUDIT.md (C3/C4/C5/V2 + gap plan), seo/seo-profile.md, and the existing
pages (seo.astro, taste-audit.astro, index.astro, ogc.astro) whose patterns are mimicked.

## Plan check

- Wrong-plan risk 1: Building generic "web design" pages instead of the exact SERP intents the audit
  named. Mitigation: each page is pinned to its audit finding + keyword (C4->hand-coded website cost,
  C5->conference/event website, C3->Astro web designer) and grades against validation-contract.md.
- Wrong-plan risk 2: Inventing numbers or naming competitor prices, tripping VC-9. Mitigation: a fixed
  allow-list of receipts (audit PSI 86/100, published offer prices, OGC facts, seo-profile facts);
  competitor pricing framed as MODELS; the only dollar figure borrowed for the subscription model
  (~$175/mo) is the one the 2026-07-14 audit brief itself sampled.
- Alternative considered: put the comparison as a blog post instead of a /compare page (the audit brief
  said "/compare or blog"). Not taken: a routed money page carries schema + internal-link equity better
  than a dated blog post and is the stronger S3 landing surface; the audit's own gap plan leads with /compare.

## Out of scope

- Redesign / day-night theme work (owned by another session on the redesign branch; not touched).
- Per-page OG image generation (audit S1, Phase 2 item); new pages use the shared og-default via BaseLayout.
- GSC/Bing wiring, authority profile rollout, DMARC rua, title-trim yes/nos (Russ-gated audit items).
- Any push, deploy, or deploy-config edit (escalate to BLOCKED.md if required).

## Phase 1: /compare page (VC-1, VC-5, VC-9)

- Goal: Ship /compare targeting "hand-coded website cost" with an honest 3-column table, ~1,200 words, FAQ + FAQPage JSON-LD, defending flat-fee + ownership on the merits.
- Proof: file builds to /compare; word count >=1,100; table present; FAQPage JSON-LD valid; title/meta/H1 in range.
- Gate: self, then dispatcher review.
- Status: done

## Phase 2: /event-websites page + /ogc inlink (VC-2, VC-5)

- Goal: Ship /event-websites ICP money page (conference/event organizers) with an OGC proof block, contextual inlink to /ogc, CalendarEmbed discovery-call CTA, client-ready copy.
- Order rationale: depends on nothing, but its inlink to /ogc is what resolves the /ogc orphan (audit T4), so /ogc is left otherwise untouched until Phase 5 link wiring.
- Proof: file builds to /event-websites; contains href="/ogc" contextual link; CalendarEmbed present; no placeholder copy.
- Gate: self, then dispatcher review.
- Status: done

## Phase 3: /process page (VC-3, VC-5)

- Goal: Ship /process targeting "Astro web designer": how the build works, why hand-coded Astro, real PSI receipts (mobile 86 / desktop 100, homepage, 2026-07-14 audit) cited honestly.
- Proof: file builds to /process; contains the exact PSI figures with the audit date; title/meta/H1 in range.
- Gate: self, then dispatcher review.
- Status: done

## Phase 4: homepage answer-first FAQ (VC-4)

- Goal: Add a visible FAQ section (4-6 ICP questions, answer-first in first 40-60 words) to index.astro with valid FAQPage JSON-LD wired into the shared graph.
- Order rationale: edits the large index.astro; done after the standalone pages so a build break is isolated to a known, reversible edit.
- Proof: FAQ section renders between #guarantee and #booking; FAQPage node present in a page-level @graph referencing #website.
- Gate: self, then dispatcher review.
- Status: done

## Phase 5: internal link wiring + llms.txt (VC-6, VC-7)

- Goal: Footer Services column links to all 3 new pages (sitewide inbound); contextual body links from /seo, /ogc, and the homepage FAQ; llms.txt lists the 3 new URLs.
- Order rationale: consumes phases 1-3 (targets must exist before they can be linked); resolving VC-6 depends on all new routes existing.
- Proof: grep shows each new route linked from footer + >=1 contextual source; llms.txt contains the 3 URLs.
- Gate: self, then dispatcher review.
- Status: done

## Phase 6: verify, build, dash grep, protocol docs (VC-8, VC-10)

- Goal: npm run build green, dash grep zero, char-length audit for titles/metas, write BUILD-LOG.md + HANDOFF-next.md, commit protocol docs.
- Proof: build exit 0 output; dash grep invocation + empty output; length audit table; grader passes.
- Gate: self, then dispatcher review.
- Status: done
