# testeranto

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

home: [adamwong246.github.io/testeranto](https://adamwong246.github.io/testeranto/)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

## about

1. Testeranto.ts an AI-first, Acceptance Test Driven Development ([ATDD](https://en.wikipedia.org/wiki/Acceptance_test-driven_development)) framework for typescript.
2. Testeranto includes a library of common patterns to help write your tests and a test runner to schedule the tests.
3. Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures. These interfaces can be shared and your code is tested through the gherkin-ish directives provided by that interface.
4. Testeranto can be run in the browser frontend or the node backend, or both, and Testeranto can be used to test _anything_ that can be bundled with esbuild. Testeranto leverages puppeteer to provide both of these runtimes.
5. Testeranto produces test results which can be fed to Aider.ai to automatically fix failing tests

## tech of note

- esm - Testeranto uses modern js
- typescript - tests are functions with type parameters
- puppeteer - provides access to both node and chrome runtimes
- esbuild - used to quickly generate test bundles
- aider - AI to automatically fix broken tests
