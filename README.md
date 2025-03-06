# testeranto

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

home: [adamwong246.github.io/testeranto](https://adamwong246.github.io/testeranto/)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

## Demo

<video src="[demo.mov](https://github.com/adamwong246/testeranto/raw/refs/heads/master/demo.mov)" width="1200" height="600" controls></video>

## What is testeranto?

- Testeranto.ts an AI-first, Acceptance Test Driven Development ([ATDD](https://en.wikipedia.org/wiki/Acceptance_test-driven_development)) framework for typescript projects.
- Testeranto produces test results which can be fed to Aider.ai to automatically fix failing tests.
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures.
- Testeranto can be run in the frontend or the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.

## tech of note

- esm - Testeranto uses modern js
- typescript - tests are functions with type parameters
- puppeteer - provides access to both node and chrome runtimes
- esbuild - used to quickly generate test bundles
- aider - AI to automatically fix broken tests
