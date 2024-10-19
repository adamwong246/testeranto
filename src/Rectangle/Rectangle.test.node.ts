import Testeranto from "testeranto/src/SubPackages/puppeteer";
// import {
//   IPartialNodeInterface,
//   INodeTestInterface,
//   TBrowser
// } from "testeranto/src/Types";

import {
  IRectangleTestShape,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";
import { INodeTestInterface } from "../../../testeranto/src/lib/types";
import { IPartialNodeInterface } from "testeranto/src/Types";
import Rectangle from "../Rectangle";

let guid;

const testInterface: IPartialNodeInterface<IRectangleTestShape> = {
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
            return (
              strippedUrl ===
              "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/test.html"
            );
          })[0];

          await page.screenshot({
            path: "rectangle-beforeAll.jpg",
          });
          res(input);
        }
      });

      console.log("mark1");
      utils.ipc.postMessage({
        launchWeb: `/docs/web/src/ClassicalComponent/test.html`,
      });
    });
  },
  beforeEach: async (): Promise<any> => {
    console.log("beta");
    // return new Promise((resolve, rej) => {
    //   resolve(React.createElement(testInput, {}, []));
    // });
  },
  andWhen: async function (s: Rectangle, whenCB): Promise<Rectangle> {
    console.log("gamma");
    return whenCB(s);
  },

  assertThis: (x) => {},
  afterAll: async (store, artificer, utils) => {
    // const page = (await browser.pages())[0]; //.map((x) => x.url())); // === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
    utils.ipc.postMessage({
      teardown: guid,
    });
    console.log("delta!", guid);
  },
};

export const RectangleTesteranto = Testeranto(
  "RectangleTesterantoBasePrototype",
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);

export {};
