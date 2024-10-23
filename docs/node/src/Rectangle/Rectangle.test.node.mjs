import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  require_react
} from "../../chunk-HC6XUHVX.mjs";
import {
  Node_default
} from "../../chunk-KHU6MVJS.mjs";
import {
  assert
} from "../../chunk-D2G2LC5R.mjs";
import "../../chunk-SF4FRI4W.mjs";
import "../../chunk-ECNFXUXQ.mjs";
import "../../chunk-4CEWYGDD.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../../chunk-4UNHOY6E.mjs";

// src/Rectangle/Rectangle.test.node.ts
init_cjs_shim();

// ../testeranto/dist/module/SubPackages/puppeteer.js
init_cjs_shim();
var import_react = __toESM(require_react(), 1);
var puppeteer_default = (testInput, testSpecifications, testImplementations, testInterface2) => {
  return Node_default(testInput, testSpecifications, testImplementations, Object.assign({ beforeAll(x) {
    process.parentPort.postMessage(`/docs/web/src/ClassicalComponent/test.html`);
    return x;
  }, beforeEach: async () => {
    return new Promise((resolve, rej) => {
      resolve(import_react.default.createElement(testInput, {}, []));
    });
  }, andWhen: function(s, whenCB) {
    return whenCB()(s);
  } }, testInterface2));
};

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

// src/Rectangle/Rectangle.test.node.ts
var guid;
var testInterface = {
  beforeAll(input, testResource, artificer, utils) {
    return new Promise(async (res, rej) => {
      utils.ipc.on("message", async (e) => {
        if (e.data.webLaunched) {
          guid = e.data.webLaunched;
          console.log("mark2", utils.browser);
          const page = (await utils.browser.pages()).filter((x) => {
            const parsedUrl = new URL(x.url());
            parsedUrl.search = "";
            const strippedUrl = parsedUrl.toString();
            console.log("mark3", strippedUrl);
            return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/test.html";
          })[0];
          await page.screenshot({
            path: "rectangle-beforeAll.jpg"
          });
          res(input);
        }
      });
      console.log("mark1");
      utils.ipc.postMessage({
        launchWeb: `/docs/web/src/ClassicalComponent/test.html`
      });
    });
  },
  beforeEach: async () => {
    console.log("beta");
  },
  andWhen: async function(s, whenCB) {
    console.log("gamma");
    return whenCB(s);
  },
  assertThis: (x) => {
  },
  afterAll: async (store, artificer, utils) => {
    utils.ipc.postMessage({
      teardown: guid
    });
    console.log("delta!", guid);
  }
};
var RectangleTesteranto = puppeteer_default(
  "RectangleTesterantoBasePrototype",
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);
export {
  RectangleTesteranto
};
