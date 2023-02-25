// import { solCompile } from "./tests/solidity/truffle.mjs";

export default {
  "loaders": [
    // {
    //   name: 'solidity',
    //   setup(build) {
    //     console.log("solidity build", build)

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
  "tests": [
    // [
    //   "MyFirstContractPrecompiledTesteranto",
    //   "./tests/solidity/MyFirstContract.solidity-precompiled.test.ts",
    //   "MyFirstContractPrecompiledTesteranto"
    // ],

    // [
    //   "storefrontAlpha",
    //   "./tests/storefront/alpha/index.test.ts",
    //   "StorefrontTest"
    // ]

    // [
    //   "StorefrontTestBeta",
    //   "./tests/storefront/beta/index.test.ts",
    //   "StorefrontTestBeta"
    // ],
    // [
    //   "MyFirstContract",
    //   "./tests/solidity/MyFirstContract.solidity.test.ts",
    //   "MyFirstContractTesteranto"
    // ],
    // [
    //   "MyFirstContractPlusRpc",
    //   "./tests/solidity/MyFirstContract.solidity-rpc.test.ts",
    //   "MyFirstContractPlusRpcTesteranto"
    // ],
    // [
    //   "Rectangle",
    //   "./tests/Rectangle/Rectangle.test.ts",
    //   "RectangleTesteranto"
    // ], [
    //   "Redux",
    //   "./tests/Redux+Reselect+React/app.redux.test.ts",
    //   "AppReduxTesteranto"
    // ], [
    //   "ReduxToolkit",
    //   "./tests/Redux+Reselect+React/app.reduxToolkit.test.ts",
    //   "AppReduxToolkitTesteranto"
    // ],

    // [
    //   "ReactTesteranto",
    //   "./tests/Redux+Reselect+React/LoginPage.test.ts",
    //   "AppReactTesteranto"
    // ],

    // [
    //   "ServerHttp",
    //   "./tests/httpServer/server.http.test.ts",
    //   "ServerHttpTesteranto"
    // ],
    // [
    //   "ServerHttpPuppeteer",
    //   "./tests/httpServer/server.puppeteer.test.ts",
    //   "ServerHttpPuppeteerTesteranto"
    // ],
    // [
    //   "ServerHttp2x",
    //   "./tests/httpServer/server.http2x.test.ts",
    //   "ServerHttp2xTesteranto"
    // ], [
    //   "ClassicalComponentReactTestRenderer",
    //   "./tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx",
    //   "ClassicalComponentReactTestRendererTesteranto"
    // ], 

    [
      "ClassicalComponentEsbuildPuppeteer",
      "./tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts",
      "ClassicalComponentEsbuildPuppeteerTesteranto"
    ]

  ],
  "features": "./tests/testerantoFeatures.test.ts",
  "ports": [
    "3001",
    "3002",
    "3003",
    "3004"
  ]
}