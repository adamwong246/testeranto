import Testeranto from "testeranto/src/Web";

import {
  IRectangleTestShape,
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";
import Rectangle from "../Rectangle";

export default Testeranto(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  {
    beforeEach: async (rectangleProto, init, artificer, tr, x, pm) => {
      pm.writeFileSync("beforeEachLog", "bar");
      return rectangleProto;
    },
    afterAll: async (store, artificer, utils) => {
      return new Promise(async (res, rej) => {
        console.log("afterAll", utils);
        utils.writeFileSync("afterAllLog", "bar");
        const page = (await utils.browser.pages()).filter((x) => {
          const parsedUrl = new URL(x.url());
          parsedUrl.search = "";
          const strippedUrl = parsedUrl.toString();

          return (
            strippedUrl ===
            "file:///Users/adam/Code/kokomoBay/docs/web/src/Rectangle/Rectangle.test.electron.html"
          );
          // return true;
        })[0];

        page.screenshot({
          path: "afterAllLog.jpg",
        });

        // const x = await utils.writeFileSync("aloha", "world");
        // console.log("x", x);

        // utils.writeFileSync("maude", "pants");
        // await window["custom-screenshot"]("bannana227.jpg");
        // const { uid } = utils.createWriteStream("hello");
        // utils.write(uid, "world");

        res(store);
      });

      // utils.browser.webContents
      //   .capturePage({
      //     x: 0,
      //     y: 0,
      //     width: 80,
      //     height: 600,
      //   })
      //   .then((z) => {
      //     console.log(z);
      //     artificer("afterAll.png", z.toPNG());
      //   });

      // console.log("do it");
      // debugger;
      // utils.ipc.postMessage("kill yourself");
      // utils.ipc.sendSync("message", "kill yourself");
      // utils.ipc.send("message", "kill yourself");
      // debugger
      // console.log("howdy", browser);
      // const page = (await browser.pages())[0];//.map((x) => x.url())); // === 'file:///Users/adam/Code/kokomoBay/dist/web/src/ClassicalComponent/test.html'))[0]
      // console.log("page", await (browser.BrowserWindow.pages));
      // artificer("browser", browser);
      // await page.screenshot({
      //   path: 'hello99.jpg'
      // })
    },
    andWhen: async function (
      s: Rectangle,
      whenCB,
      tr,
      utils
    ): Promise<Rectangle> {
      utils.writeFileSync("andWhenLog", "icecream");
      return whenCB(s);
    },
  }
);

export {};
