import { solCompile } from "./myTests/solidity/truffle.mjs";
import features from "./myTests/testerantoFeatures.test.mjs";
import { IBaseConfig } from "testeranto/src/IBaseConfig.js";

const baseConfig: IBaseConfig = {
  __dirname: `~/Code/kokomoBay`,
  features,
  collateEntry: "index.tsx",
  // tty: false,
  clearScreen: false,
  // watchMode: true,
  outdir: "js",
  outbase: ".",
  // resultsdir: "resultsdir",
  minify: false,

  ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],

  tests: [

    [
      "./myTests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx", "node"
    ],
    [
      "./myTests/ClassicalReact/ClassicalComponent.electron.test.ts",
      "electron",
    ],
    ["./myTests/Rectangle/Rectangle.test.node.ts", "node"],
    ["./myTests/Rectangle/Rectangle.test.electron.ts", "electron"],

    // "./myTests/solidity/MyFirstContract.solidity-precompiled.test.ts",
    // "./myTests/storefront/alpha/index.test.ts",
    // "./myTests/storefront/beta/index.test.ts",
    // "./myTests/solidity/MyFirstContract.solidity.test.ts",
    // "./myTests/solidity/MyFirstContract.solidity-rpc.test.ts",
    // ["./myTests/Redux+Reselect+React/app.redux.test.ts", "electron"],
    // "./myTests/Redux+Reselect+React/app.reduxToolkit.test.ts",
    // "./myTests/httpServer/server.http.test.ts",
    // "./myTests/httpServer/server.puppeteer.test.ts",
    // "./myTests/httpServer/server.http2x.test.ts",
    // "./myTests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx",
    // "./myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts",
    // ["./myTests/Rectangle/Rectangle.test.puppeteer.ts", "puppeteer"],
    // ["./myTests/Redux+Reselect+React/app.redux.test.ts", "node"],
    // ["./myTests/Redux+Reselect+React/LoginPage.test.ts", "node"]
  ],
  loaders: [
    // {
    //   name: 'solidity',
    //   setup(build) {
    //     // console.log("solidity build", build)
    //     build.onResolve({ filter: /^.*\.sol$/ }, args => {
    //       return ({
    //         path: "MyFirstContract",
    //         namespace: 'solidity',
    //       })
    //     })
    //     build.onLoad({ filter: /.*/, namespace: 'solidity' }, async (argz) => {
    //       return ({
    //         contents: JSON.stringify((await solCompile(argz.path))),
    //         loader: 'json',
    //         watchDirs: [process.cwd() + "/contracts"]
    //       })
    //     })
    //   },
    // }
  ],
  collateMode: "on",
  runMode: false,
  buildMode: "on",
};

export default baseConfig;
