# testeranto

## The AI-powered BDD test framework for TypeScript projects

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

demo video: [youtube](https://www.youtube.com/embed/WvU5xMqGi6Q)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example repo: [testeranto-starter](https://github.com/adamwong246/testeranto-starter)

## What is testeranto?

- Testeranto produces test results which can be fed to Aider.ai to automatically fix failing tests.
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures.
- Testeranto can be run in the frontend or the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.
- Testeranto connects "features" to "tests". This allows the AI to read feature documentation from external systems, like Jira.
- Testeranto generates test results into static a website which can be deployed to github pages easily.

## Key Technologies

Testeranto builds on modern JavaScript/TypeScript tooling:

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| TypeScript | Strongly-typed test definitions        |
| Puppeteer  | Cross-runtime testing (Node & Browser) |
| esbuild    | Fast test bundling                     |
| Aider.ai   | AI-powered test fixing                 |
| ESLint     | Static analysis of test files          |
| tsc        | Type checking of test files            |
| Markdown   | Feature documentation format           |

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

3. Run your tests in two separate terminals:

```bash
# Terminal 1 - Build in watch mode
yarn t-build rectangle.test.ts dev

# Terminal 2 - Run in watch mode
yarn t-run rectangle.test.ts dev
```

## Architecture Overview

```mermaid
flowchart TD
    subgraph ThreePillars["Testeranto Core"]
        Builder[Test Builder]
        Runner[Test Runner]
        Aider[AI Integration]
    end

    subgraph BuilderComponents[" "]
        Specification[Specification]
        Implementation[Implementation]
        Interface[Interface]
    end

    subgraph Runtimes[" "]
        Node[Node]
        Web[Browser]
        Pure[JS]
    end

    Builder --> Runner
    Runner --> Aider
    Aider --> Builder

    Builder --> BuilderComponents
    Runner --> Runtimes

    style ThreePillars fill:none,stroke:#586e75
    style Builder fill:#268bd2,stroke:#586e75,color:#fdf6e3
    style Runner fill:#268bd2,stroke:#586e75,color:#fdf6e3
    style Aider fill:#b58900,stroke:#586e75,color:#002b36
    style BuilderComponents fill:#002b36,stroke:#586e75,color:#eee8d5
    style Runtimes fill:#073642,stroke:#586e75,color:#eee8d5
    style Specification fill:#2aa198,stroke:#586e75,color:#002b36
    style Implementation fill:#2aa198,stroke:#586e75,color:#002b36
    style Interface fill:#2aa198,stroke:#586e75,color:#002b36
    style Node fill:#859900,stroke:#586e75,color:#002b36
    style Web fill:#859900,stroke:#586e75,color:#002b36
    style Pure fill:#859900,stroke:#586e75,color:#002b36
```

## Runtime Platforms

Testeranto runs tests in multiple runtime environments, each suited for different testing scenarios:

| Runtime  | Description                                       | When To Use                                                            | Key Characteristics                                     |
| -------- | ------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| **Node** | Full IO access with Node.js built-in modules      | Testing backend code, Node APIs, or anything needing filesystem access | Runs in Node v8 via fork, has access to fs, crypto, etc |
| **Web**  | DOM API access with browser capabilities          | Testing frontend code, UI interactions, or visual regression           | Runs in Chrome page, can take screenshots/recordings    |
| **Pure** | Isolated JS runtime without external dependencies | Fast unit tests that don't need external resources                     | Dynamically imported into main thread, no IO access     |

**Key Considerations:**

- Use **Node** for testing backend services, file operations, or anything requiring Node.js APIs
- Use **Web** when testing browser-specific code that references `document` or `window`
- Use **Pure** for fast, isolated unit tests where you don't need console output or external resources

## CLI Commands

| Command                               | Description                                   |
| ------------------------------------- | --------------------------------------------- |
| `yarn t-init`                         | Create a new testeranto project               |
| `yarn t-build <YOUR_TESTS> dev\|once` | Build test bundles (watch or single-run mode) |
| `yarn t-run <YOUR_TESTS> dev\|once`   | Run tests (watch or single-run mode)          |
| `yarn t-report`                       | Launch test report server                     |
| `yarn t-aider`                        | Fix failing tests with AI                     |

Example workflow:

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

## AI

Testeranto generates a "prompt" alongside test results. This prompt is passed to aider as input.

```
// input src files which can be edited by aider
/add test/node.ts

// test report files that inform aider but should not be edited
/read testeranto/reports/allTests/node/test/node/tests.json
/read testeranto/reports/allTests/test/node/node/lint_errors.json
/read testeranto/reports/allTests/test/node/node/type_errors.txt

// A list of features which can inform aider.
/load testeranto/reports/allTests/node/test/node/featurePrompt.txt

// tell the AI what to do
/code Fix the failing tests described in testeranto/reports/allTests/node/test/node/tests.json. Correct any type signature errors described in the files testeranto/reports/allTests/test/node/node/type_errors.txt. Implement any method which throws "Function not implemented. Resolve the lint errors described in testeranto/reports/allTests/test/node/node/lint_errors.json"
```

## "Features"

Testeranto connects "features" to tests. The features may be simple strings, but they can also take the form of local markdown files, or remote URLs to external feature tracking systems. For instance, this could be a jira ticket or a github issue. These features are used to inform the AI context.

```ts
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

## Core Concepts

Testeranto's type system provides a rigorous framework for Behavior-Driven Development (BDD) testing. Let's break down the key components using a Rectangle class example.

### 1. Test Subject

First, define the class you want to test:

```typescript
class Rectangle {
  constructor(public width: number, public height: number) {}

  setWidth(w: number) {
    this.width = w;
  }
  setHeight(h: number) {
    this.height = h;
  }
  getArea() {
    return this.width * this.height;
  }
}
```

### 2. Test Interface Types

Testeranto uses a powerful type system to ensure your tests match your implementation:

```typescript
type IRectangle = Ibdd_in<
  null, // No special initialization needed
  null, // No special cleanup needed
  Rectangle, // The test subject type
  Rectangle, // State type between test steps
  Rectangle, // Final state type
  (n: number) => (r: Rectangle) => void, // When functions signature
  (r: Rectangle) => number // Then functions signature
>;
```

This type definition ensures:

- Type safety throughout the test lifecycle
- Clear separation of test phases (setup, execution, verification)
- Proper function signatures for test steps

### 3. Test Specification

Define your BDD-style tests with full type checking:

```typescript
const RectangleSpec: ITestSpecification<IRectangle> = (
  Suite,
  Given,
  When,
  Then
) => [
  Suite.Default("Rectangle Operations", {
    // Test case 1: Basic dimension setting
    basicDimensions: Given.Default(
      ["Validate basic rectangle operations"],
      [When.setWidth(5), When.setHeight(10)], // Actions
      [Then.getWidth(5), Then.getHeight(10)] // Assertions
    ),

    // Test case 2: Area calculation
    areaCalculation: Given.Default(
      ["Validate area calculation"],
      [When.setWidth(3), When.setHeight(4)],
      [(r) => r.getArea() === 12] // Custom assertion
    ),
  }),
];
```

### Development Workflow

```mermaid




flowchart LR

    subgraph hh["humans"]
        direction LR
        Human[🧑💻 ]
    end

    subgraph bb["AI"]
        direction LR
        Bot[🤖🧠 aider]
    end


    tests ---> L
    subgraph tests
        direction LR
        A[Test Specification]
        B[Test Interface]
        C[Test Implementation]
        K[application code]
    end

    subgraph buildSystem
        direction TB
        L["t-build"]
        M[t-run]
        L ---> M

        M ---> N
        M --->O
        M --->P
        N["BDD tests"]
        O["Static analysis"]
        P["Type checking"]

        Q["reports"]
        N ---> Q
        O ---> Q
        P ---> Q



    end

    Q ---> bb

    buildSystem ---> bb
    bb ---> tests
    hh ---> tests






    %% Styling
    style Human fill:#268bd2,stroke:#586e75,color:#fdf6e3
    style Bot fill:#d33682,stroke:#586e75,color:#fdf6e3

    %% Layout tweaks
    classDef column margin-right:20px

```

**Key Components:**

1. **Specification** - BDD test definitions (Given/When/Then)
2. **Implementation** - Concrete test logic and assertions
3. **Interface** - Test lifecycle hooks (before/after each)

**Rapid Development Loop:**

1. `t-build` continuously type-checks and bundles tests
2. `t-run` executes tests as they change
3. Aider analyzes failures and suggests fixes
4. Developer iterates based on feedback

The workflow creates a tight feedback loop where:

- Type errors are caught immediately during build
- Test failures trigger AI-assisted fixes
- Changes propagate instantly through the system

2. **Autocomplete** - IDE support for test steps
3. **Refactoring safety** - Changes to implementation trigger type errors in tests
4. **Documentation** - Types serve as living documentation

### The Testing Lifecycle

1. **Given** - Set up initial state
2. **When** - Perform actions on the subject
3. **Then** - Verify outcomes
4. **Check** - Imperative-style validations (optional)

Each phase is type-checked against your interface definition, ensuring tests remain valid as your code evolves.

```js
export default async <I extends IT, O extends OT, M>(

  // the thing that is being tested.
  input: I["iinput"],

  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testInterface: Partial<IWebTestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
) => {

  // or WebTesteranto<I, O, M> or PureTesteranto<I, O, M>
  return new NodeTesteranto<I, O, M>(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};

```

Practically speaking, for each thing you test, you will need to implement 3 types and 4 objects.

#### type I

this type describes the shape of the BDD test

```ts
export type I = Ibdd_in<
  null,
  null,
  Rectangle,
  Rectangle,
  Rectangle,
  (...x) => (rectangle: Rectangle, utils: IPM) => Rectangle,
  (rectangle: Rectangle, utils: IPM) => Rectangle
>;
```

#### type O

this type describes the shape of the "interface"

```ts
export type O = Ibdd_out<
  // Suite
  {
    Default: [string];
  },
  // "Given" are initial states
  {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  },
  // "Whens" are steps which change the state of the test subject
  {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  // "Thens" are steps which make assertions of the test subject
  {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [];
  },
  // "Checks" are similar to "Givens"
  {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  }
>;
```

#### type M (optional)

this type describes the modifications to the shape of the "specification". It can be used to make your BDD tests DRYer but is not necessary

```ts
export type M = {
  givens: {
    [K in keyof O["givens"]]: (...Iw: O["givens"][K]) => Rectangle;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...Iw: O["whens"][K]
    ) => (rectangle: Rectangle, utils: PM) => Rectangle;
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...Iw: O["thens"][K]
    ) => (rectangle: Rectangle, utils: PM) => Rectangle;
  };
};
```

#### the "specification" aka ITestSpecification<I, O>

The test specification is the BDD tests logic. The specification implements BDD directives "Given", "When", and Then"

```ts
export const RectangleTesterantoBaseTestSpecification: ITestSpecification<
  I,
  O
> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Rectangle class",
      {
        // A "given" is a strict BDD test. It starts with an initial state, then executes the "whens" which update the test subject, and then executes the "thens" as a assertions.
        test0: Given.Default(
          // a list of features
          ["https://api.github.com/repos/adamwong246/testeranto/issues/8"],
          // a list of "whens"
          [When.setWidth(4), When.setHeight(19)],
          // a list of "thens"
          [Then.getWidth(4), Then.getHeight(19)]
        ),
      },

      [
        // a "check" is a less strict style of test. Instead of lists of whens and thens, you get a function callback.
        Check.Default("imperative style?!", [], async (rectangle) => {
          Then.getWidth(2).thenCB(rectangle);
          Then.getHeight(2).thenCB(rectangle);
          When.setHeight(22).whenCB(rectangle);
          Then.getHeight(232).thenCB(rectangle);
        }),
      ]
    ),
  ];
};
```

#### the "interface" aka testInterface: Partial<IWebTestInterface<I>>

The test interface is code which is NOT BDD steps. The interface implements "before all", "after all", "before each", and "after each", all of which are optional. f

```ts
export const RectangleTesterantoBaseInterface: IPartialInterface<I> = {
  beforeEach: async (subject, i) => {
    return i();
  },
  andWhen: async function (s, whenCB, tr, utils) {
    return whenCB(s)(s, utils);
  },
  butThen: async (s, t, tr, pm) => {
    return t(s, pm);
  },
};
```

#### the "test resource requirement" aka ITTestResourceRequest (optional)

The test resource requirement describes things that the test needs to run, namely network ports. It is optional, but you should add this argument if your test needs to rely upon network ports

```ts
// TODO add example of test resource requirement
```

## Sidecars (COMING SOON)

Along side your test, you can include a number of "sidecars" which are other bundled javascript assets upon which your test depends. For example, suppose you have an app with a frontend and backend component. You could run a react test in the web and include the node http server as a sidecar.

## `eslint` and `tsc`

Alongside the bdd tests, testeranto runs eslint and tsc upon the input files to generate a list of static analysis errors and a list of type errors, respectively.

## Subprojects

Testeranto has a core repo, but there are also subprojects which implement tests by type and by technology

### testeranto-solidity

Test a solidity contract. Also included is an example of deploying a contrct to a ganache server.

### testeranto-reduxtoolkit

Test a redux store.

### testeranto-http

Test a node http server.

### testeranto-react (COMING SOON)

Test a react component. You can choose from a variety of types (jsx functions, class style, etc) and you can test with `react`, `react-dom`, or `react-test-renderer`

### testeranto-express (COMING SOON)

### testeranto-xstate (COMING SOON)
