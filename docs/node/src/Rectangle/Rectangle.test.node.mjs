import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Node_default
} from "../../chunk-O3OSUFIX.mjs";
import {
  assert
} from "../../chunk-7DTFZFDN.mjs";
import "../../chunk-CDRQ6FZS.mjs";
import "../../chunk-6SZJES2S.mjs";
import "../../chunk-BRBW5YJH.mjs";
import "../../chunk-S5L4ZC6L.mjs";
import "../../chunk-LE3VN4X4.mjs";
import "../../chunk-GF7QN4NN.mjs";
import {
  init_cjs_shim
} from "../../chunk-4IESOCHA.mjs";

// src/Rectangle/Rectangle.test.node.ts
init_cjs_shim();

// src/Rectangle.test.ts
init_cjs_shim();

// src/Rectangle.ts
init_cjs_shim();
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
          [Then.getWidth(4), Then.getHeight(9)]
        ),
        test1: Given.Default(
          [`hello`],
          [When.setWidth(4), When.setHeight(5)],
          [
            Then.getWidth(4),
            Then.getHeight(5),
            Then.area(20),
            Then.AreaPlusCircumference(38)
          ]
        ),
        test2: Given.Default(
          [`hello`],
          [When.setHeight(4), When.setWidth(33)],
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
    )
  ];
};
var RectangleTesterantoBasePrototype = Rectangle_default.prototype;

// src/Rectangle/Rectangle.test.node.ts
var testInterface = {
  beforeAll(input, testResource, artificer, utils) {
    return new Promise(async (res, rej) => {
      const x = Object.create(input);
      console.log("beforeAll", x);
      res(x);
    });
  },
  // beforeEach: async (): Promise<any> => {
  //   // console.log("beta");
  //   return new Promise((resolve, rej) => {
  //     resolve(React.createElement(testInput, {}, []));
  //   });
  // },
  andWhen: async function(s, whenCB) {
    return whenCB(s);
  },
  assertThis: (x) => {
  },
  afterAll: async (store, artificer, utils) => {
  }
};
var Rectangle_test_node_default = Node_default(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);
export {
  Rectangle_test_node_default as default
};
