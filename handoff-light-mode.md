# HANDOFF: Light mode for generussdesign.com, colors only

You are Kit, opening a fresh session in /Users/studio/Build/generuss-design. This file is your complete assignment; Russ will not type anything. Execute it end to end and stop him exactly once, at the gate marked GATE L. Read ~/.claude/rules-situational/build-preamble.md before anything.

## Russ's ruling (2026-07-14, verbatim intent)

"I like the colors that you picked. I just want to keep the initial structure and copy exactly as it is and have this be a colors-only thing."

Meaning: the CURRENT live site (the dark one on main) keeps its structure, copy, type, spacing, and behavior EXACTLY as they are. The Workbench redesign's PALETTE becomes a light theme of that existing site. The full Workbench redesign (branch redesign/v2: new plates, Fraunces, new pages) stays PARKED and does not ship; it is a future asset library, do not merge or delete it.

## Ground truth to verify on disk before starting (confirm, do not re-derive)

- Repo: /Users/studio/Build/generuss-design. main = production; CF Pages project `generuss-design`; push to main IS the prod deploy. Branch discipline is the safety model.
- Production currently serves the dark site with the 7/14 SEO fix passes, trimmed titles, and the 5-Leak Teardown rename (never resurrect "5-Site").
- Branch redesign/v2 exists, parked at Gate B by ruling. Its ART-DIRECTION.md documents the palette. Preview: redesign-v2.generuss-design.pages.dev.
- 90+ SEO goal thread lives in seo/seo-profile.md (baseline 73, monthly cron). Update its status note when this ships: the redesign's ledger points do NOT land with this colors-only theme; adjust the note honestly.
- Money paths, do not break in either theme: Cal.com booking (#booking + /call-confirmed), 3-tier offer ladder on the homepage, /seo page, /taste-audit $197 Stripe link, 5-Leak Teardown + contact Formspree forms.
- Known tool artifact: pilot-qa.mjs PD4 contrast eval parses rgb only and false-positives on oklch; hand-verify anything it flags (fontTools also lacks brotli here; and this zsh does NOT word-split unquoted vars; and cwd persists across Bash calls, use absolute paths).

## The palette (the colors Russ approved, from the Workbench)

```
paper (bg):        oklch(0.965 0.008 85)
paper-deep:        oklch(0.93 0.012 85)    /* surface / cards */
paper-shade:       oklch(0.895 0.015 85)   /* surface-raised, wells */
ink (text):        oklch(0.24 0.015 60)
ink-soft (muted):  oklch(0.42 0.012 60)
border:            oklch(0.24 0.015 60 / 0.14)
draft (accent):    oklch(0.5 0.085 245)    /* replaces cyan in light mode */
accent-hover:      oklch(0.44 0.09 245)
accent-dim:        oklch(0.52 0.085 245 / 0.1)
accent-mid:        oklch(0.52 0.085 245 / 0.35)
accent-glow:       oklch(0.52 0.085 245 / 0.18)
seal (vermilion):  oklch(0.55 0.16 35)     /* sparingly: stars, one warm accent class */
```

Pre-decided mappings so nothing needs asking: cyan accent -> draft blue everywhere in light mode. Dark neumorphic shadow pairs -> soft warm paper shadows (dark oklch(0.24 0.015 60 / ~0.10) + light oklch(1 0 0 / ~0.6)). Cyan glows -> accent-glow at the values above. Star ratings and any red-adjacent warmth -> seal. Selection: draft bg + paper text. Fonts, sizes, spacing, radii: UNTOUCHED (colors only).

## The job

1. Fresh branch off main: `theme/light-paper`. Never work on main directly.
2. Implement light mode as a TOKEN LAYER on the existing site: the current dark values stay the `:root` default, byte-for-byte where possible; `[data-theme="light"]` (and `@media (prefers-color-scheme: light)` for first paint before JS) swaps the custom properties in src/styles/global.css to the palette above. Dark mode must render PIXEL-IDENTICAL to today: guard it by screenshotting prod home/seo/taste-audit desktop+mobile before any edit, then diffing your branch build in dark mode against those shots at the end.
3. Colors-only also means: hardcoded color stragglers in the existing pages (text-white, #0C0C0C on accent CTAs, inline cyan rgba glows, hex values in inline styles or SVGs) get converted to the tokens so both themes read correctly. That is still colors work. Structure, copy, class layout, animations, fonts: forbidden to touch. If a color cannot be fixed without touching structure, leave it and log it.
4. Theme toggle: one small accessible control in the nav (and mobile menu), sun/moon or DAY/NIGHT in the site's existing visual language, aria-pressed, persisted in localStorage, honors prefers-color-scheme on first visit, no flash of wrong theme (inline head script sets data-theme before paint). Default for first-time visitors: system preference; returning visitors: their stored choice.
5. Sweep EVERY route in light mode at 1440 and 390 with the shot harness (/Users/studio/Build/fable-10/tools/shot.mjs; run it with cwd fable-10): home, /seo, /taste-audit, /connect (its hardcoded dark bento may stay dark by design if tokens don't reach it; decide by looking, log the call), /ogc, /call-confirmed, /blog, one timeline post + one default post, 404. Hostile critique: contrast (hand-verify oklch), legibility on paper, glow remnants, broken hover states. Fix everything found, three passes max per law 10.
6. Floor: pilot-qa (/Users/studio/Build/\_resources/execution/pilot-qa.mjs, target 22) run TWICE on localhost: once per theme. Zero console errors both themes. No em or en dashes introduced anywhere.

## GATE L, the only stop

Serve the branch build on localhost (static server on the built dist is fine), give Russ the URL plus 4 to 6 before/after screenshots (dark unchanged, light in the new palette, desktop + mobile), one short paragraph on any judgment calls (e.g. /connect), and WAIT. His approval here is also the ship go; do not re-ask after.

## After his go, ship (Phase 3, one pass)

1. Independent gate first: /vera or a fresh Opus review of the diff (no self-gate, law 6).
2. Read ~/.claude/rules/deploy-target-verification.md, state the target out loud: Cloudflare Pages project `generuss-design` at https://generussdesign.com, merge of theme/light-paper into main = the production deploy.
3. Merge, push, verify live: both themes render, toggle persists, no flash, booking flow works, Stripe link resolves, teardown form redirects, zero console errors, 390px composed, dark mode still pixel-faithful.
4. /seo quick against the live site as the post-ship delta; update the goal-thread status note in seo/seo-profile.md (colors-only shipped; redesign/v2 ledger points still parked).
5. Report past-tense with receipts, run the /reflect closeout, update context_handoff.md and the kit_sessions row, then delete THIS handoff file per convention.

## Boundaries

- No structure, copy, type, spacing, or animation changes anywhere. Colors only. The banned move: "while I'm here" improvements.
- Nothing merges to main before GATE L approval. redesign/v2 stays parked and unmerged.
- No new paid services or spend. DNS/email-auth changes stay drafted, never executed.
- If usage burns hot, pause and say so. Content filter blocks twice: stop and table per law 10.
- Times Pacific 12-hour in the report. Full file paths when naming files to Russ.

## Still open on Russ's side (remind him at the close, do not block on them)

- Bing Webmaster import (10 min) · Month-1 authority floor, drafts ready in seo/audits/2026-07-14/drafts/authority-plan.md · rua DNS one-liner (audit E3 in seo/audits/2026-07-14/AUDIT.md).
- [REVENUE] surfacer, still carried: Taste Audit $197 / Vertical Briefs $197 per month / AI Accountability $997: pick one to ship in a dedicated session, or kill it.

Composed by Kit 2026-07-14 late session (updated after Russ's colors-only ruling). Fun first, receipts always.
