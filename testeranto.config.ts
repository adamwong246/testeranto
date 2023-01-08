import { TesterantoProject } from "./src/Project"

export default new TesterantoProject(
  [
    ['MyFirstContract', './tests/solidity/MyFirstContract.solidity.test.ts', 'MyFirstContractTesteranto'],
    ['MyFirstContractPlusRpc', './tests/solidity/MyFirstContract.solidity-rpc.test.ts', 'MyFirstContractPlusRpcTesteranto'],

    [
      'Rectangle', './tests/Rectangle/Rectangle.test.ts', 'RectangleTesteranto'],
    [
      'Redux', './tests/Redux+Reselect+React/app.redux.test.ts', 'AppReduxTesteranto'],
    [
      'ReduxToolkit', './tests/Redux+Reselect+React/app.reduxToolkit.test.ts', 'AppReduxToolkitTesteranto'
    ],
    [
      'ReactTesteranto', './tests/Redux+Reselect+React/LoginPage.test.ts', 'AppReactTesteranto'
    ],

    ['ServerHttp', './tests/httpServer/server.http.test.ts', 'ServerHttpTesteranto'],
    ['ServerHttpPuppeteer', './tests/httpServer/server.puppeteer.test.ts', 'ServerHttpPuppeteerTesteranto'],
    ['ServerHttp2x', './tests/httpServer/server.http2x.test.ts', 'ServerHttp2xTesteranto'],

    [
      'ClassicalComponentReactTestRenderer',
      './tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx',
      'ClassicalComponentReactTestRendererTesteranto'
    ],
    [
      'ClassicalComponentEsbuildPuppeteer',
      './tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts',
      'ClassicalComponentEsbuildPuppeteerTesteranto'
    ],
  ],
  './tests/testerantoFeatures.test.ts',
  ['3001', '3002', '3003']

);
