## Core Concepts

Testeranto's type system provides a rigorous framework for Behavior-Driven Development (BDD) testing. Let's break down the key components using a Rectangle class example.

### The Test Subject

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

### Teseranto's 3 main functions

For each of testeranto's runtime, there is a specific Testeranto main function. Each is it's own import but all 3 are called in the same way.

#### Node

```ts
import Testeranto from "testeranto/src/Node";

import { RectangleTesterantoBaseTestImplementation } from "./Rectangle.test.implementation";
import { RectangleTesterantoBaseTestSpecification } from "./Rectangle.test.specification";
import { RectangleTesterantoBaseInterface } from "./Rectangle.test.interface";

export default Testeranto(
  null,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseInterface
);
```

#### Web

```ts
import Testeranto from "testeranto/src/Web";

import { RectangleTesterantoBaseTestImplementation } from "./Rectangle.test.implementation";
import { RectangleTesterantoBaseTestSpecification } from "./Rectangle.test.specification";
import { RectangleTesterantoBaseInterface } from "./Rectangle.test.interface";

export default Testeranto(
  null,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseInterface
);
```

#### Pure

```ts
import Testeranto from "testeranto/src/Pure";

import { RectangleTesterantoBaseTestImplementation } from "./Rectangle.test.implementation";
import { RectangleTesterantoBaseTestSpecification } from "./Rectangle.test.specification";
import { RectangleTesterantoBaseInterface } from "./Rectangle.test.interface";

export default Testeranto(
  null,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseInterface
);
```

### Testeranto functions and types

Every testeranto test has 4-5 components:

1. ITestSpecification
2. ITestImplementation
3. ITestInterface
4. Ibdd_in
5. Ibdd_out
6. the "modifier" type

#### The Specification aka ITestSpecification

The Specification defines the business logic of your tests, divorced from implementation details.

```typescript
export const RectangleTesterantoBaseTestSpecification: ITestSpecification<
  I,
  O
> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Rectangle class",
      {
        test0: Given.Default(
          ["https://api.github.com/repos/adamwong246/testeranto/issues/8"],
          [],
          [Then.getWidth(2)]
        ),
        test1: Given.Default(
          [`Rectangles have width and height.`],
          [When.setWidth(4), When.setHeight(5)],
          [Then.getWidth(4), Then.getHeight(5), Then.area(20)]
        ),
      },

      []
    ),
  ];
};
```

#### The Implementation aka ITestImplementation

The Implementation defines the hooks that the Specification will call.

```ts
export const RectangleTesterantoBaseTestImplementation: ITestImplementation<
  I,
  O,
  M
> = {
  suites: {
    Default: "a default suite",
  },

  givens: {
    Default: () => new Rectangle(2, 2),
    WidthAndHeightOf: (width, height) => new Rectangle(width, height),
  },

  whens: {
    setWidth: (width: number) => (rectangle) => {
      rectangle.setWidth(width);
      return rectangle;
    },
    setHeight: (height: number) => (rectangle) => {
      rectangle.setHeight(height);
      return rectangle;
    },
  },

  thens: {
    getWidth: (expectedWidth) => (rectangle) => {
      assert.equal(rectangle.getWidth(), expectedWidth);
      return rectangle;
    },
    getHeight: (expectedHeight) => (rectangle) => {
      assert.equal(rectangle.getHeight(), expectedHeight);
      return rectangle;
    },
    area: (area) => (rectangle) => {
      assert.equal(rectangle.area(), area);
      return rectangle;
    },
    circumference: (circumference: number) => (rectangle: Rectangle) => {
      assert.equal(rectangle.circumference(), circumference);
      return rectangle;
    },
  },

  checks: {
    Default: () => new Rectangle(2, 2),
  },
};
```

#### The Interface aka ITestInterface

The test interface is code which is NOT BDD . The interface adapts your test subject so that the BDD hooks can be applied. The interface implements "before all", "after all", "before each", and "after each", all of which are optional.

```ts
export const RectangleTesterantoBaseInterface: ITestInterface<I> = {
  beforeEach: async (subject, i) => {
    return i();
  },
  andWhen: async function (s, whenCB, tr, utils) {
    return whenCB(s, utils);
  },
  butThen: async (s, t, tr, pm) => {
    return t(s, pm);
  },
  afterEach: (z) => {
    return z;
  },
  afterAll: () => {},
  assertThis: (x: any, y) => {},
};
```

#### type I aka Ibdd_in

this type describes the "inner" shape of your BDD tests.

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

#### type O aka Ibdd_out

this type describes the "outer" shape of your BDD tests.

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
