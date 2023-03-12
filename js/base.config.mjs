import features from "./myTests/testerantoFeatures.test.mjs";
export default {
    features,
    collateEntry: "MyReport.tsx",
    "tty": false,
    "clearScreen": false,
    "watchMode": true,
    "outdir": "js",
    "outbase": ".",
    "resultsdir": "resultsdir",
    "minify": false,
    "ports": [
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
    ],
    tests: [
        // "./myTests/solidity/MyFirstContract.solidity-precompiled.test.ts",
        "./myTests/storefront/alpha/index.test.ts",
        "./myTests/storefront/beta/index.test.ts",
        "./myTests/solidity/MyFirstContract.solidity.test.ts",
        "./myTests/solidity/MyFirstContract.solidity-rpc.test.ts",
        "./myTests/Rectangle/Rectangle.test.ts",
        "./myTests/Redux+Reselect+React/app.redux.test.ts",
        "./myTests/Redux+Reselect+React/app.reduxToolkit.test.ts",
        "./myTests/Redux+Reselect+React/LoginPage.test.ts",
        "./myTests/httpServer/server.http.test.ts",
        "./myTests/httpServer/server.puppeteer.test.ts",
        "./myTests/httpServer/server.http2x.test.ts",
        "./myTests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx",
        "./myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts",
    ],
    "loaders": [
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
};
