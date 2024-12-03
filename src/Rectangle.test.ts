import { assert } from "chai";

import type {
  ITestSpecification,
  ITestImplementation,
  IPartialInterface,
} from "testeranto/src/Types";

import Rectangle from "./Rectangle";

export interface IRectangleTestShape {
  iinput: Rectangle;
  isubject: Rectangle;
  istore: Rectangle;
  iselection: Rectangle;

  when: (rectangle: Rectangle) => any;
  then: unknown;
  given: (x) => (y) => unknown;

  suites: {
    Default: [string];
  };
  givens: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  };
  whens: {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  };
  thens: {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  };
  checks: {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  };
}

export const RectangleTesterantoBaseTestImplementation: ITestImplementation<
  IRectangleTestShape,
  {
    givens: {
      [K in keyof IRectangleTestShape["givens"]]: (
        ...Iw: IRectangleTestShape["givens"][K]
      ) => Rectangle;
    };
    whens: {
      [K in keyof IRectangleTestShape["whens"]]: (
        ...Iw: IRectangleTestShape["whens"][K]
      ) => IRectangleTestShape["when"];
    };
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
    HeightIsPubliclySetTo: (height) => (rectangle) =>
      (rectangle.height = height),
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
  IRectangleTestShape
> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Rectangle class",
      {
        test0: Given.Default(
          [`hello`],
          [When.setWidth(4), When.setHeight(9)],
          [Then.getWidth(4), Then.getHeight(99)]
        ),
        test1: Given.Default(
          [`hello`],
          [When.setWidth(4), When.setHeight(5)],
          [
            // Then.getWidth(4),
            // Then.getHeight(5),
            // Then.area(20),
            // Then.AreaPlusCircumference(38),
          ]
        ),
        test2: Given.Default(
          [`hello`],
          [When.setHeight(4), When.setWidth(3)],
          [
            // Then.area(12)
          ]
        ),
        test3: Given.Default(
          [`hello`],
          [When.setHeight(5), When.setWidth(5)],
          [
            // Then.area(5)
          ]
        ),

        test4: Given.Default(
          [`hello`],
          [When.setHeight(6), When.setWidth(6)],
          [
            // Then.area(37)
          ]
        ),
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

export const RectangleTesterantoBaseInterface: IPartialInterface<IRectangleTestShape> =
  {
    beforeEach: async (subject, initializer, art, tr, initialValues) => {
      return subject;
    },
    andWhen: async function (renderer, actioner) {
      console.log("MARK");
      actioner(renderer);
      return renderer;
    },
    butThen: (s, t, tr) => {
      return t(s);
    },
  };

export const RectangleTesterantoBasePrototype = Rectangle.prototype;
