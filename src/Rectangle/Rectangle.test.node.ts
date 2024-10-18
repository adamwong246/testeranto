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

const testInterface: IPartialNodeInterface<IRectangleTestShape> = {
  beforeAll(input, testResource, artificer, utils) {
    return new Promise(async (res, rej) => {
      utils.ipc.postMessage(`/docs/web/src/ClassicalComponent/test.html`);

      const page = (await utils.browser.pages()).filter((x) => {
        const parsedUrl = new URL(x.url());
        parsedUrl.search = "";
        const strippedUrl = parsedUrl.toString();

        console.log(strippedUrl);

        return (
          strippedUrl ===
          "file:///Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.html"
        );
      })[0];
      console.log("gutentag", page);

      // const client = await page.target().createCDPSession();
      // await client.send("Page.setDownloadBehavior", {
      //   behavior: "allow",
      //   downloadPath: ".~/Code/kokomoBay/docs/",
      // });

      await page.screenshot({
        // cwd: "./node/src/Rectangle/Rectangle.test.node/",
        path: "rectangle-beforeAll.jpg",
      });
      // return input;
      res(input);
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
  afterAll: async (store, artificer, browser) => {
    // const page = (await browser.pages())[0]; //.map((x) => x.url())); // === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
    console.log("delta");
  },
};

export const RectangleTesteranto = Testeranto(
  "RectangleTesterantoBasePrototype",
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);

export {};
