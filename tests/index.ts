import { AppReduxTesteranto } from "./Redux+Reselect+React/app.redux.test";
import { AppReduxToolkitTesteranto } from "./Redux+Reselect+React/app.reduxToolkit.test";
import { AppReactTesteranto } from "./Redux+Reselect+React/LoginPage.test";

import { ServerHttpTesteranto } from "./httpServer/server.http.test";
import { ServerHttpPuppeteerTesteranto } from "./httpServer/server.puppeteer.test";

import reporter from "../src/reporter";

reporter([
  new AppReduxTesteranto()[0],
  new AppReduxToolkitTesteranto()[0],
  new AppReactTesteranto()[0],
  new ServerHttpTesteranto()[0],
  // new ServerHttpPuppeteerTesteranto()[0],
]);

// import { AppReduxTesteranto } from "./Redux+Reselect+React/app.redux.test";

// import Rectangle from "./Rectangle/Rectangle.test";
// import LoginSelector from "./Redux+Reselect+React/LoginSelector.test";
// import LoginStore from "./Redux+Reselect+React/LoginStore.test";
// import LoginPage from "./Redux+Reselect+React/LoginPage.test";

// import ClassicalReactTests from "./ClassicalReact/ClassicalComponent.react-test-renderer.test";
// import ClassicalReactEsBuildPuppeteer from "./ClassicalReact/ClassicalComponent.esbuild-puppeteer.test";

// Rectangle(),
// LoginStore(),
// LoginSelector(),
// LoginPage(),
// HttpServerTests(),
// ClassicalReactTests(),
// ClassicalReactEsBuildPuppeteer(),
