import { ITProject } from "testeranto/src/Project";

import { solCompile } from "./myTests/truffle.mjs";

export default new ITProject({
  outdir: "docs",
  features: "/Users/adam/Code/kokomoBay/features.test.mts",
  tests: [
    ["./src/LoginPage/react/web.test.tsx", "web", []],
    ["./src/LoginPage/react/node.test.tsx", "node", []],
    ["./src/LoginPage/react-test-renderer/web.test.tsx", "web", []],
    ["./src/LoginPage/react-test-renderer/node.test.tsx", "node", []],
    ["./src/ReactStateAndHook.test.tsx", "node", []],
    ["./src/app.reduxToolkit.test.ts", "node", []],
    ["./src/app.redux.test.ts", "node", []],
    ["./src/Rectangle/Rectangle.test.electron.ts", "web", []],

    ["./src/MyFirstContract.solidity-precompiled.test.ts", "node", []],

    // broken
    ["./src/MyFirstContract.solidity.test.ts", "node", []],
    [
      "./src/Rectangle/Rectangle.test.node.ts",
      "node",
      [["./src/ClassicalComponent/test.ts", "web", []]],
    ],
  ],

  debugger: true,
  clearScreen: false,
  devMode: true,
  //
  // tests: 'tests.test.mts',
  minify: false,
  outbase: ".",
  externals: ["ganache", "stream"],
  ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],

  webPlugins: [],

  nodePlugins: [
    {
      name: "ganache-shim",
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          // console.log("mark4", args.path);
          // return ({
          //   path: "MyFirstContract",
          //   namespace: 'ganache-shim',
          // })
        });
        // build.onLoad({ filter: /.*/, namespace: 'ganache-shim' }, async (argz) => {
        //   return ({
        //     contents: JSON.stringify((await solCompile(argz.path))),
        //     loader: 'json',
        //     watchDirs: [process.cwd() + "/contracts"]
        //   })
        // })
      },
    },

    {
      name: "solidity",
      setup(build) {
        build.onResolve({ filter: /^.*\.sol$/ }, (args) => {
          return {
            path: "MyFirstContract",
            namespace: "solidity",
          };
        });
        build.onLoad({ filter: /.*/, namespace: "solidity" }, async (argz) => {
          return {
            contents: JSON.stringify(await solCompile(argz.path)),
            loader: "json",
            watchDirs: [process.cwd() + "/contracts"],
          };
        });
      },
    },
  ],
});
