# Validation Contract: 4 content/SEO units for generussdesign.com

> Written BEFORE code (Build Protocol v1.4 Stage 2). Observable, testable assertions derived
> from the dispatch spec + audit findings C3/C4/C5/V2, never from the implementation.
> Any reviewer grades the build against THIS, not against the build's own claims.
> Verification receipts captured in BUILD-LOG.md PROOF.

## Assertion inventory

### VC-1 - /compare page (audit C4, S3 intent)

- **VC-1.1** `src/pages/compare.astro` exists and builds to a `/compare` route.
- **VC-1.2** Targets "hand-coded website cost"; positions flat-fee custom vs monthly subscription vs DIY template.
- **VC-1.3** Body copy is roughly 1,200 words (>= 1,100 words of real prose, measured on rendered text).
- **VC-1.4** Contains an honest 3-column comparison table (flat-fee / subscription / template) across real dimensions.
- **VC-1.5** Contains a FAQ section rendered on-page AND valid FAQPage JSON-LD in the page schema.
- **VC-1.6** Argues flat-fee + ownership on the merits (not by disparaging named competitors).

### VC-2 - /event-websites page (audit C5, S4 ICP money page)

- **VC-2.1** `src/pages/event-websites.astro` exists and builds to `/event-websites`.
- **VC-2.2** Targets "conference website design" and "event website that sells tickets"; ICP = conference/event organizers.
- **VC-2.3** Has a proof block built on the OGC case study with a contextual inlink to `/ogc` (this inlink resolves the /ogc orphan, audit T4).
- **VC-2.4** Primary CTA is the discovery call using the same CalendarEmbed component as existing money pages (booking anchor + CalendarEmbed).
- **VC-2.5** Ships client-ready (no placeholder text, no TODOs, real copy end to end).

### VC-3 - /process page (audit C3, "Astro web designer")

- **VC-3.1** `src/pages/process.astro` exists and builds to `/process`.
- **VC-3.2** Targets "Astro web designer"; explains how the build process works and why hand-coded Astro.
- **VC-3.3** Carries the real speed receipts: PSI mobile 86 / desktop 100 on the homepage, 2026-07-14 audit, cited honestly with no rounding up.

### VC-4 - homepage answer-first FAQ (audit V2)

- **VC-4.1** `src/pages/index.astro` gains a visible FAQ section with 4 to 6 real ICP questions.
- **VC-4.2** Each answer states the direct answer in its first 40 to 60 words.
- **VC-4.3** Valid FAQPage JSON-LD wired into the existing shared schema graph (references #website by @id).

### VC-5 - per-page SEO hygiene (every new page)

- **VC-5.1** Title 30-60 chars, keyword front-loaded.
- **VC-5.2** Meta description 70-155 chars.
- **VC-5.3** Exactly one `<h1>`.
- **VC-5.4** Page schema reuses the schema.ts module (siteGraph via BaseLayout + breadcrumbs() helper); each page emits WebPage + BreadcrumbList (plus FAQPage/Service where relevant) referencing the shared graph by @id.
- **VC-5.5** OG tags present via BaseLayout (title/description/image, twitter card).

### VC-6 - internal links (no orphans)

- **VC-6.1** Each new page is linked FROM at least 2 existing pages (footer Services column = sitewide, plus >=1 contextual body link from seo/ogc/index).
- **VC-6.2** Each new page links OUT to at least 2 existing pages.

### VC-7 - llms.txt

- **VC-7.1** `public/llms.txt` lists the 3 new URLs, each with a one-line description.

### VC-8 - build + dash cleanliness

- **VC-8.1** `npm run build` exits 0; all pre-existing routes still emit.
- **VC-8.2** grep for em dash (U+2014) and en dash (U+2013) across the new/changed copy returns zero matches (invocation + output pasted as receipt).

### VC-9 - no invented numbers

- **VC-9.1** Only allowed receipts appear: 2026-07-14 audit PSI numbers, OGC facts already on /ogc, seo-profile facts, published on-site offer prices.
- **VC-9.2** Competitor pricing describes MODELS (subscription shops ~$0 down/monthly, template builders) not asserted named-competitor prices; the ~$175/mo subscription figure is used only because the 2026-07-14 audit brief + profile sampled it explicitly.

### VC-10 - protocol artifacts

- **VC-10.1** phases.md (all statuses done/descoped, Plan check present), BUILD-LOG.md (7 sections, >=2 receipts), HANDOFF-next.md (structured-state fields), validation-contract.md all at build root.
- **VC-10.2** Each phase committed separately, staged by name; no BLOCKED.md at close (or a visible BLOCKED if a hard boundary is hit).

## Check table (filled at close)

| VC                                | Status | Receipt |
| --------------------------------- | ------ | ------- |
| (populated in BUILD-LOG.md PROOF) |        |         |
