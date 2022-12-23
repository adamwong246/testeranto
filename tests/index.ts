// import { ClassicalComponentEsbuildPuppeteerTesteranto } from "./ClassicalReact/ClassicalComponent.esbuild-puppeteer.test";
// import { ClassicalComponentReactTestRendererTesteranto } from "./ClassicalReact/ClassicalComponent.react-test-renderer.test";

// import { ServerHttpPuppeteerTesteranto } from "./httpServer/server.puppeteer.test";



import { RectangleTesteranto } from "./Rectangle/Rectangle.test";
import { AppReduxTesteranto } from "./Redux+Reselect+React/app.redux.test";
import { ServerHttpTesteranto } from "./httpServer/server.http.test";
import { ServerHttpPuppeteerTesteranto } from "./httpServer/server.puppeteer.test";
import { AppReduxToolkitTesteranto } from "./Redux+Reselect+React/app.reduxToolkit.test";
import { AppReactTesteranto } from "./Redux+Reselect+React/LoginPage.test";


import { ClassicalComponentEsbuildPuppeteerTesteranto } from "./ClassicalReact/ClassicalComponent.esbuild-puppeteer.test";

import { reporter } from "../src/reporter";

export type ITestResource = "port";

reporter(
  [
    new RectangleTesteranto()[0],
    new AppReduxTesteranto()[0],
    new AppReduxToolkitTesteranto()[0],
    new AppReactTesteranto()[0],
    new ServerHttpTesteranto()[0],
    new ServerHttpPuppeteerTesteranto()[0],
    new ClassicalComponentEsbuildPuppeteerTesteranto()[0],
    // new ClassicalComponentReactTestRendererTesteranto()[0],
    
  ],
  {
    ports: [3000],
  }
);
