// import Rectangle from "./Rectangle/Rectangle.test";
import LoginSelector from "./Redux+Reselect+React/LoginSelector.test";
import LoginStore from "./Redux+Reselect+React/LoginStore.test";
import LoginPage from "./Redux+Reselect+React/LoginPage.test";
import HttpServerTests from "./httpServer/server.http.test";

// import * as ReactDOMServer from "react-dom/server";
// import { ClassicalComponent } from "./ClassicalReact/ClassicalComponent";
// import React from "react";

import reporter from "../src/reporter";

reporter([
  LoginStore(),
  LoginSelector(),
  // Rectangle(),
  LoginPage(),
  HttpServerTests(),
]);

// const puppeteer = require("puppeteer");
// // import * as puppeteer from 'puppeteer';

// const doIt = async () => {
//   console.log("start");
//   const browser = await puppeteer.launch({
//     headless: true,
//     executablePath:
//       "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//   });
//   console.log("launched");
//   const page = await browser.newPage();
//   console.log("navigated");
//   await page.goto("https://adamwong246.github.io/resume.html");

//   const htmlContent = ReactDOMServer.renderToString(
//     React.createElement(ClassicalComponent, { foo: "hello puppeteer!" }, [])
//   );
//   await page.setContent(htmlContent);

//   console.log("navigated");
//   await page.screenshot({ path: `./dist/screenshot.jpg` });
//   console.log("done");
//   process.exit(0);
// };

// doIt();
