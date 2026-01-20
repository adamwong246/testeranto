# testeranto

## What is it?

Testeranto lets you vibe code large, real-world polyglot codebases via BDD tests. It currently supports node, web, python and golang. By wrapping your code in gherkin semantics, you specify the behavior of your components. The tests are run and the output of those tests are passed into the context of your favorite LLM. Testeranto edits your code and tests in congruence with your documentation and then runs the tests again. Once all the tests pass, the results are committed to the repo. In short, testeranto is my attempt to automate my job. It allows a Product Manager to create a jira ticket and, within minutes, recieve a well-tested pull request addressing that ticket and with almost zero human intervention.

In more conrete terms, testeranto is
- a test runner that uses docker as a multi-language process manager
- a VS code extension
- integrates static tests, unit tests, integration tests and source code into focused Aider sessions.
- turns github issues, BDD specs and markdown documentation into packaged artifacts and human readable test reports.

## Philosophy

The common pattern of testing and packaging software is 
1) static tests of entire codebase
2) unit tests  of entire codebase
3) packaging
4) integration tests of entire codebase

Testeranto reverses this pattern

1) Breakup the application into "slices"
2) Package each
3) static tests of input files
4) unit tests of input files
5) run testeranto tests of input files
6) packaging 
7) integration tests of entire codebase

By packaging a piece of software first, we can correlate the output aritifacts to it's specific input source files. We can then run static tests and unit tests upon this set of input files. The results of all these tests, plus the BDD test results, are given to an LLM. This allows focus the LLM's context entirely around 1 slice of an application.

