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
      utils.browser.webContents
        .capturePage({
          x: 0,
          y: 0,
          width: 80,
          height: 600,
        })
        .then((z) => {
          console.log(z);
          artificer("afterAll.png", z.toPNG());
        });

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
