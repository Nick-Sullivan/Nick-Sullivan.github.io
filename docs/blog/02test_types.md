---
title: Backend Test Levels
layout: default
parent: Blog
nav_order: 2
published: false
---

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
