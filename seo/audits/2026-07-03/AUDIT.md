# SEO Audit: generussdesign.com - 2026-07-03

Mode: full (T0) · Skipped for access: PSI (Google keyless quota exhausted, HTTP 429 ~8:45 AM PT; unlock = free PSI_API_KEY), GSC (not wired), Apify SERP sampling (deferred, competitors not yet named in profile), authority sweep (deferred with it)
Data sources: crawl 7/3 (9 pages, execution/crawl.mjs), email-auth.sh 7/3 (generussdesign.com + generuss.com), repo inspection

## Scorecard (pre-fix state; Δ = after the 7/3 fix commit)

| Module                                        | Score  | Grade | Δ 7/3  | One-line verdict                                                                              |
| --------------------------------------------- | ------ | ----- | ------ | --------------------------------------------------------------------------------------------- |
| Technical SEO                                 | 84     | B     | 90     | Clean foundation (canonicals/og/sitemap 100%); long blog titles remain                        |
| Content                                       | 68     | D+    | 74     | Strong essays, but zero service-intent pages until /seo shipped; no GSC                       |
| Local / GBP                                   | n/a    |       |        | Not a local business, module out of scope                                                     |
| Authority                                     | n/a    |       |        | Deferred: needs competitors named + mention sweep (next run)                                  |
| GEO / AEO                                     | 55     | F     | 72     | Schema graph solid on core pages but no llms.txt (fixed), no sameAs, entity name typo (fixed) |
| Voice                                         | 55     | F     | 65     | No FAQ/question coverage anywhere until /seo page's FAQ block                                 |
| Performance                                   | n/a    |       |        | PSI quota-blocked today; static Astro + 126ms avg server response bodes well; score next run  |
| UX / CRO                                      | 75     | C     | 78     | Booking flow strong; /connect title was brand-only (fixed); site-rx pass = follow-up          |
| Email                                         | 40     | F     | 40     | Domain sends nothing but has zero spoofing protection (open, RUSS: DNS)                       |
| Social                                        | 70     | C-    | 72     | og/twitter 100%, one shared og image sitewide; sameAs missing from schema                     |
| **Overall (weighted, in-scope renormalized)** | **65** | **D** | **73** |                                                                                               |

## This week (top 3)

1. DONE 7/3: ship /seo service page (S4 service-intent + FAQ/Service schema + footer link).
2. Wire GSC + get PSI_API_KEY (both free; unlocks page-2 goldmine + perf module). RUSS: 10 min, steps in the session report.
3. Add `sameAs` (GitHub, X) to the BaseLayout Organization schema + extend the schema graph to blog layouts (5 posts, only 2 carry Article schema; blog index has none). AUTO next pass.

## Findings

| #   | Finding                                                                                                             | Evidence                                                                | Impact | Effort | Tier | Status                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ | ------ | ---- | ------------------------------------------------------------------------------------------ |
| T1  | 2 blog posts had two H1s (template + in-content markdown #)                                                         | crawl: claudes-retrospective, pharadoxa-build h1=2                      | M      | S      | AUTO | FIXED 7/3 (demoted content H1s)                                                            |
| T2  | Blog post titles 94-111 chars, truncated in SERPs                                                                   | crawl titleLength: 4 posts >90                                          | M      | S      | RUSS | OPEN: titles are voice-bearing headlines; trim only with Russ's eye                        |
| T3  | /connect title was "generuss. \| flawless by design" (zero keywords, booking money page)                            | crawl: title 30 chars, brand-only                                       | M      | S      | AUTO | FIXED 7/3                                                                                  |
| T4  | /ogc in sitemap with 0 internal inlinks (orphan)                                                                    | crawl sitemapOrphans                                                    | L      | S      | RUSS | OPEN: looks intentional (direct-link landing page); confirm or link from footer            |
| G1  | No llms.txt                                                                                                         | fetch /llms.txt 404                                                     | M      | S      | AUTO | FIXED 7/3 (public/llms.txt)                                                                |
| G2  | Person schema said "Russ Garner"; prose says "Russ Gardner" (entity inconsistency, GEO poison)                      | BaseLayout.astro:76 vs claudes-retrospective.md excerpt                 | M      | S      | AUTO | FIXED 7/3                                                                                  |
| G3  | Organization schema has no sameAs links (GitHub/X exist in footer)                                                  | BaseLayout.astro @graph                                                 | M      | S      | AUTO | OPEN next pass                                                                             |
| G4  | Schema coverage 56%: blog index + 3 posts missing structured data                                                   | crawl schemaTypes: Org:3, Article:2 of 5 posts                          | M      | M      | AUTO | OPEN next pass                                                                             |
| C1  | Zero service-intent (S4) pages: nothing to rank for "SEO services", "custom website design" queries beyond homepage | crawl page inventory: home + blog + 2 landing pages                     | H      | M      | AUTO | FIXED 7/3 (/seo page; more service pages = content plan)                                   |
| C2  | No GSC: content module running blind (no page-2 goldmine, no CTR data)                                              | access check                                                            | H      | S      | RUSS | OPEN: wire-up steps in report                                                              |
| V1  | No FAQ/question-formatted content sitewide                                                                          | crawl H2 scan                                                           | M      | S      | AUTO | FIXED 7/3 on /seo (FAQPage schema); extend to home later                                   |
| E1  | generussdesign.com has no SPF/DMARC at all: any spammer can spoof @generussdesign.com                               | email-auth.sh 7/3: FAIL SPF, FAIL DMARC, no MX                          | M      | S      | RUSS | OPEN: add `v=spf1 -all` TXT + `_dmarc` `v=DMARC1; p=reject;` (non-sending domain lockdown) |
| E2  | generuss.com (the actual sending domain) DMARC is p=none                                                            | email-auth.sh 7/3: SPF -all PASS, DKIM google+resend PASS, DMARC p=none | M      | S      | RUSS | OPEN: move to p=quarantine after a clean report cycle (rua already goes to Cloudflare)     |
| P1  | PSI/CWV unmeasured this run                                                                                         | 429 quota                                                               | ?      | S      | RUSS | OPEN: PSI_API_KEY (free) then /seo perf                                                    |
| S1  | One shared og-default.png for every page                                                                            | BaseLayout ogImage default                                              | L      | M      | AUTO | OPEN: per-page og images (Astro OG generation) later                                       |

## Degraded / skipped

- PSI: keyless daily quota exhausted (shared pool). Unlock: free API key, steps in report.
- GSC/GA4: not connected. Single biggest data unlock for the content module.
- Apify SERP/competitor sampling + authority sweep: profile has no named competitors yet; name 2-3 and the next full run does the gap analysis.

## Scoring notes

Tech: -1×7 title lengths, -5 multi-H1 (restored post-fix), -4 thin/orphan handling. Content: essays strong (+), S4 coverage was zero (C1, heaviest content penalty), no GSC. GEO per rubric: bots 10/10 (all AI bots allowed, robots.txt deliberate), llms.txt 0→10, answer-first 5/25 (blog only)→12 post-/seo FAQ, schema+sameAs 12/20 (G2 fixed, G3 open), presence sampling not run (0 counted, deferred), entity consistency 8/15→13. Overall = weighted mean over in-scope modules (tech .15, content .20+.10, geo .10+.05, voice .05, cro .10, email .05, social .05, renormalized).
