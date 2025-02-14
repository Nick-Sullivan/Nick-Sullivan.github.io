---
title: Startup catch-22
date: 2025-02-15
description: "So much time and so little to do. Strike that, reverse it."
published: true
---

The technical challenges to scaling a business are a catch-22. The ability to quickly evolve your software is largely determined by the foundation set when it was first written. But when first writing the code, there are so many time and cost constraints that spending too much time making the foundation strong is a massive risk to the company's existence.

How can we approach this?

**Reduce**

Keep it simple, stupid. All code is a burden, and it will slow you down. When creating experimental features (if you're a startup, everything is an experiment), be prepared to deprecate anything you don't plan to maintain. Have a strong focus on development speed. It is your main advantage over bigger, more established companies.

**Reuse**

Knowledge of best practices and established design patterns can be a great starting point for any project. Don't dogmatically copy the latest trend, or do things just because a big tech company did it. But it's valuable to stay up to date on what approaches have worked for others. Read books or blogs. The value that they can add almost feels like cheating.

Copy from yourself. Linters, IDE config, infrastructure-as-code, project structures, CICD config, Dockerfiles. These are all things that can be copied from project to project as a template and tweaked to fit your new needs. For me, part of the fun of throwaway side projects is creating my go-to tooling and components, so I can build new projects quickly.

Remember that you don't need to reinvent the wheel; knowledge of different libraries and tools is extremely valuable.

**Recycle**

Recognise what parts of your software will become harder to replace as the company grows, and which parts will be more or less the same difficulty. You may have heard this as [one-way doors vs two-way doors](https://www.inc.com/jeff-haden/amazon-founder-jeff-bezos-this-is-how-successful-people-make-such-smart-decisions.html). Servers, for example, are usually ephemeral, so starting with a single small server and upgrading as needed is a sensible approach. You can support this further by Dockerising your code to maintain consistency regardless of where your code is deployed to. I've talked earlier that I'm a fan of web services that can be deployed [locally, on-server, or serverless.](/blog/13serverless) Tests, on the other hand, are difficult to add later (and pay themselves off almost immediately!). Please add them early on. I'm tired of hearing that startups don't have time for tests.

Keep recycling in mind when making decisions that build on top of previous decisions. For example, you may have started with a basic schema for a transactional database, and there is appetite for ingesting this data into an analytics database. This will make it harder to change your transactional schema - are there any warts in there that you desperately want to fix first? Can you limit the ingestion to only the battle-tested tables, and leave out the new, evolving tables for a while?
