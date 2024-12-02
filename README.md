# testeranto

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

home: [adamwong246.github.io/testeranto](https://adamwong246.github.io/testeranto/)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

## tl;dr

- Do you like TDD/BDD?
- Do you love Typescript?
- Do you hate Jira?

If so, then testeranto might be the testing tool you have been looking for!

## about

Testeranto.ts an Acceptance Test Driven Development ([ATDD](https://en.wikipedia.org/wiki/Acceptance_test-driven_development)) framework. It focuses on strongly-typed tests, specified in a gherkin-like syntax. Testeranto includes a framework to help write your tests, a test runner to schedule the tests and a reporter to display the results.

## Getting started

1. Write some code.
2. Write some tests of that code.
3. Write some features of that code.
4. Write a `testeranto.mts`, which acts as a config file.
5. Launch testeranto. The test runner is now rebuilding the docs folder.
6. Commit the results of those tests.
7. Your github pages now shows your report, showing your features, linked with your test results.
8. Optionally add testeranto to your CI.

## tech of note

- esm - Testeranto uses modern js.
- typescript - tests are functions with type parameters
- puppeteer - provides access to both node and chrome runtimes
- esbuild - used to quickly generate test bundles
- graphology - used to store features within a semantic network

## 3 distinguishing features of testeranto

1. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures. These interfaces can be shared and your code is now tested through the gherkin-ish directives provided by that interface.

2. Testeranto tracks features and test results directly in the source code. You may be accustomed to using tools like Jira and Trello to define user stories and assign story points- Under Testeranto, this data lives within the code base _as_ typescript code. Features are defined as nodes within a directed graph, allowing the reporter to summarize these features and their test results.

3. Testeranto is designed for both the backend and the frontend. It leverages electron to provide both of these runtimes. Each of your tests can be executed in the backend node runtime, within the frontend chromium browser runtime, or both.

## the good parts

Your tests can be run in node, chromium, or both.

Testeranto includes a test runner which bundles and executes your tests, taking care to only run the tests which have changed.

Testeranto includes a test reporter which displays the state of your code in a web app. ([see example](https://chromapdx.github.io/kokomoBay/report.html)) This reporter can also be run locally for the developer's convenience.

Testeranto exposes an extended gherkin syntax. You can use the given-when-then lingua-franca, AND you can also use an imperative `Check` which is a bit more flexible.

Rather than the traditional method of specifying tests in plain text, Testeranto tests and features are just TS, editable and type-checkable from [github's online editor](https://github.dev/ChromaPDX/kokomoBay)!

## the bad parts

Testeranto is not designed to maximize performance.

Testeranto does not (yet!) of a means of allowing non-coders to affect changes so, as they say, "get good 💪!"

Because Testeranto is so un-opinionated that it does not provide test infrastructure. You will need to find an existing recipe or implement it yourself, though a public repo of test interfaces exists.

## How it works

Testeranto is comprised of 3 parts

1. The build process reads a config and builds the docs folder, then launches 3 esbuild build processes.

- Build the features for the html report
- Build the node-style tests
- Build the web-style tests

2. The test runner watches the output of those build processes and launches the tests as those files change.
3. A Report which links your features, your tests and the results of those tests into a handy website.

## Hybrid tests

Consider the a scenario: You have an http server which serves a frontend react component. You have multiple ways you can test this.

- A node test of the logic of the http server
- A node test of the full http server, tested over http request.
- A node test of the react component with react-test-render
- A web test of the react component rendering it to the dom.
- A node test of the logic of the server, rending the component as a paired artifact and communicated over IPC.
- A node test of the full server, invoking puppeteer to drive the browser.
- A web test, invoking the server as a shared artifact, serving http to the browser.

## API

Testeranto's main API interface is 2 functions, 1 for each run time. You must pass to this function the following arguments

- The "shape" - a TS type signature to which the other arguments must conform.
- The "input" - the test subject. The "thing that is to be tested"
- the "specification" - This is the Cucumber-style Given/When/Then steps.
- the "implementation" - This is the code which implements the "test specification" in code.
- the "interface" - The code which sets up the test.

This is designed so that each piece can be worked upon separately. You can think of each argument as the responsibility of a different member of your team.

- "Senior Engineer" handles the "shape" and "input"
- "Product Manager" handles the "specification"
- "Middle Engineer" handles the "interface"
- "Junior Engineer" handles the "implementation"

## CLI

There are 3 commands you should add to your `package.json`

```
// build the tests once
"testeranto-esbuild": "ts-node-esm testeranto.mts",

// build the tests, watching for changes
"testeranto-esbuild-dev": "ts-node-esm testeranto.mts",

// run the tests
"testeranto-puppeteer":"ts-node-esm node_modules/testeranto/dist/module/Puppeteer.js",
```
