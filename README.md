# testeranto

home: [adamwong246.github.io/testeranto](https://adamwong246.github.io/testeranto/)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

## tl;dr

- Do you like BDD?
- Do you love Typescript?
- Do you hate Jira?

If so, then testeranto might be the testing tool you have been looking for!

## about

Testeranto.ts an Acceptance Test Driven Development ([ATDD](https://en.wikipedia.org/wiki/Acceptance_test-driven_development)) framework. It focuses on strongly-typed tests, specified in a gherkin-like syntax. Testeranto includes a framework to help write your tests, a test runner to schedule the tests and a reporter to display the results.

## 2 distinguishing features of testeranto

1. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures. These interfaces can be shared and your code is now tested through the gherkin-ish directives provided by that interface.

2. Testeranto tracks features and test results directly in the source code. You may be accustomed to using tools like Jira and Trello to define user stories and assign story points- Under Testeranto, this data lives within the code base _as_ typescript code. Features are defined as nodes within a directed graph, allowing the reporter to summarize these features and their test results.

## tech of note

- typescript - tests are functions with type parameters
- esbuild - used to quickly generate test bundles
- graphology - used to store features within a semantic network

## the good parts

Testeranto includes a test runner which bundles and executes your tests, taking care to only run the tests which have changed. It is designed to run most tests in parallel, though it has support for tests which require a shared resource, like a port.

Testeranto includes a test reporter which displays the state of your code in a web app. ([see example](https://chromapdx.github.io/kokomoBay/report.html)) This reporter can also be run locally for the developer's convenience.

Testeranto exposes an extended gherkin syntax. You can use the given-when-then lingua-franca, AND you can also use an imperative `Check` which is a bit more flexible.

Rather than the traditional method of specifying tests in plain text, Testeranto tests and features are just TS, editable and type-checkable from [github's online editor](https://github.dev/ChromaPDX/kokomoBay)!

## the bad parts

Testeranto does not (yet!) of a means of allowing non-coders to affect changes so, as they say, "get good 💪!"

Testeranto is not for testing pure functions. It's designed only to address _stateful_ logic.

Testeranto prefers TS and to be leveraged to it full potential requires at least some proficiency with the language.

Because Testeranto is so un-opinionated that it does not provide test infrastructure. You will need to find an existing recipe or implement it yourself, though I plan to have some sort of public repo of test interfaces someday 😅
