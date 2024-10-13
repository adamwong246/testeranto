import { ITProject } from "testeranto/src/Project";

import { solCompile } from "./myTests/truffle.mjs";

export default new ITProject({
  debugger: false,
  clearScreen: false,
  devMode: true,
  features: 'features.test.mts',
  minify: false,
  outbase: ".",
  outdir: "dist",
  tests: 'tests.test.mts',
  externals: ["ganache"],
  ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],

  webPlugins: [],

  nodePlugins: [
    {
      name: 'ganache-shim',
      setup(build) {
        build.onResolve({ filter: /.*/ }, args => {
          // console.log("mark4", args.path);

          // return ({
          //   path: "MyFirstContract",
          //   namespace: 'ganache-shim',
          // })
        })
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
      name: 'solidity',
      setup(build) {
        build.onResolve({ filter: /^.*\.sol$/ }, args => {
          return ({
            path: "MyFirstContract",
            namespace: 'solidity',
          })
        })
        build.onLoad({ filter: /.*/, namespace: 'solidity' }, async (argz) => {
          return ({
            contents: JSON.stringify((await solCompile(argz.path))),
            loader: 'json',
            watchDirs: [process.cwd() + "/contracts"]
          })
        })
      },
    }
  ]
});
