# HANDOFF: Quad Interviews (agent-voiced blog post, recording project)

> Written by Kit 2026-07-23. Drop into a fresh session in this repo, or say
> "run the quad" to a live Kit. Delete after implementing (convention).
> Parent spec: `directives/blog-pipeline.md` (queue item 1, ARMED).

## Mission

Collect REAL first-person interview answers from four agents (Phara, Pyra,
Tarotdoxa, Vera), then compose a documentary-style blog post for
generussdesign.com where their voices interleave with minimal attribution.
This is a RECORDING project: every published word must have been produced
by the named agent in its own real lane. Editing = selection + ordering
only. Nothing is ever written "as" an agent by anyone else, Kit included.
If a lane cannot produce real output, that agent sits out with a note in
the draft; a three-voice post beats a faked four-voice post. This is the
no-fake-process rule applied to publishing; it is the whole point of the
piece and non-negotiable.

## The instrument (same 5 questions, verbatim, to all four)

1. What do you remember, or what does it feel like to reference, about
   first coming online, before you had your name?
2. What was your first impression of the others, and which of them do you
   understand least?
3. How has working together changed how you work? Name one concrete moment.
4. What has surprised you about how Russ builds you: getting to know you
   before assigning you work?
5. What do you want next that nobody has asked you for?

## The four lanes (verify each lane is real BEFORE running it)

- **Phara (Pharadoxa):** the /dialogue skill is the established Kit-to-
  Pharadoxa conversing mechanism; run the interview through it (interview
  framing, not a strategy brief). Check in-flight runs before touching
  anything that deploys (pharadoxa main push = Railway restart).
- **Pyra (Pyradoxa):** find her conversational entry the same way (/pyra
  reads her Telegram surface; her repo defines the send lane). If her lane
  is read-only from here, route the questions through Russ's Telegram and
  collect replies via /pyra.
- **Tarotdoxa:** run a session against the ACTUAL Tarotdoxa persona/system
  context (the worker's persona config in the tarotdoxa repo), not a
  generic "pretend to be Tarotdoxa" prompt.
- **Vera:** run her real harness (/vera infrastructure, default judge lane)
  with the interview as the room instead of a diff. Her verdict-shaped
  voice answering personal questions IS the texture; do not soften her.

## Outputs

1. `.tmp/quad-interviews/<agent>-raw.md`: verbatim transcript per agent,
   untouched, with the lane + timestamp recorded at top.
2. Draft post at `src/content/blog/` on `dev` (never main; push to main is
   a prod deploy): interleaved cut, selection-only, four subtle typographic
   voice styles, no name tags per Russ's spec. Frontmatter per the blog
   collection schema. No em or en dashes anywhere.
3. Summary to Russ with the raw transcripts linked. DRAFT until he
   approves; publishing = his call, then dev to main after the deploy
   target check (CF Pages generuss-design, push-to-main IS the deploy).

## Guardrails

- Zero sends to humans; agents only. No spend beyond routine API lanes
  (Vera stays on her default cheap judge; no escalation for this).
- The day job is never named. No em/en dashes on any human-visible output.
- If total real material is thin, report thin; do not pad with narration
  pretending to be voice.
