---
title: Environment abstractions
date: 2024-11-15
description: I, as a software engineer, want nothing more than to pretend software doesn't exist.
published: true
---

When it comes to developer setups, my opinion is to use the most convenient abstraction, but recognize when to
break that abstraction.

For example, let's say I have extremely simple Python code that gets deployed to a server, but I want to
run it on my own laptop for fast iteration speed of my work.

I would make sure my local setup has the same Python version and the same library versions. At this point, it doesn't
matter to me if my local system is using the same operating system as the hardware it will be deployed to, because
the consistency is captured by Python.

But if my service requires particular system libraries, this abstraction is insufficient for me to be confident that
my local build will behave like production. I would dockerize my service to capture this.

If the service requires particular hardware, such as manipulating routing tables, I would get a machine
that runs on similar hardware and use my desktop to remote into that machine.

Each layer of abstraction that we peel away can provide greater consistency, but at the cost of complexity.
