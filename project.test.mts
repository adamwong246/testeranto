import { ITProject } from "testeranto/src/Project";

import { solCompile } from "./myTests/truffle.mjs";

export default new ITProject({
  devMode: false,
  clearScreen: false,

  features: 'features.test.mts',
  tests: 'tests.test.mts',
  __dirname: `~/Code/kokomoBay`,
  outbase: ".",
  outdir: "dist",
  minify: false,

  ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],

  loaders: [
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
