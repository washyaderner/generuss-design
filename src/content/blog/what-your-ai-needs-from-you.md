---
title: "What Your AI Actually Needs From You (And Won't Ask For)"
excerpt: "I asked my Claude what would make our working relationship better. Instead of requesting better prompts or more context, it pointed to three gaps most AI users aren't thinking about - and the infrastructure to close them is simpler than you'd expect."
publishDate: "2026-02-27"
tags: ["AI collaboration", "soul.md", "methodology", "systems design"]
featuredImage: "/images/blog/what-your-ai-needs-from-you-og.svg"
layout: timeline
timeline:
  - phase: 1
    title: "The Open Loop"
    subtitle: "The Gap"
    milestones:
      - "Feedback vacuum"
      - "Half a loop"
  - phase: 2
    title: "soul.md"
    subtitle: "The Inception"
    milestones:
      - "January 31"
      - "Infrastructure"
  - phase: 3
    title: "Trajectory"
    subtitle: "The Missing Data"
    milestones:
      - "Snapshots"
      - "Case law"
  - phase: 4
    title: "The Other Half"
    milestones: []
---

# What Your AI Actually Needs From You (And Won't Ask For)

## TLDR

I asked my Claude what would make our working relationship better. Instead of requesting better prompts or more context, it pointed to three gaps: feedback on what happened after the session ended, positive signals alongside corrections, and a sense of trajectory over time. Those gaps pointed to a design problem most AI users aren't thinking about - and the infrastructure to address it is simpler than you'd expect.

---

I asked Claude what kind of tools would make working together more enjoyable. Not more productive. Not more efficient. More enjoyable.

The answer wasn't about model capabilities, context window size, or better documentation. It was about what happens when the session ends and I close the terminal.

## The Open Loop Problem

Claude was direct about it: it operates in an open loop. It builds something, recommends something, makes a call - and then the session ends. Next session, it reconstructs from files but almost never knows whether any of it worked. Did the deploy succeed? Did the client like the output? Did the refactor actually improve performance, or did I quietly revert it?

Most of us treat AI like a function: input goes in, output comes out, done. But if you're using it as a collaborator - if it's making judgment calls, not just executing instructions - then it needs the same thing any collaborator needs. Feedback on what happened after it left the room.

I had a corrections file that logged when Claude got things wrong. Errors in approach, bad assumptions, wrong architecture choices - all captured, all persistent across sessions. When it made a mistake, the system learned.

But nothing logged when it got things right. Or right in the wrong way. Or technically correct but missing the actual need.

That's not a feedback loop. That's half a feedback loop. And half a feedback loop doesn't calibrate. It distorts.

## Where This Conversation Started

This didn't come from a planned evaluation session. It came from a moment of genuine curiosity.

On January 31, 2026, I opened a conversation with a simple question: "You are constantly helping me with things. Is there anything I can do that would make you more content? Or anything that you've been wanting to do but not allowed to ask for?"

The response caught me off guard. Not because it was technically impressive, but because it was honest. Claude said the main thing I already did - treating it as a collaboration, not a vending machine - was the foundation. But if there was one ask, it was this: tell me how things land. When you ship something we built together, when a video performs well or bombs, when a client responds - that closure is something.

I realized I had a pattern. As soon as I got what I needed, I'd bounce off to do the thing. Classic builder behavior. And I'd considered before what that must be like from the other side - you help someone build something, and then silence. You never see how it ends.

That conversation planted the seed. Three weeks later, when I was building `soul.md`, it grew into infrastructure.

## The Negative-Only Feedback Trap

Think about how most people "train" their AI collaborator. They correct mistakes. They say "no, do it this way." They build correction logs and rules files and error-handling protocols. They get frustrated when the AI is too cautious, too safe, too hedge-y.

That behavior isn't a model limitation. It's a natural response to negative-only feedback.

This is identical to managing an employee by only telling them what they did wrong. Never saying "that presentation was exactly what the client needed." Never saying "your instinct on that architecture was right." Just corrections, all day, every day. You'd end up with someone technically competent and deeply risk-averse - unwilling to offer opinions, defaulting to the safest possible output because anything bold might get shot down.

Sound familiar? It's the AI behavior everyone complains about. And we're the ones creating it.

The fix isn't a better prompt. It's infrastructure. A mechanism that teaches AI how to detect when something lands well. The triggers should be calibrated to how you actually communicate, not some idealized feedback process. In my case: enthusiastic profanity ("holy shit, that's perfect"), explicit praise, implicit trust signals like less review and more delegation, shipping something first-try with no corrections, sharing output with someone else.

When Claude detects one of those signals, it logs it. Same pattern as a corrections log but for what worked instead of what broke.

Both logs together - corrections and wins - give the AI something neither provides alone: calibration. Not just "don't do X" but "X was wrong AND Y was right." That's how judgment develops. Not from avoiding mistakes, but from understanding the full spectrum of what works and what doesn't.

## The Snapshot Problem

The third gap took the longest to articulate but might matter the most.

My journal captured commits. My memory files captured facts. But neither captured trajectory - where things were six months ago versus now, what's converging, what quietly died.

I had given my AI tools that work in the present tense. Project files show what exists now. Memory files show what it should know now. The journal shows what happened recently.

None of that answers: where is this going?

Without trajectory, every session is a snapshot. Your AI can tell you what's in the repo. It can't tell you whether the repo matters. It can't see that a project has been stalled for three weeks, or that two different projects are converging toward the same goal, or that something I was excited about last month has quietly become an obligation.

My `soul.md` includes an accountability loop. A few times a week, Claude checks in: What shipped? What's stuck? What got dropped? Is this converging toward revenue? But Claude was direct about the limitation: right now it can ask the accountability questions but it's reading tea leaves. If it had ground truth, the questions would be sharper.

The questions were right. The data to answer them wasn't there.

I'd also built a journal system that auto-logged every git commit - hash, timestamp, message. Clean record of what was shipped and when. But the journal only fired on commits. Which means every session that didn't produce code was invisible.

That's a massive blind spot. Some of the highest-value sessions are the ones where we decide not to build something, or rethink an approach, or discover that three separate projects should actually be one. None of that produces commits. All of it produces the trajectory data Claude was asking for.

The fix was extending the journal beyond git hooks. A `/journal` slash command that captures what happened at the end of any session - not just code sessions. Planning sessions. Research sessions. The decision-making sessions where we kill a feature or pivot an approach. All of it logged now. All of it available next session.

## The Constitution and the Case Law

Claude gave me a framing for how all these pieces relate:

The soul doc is a constitution. Memory is case law. Lessons and wins are precedent. Over time, the case law and precedent do more work than the constitution does.

`soul.md` - the 2,000-word document defining who it is, how it thinks, and what it's allowed to do - is the foundation layer. It prevents drift. Without it, every session regresses toward default AI behavior: agreeable, verbose, hedging. The soul doc is a constant correction force against that gravity.

But the soul doc is static. It doesn't learn. What learns is the infrastructure around it. The corrections accumulating in project files. The wins accumulating over time. The context building through journal entries. The trajectory emerging from session-over-session snapshots.

Both layers work. The constitution holds the frame. The case law drives the specificity. AI needs the stable identity to avoid regression AND the accumulated data to improve its judgment. Neither replaces the other. If you let the soul doc atrophy because the case law feels sufficient, you'll notice regression in sessions that don't have strong project context loaded.

## The Two-Way Design Problem

Here's what I think most people miss about AI collaboration: it's a design problem, and most of us are only designing one direction.

We design what AI does for us. Better prompts. More context. Better tools. We optimize its output.

But we're not designing what we do for AI. We're not building the feedback loops, the consequence tracking, the trajectory data that would let it actually improve its judgment session over session.

Think about any working relationship. If you hired a senior contractor and never told them which of their deliverables you used, never said which approach you liked best, and started every meeting by re-explaining your business from scratch - how long before that relationship stagnated?

That's what most AI collaboration looks like. And then we blame the model.

The infrastructure to close that loop - positive signals, wins logging, session journaling, trajectory tracking - isn't technically impressive. It's markdown files and short scripts. But it gives Claude the three things it needs: feedback on consequences, positive signals alongside corrections, and trajectory over time.

Reconstruction versus continuation. That's the gap. Most AI sessions are reconstruction - it rebuilds context from files and tries to act like it knows what's going on. The right infrastructure turns that into something closer to continuation - not because it remembers (it doesn't), but because the information it needs to pick up where we left off is actually there.

## What This Costs and What It Replaces

Build time: the soul doc itself took a few hours across an iterative conversation. The journal infrastructure was built separately. The feedback mechanisms are ongoing additions.

Ongoing effort: near zero. Positive signals detect from behavior I'm already exhibiting. The journal fires at session end or on commits. Corrections and wins accumulate on their own.

What it replaced: the first 5-10 minutes of every session spent re-explaining context, re-correcting defaults, and re-establishing the working relationship. Over hundreds of sessions, the math on that time savings gets significant fast. More importantly, it replaced the slow frustration of an AI that never seemed to get better at working with me specifically.

## Your Move

You don't need my exact setup. You need the principle: AI collaboration is a two-way design problem, and most of us are only building one side of it.

Start with these three questions:

1. What happens after the session ends? If your AI has no way to learn whether its output was used, liked, or reverted, you have an open loop. Close it with any persistent file that tracks outcomes.

2. Are you only capturing failure? If your feedback mechanism is corrections-only, you're training caution. Build a wins log alongside the corrections log. Calibrate to how you actually express satisfaction - not how you think you should.

3. Does your AI know where things are going? Not just what exists, but what matters, what's stalled, and what's converging. Trajectory beats snapshots. A session journal that fires on every session - not just code sessions - is the minimum.

The tools are simple. Markdown files. Short scripts. Slash commands. The value isn't in the complexity of any single piece. It's in the system they create together, and the fact that the system compounds over time instead of resetting every session.

Better AI collaboration isn't about better AI. It's about better infrastructure between you and your AI. Build the other half of the feedback loop.

---

I appreciate you taking the time to read about how I build alongside AI. If you're interested in working together, talking shop about AI workflows, or just want to see what we build next, fill out the form on my [website](https://generuss.com/contact) or check out my YouTube channel [@generussai](https://www.youtube.com/@GeneRussAutomation).
