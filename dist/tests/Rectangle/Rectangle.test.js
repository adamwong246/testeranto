// tests/Rectangle/Rectangle.test.ts
import assert from "assert";
import {
  Testeranto
} from "testeranto";

// tests/Rectangle/Rectangle.ts
var Rectangle = class {
  constructor(height = 2, width = 2) {
    this.height = height;
    this.width = width;
  }
  getHeight() {
    return this.height;
  }
  getWidth() {
    return this.width;
  }
  setHeight(height) {
    this.height = height;
  }
  setWidth(width) {
    this.width = width;
  }
  area() {
    return this.width * this.height;
  }
  circumference() {
    return this.width * 2 + this.height * 2;
  }
};
var Rectangle_default = Rectangle;

// tests/Rectangle/Rectangle.test.ts
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";
var RectangleTesteranto = Testeranto(
  Rectangle_default.prototype,
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Rectangle class",
        [
          Given.Default(
            [features.hello],
            [When.setWidth(4), When.setHeight(9)],
            [Then.getWidth(4), Then.getHeight(9)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            [],
            [When.setWidth(4), When.setHeight(5)],
            [
              Then.getWidth(4),
              Then.getHeight(5),
              Then.area(20),
              Then.AreaPlusCircumference(38)
            ]
          ),
          Given.WidthOfOneAndHeightOfOne(
            [features.hola],
            [When.setHeight(4), When.setWidth(3)],
            [Then.area(12)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            [features.hola],
            [
              When.setHeight(3),
              When.setWidth(4),
              When.setHeight(5),
              When.setWidth(6)
            ],
            [Then.area(30), Then.circumference(22)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            [features.gutentag, features.aloha],
            [When.setHeight(3), When.setWidth(4)],
            [
              Then.getHeight(3),
              Then.getWidth(4),
              Then.area(12),
              Then.circumference(14)
            ]
          ),
          Given.WidthOfOneAndHeightOfOne(
            [features.hello],
            [When.setHeight(33), When.setWidth(34)],
            [
              Then.getHeight(33)
            ]
          )
        ],
        [
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
        ]
      )
    ];
  },
  {
    Suites: {
      Default: "a default suite"
    },
    Givens: {
      Default: () => new Rectangle_default(),
      WidthOfOneAndHeightOfOne: () => new Rectangle_default(1, 1),
      WidthAndHeightOf: (width, height) => new Rectangle_default(width, height)
    },
    Whens: {
      HeightIsPubliclySetTo: (height) => (rectangle) => rectangle.height = height,
      WidthIsPubliclySetTo: (width) => (rectangle) => rectangle.width = width,
      setWidth: (width) => (rectangle) => rectangle.setWidth(width),
      setHeight: (height) => (rectangle) => rectangle.setHeight(height)
    },
    Thens: {
      AreaPlusCircumference: (combined) => (rectangle) => {
        assert.equal(
          rectangle.area() + rectangle.circumference(),
          combined
        );
      },
      getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),
      getHeight: (height) => (rectangle) => assert.equal(rectangle.height, height),
      area: (area) => (rectangle) => assert.equal(rectangle.area(), area),
      prototype: (name) => (rectangle) => assert.equal(1, 1),
      // throw new Error("Function not implemented.")
      circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference)
    },
    Checks: {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {
        return {};
      }
    }
  },
  { ports: 0 },
  {
    andWhen: async function(renderer, actioner) {
      actioner()(renderer);
      return renderer;
    }
  }
);
export {
  RectangleTesteranto
};
