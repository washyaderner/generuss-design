# BUILD-LOG: 4 content/SEO units for generussdesign.com

Build root: this worktree (branch `worktree-agent-a4693e100bb497d8b`). No push, no deploy.

## 1. INITIAL PLAN

- Ship 3 new Astro pages + 1 homepage section closing audit gaps C3/C4/C5/V2, mimicking the existing money-page patterns (seo.astro, taste-audit.astro, ogc.astro) rather than inventing structure.
- /compare (C4, "hand-coded website cost"), /event-websites (C5, ICP money page), /process (C3, "Astro web designer"), homepage answer-first FAQ (V2).
- Reuse the schema.ts module (siteGraph via BaseLayout + the unused breadcrumbs() helper), the CalendarEmbed CTA, the Formspree infra, and the design tokens.
- Wire internal links so no new page is an orphan; update llms.txt; keep every dollar figure on the audit/profile/published allow-list.
- Verify each phase with a real build + rendered-HTML checks; commit each phase separately, staged by name.

## 2. WHAT CHANGED + WHY

- Meta descriptions trimmed twice after measuring rendered length: /compare 166 -> 136 chars, /event-websites 158 -> 142 chars (VC-5.2 caps at 155). Trigger: char-count audit on the built HTML.
- Homepage schema: the existing standalone WebPage `<script>` was widened into a `@graph` holding WebPage + the new FAQPage (both `isPartOf` #website), instead of adding a third loose script. Trigger: VC-4.3 "wired into the existing shared schema graph" reads cleaner as one graph.
- Homepage FAQ section deliberately does NOT use the `section-fade-in`/`gsap-hidden` animation classes the money pages use. Trigger: the homepage has its own GSAP + IntersectionObserver reveal system; plain-visible content removes any risk of an invisible FAQ if that system changes.

## 3. KEY MOVES + RATIONALE

- Modeled all 3 pages on seo.astro (hero + labeled sections + FAQ + booking) so tone, tokens, and schema wiring match the site instead of a generic template. Alternative (a blog post for the comparison) rejected: a routed page carries schema + link equity better and the audit gap plan led with /compare.
- Used the pre-existing `breadcrumbs()` helper in src/lib/schema.ts (defined, never called until now) for every new page's BreadcrumbList, satisfying VC-5.4's "reuse the module" without adding a parallel implementation.
- Subscription-model math is arithmetic on the ONE figure the 2026-07-14 audit brief itself sampled (~$175/mo): 175x36 = ~$6,300 over 3 years, and 4500/175 = ~26 months to cross the flat-fee line. No named-competitor price asserted; columns describe models (VC-9.2).
- Footer Services column carries all 3 new links, making every site page an inbound source; contextual body links (/ogc -> /event-websites, /seo -> /process, homepage FAQ -> all 3) add real editorial links on top.
- /event-websites reuses the already-published OGC screenshot (/images/ogc/desktop.webp) and facts for its proof block, and its /ogc inlink is what clears the /ogc orphan (audit T4), so /ogc's content was left otherwise untouched.

## 4. PRECAUTIONS

- Additive only: every edit to existing files (index.astro, Footer.astro, seo.astro, ogc.astro, llms.txt) inserts, never deletes, existing content. No route removed (full route list re-verified post-build).
- Isolated worktree, per-phase commits staged BY NAME (never `git add -A`), no push, no deploy, no deploy-config edits, redesign branch untouched, handoff-light-mode.md not read or touched.
- Every dollar figure traced to an allow-listed source (published offer prices, OGC /ogc facts, audit PSI, audit-sampled ~$175/mo). No invented performance or outcome stats.
- PSI receipts cited exactly as measured (86 mobile / 100 desktop / CLS 0), no rounding up; the page explicitly notes the mobile score "has room to climb."

## 5. DETOURS

- zsh word-splitting: unquoted `$FILES` in a verification script was treated as one path (zsh does not split like bash). Resolved by listing files inline. No source impact.
- macOS `grep` lacks `-P`; switched the dash-scan receipt to a perl `\x{2014}\x{2013}` scan plus literal-character grep. No source impact.
- `grep -c` returning 0 exits non-zero and broke a couple of `&&` verification chains; re-ran the affected checks standalone. No source impact.

## 6. PROOF (receipts, independently checkable)

- **Build (VC-8.1):** `npm run build` exits 0, "Complete!"; all 17 pre-existing routes still emit (404, 5 blog posts, blog index, call-confirmed, case-studies/pharadoxa, connect, ogc, seo, taste-audit, index, resources/5-site-teardown) plus new /compare, /event-websites, /process. Route list captured from `dist/**/index.html`.
- **Dash grep (VC-8.2):** perl `\x{2014}|\x{2013}` scan across all 8 touched files = per-file em=0 en=0, TOTAL 0; literal `grep -rn` for em and en dash across the 3 new pages both exit 1 (no matches).
- **/compare (VC-1):** rendered main-text word count = 1342 (target ~1,200); title 49 chars; meta 136 chars; exactly 1 h1; JSON-LD contains WebPage + BreadcrumbList + FAQPage.
- **/event-websites (VC-2):** title 51; meta 142; 1 h1; JSON-LD WebPage + BreadcrumbList + Service + FAQPage; `href="/ogc"` present (orphan-clearing inlink); CalendarEmbed marker `id="cal-trigger"` present (parity with /seo).
- **/process (VC-3):** title 36; meta 148; 1 h1; rendered HTML contains "86", "100", and "2026-07-14" (PSI receipts cited honestly).
- **Homepage FAQ (VC-4):** dist/index.html has `id="faq"`, FAQPage in JSON-LD, 5 `<details>`; every answer leads with the direct answer in its first sentence (2-21 words), total 46-49 words each.
- **Links (VC-6):** each new page linked FROM 4 existing pages (home/seo/ogc/taste-audit via footer + body), and links OUT to 3-4 existing pages. **llms.txt (VC-7):** contains /compare, /event-websites, /process.
- **Git:** phases committed separately: 82c892d (compare), 6c5bff6 (event-websites), 2271681 (process), 2a2983d (home FAQ), 082e904 (links + llms).

## 7. OPEN LOOPS + HUMAN GATE

- Independent review gate before any merge/deploy (per dispatch). This build does not self-approve toward main.
- Deploy/push are out of scope by instruction; the branch is left ready for the reviewer to PR.
- Optional future polish (not blocking, not done): per-page OG image for the 3 new pages (currently the shared og-default via BaseLayout, consistent with the rest of the site; audit S1 is a separate Phase 2 item). The homepage mobile PSI (86) improvement is an existing audit P2 item, unchanged here.
- Kept-doing (worth repeating): (1) measuring title/meta/word-count on the BUILT HTML, not the source, caught two over-length metas before commit; (2) modeling new pages on an existing money page kept tone + schema + tokens consistent with zero design drift.
