---
title: Software testing guidelines
date: 2025-01-16
description: Out with the pyramid, in with the rhombic dodecahedron.
published: true
---

I find online discussions about software testing quite frustrating for two main reasons:

1. Developers assume all software systems are similar.
2. Testing terminology isn't standardized.

While I'm not here to address the second point, I want to share my thoughts on software testing with a focus on the first.

First, let's clarify some terminology. I'll be discussing testing _functionality_. Other types of testing (like security or load testing) would make this post too lengthy. The key difference in test categorization is _scope_: how much of your software you test in a single test.

- **Unit tests**: These have a small scope, checking small blocks of logic. They are quick to run, maintain, and investigate failures.
- **System or end-to-end tests**: These have a large scope, checking that all components work together.
- **Integration tests**: These fall in the middle, providing a trade-off between small and large scope.

A quick search will reveal numerous articles about the testing pyramid, suggesting mostly unit tests and a few system tests. But the next article might argue for an inverted pyramid with mostly system tests. Then another group might advocate for an hourglass, or a diamond shape.

I don't care about what shape you use. Here are the guidelines I follow for designing tests:

1. **Target interfaces**

  Systems evolve, and rewrites are inevitable. There will be times when you need to rewrite tests because the function they are calling no longer exists. This is not only time-consuming but also risky, as you might introduce new problems while rewriting the test. To minimize this, focus the majority of your tests on interfaces: prioritize public functions over private ones, API endpoints, and the UI. This approach ensures that your tests remain relevant and effective, even as the underlying code changes.

2. **Test where the complexity is**

  For a project, we had a simple frontend and backend. A website called an API that stored files in an object store and metadata in a database, with some logic for granular permissions. All our tests were system tests because they gave us confidence that everything worked. Unit tests wouldn't have added much value since each component was simple. Our tests formed an inverted pyramid shape.
   
  For another project, the API was very complex. One endpoint created an elevation map, downloading millions of GPS data points, rejecting outliers, grouping into cells, detecting cliffs, and applying smoothing. We had a few integration tests at the API level, but it was hard to know if it was performing correctly from the output. We relied heavily on unit tests to check each step in the process. Our tests formed a pyramid shape.
   
  At a biotech startup, the most complex part of the system was the database models. The number of users was minimal, the website was simple, and there was little logic in the APIs. However, modeling biological and chemical domains while continuously improving the research process was very complex. To ensure our software worked, all our tests used a local relational database seeded with data. We didn't mock or fake the database connection because it wouldn't have given us much confidence. Our tests formed a diamond shape.

3. **Design your system to be testable**

  When developers first try writing unit tests, they often find it messy and difficult. They are then guided to refactor their implementation to ease testing by splitting out responsibilities and minimizing dependencies, making unit tests simpler to write. However, the same principle should apply to other types of tests. If writing system or integration tests is messy and difficult, it's a sign that the system could be better designed.

  For example, if you have a multi-page form and want tests on each page, make it possible to jump to the page under test. It's slow to wait for each page to render and be filled in completely, and it can block testing if an earlier page is down. Of course, it's sensible to still have at least one test that goes through all the pages together.

This is why I strongly believe that the team responsible for building a product should also be responsible for writing tests for that product. The pain of a product's shortcomings should be felt by those who have the power to change it.
