import { ITProject } from "testeranto/src/Project";

import { solidityEsBuildConfig } from "./subPackages/solidity/index.js";

export default new ITProject({
  outdir: "docs",
  features: "/Users/adam/Code/kokomoBay/features.test.mts",
  tests: [
    // Don't use these tests.
    // Testing react components with the react package is not useful
    // Use react-dom or react-test-renderer instead for testing components
    // these test might be useful if you are testing react itself, rather than a react component
    // ["./src/LoginPage/react/web.test.tsx", "web", { ports: 0 }, []],
    // ["./src/LoginPage/react/node.test.tsx", "node", { ports: 0 }, []],

    [
      "./src/LoginPage/react-test-renderer/web.test.tsx",
      "web",
      { ports: 0 },
      [],
    ],
    ["./src/Rectangle/Rectangle.test.electron.ts", "web", { ports: 0 }, []],
    [
      "./src/ClassicalComponent/react-dom/client.web.test.tsx",
      "web",
      { ports: 0 },
      [],
    ],

    [
      "./src/LoginPage/react-test-renderer/node.test.tsx",
      "node",
      { ports: 0 },
      [],
    ],
    ["./src/ReactStateAndHook.test.tsx", "node", { ports: 0 }, []],
    ["./src/app.reduxToolkit.test.ts", "node", { ports: 0 }, []],
    ["./src/app.redux.test.ts", "node", { ports: 0 }, []],
    [
      "./src/Rectangle/Rectangle.test.node.ts",
      "node",
      { ports: 0 },
      [["./src/ClassicalComponent/test.ts", "web", { ports: 0 }, []]],
    ],
    ["./src/MyFirstContract.basic.test.ts", "node", { ports: 0 }, []],
    ["./src/MyFirstContract.rpc.test.ts", "node", { ports: 1 }, []],

    // [
    //   "./src/MyFirstContract.solidity-react.testeranto.ts",
    //   "node",
    //   { ports: 1 },
    //   [["./src/MyFirstContractUI.tsx", "web", { ports: 0 }, []]],
    // ],
  ],

  debugger: true,
  clearScreen: false,
  devMode: true,
  minify: false,
  outbase: ".",
  externals: ["ganache", "stream"],
  ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],

  webPlugins: [solidityEsBuildConfig],

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
    solidityEsBuildConfig,
    // {
    //   name: "solidity",
    //   setup(build) {
    //     build.onResolve({ filter: /^.*\.sol$/ }, (args) => {
    //       return {
    //         path: "MyFirstContract",
    //         namespace: "solidity",
    //       };
    //     });
    //     build.onLoad({ filter: /.*/, namespace: "solidity" }, async (argz) => {
    //       return {
    //         contents: JSON.stringify(await solCompile(argz.path)),
    //         loader: "json",
    //         watchDirs: [process.cwd() + "/contracts"],
    //       };
    //     });
    //   },
    // },
  ],
});
