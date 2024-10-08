import { ITestTypes } from "testeranto/src/Types";

export default [
  ["./src/LoginPage/react/web.test.tsx", "web", []],
  ["./src/LoginPage/react/node.test.tsx", "node", []],
  ["./src/LoginPage/react-test-renderer/web.test.tsx", "web", []],
  ["./src/LoginPage/react-test-renderer/node.test.tsx", "node", []],
  ["./src/ClassicalComponent/react-test-renderer/web.test.tsx", "web", []],
  ["./src/ClassicalComponent/react-test-renderer/node.test.tsx", "node", []],
  ["./src/ClassicalComponent/react-dom/client.web.test.tsx", "web", []],
  ["./src/ClassicalComponent/react-dom/server.node.test.tsx", "node", []],

  // ["./src/ReactStateAndHook.test.tsx", "node", []],
  // ["./src/google.puppeteer.testeranto.test.ts", "node", []],
  // ["./src/app.redux.test.ts", "node", []],
  // ["./src/app.reduxToolkit.test.ts", "node", []],
  // ["./src/ClassicalComponent.electron.test.ts", "web", []],
  // ["./src/ClassicalComponent.react-test-renderer.test.tsx", "node", []],
  // ["./src/LoginPage.electron.test.ts", "web", []],
  // ["./src/LoginPage.react-test-renderer.test.ts", "node", []],
  // ["./src/Rectangle/Rectangle.test.electron.ts", "web", []],
  // ["./src/Rectangle/Rectangle.test.node.ts", "node", []],
  // [
  //   "./src/ClassicalComponent.esbuild-puppeteer.test.ts",
  //   "node",
  //   [["src/ClassicalComponent.tsx", "web", []]]
  // ],

  // ["./src/MyFirstContract.solidity.test.ts", "node", []],
  // ["./src/MyFirstContract.solidity-precompiled.test.ts", "node", []],
  // ["./src/MyFirstContract.solidity-rpc.test.ts", "node", []],
  // ["./src/server.http.test.ts", "node", [["src/ClassicalComponent.tsx", "web", []], ["src/LoginPage.tsx", "web", []]]],
  // ["./src/Rectangle.test.puppeteer.ts", "puppeteer", []], // maybe works?
  // not working
  // "./myTests/storefront/alpha/index.test.ts",
  // "./myTests/storefront/beta/index.test.ts",
  // "./myTests/httpServer/server.puppeteer.test.ts",
  // "./myTests/httpServer/server.http2x.test.ts",
] as ITestTypes[]