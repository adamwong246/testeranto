import { ITProject } from "testeranto/src/Project";
import fs from "fs";
import { solCompile } from "./myTests/truffle.mjs";
import { IJsonConfig } from "testeranto/src/Types";
import { jsonc } from 'jsonc';
// import configs from "./testeranto.json"  assert { type: "jsonc" };

const configs = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString()) as IJsonConfig;


export default new ITProject({
  ...configs,

  debugger: true,
  clearScreen: false,
  devMode: true,
  // 
  // tests: 'tests.test.mts',
  minify: false,
  outbase: ".",
  externals: [
    "ganache",
    "stream"
  ],
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
