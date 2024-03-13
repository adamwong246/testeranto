"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// myTests/Rectangle/Rectangle.test.node.ts
var Rectangle_test_node_exports = {};
__export(Rectangle_test_node_exports, {
  RectangleTesteranto: () => RectangleTesteranto
});
module.exports = __toCommonJS(Rectangle_test_node_exports);
var import_core_node = __toESM(require("testeranto/src/core-node"));

// src/Rectangle.test.ts
var import_chai = require("chai");

// src/Rectangle.ts
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

// src/Rectangle.test.ts
var RectangleTesterantoBaseTestSpecification = (Suite, Given, When, Then, Check) => {
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
            Then.AreaPlusCircumference(38)
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
    )
  ];
};
var RectangleTesterantoBaseTestImplementation = {
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
    setHeight: (height) => (rectangle) => {
      console.log("SET HEIGHT", rectangle, height);
      rectangle.setHeight(height);
    }
  },
  Thens: {
    AreaPlusCircumference: (combined) => (rectangle) => {
      import_chai.assert.equal(rectangle.area() + rectangle.circumference(), combined);
    },
    getWidth: (width) => (rectangle) => import_chai.assert.equal(rectangle.width, width),
    getHeight: (height) => (rectangle) => import_chai.assert.equal(rectangle.height, height),
    area: (area) => (rectangle) => import_chai.assert.equal(rectangle.area(), area),
    prototype: (name) => (rectangle) => import_chai.assert.equal(1, 1),
    // throw new Error("Function not implemented.")
    circumference: (circumference) => (rectangle) => import_chai.assert.equal(rectangle.circumference(), circumference)
  },
  Checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};
var RectangleTesterantoBaseInterface = {
  andWhen: async function(renderer, actioner) {
    actioner()(renderer);
    return renderer;
  }
};
var RectangleTesterantoBaseKey = "rectangle";
var RectangleTesterantoBasePrototype = Rectangle_default.prototype;

// myTests/Rectangle/Rectangle.test.node.ts
var RectangleTesteranto = (0, import_core_node.default)(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBaseKey
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RectangleTesteranto
});
