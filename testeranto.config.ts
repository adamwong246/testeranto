import { TesterantoProject } from "./src/Project"

export default new TesterantoProject(
  [
    [
      'Rectangle', './tests/Rectangle/Rectangle.test.ts', 'RectangleTesteranto'],
    [
      'Redux', './tests/Redux+Reselect+React/app.redux.test.ts', 'AppReduxTesteranto'],
    [
      'ReduxToolkit', './tests/Redux+Reselect+React/app.reduxToolkit.test.ts', 'AppReduxToolkitTesteranto'],
    [
      'ServerHttpPuppeteer', './tests/httpServer/server.http.test.ts', 'ServerHttpTesteranto'],
    [
      'ServerHttp', './tests/httpServer/server.puppeteer.test.ts', 'ServerHttpPuppeteerTesteranto'],
  ],
  './tests/testerantoFeatures.test.ts',
  // __filename
);
