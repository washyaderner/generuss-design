# SEO Profile: generussdesign.com

> Permanent context for every /seo run on this site. Load this, never re-ask what it answers.
> Created: 2026-07-03 · Last verified: 2026-07-14

## Business basics

- Business name: generuss design (styled lowercase on-site)
- Legal entity: Generuss LLC
- Address: online only, no public address
- Phone: none published (email + booking call flow)
- Website: https://generussdesign.com (generuss.com 301s here, verified 7/3/2026)
- Google Business Profile: none - not a local business
- Years in business: see site; 17+ sites shipped claim on /ogc
- Team size: solo (Russ)
- Whose property: Russ

## Services + market

- Primary: custom website design + development (hand-coded, Astro + Cloudflare, live in 21 days, client owns everything)
- Secondary: Search + AI visibility optimization (/seo page: SEO, AEO, GEO/GSO, Local, Voice, Perf, CRO, Email, Social), conversion engineering, Pharallax strategic AI (separate property)
- Service areas: online/worldwide; outreach ICP = event/conference organizers (inferred from business strategy, 2026-07)
- Target customer: service businesses and founders who outgrew templates
- Positioning: "Custom websites that convert. No bloat." Guarantees: 21 days, you own everything, deposit back if you hate the first design.

## Goals + keywords (inferred 2026-07-03; refine with Russ)

- Top keywords: custom website design for service businesses, SEO AEO GEO services, AI search optimization, website that converts, Astro web designer
- AI-visibility targets: "who builds custom sites for small service businesses", "what is GEO/AEO and who does it"
- Biggest problem: young domain, thin service-intent page coverage (fixed 7/3 with /seo page), no GSC wired

## Competitors

Derived from SERP sampling 2026-07-14 (Kit's picks, flagged at Gate A of the level-up run; Russ can swap any).

| Name                   | Website                          | Notes                                                                                                                                                              |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Oak Harbor Web Designs | https://oakharborwebdesigns.com  | Ranks #1 for "custom hand-coded websites for small service businesses" (exact ICP query). Same craft pitch, opposite pricing model ($0 down, $175/mo subscription) |
| OTM Web Design         | https://otm-designs.com          | Hand-coded, no-templates specialist (Texas); ranks top-3 for "custom website design hand-coded no templates"                                                       |
| Yellowfin Digital      | https://www.yellowfindigital.com | "Conversion-focused custom web design USA": closest match to our "websites that convert" positioning                                                               |

SERP context: the winning result format for our head queries is the productized subscription shop ($0-175/mo). Nobody in that SERP defends flat-fee + full ownership: that is our content wedge (see 7/14 gap plan).

## Stack + access

- Repo: /Users/studio/Build/generuss-design (branch main = production)
- Framework/host: Astro + Tailwind v4 + Cloudflare Pages
- Deploy: git push to main (Pages project `generuss-design` git-connected). Manual: `npm run deploy` needs `env -u CLOUDFLARE_API_TOKEN` (secrets token is DNS-only).
- Analytics: booking conversion tracked via Google Ads gtag on /call-confirmed (repo-verified 7/14); no sitewide analytics in repo (CF-dashboard-level injection unverified)
- Search Console: domain property VERIFIED 2026-07-14, sitemap-index.xml submitted same day. Owning Google account: (ask at Gate A, record the one word here). API/browser read access not yet wired; wire before next full run to unlock striking-distance data
- PSI: PSI_API_KEY in ~/.secrets (test-fired 7/14; psi.mjs reads it from env)
- Email sender: russ@generuss.com (Google Workspace + Resend; auth lives on generuss.com). generussdesign.com sends nothing and is LOCKED DOWN as of 2026-07-14 (dig-verified: null MX, SPF `v=spf1 -all`, DMARC `p=reject`; rua tag still open, paste-ready in 7/14 audit E3). generuss.com DMARC moved p=none -> p=quarantine 7/14
- Social: GitHub washyaderner, X @generussai (footer)
- Content: src/content/blog/\*.md (Astro content collections)

## History

- 2026-07-03: first full /seo audit + fix pass (see audits/2026-07-03/): 65 -> 73
- 2026-07-14: email lockdown DNS trio + generuss.com DMARC quarantine executed live (Comet) + GSC verified + PSI keyed, all dig-verified
- 2026-07-14: full re-audit, run 2 (audits/2026-07-14/): first full-coverage scoring (all 9 modules, no nulls), 70 pre-fix -> 73 post-fix; fix pass commit 6afc512 (schema 100%, sameAs, Article x5, descs, de-orphan); competitors named; path-to-90 ledger written; part of the level-up run (Phase 2 redesign follows Gate A)
