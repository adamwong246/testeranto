// tests/Rectangle/Rectangle.test.ts
import assert from "assert";
import {
  TesterantoFactory
} from "/Users/adam/Code/testeranto.ts/tests/Rectangle/../../src/index.ts";
import Rectangle from "/Users/adam/Code/testeranto.ts/tests/Rectangle/./Rectangle.ts";
import features from "/Users/adam/Code/testeranto.ts/tests/Rectangle/../testerantoFeatures.test.ts";
var RectangleTesteranto = TesterantoFactory(
  Rectangle.prototype,
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Rectangle class",
        [
          Given.Default(
            "test 1",
            [features.hello],
            [When.setWidth(4), When.setHeight(9)],
            [Then.getWidth(4), Then.getHeight(9)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 2",
            [],
            [When.setWidth(4), When.setHeight(5)],
            [
              Then.getWidth(4),
              Then.getHeight(5),
              Then.area(20),
              Then.AreaPlusCircumference(38999)
            ]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 3",
            [],
            [When.setHeight(4), When.setWidth(3)],
            [Then.area(12)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 4",
            [],
            [
              When.setHeight(3),
              When.setWidth(4),
              When.setHeight(5),
              When.setWidth(6)
            ],
            [Then.area(30), Then.circumference(22)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 5",
            [],
            [When.setHeight(3), When.setWidth(4)],
            [
              Then.getHeight(3),
              Then.getWidth(4),
              Then.area(12),
              Then.circumference(144)
            ]
          )
        ],
        []
      )
    ];
  },
  {
    Suites: {
      Default: "a default suite"
    },
    Givens: {
      Default: () => new Rectangle(),
      WidthOfOneAndHeightOfOne: () => new Rectangle(1, 1),
      WidthAndHeightOf: (width, height) => new Rectangle(width, height)
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
      circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference)
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  "na",
  {
    andWhen: async function(renderer, actioner, testResource) {
      actioner()(renderer);
      return renderer;
    }
  },
  __filename
);
export {
  RectangleTesteranto
};
