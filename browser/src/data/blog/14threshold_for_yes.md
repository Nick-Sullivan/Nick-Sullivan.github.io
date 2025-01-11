---
title: Threshold for yes
date: 2024-12-18
description: "High level communication requires abstraction."
published: True
---

If you ran into a wall, there is a non-zero chance that you would [phase through it](https://en.wikipedia.org/wiki/Quantum_tunnelling).
But if you were to design a building to account for quantum tunnelling risk, you would be laughed out of the room for wasting everyone's time.
Because despite being technically incorrect, the answer to "will you ever phase through a wall?" is _no_ for most purposes.

Abstracting away unnecessary detail is necessary for efficient communication at a high level. The challenge is discerning what information
is necessary for this person at this time. I've noticed that this can be difficult for those whose roles demand mastery in the details.
It can feel dishonest to skip certain details, or unfair to only address visible work. Or they assume that everyone is as interested in the details as they are.

### Impact

It can cause a loss in confidence in you and your work.
If someone asks you "will this project work?" and you respond "maybe", many will perceive it as a lack of preparation or interest.

It wastes time.
If you present information to someone, they can reasonably assume there is a reason you want them to know about it, leading them to dig further to
find out if it's a risk they need to prepare for, or an action they need to take. Suddenly, every engineer is getting a tap on the shoulder for
their opinion on whether the project is on track.

### Options

The first step is acknowledging that your definition of _yes_ is likely to be different from everyone else's, and highly dependent on context.

If saying _yes_ and _no_ is uncomfortable because it implies certainty that you don't have, use terms like "I am confident", or "I believe it will work".

Back your opinion with your reasoning, and opt for unambiguous language. For example, "I'm confident. We've built a suite of automated tests to confirm
correctness, and alpha testers have been using it for the last two weeks without significant issues."

Lean on industry practices, akin to legal standards in industries like construction and medicine. For example, in cloud engineering, there are
availability guides such as [this](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html).

| Availability | Maximum Unavailability (per year) | Application Categories                                     |
| :----------- | :-------------------------------- | :--------------------------------------------------------- |
| 99%          | 3 days 15 hours                   | Batch processing, data extraction, transfer, and load jobs |
| 99.9%        | 8 hours 45 minutes                | Internal tools like knowledge management, project tracking |
| 99.95%       | 4 hours 22 minutes                | Online commerce, point of sale                             |
| 99.99%       | 52 minutes                        | Video delivery, broadcast workloads                        |
| 99.999%      | 5 minutes                         | ATM transactions, telecommunications workloads             |

Remember that nobody expects you to be perfect. If you believe that there is a 99% chance of it working, then saying _yes_ will mean you are right 99 times out of 100. If it goes wrong, jump on it and fix it until it's right. In some cases, seeing you put out the fire is more visible than preventing the fire.
