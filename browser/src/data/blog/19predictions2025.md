---
title: Predictions for 2025
date: 2024-01-17
description: ""
published: true
---

**Artificial Intelligence**

- Code assistance will use voice
AI autocomplete is good when it doesn't break your flow. What does break my flow
is clicking clicking away, typing a prompt, iterating, and copying the result once I'm happy with it. Using voice would allow me to see an autocomplete, tell AI what needs to change, then hit tab once I'm happy with it.
The biggest barrier to this is the noise it would create in an office setting. Maybe it would create a push for more working from home?

- Code assistance sandboxes
Self contained environments that AI can use to verify their suggestions can compile and run. It would catch the biggest sources of my frustration, when it suggests functions that don't exist.
I'm not sure whether this would be an interactive sandbox (AI creates the template, and you can tweak until it works) or if it would be a behind-the-scenes sandbox. I predict the latter.

- Sponsored content
Right now, companies are losing money trying to gain market share. Once they have it, there's no reason to believe it won't monetize your attention in a way we've seen countless times before. Ads. Companies will pay for AI to recommend their service over other services.

**Architecture**

- Design patterns for AI assistance
When computers were first being used to play chess, strategies were invented specifically to play against them (in short, keeping lots of pieces around so there were many options to consider). Likewise, I believe the rise of AI produced code will call for specific design patterns that constrain the scope of AI written code, so that it can be used safely.

- Infrastructure as diagrams
I love infrastructure as code. Love it love it love it. But I've found myself creating new projects by combining components from other projects. I think in *most* cases I could map each component to a symbol, and draw these components together (a queue points to a service, a service points to a database etc.). And while plenty of low-code/no-code solutions exist, most opt for a lock-in monetisation strategy, which I see as the biggest reason none have hit mainstream. There's just too much risk that we would hit a wall that the tool cannot support, and you have to drop the tool and start again. It is inevitable that our tooling moves towards low-code/no-code, and I believe architectural components are the most likely to be adopted first.

**Data**

- A combined analytical and transactional databases will make waves
It's a common pattern to use transactional databases for fast operation of your product, with a periodic ingestion to an analytical database for reporting. I would love a single database service that abstracts away this process, allowing for queries in efficient-but-slightly-old mode or up-to-date mode.

**Culture**

- Fewer new tools & languages
There are two reasons for this. The first is that people are becoming more reliant on AI to learn, and AI is unlikely to recommend tools that don't have sufficient popularity. The second is that as we increasingly use AI to create low-level components, there's less demand to make these components user friendly.
