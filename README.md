# testeranto.ts

🚧 under heavy development! 🚧 I'm hoping to have a 1.0.0 release by the end of the year 🤞 but until then _caveat emptor_.

## about

Testeranto.ts an Acceptance Test Driven Development (ATDD) testing framework. Testeranto focuses on specifing stateful logic which crosses applications boundaries with strong type bindings and using an extended gherkin syntax.

## What is ATDD?

If TDD is for small unit tests, and BDD is for big integration tests, ATDD is the best of both. If TDD is for developers, and BDD is for users, ATDD is for _stakeholders_. ATDD is the application of Given-When-Then specifications across your codebase, to both "big" and "small" tests.

### an example

---

```ts
class Rectangle {
  height: number;
  width: number;

  constructor(height: number = 2, width: number = 2) {
    this.height = height;
    this.width = width;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  area(): number {
    return this.width * this.height;
  }

  circumference(): number {
    return this.width * 2 + this.height * 2;
  }
}
```

```ts
export default Rectangle;

const RectangleTesteranto = TesterantoClassicFactory<
  Rectangle,
  {
    Default: "hello";
  },
  {
    Default: [never];
    WidthOfOneAndHeightOfOne: [never];
    WidthAndHeightOf: [number, number];
  },
  {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  }
>(Rectangle, (Suite, Given, When, Then) => {
  const RectangleSuite = Suite.Default;
  return [
    RectangleSuite([
      Given.Default(
        [When.setWidth(4), When.setHeight(9)],

        [Then.getWidth(4), Then.getHeight(9)]
      ),

      Given.WidthOfOneAndHeightOfOne(
        [When.setWidth(4), When.setHeight(5)],
        [
          Then.getWidth(4),
          Then.getHeight(5),
          Then.area(20),
          Then.AreaPlusCircumference(38),
        ]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [When.setHeight(4), When.setWidth(3)],
        [Then.area(12)]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [
          When.setHeight(3),
          When.setWidth(4),
          When.setHeight(5),
          When.setWidth(6),
        ],
        [Then.area(30), Then.circumference(22)]
      ),
      Given.WidthOfOneAndHeightOfOne(
        [When.setHeight(3), When.setWidth(4)],
        [
          Then.getHeight(3),
          Then.getWidth(4),
          Then.area(12),
          Then.circumference(14),
        ]
      ),
    ]),
  ];
});
```

```
Suite: Default constructor

 - idk feature -

Given: width of 1 and height of 1
 When: setWidth: 4
 When: setHeight: 9
 Then: getWidth: 4
 Then: getHeight: 9

 - idk feature -

Given: width of 1 and height of 1
 When: setWidth: 4
 When: setHeight: 5
 Then: getWidth: 4
 Then: getHeight: 5
 Then: area: 20
 Then: AreaPlusCircumference: 38

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 4
 When: setWidth: 3
 Then: area: 12

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 3
 When: setWidth: 4
 When: setHeight: 5
 When: setWidth: 6
 Then: area: 30
 Then: circumference: 22

 - idk feature -

Given: width of 1 and height of 1
 When: setHeight: 3
 When: setWidth: 4
 Then: getHeight: 3
 Then: getWidth: 4
 Then: area: 12
 Then: circumference: 14
```

### the good parts

Testeranto can very feasibly be used to test any code- a ruby HTTP server, for example. While testeranto itself and it's test implementations are typescript, the subject of the test can be any stateful software.

Testeranto allows you to test the same code in multiple ways. You can test your unbundled TS in a unit-test fashion, and also bundle that same code, then testing it through a interface like puppeteer, fetch, curl, etc. The same patterns you apply to your low level components are applied to your larger applications as well.

Testeranto exposes an extended gherkin syntax. You can use the given-when-then lingua-franca, AND you can also use an imperative `Check` which is a bit more flexible.

Testeranto.ts is very lightweight and unopinionated. It is comprised entirely of ~1000 lines of typescript, with only 1 dependency (lodash).

Testeranto is just TS- no plain text, no markdown and no regex pattern matching required.

### the bad parts

Testerano is not for testing pure functions. It's designed only to address _stateful_ logic.

Testeranto prefers TS and to be leveraged to it full potential requires at least some proficiency with the language.

Because testerano is so unopinionated, it does not provide test infrastructure. You will need to find an existing recipe or implement it yourself. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:

1] `TesterantoClassic`, when you only need to test a class

2] `TesterantoBasic`, when you need to test something more complex

### examples of test infrasuctures

- [Testing a class, with TesterantoClassic](/tests/Rectangle)
- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
- [Testing an http server with node's fetch](/tests/httpServer/http.testerano.test.ts.test.ts)
- [Testing an http server with puppeteer](/tests/httpServer/puppeteer.testeranto.test.ts)
- [Testing a Clasical react component](/tests/ClassicalReact/ClassicalReact.testeranto.test.ts)
- [Testing a Clasical react component, bundled with esbuild and tested with puppeteer with screenshots](/tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts)
