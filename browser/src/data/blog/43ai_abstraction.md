---
title: "AI abstraction"
date: 2026-07-19
description: "Is AI a sufficient abstraction for software?"
published: true
---

I've heard many people talk about how the abstraction of AI to write code is
similar to the abstraction of high-level languages (Python, JavaScript etc.)
of low level code (C, C++ etc.). I want to dig into that a bit.

And when talking about high level abstractions, the tradeoff is quite 
straightforward. We gain the ability to ignore how we allocate
memory, just declare variables and let the computer do the rest.
And what we lose is the ability to optimise, a general purpose memory manager
will not be able to compete with bespoke memory control, designed to fit
for each project.
This makes it very clear when the abstraction is undesirable, if you need efficient memory and computation, such as when working in hardware limited scenarios such as medical devices or robotic sensors, then low level languages remain a fantastic choice.

Generally, though, the decrease in hardware costs has meant that high level
languages have been very popular in many industries - development time has been a far bigger business cost than compute and memory.

The use of AI as an abstraction for writing code can be seen similarly. 
The tradeoff is that we can ignore how we implement product features, just
prompt what you want and let the computer do the rest. What we lose is 
determinism - does it work? Maybe. Probably. Claude says it does.

And this tradeoff is particularly difficult for people to understand. Historically, computers have been calculators - deterministic but unable to handle ambiguity. For the first time, AI has allowed computers to handle ambiguity, at the cost of becoming unpredictable. 
I believe this is how we've ended up with repeated cases of people using AI and being surprised that the results are completely made up, such as legal documents citing made up cases.

It's therefore quite clear when the abstraction of AI should not be used; if you need deterministic, explainable results, stick to conventional programming.

I have a question, then. For the majority of industries, is the unpredictable nature of AI good enough? Are traditional-code purists doomed to become a niche, where the industry default is AI?

I believe the answer lies in user expectations. If users demand (as voted with their wallets) software that is reliable, then the push to integrate AI into everything will have a dramatic backlash.

But, if users learn to expect that software fails randomly, and that bugs and downtime are normal and expected, then what motivation do companies have to do better? The current generation of engineers has an expectation that computers are accurate, will the next one?

Businesses are clearly hoping not, and perhaps part of the motivation of sloppifying everything is to grind down expectations, normalising inaccuracies.

Businesses that want to buck the trend need to have a good marketing team.
