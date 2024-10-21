import Testeranto from "testeranto/src/Web";

// const { BrowserWindow, app } = require("electron");
// console.log("mark3", BrowserWindow, app);
// debugger

// const remote = require('@electron/remote')
// remote.BrowserWindow()

// const win = new remote.BrowserWindow();
// const url = "https://www.news.com/";
// win.loadURL(url);

// console.log(await browser.pages());
// const page = await pie.getPage(browser, win);
// await page.screenshot({
//   path: 'google.jpg'
// });

import {
  IRectangleTestShape,
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";

export const RectangleTesteranto = Testeranto(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  {
    afterAll: async (store, artificer, utils) => {
      return new Promise(async (res, rej) => {
        console.log("mark00", (await utils.browser).pages);
        const page = (await utils.browser.pages()).filter((x) => {
          const parsedUrl = new URL(x.url());
          parsedUrl.search = "";
          const strippedUrl = parsedUrl.toString();
          console.log("mark3", strippedUrl);
          return (
            strippedUrl ===
            "file:///Users/adam/Code/kokomoBay/docs/web/src/Rectangle/Rectangle.test.electron.html"
          );
          // return true;
        })[0];

        await page.screenshot({
          path: "bannana5.jpg",
        });

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

      console.log("do it");
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
  }
);

export {};
