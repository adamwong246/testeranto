import { AppReduxTesteranto } from "./Redux+Reselect+React/app.redux.test";
import { AppReduxToolkitTesteranto } from "./Redux+Reselect+React/app.reduxToolkit.test";
import { AppReactTesteranto } from "./Redux+Reselect+React/LoginPage.test";

import { ServerHttpTesteranto } from "./httpServer/server.http.test";
import { ServerHttpPuppeteerTesteranto } from "./httpServer/server.puppeteer.test";

import reporter from "../src/reporter";

export type ITestResource = "port";

reporter(
  [
    new AppReduxTesteranto()[0],
    new AppReduxToolkitTesteranto()[0],
    new AppReactTesteranto()[0],
    new ServerHttpTesteranto()[0],
    new ServerHttpPuppeteerTesteranto()[0],
  ],
  {
    ports: [3000, 3001],
  }
);
