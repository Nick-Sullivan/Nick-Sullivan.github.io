---
title: "Expert generalists"
date: 2025-07-10
description: ""
published: true
---

I love finding articles that explain something I've always felt, but haven't been able to articulate.
And today I'm very excited to have read Martin Fowler's article on [Expert Generalists](https://martinfowler.com/articles/expert-generalist.html).

> ...developers who roam across languages, architectures, and problem spaces may seem like "jack-of-all-trades, master-of-none," yet repeated dives below surface differences help them develop durable, principle-level mastery. Over time these generalists can dissect unfamiliar challenges, spot first-principles patterns, and make confident design decisions with the assurance of a specialist.

I recommend reading that article (or at least skimming), and maybe you'll feel like me, with sudden clarity about interactions that make sense when viewed through an expert generalist lens. In particular, I've felt that certain skills are undervalued, and I've got the urge to write it down.


**Working across domains**

I've worked in miningtech, fintech, biotech (and soon, logistics). I've written before about some of my observations about how [domain cultures impact software engineering.](/blog/06_domain_culture) My pattern-matching monkey brain finds it interesting to identify which principles are fundamental, and which ones are manifestations of domain-specific constraints.

This is useful knowledge to have! As your business/product/domain evolves, you can recognise what needs to change with it. Got an increased requirement for auditing? Finance bread and butter. Highly experimental product features? Science has been doing it for years.
It adds tools to your tool belt, giving you lots of different options for how to solve a problem.

In particular, I've found it very useful for contextualising software discussions. I enjoy reading blogs and forums about building software, and see a litany of assumptions assuming that all systems have similar constraints. Being able to step back to first principles has been helpful in extracting valuable nuggets of information.


**Mechanical sympathy**

I really like the extension of the mechanical sympathy concept:

> Jackie Stewart, a triple Formula 1 world champion (1969-93), described how, while he wasn't an engineer of the cars he drove, he still needed a sense of how they worked, how they responded to what the driver was trying to do, a sense he called mechanical sympathy.

to the wider business:

>...we do need to cultivate such a sympathy for any adjacent domain to the ones we are working on. When working on a database design, we need such a sympathy for the user-interface so we can construct a design that will work smoothly with the user-experience. A user-experience designer needs such a sympathy with software constraints so when choosing between similarly valuable user flows, they take into account how hard it is to build them.

This is exactly what I've talked about in a previous post (but Fowler does it more succinctly). Making good decisions needs an [understanding of what is important to all stakeholders](/blog/35ux_all_the_way_down), including staff! This is only possible if you have a level of understanding of what your stakeholders need to succeed. I'm going to call this "stakeholder sympathy".


**High empathy teams**

I've found the highest performing teams are the ones that have minimal "handovers". A handover indicates transfer of ownership, and with it, all responsibility. With every handover, I find there is a loss of context and empathy. For example, if teams handover between every step of a reasonably standard process:

    Product -> Architecture -> Development -> Testing

You end up with product decisions with no understanding of engineering impact, architects that don't understand the current limitations of the code, developers that don't understand what problem they're solving, and testers testing a system that isn't built to be testable. 

I'm not saying we can't have those roles, or that we can't have specialists, we absolutely still need them. But my strong preference is for a project-oriented approach, where everyone is involved from start to finish.

As an example, [this article](https://microservices.io/post/architecture/2025/03/23/andrew-harmel-law-architecture-advice-process.html) summarises Andrew Harmel-Law's approach to architecture:

> Anyone (a development team member or someone playing a cross-team architecture role) can take (select a decision option) and communicate an architectural decision as long as during the option-making stage, they seek advice from:
>  - Everyone who will be meaningfully affected by the decision
>  - People who have expertise in the area in which the decision is being taken

Teams structured this way tend to develop greater stakeholder sympathy, and hence are able to make better decisions.