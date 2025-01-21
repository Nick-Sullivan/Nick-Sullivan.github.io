---
title: Domain culture
date: 2025-01-21
description: "Every industry has a blind spot"
published: true
---

I've had the unique opportunity to dive into the tech world across various domains, and it's fascinating to see how each domain's culture shapes its software development practices.
Domain specialists bring a finely-tuned perspective and problem-solving approach tailored to their field. This can lead to innovative solutions in software development, but it can also create blind spots that need to be navigated carefully. 

These are my observations from working in a few startups and scaleup.

In mining, the landscape is messy. Literally, you're in the middle of nowhere, covered in dust, with giant holes in the ground that get bigger every day. But also figuratively. Metal prices fluctuate, contracts adjust based on the changing landscape, and a third of the staff fly in and fly out. Because of this, mining has a strong experimentation culture. With the landscape changing so frequently, it's a good idea to try out new approaches to see if they're a better fit.
When I was working in MiningTech, the product team was made up of these mining experts, and they brought an experimentation culture with them. For a startup, this worked very nicely, given that any startup is basically a big experiment.
But there was a downside as well. In mining, failed experiments tend to fall away by themselves. An idea that doesn't add much value won't be passed on to the next shift, or staff will intentionally ignore it whenever their supervisor isn't looking. This does not apply in tech. We were maintaining lots of features, but we didn't have any observability on which features were valuable. We argued to the company for the ability to add it, but for a long time, it was considered lower priority. Eventually, we were able to add it and discovered that 30% of our work was basically unused. Unfortunately, the 30% was not evenly spread. It was a bitter day for some to discover that nobody was using the product features they built and maintained for the last year, delivering no value.

In finance, specialists are highly valued. Every problem is meticulously broken down into a series of steps, with each step assigned to someone who focuses solely on that task. This ensures accountability, as any mistake can be traced back to an expert in their specific area. Many financial problems are well-suited to this "greedy" style of problem-solving.
When I was working for a FinTech, this approach influenced the software team. Despite being relatively small (~15 software engineers), responsibilities were highly granular. Infrastructure devs handled cloud components, front-end devs managed the UI, back-end devs took care of APIs, quality assurance focused on testing, bug-fix devs addressed issues, and reliability devs maintained site uptime. This structure makes sense for large companies where coordination is a significant challenge. However, for a small team, the overhead of hand-offs and the lack of a single point of ownership slowed development.
Fortunately, we were able to implement significant changes, transitioning to teams that owned vertical slices of the product, with more end-to-end responsibility. This shift improved efficiency and accountability, allowing us to move faster and deliver better results.

In biochemistry, everyone operates within their own silo. The domain is *very* complex, requiring each scientist to have a Ph.D. in their specific area. This complexity poses challenges for software development due to the lack of standardisation. Scientists often don't need to communicate detailed information across different areas, and their research processes frequently change as new discoveries are made.
On the upside, there's a strong culture of spending sufficient time to avoid mistakes. It takes weeks for bacteria in petri dishes to grow, so spending an extra hour to ensure optimal conditions is worth it. This meticulous approach is beneficial for software development as well, provided engineers don't abuse it. The business is receptive to investing more time and resources to build software that minimizes bugs and eases future development.
