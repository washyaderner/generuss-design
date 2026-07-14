# SEO Audit: generussdesign.com - 2026-07-14 (full, run 2)

Mode: full (T0 + PSI keyed) · First run with ALL 9 in-scope modules scored (7/3 deferred perf, authority, and GEO presence sampling; those now carry real numbers, which is why overall holds at 73 despite email +51).
Data sources: crawl 7/14 (11 pages, execution/crawl.mjs), PSI API keyed 7/14 (5 runs, 4 URLs), email-auth.sh 7/14 (both domains, dig live), WebSearch sampling 7/14 (7 queries), DuckDuckGo cross-check, whois, repo inspection, Playwright walk (/connect + home).
Skipped for access: GSC query/coverage data (property verified + sitemap submitted 7/14 but API/browser read not wired; unlock = account word from Russ at Gate A, then creds or browser session). Apify SERP census (WebSearch sampling sufficed this run; label: sample, not census). Klaviyo engagement layer (no active list for this property; email scored infrastructure-only per playbook).

## Scorecard

| Module                               | 7/3    | 7/14 pre-fix | 7/14 post-fix | Grade | One-line verdict                                                                                                         |
| ------------------------------------ | ------ | ------------ | ------------- | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| Technical SEO                        | 90     | 85           | **92**        | A-    | Foundation clean; 5 voice-bearing title tags remain (Gate A), /ogc orphan ruling pending                                 |
| Content                              | 74     | 74           | **74**        | C     | 4 of 5 S4 keywords covered; striking-distance blind until GSC data flows; S3 tier thin                                   |
| Authority                            | n/a    | 37           | **37**        | F     | 5-month-old domain, zero off-site mentions (2 engines, 7/14); 90-day plan drafted, floor is free                         |
| GEO / AEO                            | 72\*   | 47           | **57**        | F     | \*7/3 excluded presence sampling; now measured: cited on 0 of 2 target queries. Schema graph + entity fixes banked today |
| Voice                                | 65     | 61           | **65**        | D     | FAQ on /seo + /taste-audit; speakable shipped on home; home FAQ block = Phase 2                                          |
| Performance                          | n/a    | 90           | **90**        | A-    | First scoring: mobile 86/92/90/82, desktop 100, CLS 0 sitewide; LCP lab 3.2-4.5s = the Phase 2 diet                      |
| UX / CRO                             | 78     | 78           | **78**        | C+    | Money paths verified live; booking conversion tracked (Ads gtag); site-rx deferred to post-redesign                      |
| Email                                | 40     | 91           | **91**        | A-    | 7/14 DNS trio dig-verified: SPF -all, DMARC reject, null MX; sender domain full PASS. +51 banked                         |
| Social                               | 72     | 65           | **70**        | C-    | OG 100%; one shared og image on money pages (S1, Phase 2); sameAs graph shipped today                                    |
| **Overall (weighted, renorm /1.05)** | **73** | **70**       | **73**        | C     | Full-coverage 73 ≠ partial-coverage 73: this one has no nulls hiding in it                                               |

Weights (local n/a, folded per reporting.md): tech .15, content .30, authority .10, geo .15, voice .05, perf .10, cro .10, email .05, social .05, renormalized /1.05.
Post-fix arithmetic: 92(.1429)+74(.2857)+37(.0952)+57(.1429)+65(.0476)+90(.0952)+78(.0952)+91(.0476)+70(.0476) = 72.7 → 73.

### Module arithmetic (reproducibility)

- **Tech** (start 100): -1×5 title lengths (4 posts + /ogc 62; blog index FIXED) · -2 orphans→-1 (/taste-audit FIXED, /ogc pending) · -1 thin /connect (by design, noted) · -1 method note (desc penalties cleared by fix). Pre-fix additionally: -5 overlong descs, -1 blog title, -1 orphan.
- **Content**: S4 coverage 32/40 (4 of 5 keywords have pages; "Astro web designer" uncovered) · striking-distance 8/20 (no rank data; indexation actioned 7/14) · cannibalization 10/10 · gap plan 10/10 (below) · journey balance 6/10 (S3 thin) · E-E-A-T 8/10.
- **Authority**: parity 8/40 (GitHub only vs competitors' directories+content) · unlinked mentions 0/15 (zero exist, evidence: WebSearch+DDG 7/14) · plan 15/15 (drafts/authority-plan.md) · citation/profile consistency 8/20 (4 profiles exist, entity sentence not rolled out) · citable asset 6/10 (blog originals, no distribution).
- **GEO**: bots 10/10 · llms.txt 10/10 (refreshed) · answer-first 13/25 (2 of 4 money pages) · schema+sameAs 17/20 (graph sitewide 7/14; logo asset is an OG banner, Phase 2) · AI presence 0/20 (sampled 2 target queries 7/14: absent both; winners = productized subscription shops + tool-brand content) · entity consistency 7/15.
- **Voice** (non-local, /80 renorm): questions 16/30 · snippet format 14/25 · schema 13/15 (speakable shipped) · conversational copy 9/10 → 52/80 = 65.
- **Perf** (lab-only formula: 0.8×PSI mean + 20 baseline): mean(86,92,90,82)=87.5 → 90. Note: subpage tests hit non-slash URLs (308 redirect included in lab run); true canonical-URL scores run slightly better. Field data: none (CrUX below threshold), stated per playbook.
- **CRO**: intent match 27/30 · path friction 21/25 (1-click Cal.com from all money pages, Stripe direct on /taste-audit) · site-rx open 13/25 (not run; redesign supersedes) · trust 10/10 · measurement 7/10 (Ads gtag conversion on /call-confirmed verified in repo; no sitewide analytics found in repo).
- **Email** (infra-only /55 renorm): SPF/DKIM/DMARC 36/40 (lockdown correct + enforced; rua absent on generussdesign DMARC) · alignment 14/15 (sender domain generuss.com: MX google, SPF strict, DKIM google+resend, DMARC quarantine + rua) → 50/55 = 91.
- **Social**: OG 30/30 · render 11/15 · unique money-page images 3/10 (shared og-default, S1) · graph wiring 11/15 (sameAs live 7/14; bio backlinks unverified) · platform strategy 10/20 · flywheel 5/10.

## This week (top 3)

1. **DONE 7/14 (this run's fix pass, commit 6afc512):** schema graph sitewide + sameAs + Article×5 + breadcrumbs + meta descriptions + /taste-audit de-orphaned + llms.txt refresh + speakable. GEO 47→57, tech 85→92.
2. **Gate A batch (Russ, ~10 min):** title trim yes/nos + GSC account word + /ogc orphan ruling + competitor confirm. Then Bing Webmaster import (10 min) and the Month-1 authority floor (free profile updates, ~1 hr, drafts ready).
3. **Phase 2 redesign carries the next block:** answer-first home + FAQ, per-page OG images, LCP diet, S3 comparison page + /event-websites ICP page (see gap plan).

## Findings

| #   | Finding                                                                                                              | Evidence                                                   | Impact | Effort | Tier      | Status                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| T2  | 4-5 blog title tags 74-111 chars, SERP-truncated                                                                     | crawl 7/14 titleLength                                     | M      | S      | RUSS      | pairs ready: drafts/title-trims.md (seoTitle mechanism shipped)                                                             |
| T4  | /ogc in sitemap, 0 internal inlinks                                                                                  | crawl 7/14 sitemapOrphans                                  | L      | S      | RUSS      | ruling: intentional direct-link page, or footer link?                                                                       |
| T5  | /taste-audit orphaned ($197 money page, 0 inlinks)                                                                   | crawl 7/14 sitemapOrphans                                  | M      | S      | AUTO      | FIXED 7/14: footer Services + /seo cross-link                                                                               |
| T6  | 5 meta descs were 250-270 chars (excerpt reuse)                                                                      | live curl 7/14 (306B meta); crawl flag was parser artifact | M      | S      | AUTO      | FIXED 7/14: metaDescription frontmatter, all ≤155                                                                           |
| T7  | Blog index title 22 chars, zero keywords                                                                             | crawl 7/14                                                 | M      | S      | AUTO      | FIXED 7/14                                                                                                                  |
| G3  | No sameAs on Organization/Person                                                                                     | grep src 7/14 (0 hits)                                     | M      | S      | AUTO      | FIXED 7/14: 4 profiles, both entities                                                                                       |
| G4  | Schema coverage 64%: blog layouts carried no graph; 3 of 5 posts zero schema                                         | crawl schemaTypes + [slug].astro inspection                | M      | M      | AUTO      | FIXED 7/14: shared siteGraph, Article+breadcrumbs all posts, CollectionPage index                                           |
| G5  | Entity name split: Org "Generuss Design" vs styled "generuss design"; Article author "Russ" vs Person "Russ Gardner" | BaseLayout vs [slug].astro                                 | M      | S      | AUTO      | FIXED 7/14: unified + legalName added                                                                                       |
| G6  | AI presence 0/2 target queries; root cause = near-zero indexation                                                    | WebSearch + DDG 7/14 (site: = 0 both)                      | H      | -      | TIME      | GSC verified + sitemap submitted 7/14; measure in monthly digest                                                            |
| G7  | Org logo points at og-default.png (banner, not logo mark)                                                            | schema.ts                                                  | L      | S      | AUTO      | Phase 2 (needs square logo asset)                                                                                           |
| A1  | Zero off-site brand mentions/links (5-month domain)                                                                  | WebSearch brand + DDG 7/14 = 0                             | H      | M      | RUSS+TIME | 90-day plan + entity sentence: drafts/authority-plan.md                                                                     |
| A2  | Not in Bing/Copilot index; GSC-import unlock exists                                                                  | DDG site: 0 (Bing index)                                   | M      | S      | RUSS      | Bing Webmaster Tools import, 10 min                                                                                         |
| C3  | "Astro web designer" S4 keyword has no page                                                                          | keyword→page map                                           | M      | M      | AUTO      | Phase 2: process/stack page (gap brief below)                                                                               |
| C4  | S3 comparison tier empty; SERP winners are $0-down subscription shops (Oak Harbor, EZPZ model)                       | SERP sampling 7/14                                         | M      | M      | AUTO      | Phase 2: "flat-fee vs subscription vs template" comparison page (gap brief below)                                           |
| C5  | ICP page missing: event/conference organizer sites                                                                   | profile ICP vs page inventory                              | M      | M      | AUTO      | Phase 2: /event-websites service page                                                                                       |
| P2  | Mobile LCP lab 3.2-4.5s (target <2.5); unused JS flagged on home                                                     | psi-\*.json 7/14                                           | M      | M      | AUTO      | Phase 2: hero image diet + island audit                                                                                     |
| P3  | /connect mobile 82, worst page (LCP 4.5 lab)                                                                         | psi-mobile-...-connect.json                                | L      | M      | AUTO      | Phase 2                                                                                                                     |
| S1  | One shared og-default.png for all money pages                                                                        | BaseLayout default                                         | L      | M      | AUTO      | Phase 2: per-page OG generation                                                                                             |
| E3  | generussdesign.com DMARC has no rua (spoof attempts invisible)                                                       | email-auth.sh 7/14 WARN                                    | L      | S      | RUSS      | paste-ready: `_dmarc` TXT → `v=DMARC1; p=reject; rua=mailto:02b42d121985435193ae10b429b25e7d@dmarc-reports.cloudflare.net;` |
| V2  | No FAQ/answer block on homepage                                                                                      | crawl H2 scan                                              | M      | M      | AUTO      | Phase 2 requirement (redesign must ship it, not regress it)                                                                 |
| X1  | Site invisible for own brand query                                                                                   | WebSearch 7/14 (GitHub outranks site)                      | H      | -      | TIME      | Indexation + entity work above; re-check monthly                                                                            |

## Content gap plan (briefs)

1. **/compare or blog: "Flat-fee custom vs $175/month subscription vs DIY template"** - target "hand-coded website cost", S3. The winning SERP format is exactly this comparison; nobody in it defends flat-fee + ownership. 3 internal links from home/seo/taste-audit. ~1,200 words, comparison table, FAQ schema.
2. **/event-websites** - S4 ICP page: "conference website design", "event website that sells tickets". Proof: OGC build + /ogc case study cross-link. CTA: discovery call. (Aligns with the paracon outreach engine; page exists before outreach warms.)
3. **Process/stack page covering "Astro web designer"** - S4, low volume high intent; we ARE the proof (96 avg speed score stat + this audit's PSI receipts).

## Path-to-90 ledger (baseline 73, target 90+, every point owned)

| Owner               | Item                                                                                | Module points                         | Overall Δ                                                 |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| KIT-DONE 7/14       | schema graph + sameAs + Article/breadcrumbs + descs + de-orphan + llms/speakable    | geo +10, tech +7, social +5, voice +4 | **+2.9 (70→73, banked)**                                  |
| KIT-PHASE-2         | answer-first home + FAQ block                                                       | geo +6                                | +0.86                                                     |
| KIT-PHASE-2         | 3 gap pages (comparison, /event-websites, Astro/process)                            | content +6                            | +1.71                                                     |
| KIT-PHASE-2         | LCP diet + unused JS + /connect                                                     | perf +6                               | +0.57                                                     |
| KIT-PHASE-2         | per-page OG images + real logo asset                                                | social +7, geo +1                     | +0.47                                                     |
| KIT-PHASE-2         | CRO polish to site-rx green                                                         | cro +7                                | +0.67                                                     |
| RUSS (10 min)       | title trims yes/no (mechanism live)                                                 | tech +4                               | +0.57                                                     |
| RUSS (1 word)       | GSC account word → profile; unlocks striking-distance data next runs                | content +4 (with TIME)                | +1.14                                                     |
| RUSS (10 min)       | Bing Webmaster import of GSC property                                               | geo +3                                | +0.43                                                     |
| RUSS (1 min)        | rua tag on generussdesign DMARC                                                     | email +4                              | +0.19                                                     |
| RUSS (1 line)       | /ogc orphan ruling                                                                  | tech +1                               | +0.14                                                     |
| RUSS (~1 hr)        | Month-1 authority floor: entity sentence on 4 profiles + Crunchbase + LinkedIn page | authority +8, geo +3                  | +1.19                                                     |
| RUSS (monthly)      | Month 2-3 plan execution (directories, Astro showcase, 1 earned piece)              | authority +12                         | +1.14                                                     |
| TIME (monthly loop) | indexation matures → AI presence (llms/schema already positioned)                   | geo +10                               | +1.43                                                     |
| TIME                | striking-distance harvest once GSC flows (2-3 cycles)                               | content +8                            | +2.29                                                     |
| TIME                | entity graph consistency settles, citable asset earns citations                     | authority +6, geo +4                  | +1.14                                                     |
|                     | **Ledger total**                                                                    |                                       | **73 → ~89.6, +2 buffer in perf/tech/email overdelivery** |

Honest read: 90 needs Phase 2 + the Russ batch + 3-4 monthly compounding cycles. Nothing in the ledger re-weights modules or touches the experimental bench; the rubric stays fixed.

## Degraded / skipped (with unlocks)

- GSC read access: verified 7/14, unread. Unlock: account word (Gate A) + API creds or browser session. Biggest data unlock for content.
- Apify SERP census: sampled via WebSearch instead (7 queries; labeled sample throughout).
- Klaviyo engagement: no list for this property; infra-only email score per playbook.
- CrUX field data: below traffic threshold; lab-only stated.

## Tooling notes (this run)

- Fixed in /seo skill (shipped to ~/.claude/skills/seo/execution/): psi.mjs per-page slug collision (multi-URL runs self-overwrote); crawl.mjs attribute regex truncating at apostrophes + entity decode order (produced the false "mid-word desc" and "Claude s" artifacts). Post-fix re-crawl verifies clean.
