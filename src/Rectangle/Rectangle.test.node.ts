import Testeranto from "testeranto/src/SubPackages/puppeteer";
import {
  IPartialNodeInterface
} from "testeranto/src/Types";

import {
  IRectangleTestShape,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";

const testInterface: IPartialNodeInterface<IRectangleTestShape> = {
  afterAll: async (store, artificer, browser) => {
    const page = ((await browser.pages()).filter((x) => x.url() === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
    page.screenshot({
      path: 'dist/afterall.jpg'
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
