# testeranto.ts

## teeny-tiny, tightly-typed typescript tests™

Testeranto.ts a Typescript testing framework, akin to mocha, jasmine or jest. Unlike those projects, testeranto focuses on _specifing stateful logic with strong type bindings using an extended gherkin syntax._

### example

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

Testeranto can test any stateful typescript, from individual classes to entire services.

Testeranto bridges TDD and BDD patterns. You can use the given-when-then lingua-franca of gherkin, AND you can also use an imperative style which is a bit more flexible.

Testeranto.ts is very lightweight and unopinionated. It is comprised entirely of <1000 lines of typescript, with only 1 dependency (lodash).

Testeranto is just TS, so you don't need to spend all your time writing regexes to match against tests written in a text file.

### the bad parts

Testerano is not for testing pure functions. It's designed only to address _stateful_ logic.

Because testerano is so unopinionated, it does not provide test infrastructure. You will need to find an existing recipe and implement this yourself. Depending on your needs, you will need to implement an interface which extends 1 of 2 classes:
1] `TesterantoClassic`, when you only need to test a class
2] `TesterantoBasic`, when you need to test something more complex

### examples of test infrasuctures

- [Testing a class, with TesterantoClassic](/tests/Rectangle)
- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)
- [Testing an http server with node's fetch](/tests/httpServer/http.testerano.test.ts.test.ts)
- [Testing an http server with puppeteer](/tests/httpServer/puppeteer.testeranto.test.ts)
- [Testing a react component with puppeteer](/tests/ClassicalReact/ClassicalReact.testeranto.test.ts)

### philosophy
