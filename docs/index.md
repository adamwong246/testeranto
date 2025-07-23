# Testeranto docs and core concepts

Testeranto's type system provides a rigorous framework for Behavior-Driven Development (BDD) testing. The API may seem complex but everything you need to know can be summed up in **1 function, 3 runtimes and 5 essential types, and 1 optional type**. Follow these patterns, and TypeScript's type checker will guide you through the rest.

### ⚠️ this doc is a work in progress. It is 99% accurate but needs some attention to be complete. ⚠️

Let's break down the key components using a Rectangle class example.

### The Test Subject

This is the thing-to-be-tested, for this example, a very simple implementation of a Rectangle

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

### Testeranto's 1 function

Testeranto has 1 function. This function launches and runs the tests. It is here that all 5 types converge and if you can type this function call correctly, the TS type system should guide you through the rest.

```ts
async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestInterface<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Testeranto<I, O, M>>
```

### Testeranto's 3 runtimes

For each of testeranto's runtime, there is a specific Testeranto main function. Each is it's own import but all 3 are called in the same way.

#### Node

```ts
import Testeranto from "testeranto/src/Node"; // <- import the Node main function
// below this point, all runtimes are identical!

import { implementation } from "./Rectangle.test.implementation";
import { specification } from "./Rectangle.test.specification";
import { interface } from "./Rectangle.test.interface";

// Note the type parameters I, O, and M: these will be important later
export default Testeranto<
  I extends Ibdd_in,
  O extends Ibdd_out,
  M
  >(
    Rectangle.prototype, // <- the subject of the test.
    specification,
    implementation,
    interface
);
```

#### Web

```ts
import Testeranto from "testeranto/src/Web"; // <- import the Web main function
// below this point, all runtimes are identical!

import { implementation } from "./Rectangle.test.implementation";
import { specification } from "./Rectangle.test.specification";
import { interface } from "./Rectangle.test.interface";

// Note the type parameters I, O, and M: these will be important later
export default Testeranto<
  I extends Ibdd_in,
  O extends Ibdd_out,
  M
  >(
    Rectangle.prototype, // <- the subject of the test.
    specification,
    implementation,
    interface
);
```

#### Pure

```ts
import Testeranto from "testeranto/src/Pure"; // <- import the Pure main function
// below this point, all runtimes are identical!

import { implementation } from "./Rectangle.test.implementation";
import { specification } from "./Rectangle.test.specification";
import { interface } from "./Rectangle.test.interface";

// Note the type parameters I, O, and M: these will be important later
export default Testeranto<
  I extends Ibdd_in,
  O extends Ibdd_out,
  M
  >(
    Rectangle.prototype, // <- the subject of the test.
    specification,
    implementation,
    interface
);
```

### Testeranto's 5 essential types

Every testeranto test is built around these 5 types that form a complete testing pipeline.

#### The Specification (ITestSpecification)

The Specification defines the business requirements in plain language, completely separate from implementation details. This is where you describe **what** should be tested without worrying about **how**.

- Pure business logic
- Human-readable test descriptions
- Defines test suites, scenarios (Given/When/Then)
- Maps directly to BDD concepts

```typescript
import {
  Ibdd_in,
  Ibdd_out,
  ITestSpecification,
} from "testeranto/src/CoreTypes";

//  Note the type parameters I and O. These are important!
export const specification: ITestSpecification<
  I extends Ibdd_in,
  O extends Ibdd_out,
> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => {
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

      // Ignore this for now
      []
    ),
  ];
};
```

#### The Implementation (ITestImplementation)

The Implementation provides the concrete operations that bring specifications to life. This is where you define **how** each test step actually works.

- `suites`: Test grouping and organization
- `givens`: Initial test states/setup
- `whens`: Actions that change state
- `thens`: Assertions and validations

```ts
import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
} from "testeranto/src/CoreTypes";

//  Note the type parameters I and O. These are important!
export const implementation: ITestImplementation<
  I extends Ibdd_in,
  O extends Ibdd_out,
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
  }
};
```

#### The Interface aka ITestInterface

The test interface is code which is NOT business logic. The interface adapts your test subject so that the BDD hooks can be applied. The interface implements the traditional BDD steps "before all", "after all", "before each", "after each", etc

```ts
import {
  Ibdd_in,
  ITestInterface,
} from "testeranto/src/CoreTypes";

//  Note the type parameter. This is important!
export const testAdapter: ITestInterface<
  I extends Ibdd_in,
> = {
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

This type describes the "inner" shape of your BDD tests. Over the course of the execution of the test, the subject will change shapes- this test describe those changes.

```ts
import { Ibdd_in } from "testeranto/src/CoreTypes";

// TODO this is inaccurate
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

This type describes the "outer" shape of your BDD tests. This type describes the set of legal BDD clauses.

```ts
import { Ibdd_out } from "testeranto/src/CoreTypes";

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

### Testeranto's 1 optional type

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

## Putting it all together

```ts
//  Make sure you import the right runtime
import Testeranto from "testeranto/src/Pure";

import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
  ITestInterface,
} from "testeranto/src/CoreTypes";

// The test subject
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

////////////////////////////////////////////////////////

// TODO this is inaccurate
type I = Ibdd_in<
  null,
  null,
  Rectangle,
  Rectangle,
  Rectangle,
  (...x) => (rectangle: Rectangle, utils: IPM) => Rectangle,
  (rectangle: Rectangle, utils: IPM) => Rectangle
>;

type O = Ibdd_out<
  // Suites
  {
    Default: [string];
  },
  // Givens
  {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  },
  // Whens
  {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  // Thens
  {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [];
  },
  // Checks are broken right now, ignore them
  {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  }
>;

type M = {
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

const testAdapter: ITestInterface<
  I extends Ibdd_in,
> = {
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

const testImplementation: ITestImplementation<
  I extends Ibdd_in,
  O extends Ibdd_out,
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
  }
};

const testSpecification: ITestSpecification<
  I extends Ibdd_in,
  O extends Ibdd_out,
> = (
  Suite,
  Given,
  When,
  Then,
  Check
) => {
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

      // Ignore this for now
      []
    ),
  ];
};

// 1 function will launch the test
export default Testeranto<
  I extends Ibdd_in,
  O extends Ibdd_out,
  M
  >(
    Rectangle.prototype,
    testSpecification,
    testSmplementation,
    testSnterface
);



```

## Trouble shooting

### Double check your runtimes.

Every test has a runtime, which must defined in 2 places. Both must match.

1. The import of the runtime
2. The runtime defined alongside the test in testeranto.config.ts

By convention, test filenames reveal their runtime. Ex: `__tests__/yourClass.node.test`. This is ONLY a convention. It has no real bearing on the runtime.

## Dos and Don'ts

### Do pass your test subject to the main testeranto function.

### Don't import your test subject elsewhere in your tests.
