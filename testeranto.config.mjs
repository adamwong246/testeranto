var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { solCompile } from "./tests/solidity/truffle.mjs";
export const f = "";
export default {
    "watchMode": true,
    "loaders": [
        {
            name: 'solidity',
            setup(build) {
                console.log("solidity build", build);
                build.onResolve({ filter: /^.*\.sol$/ }, args => {
                    return ({
                        path: "MyFirstContract",
                        namespace: 'solidity',
                    });
                });
                build.onLoad({ filter: /.*/, namespace: 'solidity' }, (argz) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        contents: JSON.stringify((yield solCompile(argz.path))),
                        loader: 'json',
                        watchDirs: [process.cwd() + "/contracts"]
                    });
                }));
            },
        }
    ],
    "tests": [
        // "./tests/solidity/MyFirstContract.solidity-precompiled.test.ts",
        // "./tests/storefront/alpha/index.test.ts",
        // "./tests/storefront/beta/index.test.ts",
        // "./tests/solidity/MyFirstContract.solidity.test.ts",
        // "./tests/solidity/MyFirstContract.solidity-rpc.test.ts",
        "./tests/Rectangle/Rectangle.test.ts",
        "./tests/Redux+Reselect+React/app.redux.test.ts",
        "./tests/Redux+Reselect+React/app.reduxToolkit.test.ts",
        "./tests/Redux+Reselect+React/LoginPage.test.ts",
        // "./tests/httpServer/server.http.test.ts",
        // "./tests/httpServer/server.puppeteer.test.ts",
        // "./tests/httpServer/server.http2x.test.ts",
        // "./tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx",
        // "./tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts",
    ],
    "features": "./tests/testerantoFeatures.test.js",
    "ports": [
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "3008",
        "3009",
        "3010"
    ]
};
