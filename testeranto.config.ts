import { TesterantoProject } from "./src/Project"

export default new TesterantoProject(
  [
    [
      'MyFirstContract', './tests/solidity/MyFirstContract.test.ts', 'MyFirstContractTesteranto'],
    // [
    //   'Rectangle', './tests/Rectangle/Rectangle.test.ts', 'RectangleTesteranto'],
    // [
    //   'Redux', './tests/Redux+Reselect+React/app.redux.test.ts', 'AppReduxTesteranto'],
    // [
    //   'ReduxToolkit', './tests/Redux+Reselect+React/app.reduxToolkit.test.ts', 'AppReduxToolkitTesteranto'
    // ],
    // [
    //   'ReactTesteranto', './tests/Redux+Reselect+React/LoginPage.test.ts', 'AppReactTesteranto'
    // ],
    // [
    //   'ServerHttpPuppeteer', './tests/httpServer/server.http.test.ts', 'ServerHttpTesteranto'],
    // [
    //   'ServerHttp', './tests/httpServer/server.puppeteer.test.ts', 'ServerHttpPuppeteerTesteranto'],

    // [
    //   'ClassicalComponentReactTestRenderer',
    //   './tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx',
    //   'ClassicalComponentReactTestRendererTesteranto'
    // ],
    // [
    //   'ClassicalComponentEsbuildPuppeteer',
    //   './tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts',
    //   'ClassicalComponentEsbuildPuppeteerTesteranto'
    // ],
  ],
  './tests/testerantoFeatures.test.ts',
  // __filename
);
