import { assert } from "chai";

import type {
  ITestInterface,
  ITestSpecification,
  ITestImplementation,
  IPartialInterface,
} from "testeranto/src/Types";

import Rectangle from "./Rectangle";

export interface testShape {

  iinput: Rectangle,
  isubject: Rectangle,
  istore: Rectangle,
  iselection: Rectangle,

  when: (rectangle: Rectangle) => unknown,
  then: unknown,
  given: (x) => (y) => unknown,

  suites: {
    Default: [string];
  },
  givens: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  },
  whens: {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  thens: {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  },
  checks: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  }
}

export const RectangleTesterantoBaseTestImplementation: ITestImplementation<
  testShape,
  {
    givens: {
      [K in keyof testShape["givens"]]: (
        ...Iw: testShape["givens"][K]
      ) => Rectangle;
    }
    whens: {
      [K in keyof testShape["whens"]]: (
        ...Iw: testShape["whens"][K]
      ) => testShape['when'];
    }
  }
> = {
  suites: {
    Default: "a default suite",
  },

  givens: {
    Default: () => new Rectangle(),
    WidthOfOneAndHeightOfOne: () => new Rectangle(1, 1),
    WidthAndHeightOf: (width, height) => new Rectangle(width, height),
  },

  whens: {
    HeightIsPubliclySetTo: (height) => (rectangle) => (rectangle.height = height),
    WidthIsPubliclySetTo: (width) => (rectangle) => (rectangle.width = width),
    setWidth: (width) => (rectangle) => rectangle.setWidth(width),
    setHeight: (height) => (rectangle) => rectangle.setHeight(height),
  },

  thens: {
    AreaPlusCircumference: (combined) => (rectangle) => {
      assert.equal(rectangle.area() + rectangle.circumference(), combined);
    },
    getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),

    getHeight: (height) => (rectangle) =>
      assert.equal(rectangle.height, height),

    area: (area) => (rectangle) => assert.equal(rectangle.area(), area),

    prototype: (name) => (rectangle) => assert.equal(1, 1),

    circumference: (circumference) => (rectangle) =>
      assert.equal(rectangle.circumference(), circumference),
  },

  checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    },
  },
};

export const RectangleTesterantoBaseTestSpecification: ITestSpecification<
  testShape
> =
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Rectangle class",
        {
          "test0": Given.Default(
            [`hello`],
            [When.setWidth(4), When.setHeight(9)],
            [Then.getWidth(4), Then.getHeight(9)]
          ),
          "test1": Given.Default(
            [`hello`],
            [When.setWidth(4), When.setHeight(5)],
            [
              Then.getWidth(4),
              Then.getHeight(5),
              Then.area(20),
              Then.AreaPlusCircumference(38),
            ]
          ),
          "test2": Given.Default(
            [`hello`],
            [When.setHeight(4), When.setWidth(3)],
            [Then.area(12)]
          ),
          "test3": Given.Default(
            [`hello`],
            [When.setHeight(5), When.setWidth(5)],
            [Then.area(25)]
          )
        },
        []
        // Check.Default(
        //   "imperative style",
        //   async ({ PostToAdd }, { TheNumberIs }) => {
        //     const a = await PostToAdd(2);
        //     const b = parseInt(await PostToAdd(3));
        //     await TheNumberIs(b);
        //     await PostToAdd(2);
        //     await TheNumberIs(7);
        //     await PostToAdd(3);
        //     await TheNumberIs(10);
        //     assert.equal(await PostToAdd(-15), -5);
        //     await TheNumberIs(-5);
        //   }
        // ),
        // ]
      ),
    ];
  };


export const RectangleTesterantoBaseInterface: IPartialInterface<testShape> = {
  beforeEach: async (
    subject,
    initializer,
    art,
    tr,
    initialValues
  ) => {
    return subject;
  },
  andWhen: async function (
    renderer,
    actioner
  ) {
    actioner(renderer);
    return renderer;
  },
};

export const RectangleTesterantoBasePrototype = Rectangle.prototype;
