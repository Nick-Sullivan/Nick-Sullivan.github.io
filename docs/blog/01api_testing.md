---
title: API Testing Orchestration
layout: default
parent: Blog
nav_order: 1
published: false
---

I'm a big fan of API tests. While they don't provide the granularity or isolation of unit tests, or have the depth of end-to-end tests, they are a fantastic middleground. Nothing gives me more confidence to refactor than an effective API testing suite, while being relatively simple to maintain.
But there is one thing about API testing that has never felt quite right to me. It's how testing frameworks handle dependencies. 

Consider an example of simple HR software, with APIs to control the registration of users in organisations. 
We want to test that the APIs can create and delete new organisations/users.

The standard approach is for each test to set up the state, perform tests, then tear down once the test is finished. One way of doing this in python is using the `pytest` library:

```python

org_name = "TestCaseOrg"
user_name = "TestCaseUser"

@pytest.fixture(autouse=True)
def setup():
    organisation_api.create(org_name)
    yield
    organisation_api.destroy(org_name)

def test_can_create_user():
    response = user_api.create(user_name, organisation=org_name)
    assert response.ok()

def test_can_destroy_user():
    response = user_api.destroy(user_name, organisation=org_name)
    assert response.ok()
```

There are parts about this that doesn't feel quite right. Firstly, if the organisation API has a problem, then all dependent tests are going to hit the server and face the same problem. If there are a lot of dependencies, there will be a lot of errors. I've had cases where I was waiting 30 minutes for a full test suite to finish, only to be discover every test had the same error, that a common dependency failed. That's something I would want to see immediately.
Secondly, these tests have bad behaviour if executed independently. The `destroy` test would fail, and the `create` test would leave an unclean state. When developing, I repeatedly run a subset of tests pointing at a locally hosted server, so that I can be confident in the changes before committing them. If the tests can't safely be run independently, it's going to be a cause of pain for me.

What I want from API Testing code:
 1. Skipping/Auto-failing tests if their dependencies fail
 2. Able to run individual tests
 3. Clean, low-boilerplate code, using an existing test framework

I'm going to explore a few options.


### Option 1 - Combine the tests

Test frameworks typically stop as soon as an exception is raised, so one way to enforce dependent tests being skipped is to combine them into the same test. For example:
```python
def test_can_create_and_destroy_user():
    response = user_api.create(user_name, organisation=org_name)
    assert response.ok()
    response = user_api.destroy(user_name, organisation=org_name)
    assert response.ok()
```

If `create` fails, the `destroy` will never be called. I actually quite like this for create/destroy, because I would never want to run one without the other. But I wouldn't use this for anything more, as it would lead to one giant test, which fails our criteria for running tests individually.

### Option 2 - Run tests sequentually, skip on failures

If we orchestrated the tests to run in topological order (tests run after all their dependent tests have run), we could skip all remaining tests after a single test fails.
The problem to be careful of here is that not all tests are dependencies. In our example, if the API to edit an organisation fails, that has no impact on tests for users. Running tests takes time, so I want to see all the unique errors in one execution.

## Option 3 - Generate a directed acyclic graph

Topological execution is not a new problem, it's common in software where steps depend on the completion of previous steps, such as CICD (e.g. build, test, deploy). This is usually solved by generating a DAG. One of the main strengths of a DAG is that we can run independent steps in parallel. Unfortunately, this would require a lot of control in test orchestration that most test frameworks do not expose.

## Implementation

In pytest, we can control the order of the tests, but as far as I can tell there isn't a way to control which tests are executed in parallel. So I've opted for a solution where the tests declare their dependencies, and if that dependency has failed, then the test is skipped.

First the test annotations:

```python
import pytest
from test.fixture import Fixture
from api import organisation_api


class TestOrganisationSetup(Fixture):
    ORG_NAME = "TestCaseOrg"
    
    def test_setup_and_teardown(self):
        self.setup()
        self.teardown()

    @classmethod
    def setup(cls):
        response = organisation_api.create(ORG_NAME)
        assert response.ok()

    @classmethod
    def teardown(cls):
        response = organisation_api.destroy(ORG_NAME)
        assert response.ok()


class TestOrganisation(Fixture):
    # I wanted to reference the test classes directly, but other files would require an import statement. 
    # This causes pytest to percieve the import as another set of tests, leading to duplicate execution.
    depends_on = ["TestOrganisationSetup"]

    @pytest.fixture(autouse=True, scope="class")
    def setup(self):
        TestOrganisationSetup.setup()
        yield
        TestOrganisationSetup.teardown()

    def test_marking_as_paid_subscription(self):
        response = organisation_api.mark_as_paid_subscription()
        assert response.ok()
```

The pytest hook in `conftest.py` to enforce our new ordering, and to mark failures.

```python
import pytest
from test.fixture import Fixture, order_by_dependency


def pytest_collection_modifyitems(config, items):
    order_by_dependency(items)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_call(item):
    output = yield
    Fixture.check_failure(item, output)
```

And now the Fixture class

```python
import pytest


class Fixture:
    depends_on = []
    failed = set()

    @classmethod
    def check_failure(cls, item, output):
        if output.exception and issubclass(item.cls, Fixture):
            cls.mark_failure(item.cls.__name__)

    @classmethod
    def mark_failure(cls, fixture_name):
        cls.failed.add(fixture_name)

    @classmethod
    def has_failed(cls, fixture_name):
        return fixture_name in cls.failed

    @pytest.fixture(autouse=True, scope="session")
    def check_dependencies(self):
        # Skips the test if the dependency has failed. The test can be run if the dependency passes, 
        # or if we do not run the the dependency.
        for dependency in self.depends_on:
            if self.has_failed(dependency):
                self.mark_failure(self.__class__.__name__)
                pytest.fail(f"Dependency {dependency} has failed")


def order_by_dependency(items):
    # Order the classes so that dependencies are first
    classes = {item.cls.__name__: item.cls for item in items}
    cls_depends = {}
    for name, cls in classes.items():
        cls_depends[name] = [d for d in getattr(cls, "depends_on", []) if d in classes]

    cls_order = list(topological_sort(list(cls_depends.items())))

    # Order tests according to their classes
    new_items = []
    for cls in cls_order:
        new_items.extend([item for item in items if item.cls.__name__ == cls])

    # Update the input list
    items[:] = new_items


def topological_sort(source):
    # Copy this from StackOverflow

```


### Conclusion

While the implementation ticks my boxes, but still feels a little heavy. It requires sequential tests, and enforces a class-based structure.

I'm not sure how much cleaner it can be without the framework considering the orchestration as a directed acyclic graph. Most API testing frameworks are slight extensions on unit-testing frameworks, which by their nature should have completely indepedent tests.


### Other notes

I also tried this in C#, but without success.
- NUnit can't control ordering
- MSTest can't control ordering
- XUnit, setup/teardown is called once for each test, excessive boilerplate to control tests per class


