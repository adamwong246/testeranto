import { assert } from "chai";

import { ITestImplementation } from "testeranto/src/Types";

import Rectangle from "./Rectangle";
import { IRectangleTestShape } from "./Rectangle.test.shape";

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
