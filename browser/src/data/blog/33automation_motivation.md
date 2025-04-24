---
title: "Automation motivation"
date: 2025-04-24
description: "Truth, like gold, is to be obtained not by its growth, but by washing away from it all that is not gold. -Tolstoy"
published: true
---

I once spent considerable effort (years) at a job, pushing for closer interaction between those who designed the product, those who built the product, and those who tested the product.

When I joined, it was an "over-the-fence" system, where each team does their piece and tosses it to the next team. This creates quite obvious problems: How can designers know what the system supports? How can engineers quickly verify what they built works? How can testers do their job efficiently if the system isn't built to be testable? This approach demanded an enormous amount of manual testing - there was 1 quality assurance engineer for every 3 software engineers, largely performing repetitive manual checks.

I found it quite baffling. I'm never satisfied that I've finished building something until I personally test it thoroughly. I won't even start work until I understand why it adds value, and am convinced it's a good approach (or have said my piece, then disagreed and committed). 

So I made it my personal mission to collaborate with the testing team to create an automated test suite that any engineer could understand, execute, and contribute to. Once we established patterns and a few keen engineers were routinely contributing, I pushed for its adoption across the entire engineering team. Around half of the developers embraced it, finding it useful for catching issues early & avoiding re-work. The rest pushed back and avoided it, clinging to their reliance on the testing team to catch all their errors.

Some time later, I took extended leave to live and work in London. During my absence, the tech industry underwent significant transformation, most notably the evolution of AI coding assistance from early adoption to mainstream practice. I was regularly using AI regularly for ideation, code completion, and debugging. I approached it with a healthy dose of scepticism, but discovered that with clear boundaries, it dramatically accelerated development.

When I returned to Adelaide, the automated tests had gone stale. Many engineers who championed them had left the company, leaving only a handful who knew how to run them. Culturally, the pendulum had swung back to "let the testers find all the issues." Simultaneously, there was a push to incorporate AI assistance into the development workflow. To my surprise, I witnessed the same adoption pattern as with the automated tests: a small vanguard experimenting with different models in practical ways, roughly half using it because they were shown its benefits, and the remainder actively resisting change.

This experience gave me three takeaways:

1. **The innovation adoption curve is real** - A small few will actively pioneer improvements to their craft, some will upgrade their skills when shown the way, and others stubbornly resist change. The pioneers help themselves, the middle cohort needs bottom-up structure and concrete examples for buy-in, and the rest require top-down mandates. For test automation, I secured buy-in from the first two groups and support from the business, but I should have convinced the CTO to declare these improved processes mandatory, not optional.

2. **Half-measures lead to exodus** - Without whole-company buy-in, the most motivated staff inevitably become jaded and leave. We don't want to be on "let's work smarter" crusades. Our motivation is selfish: I hate manual testing, I don't enjoy debugging, and I crave a reliable safety net that lets me work rapidly.

3. **Top talent flees inefficiency** - The best engineers have a visceral, allergic reaction to inefficiency. They hunger for interesting, valuable work. Deny them this, and they'll find another job, leaving you with people who are happy working slowly.
