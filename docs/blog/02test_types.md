---
title: Backend Test Levels
layout: default
parent: Blog
nav_order: 2
published: false
date: 2024-06-01
---

<!-- Focus tests where the complexity lives, target interfaces-->

I find discussions around software testing quite frustrating, for two reasons
1. Developers assume all domains are similar
2. Testing terminology isn't standardised

I'm not here to address (2), but I'll share my thoughts on software testing with a focus on (1). 
I've enjoyed working in a few different domains (robotics, mining, finance, aviation, & biochemistry),
and some aspects of testing can vary quite a bit.

But first, a quick summary to provide context on the terminology I use.

I'll be talking about testing *functionality*, other types of testing (security, load etc.) would make this post too big.
The biggest decision about these tests is *scope*, how much of your software should you test in a single test?

Tests with small scope (typically called unit tests) are quick to run and easy to investigate.
Large scope (typically called system or end-to-end tests) checks that all the components work together, and do not need to be re-written when refactoring. 
Tests in the middle (often called integration tests), provide a trade-off between small and large.

I don't agree with arguments that argue for how many tests should 
testing pyramid where there are mostly small-scope tests because they are quicker
or the testing hourglass where it is mostly small-scope and large-scope, with very few in the middle
or the inverted pyramid which focuses on large-scope tests


Do I test private functions?
Do I mock external dependencies?




Take home message: 

- Unit tests (isolated, mock internal + external)
  - good for high permutation, low dependency tests (input validation, calculations)
- Unit tests (social, mock external)
  - 
- API tests (w/ backdoor)
  - in general i don't like them, but useful if APIs don't expose methods to check or delete. 
  - allows APIs to be tested individually
  - ties to implementation, may break even if the API interface has not
- API tests (no backdoor)
  - i like these a lot
  - orchestration of APIs can be a bit harder (SetUp & TearDown)
- End-to-end tests (w/ backdoor)
  - i don't like these
- End-to-end tests (w/ API)
  - i like these
  - uses APIs to set up and teardown state, 
- End-to-end tests (no API)
