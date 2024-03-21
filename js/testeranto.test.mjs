import { ITProject } from "testeranto/src/Project";
import { solCompile } from "./myTests/truffle.mjs";
import features from "./testerantoFeatures.test.mjs";
import tests from "./tests.test.mjs";
export default new ITProject({
    __dirname: `~/Code/kokomoBay`,
    features,
    outbase: ".",
    outdir: "dist",
    buildMode: "watch",
    runMode: true,
    clearScreen: false,
    collateEntry: "index.tsx",
    collateMode: "on",
    minify: false,
    ports: ["3001", "3002", "3003", "3004", "3005", "3006", "3007"],
    tests,
    loaders: [
        {
            name: 'solidity',
            setup(build) {
                // console.log("solidity build", build)
                build.onResolve({ filter: /^.*\.sol$/ }, args => {
                    return ({
                        path: "MyFirstContract",
                        namespace: 'solidity',
                    });
                });
                build.onLoad({ filter: /.*/, namespace: 'solidity' }, async (argz) => {
                    return ({
                        contents: JSON.stringify((await solCompile(argz.path))),
                        loader: 'json',
                        watchDirs: [process.cwd() + "/contracts"]
                    });
                });
            },
        }
    ]
});
