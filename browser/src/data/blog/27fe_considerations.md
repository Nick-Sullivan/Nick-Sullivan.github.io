---
title: "Frontend infrastructure part 1: considerations"
date: 2025-02-18
description: ""
published: false
---

When I was learning about frontend architectures, I struggled to find an article that articulated frontend architecture concepts, encompassing the factors to consider and opinions on available frameworks.

So after a bit of research, I've written a post I would have liked to have read.

## Considerations

Before we get into any technical details, I want to talk about the key factors one should keep in mind when thinking about the architectures.

- Initial load time

A fast initial load can have a big impact on user experience and retention. It's particularly important if you want your site listed high up on search engine results. Search engine rankings are so highly sought after that there is an entire Search Engine Optimisation (SEO) industry. Initial response time is an important contributer to a search engine's rankings.

- Subsequent load time

When users interact with the web page, it may require additional data or loading of other pages. For highly-reactive sites such as google maps, it can be important for these re-renders to happen quickly to provide a smooth user experience.

- User customisation

It may be necessary to show different content based on the requesting user. It could be based on geographic location, permissions, or state (such as a shopping cart).

- Simplicity & Cost

As with any project, money is a concern, and simple approaches are faster to implement and easier to maintain. 


[View the next post in this series here.](/blog/28fe_rendering)
