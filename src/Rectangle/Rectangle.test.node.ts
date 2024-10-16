import Testeranto from "testeranto/src/SubPackages/puppeteer";
import {
  IPartialNodeInterface,
  INodeTestInterface,
  TBrowser
} from "testeranto/src/Types";

import {
  IRectangleTestShape,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";

const testInterface: IPartialNodeInterface<IRectangleTestShape> = {
  assertThis: (x) => {

  },
  afterAll: async (store, artificer, browser) => {
    const page = (await browser.pages())[0];//.map((x) => x.url())); // === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
    console.log("page", page);
    await page.screenshot({
      path: 'hello98.jpg'
    })
  }
}

export const RectangleTesteranto = Testeranto(
  'RectangleTesterantoBasePrototype',
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  testInterface
);

export { };
