import features from "./testerantoFeatures.test.mjs";
const baseConfig = {
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
        // ["./src/google.puppeteer.testeranto.test.ts", "node", []],
        // ["./src/app.redux.test.ts", "node", []],
        // ["./src/app.reduxToolkit.test.ts", "node", []],
        // ["./src/ClassicalComponent.electron.test.ts", "electron", []],
        // ["./src/ClassicalComponent.react-test-renderer.test.tsx", "node", []],
        // ["./src/LoginPage.electron.test.ts", "electron", []],
        // ["./src/LoginPage.react-test-renderer.test.ts", "node", []],
        // ["./src/Rectangle/Rectangle.test.electron.ts", "electron", []],
        // ["./src/Rectangle/Rectangle.test.node.ts", "node", []],
        // ["./src/server.http.test.ts", "node", [["src/ClassicalComponent.tsx", "electron", []], ["src/LoginPage.tsx", "electron", []]]],
        // not working
        // [
        //   "./src/ClassicalComponent.esbuild-puppeteer.test.ts",
        //   "node",
        //   [["src/ClassicalComponent.tsx", "electron", []]]
        // ],
        // ["./src/MyFirstContract.solidity.test.ts", "node", []],
        ["./src/MyFirstContract.solidity-rpc.test.ts", "node", []],
        // "./myTests/storefront/alpha/index.test.ts",
        // "./myTests/storefront/beta/index.test.ts",
        // "./myTests/httpServer/server.puppeteer.test.ts",
        // "./myTests/httpServer/server.http2x.test.ts",
        // ["./myTests/Rectangle/Rectangle.test.puppeteer.ts", "puppeteer"],
        // ["./myTests/solidity/MyFirstContract.solidity-precompiled.test.ts", "node", []],
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
