# testeranto

🚧 this project has not yet reached a stable api 🚧

home: [adamwong246.github.io/testeranto](https://adamwong246.github.io/testeranto/)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example report: [adamwong246.github.io/testeranto/dist/report.html](https://adamwong246.github.io/testeranto/dist/report.html)

## about

testeranto an Acceptance Test Driven Development ([ATDD](https://en.wikipedia.org/wiki/Acceptance_test-driven_development)) framework. It focuses on testing features which cross application boundaries using strongly typed tests and specified in a gherkin-like syntax.

## what is Acceptance Test Driven Development?

ATDD is the latest evolution of BDD and TDD methodologies. Where TDD tests are written for the benefit of the developer and BDD tests are written from the perspective of the user, ATDD uses executable tests which resolve to acceptance critera and draws from a larger range of stakeholders.

## 3 distinguishing features of testeranto

0. Testeranto can execute many types of tests. It abstracts away the differences between a "small" unit test and a "big" integration test. Features can thus be tracked across many test suites.

1. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures. These interfaces can be shared and your code is now tested through the gherkin-ish directives provided by that interface.

2. Testeranto tracks features and test results directly in the source code. You may be accustomed to using tools like Jira and Trello to define user stories and assign story points- Under Testeranto, this data lives within the code base _as_ typescript code. Features are defined as nodes within a directed graph, allowing the reporter to summarize these features and their test results.

## tech of note

- typescript - tests are functions with type parameters
- esbuild - used to quickly generate test bundles
- graphology - used to store features within a semantic network

## the good parts

Testeranto includes a test runner which bundles and executes your tests, taking care to only run the tests which have changed. It is designed to run most tests in parallel, though it has support for tests which require a shared resource, like a port.

Testeranto includes a test reporter which displays the state of your code in a web app. ([see example](https://adamwong246.github.io/testeranto/dist/report.html)) This reporter can also be run locally for the developer's convenience.

Testeranto can very feasibly be used to test any code- a ruby HTTP server, for example. While testeranto itself and it's test implementations are typescript, the subject of the test can be any stateful software.

Testeranto allows you to test the same code in multiple ways. You can test your unbundled TS in a unit-test fashion, and also bundle that same code, then testing it through a interface like puppeteer, fetch, curl, etc.

Testeranto exposes an extended gherkin syntax. You can use the given-when-then lingua-franca, AND you can also use an imperative `Check` which is a bit more flexible.

testeranto is very lightweight and un-opinionated. It is comprised entirely of <2000 lines of typescript, with only a few basic dependencies.

Rather than the traditional method of specifying tests in plain text, Testeranto tests and features are just TS, editable and type-checkable from [github's online editor](https://github.dev/adamwong246/testeranto)!

## the bad parts

Testeranto does not (yet!) of a means of allowing non-coders to affect changes so, as they say, "get good 💪!"

Testeranto is not for testing pure functions. It's designed only to address _stateful_ logic.

Testeranto prefers TS and to be leveraged to it full potential requires at least some proficiency with the language.

Because Testeranto is so un-opinionated that it does not provide test infrastructure. You will need to find an existing recipe or implement it yourself, though I plan to have some sort of public repo of test interfaces someday 😅

### examples of test infrastructures

- [Testing a class](/tests/Rectangle/Rectangle.test.ts)
- [Testing a Redux store](/tests/Redux+Reselect+React/app.redux.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/app.reduxToolkit.test.ts)
- [Testing an http server with node's fetch](/tests/httpServer/server.http.test.ts)
- [Testing an http server with puppeteer](/tests/httpServer/server.puppeteer.test.ts)
- [Testing a Classical react component](/tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx)
- [Testing a Classical react component, bundled with esbuild and tested with puppeteer with screenshots](/tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx)

### road map

- replace "cancelable-promises" with pm2
- fix "checks" aka tdd/bdd
- improve type signatures
- hunt down many ts "ignore-s" and "any-s"
- separate example from library
