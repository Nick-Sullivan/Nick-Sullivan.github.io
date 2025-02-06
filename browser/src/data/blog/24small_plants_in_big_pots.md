---
title: Small plants in big pots
date: 2025-02-06
description: ""
published: true
---

**"What are the most important skills for an engineer in a small, scaling business?"**

In my experience, there are two main skills that stand out:

- **Technical:** The ability to create something quickly, but with a clean foundation that is simple to grow and improve later.
- **Non-Technical:** Understanding the needs of the business and translating them into technical designs.

These skills are crucial for setting up the business for success, or as I like to call it, planting **small plants in big pots**.

Here's why: In any company, there are many competing objectives, but for small companies, two major ones stand out:
1. Acquiring customers/clients to avoid going bankrupt immediately.
2. Establishing a strong foundation to support future growth.

The best engineer for this purpose is someone who understands both the business and the technology well enough to make good judgments about balancing the two. For example:

- **CICD:** Yes. Very fast ROI. Keep it simple because being tricky can become a time sink.
- **Tests:** Absolutely. They dramatically improve the quality of the codebase and reduce on-call bug fixing.
- **Linting:** Yes. Use a popular linter with default configuration.
- **Logging:** Use a basic setup.
- **No-downtime deployments:** Not needed early on, but containerize your code so you can.
- **Architecture:** Avoid abstraction. Keep it simple so it's easy to change later.
- **Tooling:** Use high-value tools, but avoid being overwhelmed by integrating multiple third-party tools.
- **Code Structure:** Recognize which services are likely to be the future of the company (with good extensibility) and which ones are experimental and could be thrown away in a week (put less effort into making them extensible, but they should still have tests!).

A lot of this comes from best practices, and with experience, you can reuse configurations and decisions from previous projects. These types of engineers create a tool belt of sensible defaults.
