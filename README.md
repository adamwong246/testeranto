# testeranto

## the AI powered BDD test framework for typescript projects

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

demo video: [youtube](https://www.youtube.com/embed/WvU5xMqGi6Q)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example test report: [chromapdx.github.io/kokomoBay](https://chromapdx.github.io/kokomoBay/testeranto/index.html)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

## What is testeranto?

- Testeranto produces test results which can be fed to Aider.ai to automatically fix failing tests.
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures.
- Testeranto can be run in the frontend or the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.
- Testeranto is _reasonably_ efficient. It is less performant than other similar js testing libraries.

## tech of note

- esm - Testeranto uses modern js
- typescript - tests are functions with type parameters
- puppeteer - provides access to both node and chrome runtimes
- esbuild - used to quickly generate test bundles
- aider - AI to automatically fix broken tests

## Do's and Don't

When writing your test, be careful when using platform specific features, like "fs" on node, or "window" in the browser. If you need to write to a file, or to log information, use the `utils`. Instead of platform specific libraries, like node's "assert", use a cross-platform alternative like "chai".

## Platforms

Testeranto runs tests in multiple runtimes. You can run the same test (more or less) in multiple contexts. Depending on your test subject, not all may be applicable

1. Node - the test is run in node v8 via fork.
2. Web - the test is run in chrome, in a page. If you code relies upon `window` or `document`, you should use this style.
3. Pure - the test is dynamically imported into the main thread. It will not have access to IO (console.log, etc) but it is more performant.
4. WebWorker - the test is tested in a web worker, in the browser, but not in a page.
