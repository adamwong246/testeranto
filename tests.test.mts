import { ITestTypes } from "testeranto/src/Project";

export default [
  [
    "./src/app.redux.test.ts",
    "node",
    []
  ],
  ["./src/app.reduxToolkit.test.ts", "node", []],
  ["./src/ClassicalComponent.electron.test.ts", "electron", []],
  ["./src/ClassicalComponent.react-test-renderer.test.tsx", "node", []],
  ["./src/google.puppeteer.testeranto.test.ts", "node", []],
  ["./src/LoginPage.electron.test.ts", "electron", []],
  ["./src/LoginPage.react-test-renderer.test.ts", "node", []],
  ["./src/MyFirstContract.solidity-rpc.test.ts", "node", []],
  ["./src/MyFirstContract.solidity.test.ts", "node", []],
  ["./src/Rectangle/Rectangle.test.electron.ts", "electron", []],
  ["./src/Rectangle/Rectangle.test.node.ts", "node", []],
  ["./src/server.http.test.ts", "node", [["src/ClassicalComponent.tsx", "electron", []], ["src/LoginPage.tsx", "electron", []]]],
  ["./src/MyFirstContract.solidity-precompiled.test.ts", "node", []],
  // ["./src/Rectangle.test.puppeteer.ts", "puppeteer", []], // maybe works?
  // [
  //   "./src/ClassicalComponent.esbuild-puppeteer.test.ts",
  //   "node",
  //   [["src/ClassicalComponent.tsx", "electron", []]]
  // ],
  // not working
  // "./myTests/storefront/alpha/index.test.ts",
  // "./myTests/storefront/beta/index.test.ts",
  // "./myTests/httpServer/server.puppeteer.test.ts",
  // "./myTests/httpServer/server.http2x.test.ts",
] as ITestTypes[]