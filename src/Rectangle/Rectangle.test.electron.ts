import Testeranto from "testeranto/src/Web";

// const { BrowserWindow, app } = require("electron");
// console.log("mark3", BrowserWindow, app);
// debugger

const remote = require('@electron/remote')
// remote.BrowserWindow()

const win = new remote.BrowserWindow();
const url = "https://www.news.com/";
win.loadURL(url);

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
  RectangleTesterantoBaseInterface,
);

export { };
