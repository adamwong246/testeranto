import {
  Web_default
} from "../../chunk-GUDS7OWX.mjs";
import {
  assert
} from "../../chunk-WK3ZH2ZI.mjs";
import "../../chunk-XALKSG2U.mjs";

// src/Rectangle.ts
var Rectangle = class {
  height;
  width;
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

// src/Rectangle.test.ts
var RectangleTesterantoBaseTestImplementation = {
  suites: {
    Default: "a default suite"
  },
  givens: {
    Default: () => new Rectangle_default(),
    WidthOfOneAndHeightOfOne: () => new Rectangle_default(1, 1),
    WidthAndHeightOf: (width, height) => new Rectangle_default(width, height)
  },
  whens: {
    HeightIsPubliclySetTo: (height) => (rectangle) => rectangle.height = height,
    WidthIsPubliclySetTo: (width) => (rectangle) => rectangle.width = width,
    setWidth: (width) => (rectangle) => rectangle.setWidth(width),
    setHeight: (height) => (rectangle) => rectangle.setHeight(height)
  },
  thens: {
    AreaPlusCircumference: (combined) => (rectangle) => {
      console.log("MARK");
      assert.equal(rectangle.area() + rectangle.circumference(), combined);
    },
    getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),
    getHeight: (height) => (rectangle) => assert.equal(rectangle.height, height),
    area: (area) => (rectangle) => assert.equal(rectangle.area(), area),
    prototype: (name) => (rectangle) => assert.equal(1, 1),
    circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference)
  },
  checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};
var RectangleTesterantoBaseTestSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Rectangle class",
      {
        test0: Given.Default(
          [`hello`],
          [When.setWidth(4), When.setHeight(9)],
          [
            // Then.getWidth(4), Then.getHeight(9)
          ]
        )
        // "test1": Given.Default(
        //   [`hello`],
        //   [When.setWidth(4), When.setHeight(5)],
        //   [
        //     // Then.getWidth(4),
        //     // Then.getHeight(5),
        //     // Then.area(20),
        //     // Then.AreaPlusCircumference(38),
        //   ]
        // ),
        // "test2": Given.Default(
        //   [`hello`],
        //   [When.setHeight(4), When.setWidth(3)],
        //   [
        //     // Then.area(12)
        //   ]
        // ),
        // "test3": Given.Default(
        //   [`hello`],
        //   [When.setHeight(5), When.setWidth(5)],
        //   [
        //     // Then.area(5)
        //   ]
        // ),
        // "test4": Given.Default(
        //   [`hello`],
        //   [When.setHeight(6), When.setWidth(6)],
        //   [
        //     // Then.area(37)
        //   ]
        // )
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
    )
  ];
};
var RectangleTesterantoBasePrototype = Rectangle_default.prototype;

// src/Rectangle/Rectangle.test.electron.ts
var RectangleTesteranto = Web_default(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  {
    afterAll: async (store, artificer, utils) => {
      utils.browser.getCurrentWebContents().capturePage({
        x: 0,
        y: 0,
        width: 80,
        height: 600
      }).then((z) => {
        console.log(z);
        artificer("afterAll.png", z.toPNG());
      });
    }
  }
);
export {
  RectangleTesteranto
};
