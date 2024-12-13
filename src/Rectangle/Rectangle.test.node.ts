import Testeranto from "testeranto/src/Node";
// import {
//   IPartialNodeInterface,
//   INodeTestInterface,
//   TBrowser
// } from "testeranto/src/Types";

// import {
//   IRectangleTestShape,
//   RectangleTesterantoBasePrototype,
//   RectangleTesterantoBaseTestImplementation,
//   RectangleTesterantoBaseTestSpecification,
// } from "../../src/Rectangle.test";
import { INodeTestInterface } from "../../../testeranto/src/lib/types";
import { IPartialNodeInterface } from "testeranto/src/Types";
import Rectangle from "../Rectangle";
import { RectangleTesterantoBasePrototype } from "../Rectangle.test";
import { RectangleTesterantoBaseTestImplementation } from "../Rectangle.test.implementation";
import { IRectangleTestShape } from "../Rectangle.test.shape";
import { RectangleTesterantoBaseTestSpecification } from "../Rectangle.test.specification";

let guid;

const testInterface: IPartialNodeInterface<IRectangleTestShape> = {
  beforeAll(input, testResource, artificer, utils) {
    return new Promise(async (res, rej) => {
      const x = Object.create(input);

      const page = (await utils.browser.pages()).filter((p) => {
        const parsedUrl = new URL(p.url());

        console.log("beforeAll parsedUrl", parsedUrl);

        parsedUrl.search = "";
        const strippedUrl = parsedUrl.toString();
        console.log("mark3", strippedUrl);
        return (
          strippedUrl ===
          "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/test.html"
        );
      })[0];

      // console.log("mark-pages", await utils.browser.pages());
      await page.screenshot({
        path: "rectangle-beforeAll.jpg",
      });
      res(input);

      // res(x);

      // console.log("brower: ", utils.browser);
      // const page = await utils.browser.newPage();
      // await page.setViewport({ width: 1920, height: 1080 });
      // await page.goto("https://scrapingbee.com");
      // await page.screenshot({ path: `./scrapingbee_homepage.jpg` });
      // await page.close();
      // // await this.browser.close();
      // const x = Object.create(input);
      // console.log("beforeAll", x);
      // res(x);

      // utils.ipc.on("message", async (e) => {
      //   if (e.data.webLaunched) {
      //     guid = e.data.webLaunched;

      //     console.log("mark2", utils.browser);
      //     const page = (await utils.browser.pages()).filter((x) => {
      //       const parsedUrl = new URL(x.url());
      //       parsedUrl.search = "";
      //       const strippedUrl = parsedUrl.toString();
      //       console.log("mark3", strippedUrl);
      //       return (
      //         strippedUrl ===
      //         "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/test.html"
      //       );
      //     })[0];

      //     await page.screenshot({
      //       path: "rectangle-beforeAll.jpg",
      //     });
      //     res(input);
      //   }
      // });

      // console.log("mark1");
      // utils.ipc.postMessage({
      //   launchWeb: `/docs/web/src/ClassicalComponent/test.html`,
      // });
    });
  },
  // beforeEach: async (): Promise<any> => {
  //   // console.log("beta");
  //   return new Promise((resolve, rej) => {
  //     resolve(React.createElement(testInput, {}, []));
  //   });
  // },
  andWhen: async function (s: Rectangle, whenCB): Promise<Rectangle> {
    // console.log("gamma", s, whenCB.toString());
    return whenCB(s);
  },

  assertThis: (x) => {},
  afterAll: async (store, artificer, utils) => {
    // const page = (await browser.pages())[0]; //.map((x) => x.url())); // === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
    // utils.ipc.postMessage({
    //   teardown: guid,
    // });
    // console.log("delta!", guid);
  },
};

export default Testeranto(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);
