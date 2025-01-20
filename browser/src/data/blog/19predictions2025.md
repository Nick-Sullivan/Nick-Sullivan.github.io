---
title: Predictions for 2025
date: 2025-01-17
description: ""
published: true
---

**Artificial Intelligence**

- Code assistance will use voice

    AI autocomplete is fantastic when it seamlessly integrates into your workflow. However, the current process of clicking away, typing prompts, iterating, and then copying the result can be disruptive. Imagine using voice commands to interact with AI: you see an autocomplete suggestion, tell the AI what to tweak, and simply hit tab when it's ready.
    A problem with this is the potential noise in an office environment. This could actually drive a trend towards more remote work, where voice interactions with AI can be done without disturbing colleagues.

- Code assistance sandboxes

    Imagine self-contained environments where AI can verify its suggestions by compiling and running them. This would eliminate one of my biggest frustrations: when AI suggests functions that don't exist.
    I'm not sure whether this would be an interactive sandbox, where AI creates a template you can tweak until it works, or a behind-the-scenes sandbox. My bet is on the latter.

- Sponsored content

    Currently, companies are burning cash to capture market share. Once they succeed, it's inevitable they'll monetize your attention just like we've seen countless times before: with ads. Companies will pay for AI to recommend their services over others.

**Architecture**

- Design patterns for AI assistance

    When computers first started playing chess, new strategies were developed specifically to counter them, such as keeping many pieces on the board to increase complexity. Similarly, I believe the rise of AI-generated code will necessitate specific design patterns that constrain the scope of AI-written code, ensuring it can be used safely.

- Infrastructure as diagrams

    I love infrastructure as code. Love it, love it, love it. But I've found myself creating new projects by combining components from other projects. In most cases, I could map each component to a symbol and draw these components together (a queue points to a service, a service points to a database, etc.). 
    While plenty of low-code/no-code solutions exist, most opt for a lock-in monetization strategy, which I see as the biggest reason none have hit mainstream. There's just too much risk that we would hit a wall that the tool cannot support, and we would have to drop the tool and start again. It is inevitable that our tooling moves towards low-code/no-code, but I believe a different financial model will make it work. And I believe architectural components are the most likely to be adopted first.

**Data**

- A combined analytical and transactional databases will make waves
    
    It's a common pattern to use transactional databases for fast operation of your product, with a periodic ingestion to an analytical database for reporting. I would love a single database service that abstracts away this process, allowing for queries in efficient-but-slightly-old mode or up-to-date mode.

**Culture**

- Fewer new tools & languages

    There are two reasons for this. First, people are becoming more reliant on AI to learn, and AI is unlikely to recommend tools that lack sufficient popularity. Second, as we increasingly use AI to create low-level components, there's less demand to make these components user-friendly.
