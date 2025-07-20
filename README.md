# testeranto

## The AI-powered BDD test framework for TypeScript projects

#### 🚧 Testeranto is still under development but is not ready for production yet. I am rapidly working to release a beta ASAP. If you are interested in joining this beta program, please contact me. 🚧

- README: [https://adamwong246.github.io/testeranto/](https://adamwong246.github.io/testeranto/)
- demo: [youtube](https://www.youtube.com/embed/WvU5xMqGi6Q)
- source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)
- npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)
- example repo: [testeranto-starter](https://github.com/adamwong246/testeranto-starter)
- tests report: [adamwong246.github.io/testeranto/testeranto](https://adamwong246.github.io/testeranto/testeranto/index.html)

## What is testeranto?

- Testeranto produces test results that can be fed to Aider.ai to automatically fix failing tests.
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you to wrap your code with a semantic interface that is based on TS type signatures.
- Testeranto can run tests in the frontend, the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.
- Testeranto connects "features" to "tests". This allows the AI to read feature documentation from external systems, like Jira.
- Testeranto generates test results as a static website that can be easily deployed to GitHub Pages.
- Testeranto uses esbuild to bundle its tests. The result is used to refine the list of files added to the AI's context. **The consequence of this is that you can fit all relevant files, and only the relevant files, into the LLM's context.**

## Key Technologies

|            |                                        |
| ---------- | -------------------------------------- |
| ESM        | Modern javascript tooling              |
| TypeScript | Strongly-typed test definitions        |
| Puppeteer  | Cross-runtime testing (Node & Browser) |
| esbuild    | Fast test bundling                     |
| Aider.ai   | AI-powered test fixing                 |
| ESLint     | Static analysis of test files          |
| tsc        | Type checking of test files            |

## Quick Start

1. Install testeranto:

```bash
npm install testeranto
```

2. Create a test file (e.g., `rectangle.test.ts`):

```typescript
import { Given, When, Then } from "testeranto";

type Rectangle = { width: number; height: number };

const RectangleSpec = (Suite, Given, When, Then) => [
  Suite.Default("Rectangle tests", {
    test1: Given.Default(
      ["Basic rectangle operations"],
      [When.setWidth(5), When.setHeight(10)],
      [Then.getWidth(5), Then.getHeight(10)]
    ),
  }),
];
```

3. Run the tests

To start testeranto in dev mode, build your tests in one terminal and execute them in another

```bash
# Terminal 1 - Build in watch mode
yarn t-build rectangle.test.ts yourProject dev

# Terminal 2 - Run in watch mode
yarn t-run rectangle.test.ts yourProject dev
```

or build and run your tests only once

```bash
yarn t-build rectangle.test.ts yourProject once && yarn t-run rectangle.test.ts yourProject once
```

## Runtime Platforms

|                                          | You should use this runtime for...                                                                      | Important differences                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Node** : node V8 with fork             | testing backend code, Node APIs (like `fs` and `crypto`), or anything needing filesystem access         | has access to the filesystem and io                                                                        |
| **Web** : chrome browser                 | testing frontend code, anything that uses `document` or `window`, UI interactions, or visual regression | can take screenshots/recordings                                                                            |
| **Pure** : node v8, dynamically imported | testing code that can run on both node-v8 and the browser                                               | Very similar to "Node" but has no IO access and thus no console.log. This runtime is theoretically faster. |

## CLI Commands

|                                       |                                               |
| ------------------------------------- | --------------------------------------------- |
| `yarn t-init`                         | Create a new testeranto project               |
| `yarn t-build <YOUR_TESTS> dev\|once` | Build test bundles (watch or single-run mode) |
| `yarn t-run <YOUR_TESTS> dev\|once`   | Run tests (watch or single-run mode)          |
| `yarn t-report`                       | Launch test report server                     |
| `yarn t-aider`                        | Fix failing tests with AI                     |

## Example workflow:

```bash
# Initialize project
yarn t-init

# Write tests in test/*.test.ts

# In terminal 1 - Build tests (watch mode)
yarn t-build test/rectangle.test.ts dev

# In terminal 2 - Run tests (watch mode)
yarn t-run test/rectangle.test.ts dev

# Or for single-run mode:
yarn t-build test/rectangle.test.ts once
yarn t-run test/rectangle.test.ts once

# Get AI help with failures
yarn t-aider
```

## Aider

Testeranto generates a "prompt" alongside test results. This prompt is passed to aider as input.

```
// input src files that can be edited by Aider
/add test/node.ts

// test report files that inform aider but should not be edited
/read testeranto/reports/allTests/node/test/node/tests.json
/read testeranto/reports/allTests/test/node/node/lint_errors.json
/read testeranto/reports/allTests/test/node/node/type_errors.txt

// A list of features which can inform aider.
/load testeranto/reports/allTests/node/test/node/featurePrompt.txt

// tell the AI what to do
Fix the failing tests described in testeranto/reports/allTests/node/test/node/tests.json. Correct any type signature errors described in the files testeranto/reports/allTests/test/node/node/type_errors.txt. Implement any method which throws "Function not implemented. Resolve the lint errors described in testeranto/reports/allTests/test/node/node/lint_errors.json"
```

## "Features"

Testeranto connects "features" to tests. The features may be simple strings, but they can also take the form of local markdown files, or remote URLs to external feature tracking systems. For instance, this could be a jira ticket or a github issue. These features are used to inform the AI context.

```typescript
import someMarkdownFile from "someMarkdownFile.md";

...

test0: Given.Default(
  [
    "https://api.github.com/repos/adamwong246/testeranto/issues/8",
    "you can set the width and height of a Rectangle",
    someMarkdownFile
    ],

  [When.setWidth(4), When.setHeight(19)],
  [Then.getWidth(4), Then.getHeight(19)]
),
...

```

## eslint and tsc

Alongside the BDD tests, Testeranto runs ESLint and tsc on the input files to generate a list of static analysis errors and type errors, respectively. Aider will use this to resolve both.

## Subprojects

Testeranto has a core repo, but there are also sub-projects which implement tests by type and by technology

### testeranto-solidity

Test a solidity contract. Also included is an example of deploying a contract to a ganache server.

### testeranto-reduxtoolkit

Tests a Redux store.

### testeranto-http

Tests a Node HTTP server.

### testeranto-react (COMING SOON)

Test a react component. You can choose from a variety of types (jsx functions, class style, etc) and you can test with `react`, `react-dom`, or `react-test-renderer`

### testeranto-express (COMING SOON)

### testeranto-xstate (COMING SOON)

## Sidecars (COMING SOON)

Alongside your test, you can include a number of "sidecars" - other bundled JavaScript assets upon which your test depends. For example, suppose you have an app with frontend and backend components. You could run a React test in the web and include the Node HTTP server as a sidecar.
