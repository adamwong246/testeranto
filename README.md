# testeranto

## Brings vibe coding to the real world

Testeranto lets you vibe code large, real-world polyglot codebases by intelligently managing the AI context

#### 🚀 Join Our Beta Program! 🚀

We're launching a private beta for GitHub stargazers first, followed by a public beta.

**Private Beta **

- Early access to AI-powered test fixing
- Lifetime priority support from the creator
- Personal onboarding assistance
- Direct influence on the roadmap
- Permanent "Beta Pioneer" status

[email us](mailto:testeranto.dev@gmail.com) to express interest.

## quick links

- Example test reports: [adamwong246.github.io/testeranto/testeranto](https://adamwong246.github.io/testeranto/testeranto/projects.html)
- demo of me using testeranto to fix a bug: [youtube](https://www.youtube.com/embed/WvU5xMqGi6Q)
- a starter testeranto project: [testeranto-starter](https://github.com/adamwong246/testeranto-starter)
- Explainer video source: [github.com/adamwong246/testeranto-video](https://github.com/adamwong246/testeranto-video)

## What is testeranto?

- Testeranto produces test results that can be fed to Aider.ai to automatically fix failing tests.
- Testeranto supports TypeScript/Javascript, golang and python (with more planed)
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you to wrap your code with a semantic interface that is based on TS type signatures.
- Testeranto can run tests in the frontend, the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.
- Testeranto connects "features" to "tests". This allows the AI to read feature documentation from external systems, like Jira.
- Testeranto generates test results as a static website that can be easily deployed to GitHub Pages.
- Testeranto uses esbuild to analyze dependencies and bundle only the essential files needed for test fixing. This context optimization means:
  - No wasted tokens on irrelevant code
  - All type signatures and dependencies included
  - Related documentation automatically linked
  - Failed tests get priority placement
- **The result:** Your LLM works with laser focus on exactly what needs fixing

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

0. Install Aider and signup for a LLM service.

### Server-Side Setup for GitHub OAuth

For GitHub authentication to work properly, you need to set up the server-side token exchange:

1. Add the following environment variables to your server:
   ```
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   ```

2. The server will handle the OAuth token exchange at the `/api/auth/github/token` endpoint

### GitHub Authentication Setup

To enable Git operations with GitHub:

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set the Authorization callback URL to: `http://localhost:3000/auth/github/callback`
3. Copy the Client ID
4. Update the `clientId` field in the `githubOAuth` section of `testeranto.config.ts`
5. Restart the development server

**Note**: The client secret is not needed for the frontend application as it will be handled by the server-side component for token exchange.

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

|                                          | You should use this runtime for...                                                                      | Important differences                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Node** : node V8 with fork             | testing backend code, Node APIs (like `fs` and `crypto`), or anything needing filesystem access         | has access to the filesystem and io                                                                                                 |
| **Web** : chrome browser                 | testing frontend code, anything that uses `document` or `window`, UI interactions, or visual regression | can take screenshots/recordings                                                                                                     |
| **Pure** : node v8, dynamically imported | testing code that can run on both node-v8 and the browser                                               | Very similar to "Node" but has no IO access. Console logs will spew into the main thread, but this runtime is theoretically faster. |

## CLI Commands

|                                       |                                               |
| ------------------------------------- | --------------------------------------------- |
| `yarn t-init`                         | Create a new testeranto project               |
| `yarn t-build <YOUR_TESTS> dev\|once` | Build test bundles (watch or single-run mode) |
| `yarn t-run <YOUR_TESTS> dev\|once`   | Run tests (watch or single-run mode)          |
| `yarn t-report`                       | Launch test report server                     |

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
