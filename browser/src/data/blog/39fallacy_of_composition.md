---
title: "Fallacy of composition"
date: 2026-01-04
description: "Why good ideas can get rejected when we analyze their parts in isolation."
published: true
---

Over-analysis of a good idea can lead to its rejection, not because the idea is flawed, but because its individual parts are hard to justify on their own.

Wanting to be data-driven in our decisions is in general a good idea, but can lead to underappreciating hard-to-quantify details or getting stuck in time-consuming research.

### A kitchen analogy

Imagine working as a cook in a kitchen. There are dirty pots and pans scattered around, food stains on the counters, cutlery in random drawers. You have an immediate urge to clean it all up before cooking.

But this would take a long time, so you have to justify this decision. You're hit with well-intentioned questions:

- _How much faster will you be if you knew where all the cutlery was?_ (Maybe 10 minutes saved per dish?)
- _Won't you become faster over time because you'll learn where we store things?_ (It will never be as fast as an organised kitchen, and it's annoying. Also, every new cook will face the same pain.)
- _But we don't hire that often, and they need to be learning how we operate anyway_ (Okay but we'll struggle with retention of our best cooks because I don't think you realise how annoying it is to work like this, and we still have a risk of poisoning customers)
- _What are the odds someone will become sick, and how sick will they be?_ (I don't know, it's nonzero and cleaning it would make this problem go away.)
- _But we can't make big decisions without some sort of data._ (Okay, I guess I'll go do research on food safety. Let's say it's a 1% chance of gastro?)
- _We're willing to take that chance for now. It's better to have a small number of sick customers than to have no customers at all_ (But how will we keep track of this risk? Post-it notes on the pots with a risk rating? Will we remember we have this landmine as our standards increase over time?)

Each question seems reasonable in isolation. But together, they create paralysis. The simple act of cleaning the kitchen, something that would obviously make everyone more efficient and safer, gets bogged down in analysis.

This is the same pattern I've seen with clean codebases. A clean codebase has fewer bugs and is faster to build on. Yet when you try to advocate for technical debt cleanup, you may face the same exhausting justification process.

### How to address this

The solution depends on the scale of the change:

**Smaller changes**: Clean-as-you-go. If you use a pot, clean it before and after, and put it in its right place. No justification needed, just make it part of your process.

**Medium changes**: Bundle changes together. Working on a new feature? What quality-of-life improvements will make it safer or faster to deliver your project? Do them first as part of the same work.

**Bigger changes**: Get buy-in and treat it as its own project. Make a compelling case for the whole, not the parts. Shout its benefits from the rooftops.

The key is recognizing when you're falling into the trap of justifying individual components. Sometimes the whole really is greater than the sum of its parts, and that should be enough.
