# testeranto

## the AI powered BDD test framework for typescript projects

🚧 WARNING: Testeranto is still under development and is not ready for production yet. 🚧

demo video: [youtube](https://www.youtube.com/embed/WvU5xMqGi6Q)

source: [github.com/adamwong246/testeranto](https://github.com/adamwong246/testeranto)

npm: [npmjs.com/package/testeranto](https://www.npmjs.com/package/testeranto)

dev: [github.dev/adamwong246/testeranto](https://github.dev/adamwong246/testeranto)

example test report: [chromapdx.github.io/kokomoBay](https://chromapdx.github.io/kokomoBay/testeranto/index.html)

example repo: [kokomo bay](https://github.com/ChromaPDX/kokomoBay)

example repo V2: [testeranto-starter](https://github.com/adamwong246/testeranto-starter)

## What is testeranto?

- Testeranto produces test results which can be fed to Aider.ai to automatically fix failing tests.
- Testeranto tests are specified in a strongly-typed gherkin-like syntax. Rather than testing your code directly, Testeranto requires you wrap your code with a semantic interface which is based on TS type signatures.
- Testeranto can be run in the frontend or the backend, or both.
- Testeranto can be used to test anything that can be bundled with esbuild.
- Testeranto connects "features" to "tests". This allows the AI to read feature documentation from external systems, like Jira.
- Testeranto generates test results into static a website which can be deployed to github pages easily.

## tech of note

- esm - Testeranto uses modern js
- typescript - tests are functions with type parameters
- puppeteer - provides access to both node and chrome runtimes
- esbuild - used to quickly generate test bundles
- aider - AI to automatically fix broken tests
- eslint - runs upon the input files to generate a file of static analysis errors
- tsc - runs upon the input files to generate a file of type errors
- markdown - Markdown is used record feature files

## scripts

`yarn t-init`: startup a new testeranto project

`yarn t-build <someTest> <once|dev>`: build the "someTest" project once, or continuously

`yarn t-run <someTest> <once|dev>`: run the "someTest" project once, or continuously

`yarn t-report` Run the report server

`yarn t-aider PATH_TO_PROMPT_FILE`: Execute a generated prompt file to fix broken tests.

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

## Platforms

Testeranto runs tests in multiple runtimes. You can run the same test (more or less) in multiple contexts, but depending on your test subject, not all may be applicable. For instance, if you are testing an http node server, you'll can't use the web runtime. If your code references `document` or `window`, you must use the web style. And if you wish to capture console.logs in a node context, you should use the `pure` runtime.

1. Node - the test is run in node v8 via fork.
2. Web - the test is run in chrome, in a page.
3. Pure - the test is dynamically imported into the main thread. It will not have access to IO (console.log, etc) but it is more performant.

## Concepts

Testeranto tests take some piece of javascript as input, and wraps it in testing apparatus, and then executes that test on the given platform. You must provide this apparatus in the following form:

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

### type I

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

### type O

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

### type M (optional)

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

### the "specification" aka ITestSpecification<I, O>

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

### the "interface" aka testInterface: Partial<IWebTestInterface<I>>

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

## the "test resource requirement" aka ITTestResourceRequest (optional)

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
