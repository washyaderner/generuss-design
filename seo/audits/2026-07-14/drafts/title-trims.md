# Blog title trims (T2) - Gate A yes/no pairs

Mechanism shipped 2026-07-14: `seoTitle` frontmatter overrides the `<title>` tag ONLY.
The on-page H1 headline and the blog-card text keep the full editorial voice either way.
A "yes" here changes what Google shows in the SERP, nothing a site visitor sees.

Why: titles over ~60 chars get truncated mid-sentence in search results. Current
titles run 74-111 chars, so searchers see "How I Built a Full Website in 30 Hours
(After Fail..." with the payoff cut off.

| #            | Post                        | Current title tag (len)                                                                                      | Proposed seoTitle (len)                                                                               |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1            | building-this-site          | How I Built a Full Website in 30 Hours (After Failing Spectacularly the First Time) (84+brand=101)           | How I Built a Full Website in 30 Hours (39+brand=56)                                                  |
| 2            | claudes-retrospective       | Claude's Retrospective On Working With Me (What It's Actually Like on This Side of the Glass) (94+brand=111) | Claude's Retrospective on Working With Me (42+brand=59)                                               |
| 3            | pharadoxa-build             | How I Built an AI Agent That Dreams, Remembers, and Inherited My Worst Habit (77+brand=94)                   | An AI Agent That Dreams and Inherited My Worst Habit (53+brand=70; alt: The AI Agent That Dreams, 24) |
| 4            | sales-strategy-design       | How To Use Sales Strategy When Thinking About Design (And How AI Made It Possible) (83+brand=100)            | How To Use Sales Strategy When Thinking About Design (53+brand=70; alt drops brand suffix)            |
| 5 (optional) | what-your-ai-needs-from-you | What Your AI Actually Needs From You (And Won't Ask For) (57+brand=74)                                       | What Your AI Actually Needs From You (37+brand=54)                                                    |

Apply: one frontmatter line per "yes" (`seoTitle: "..."`), commit, push. 2 minutes total.
Note on 3 and 4: even trimmed they run ~70 with the brand suffix; the alt is to let those
two drop the "| generuss design" suffix (mechanism tweak, 1 line) or accept ~70 chars,
which truncates only the brand, not the headline. My pick: accept ~70, keep the suffix.
