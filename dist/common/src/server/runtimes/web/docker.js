"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webBddCommand = exports.webBuildCommand = exports.webDockerComposeFile = void 0;
const webDockerComposeFile = (config, container_name, fpath) => {
    return {
        platform: "linux/arm64",
        build: {
            context: process.cwd(),
            dockerfile: config[container_name].dockerfile,
        },
        container_name,
        environment: {
        // NODE_ENV: "production",
        // ...config.env,
        },
        working_dir: "/workspace",
        volumes: [
            `${process.cwd()}/src:/workspace/src`,
            `${process.cwd()}/example:/workspace/example`,
            `${process.cwd()}/dist:/workspace/dist`,
            `${process.cwd()}/testeranto:/workspace/testeranto`,
        ],
        command: (0, exports.webBuildCommand)(fpath),
    };
};
exports.webDockerComposeFile = webDockerComposeFile;
const webBuildCommand = (fpath) => {
    // return `yarn tsx src/server/runtimes/web/web.ts /workspace/${fpath}`;
    return `yarn tsx src/server/runtimes/web/web.ts /workspace/${fpath}`;
};
exports.webBuildCommand = webBuildCommand;
const webBddCommand = (fpath) => {
    // return `node ${fpath} /workspace/web.js `;x
    return `node dist/prebuild/server/runtimes/web/hoist.mjs `;
};
exports.webBddCommand = webBddCommand;
// export const webBuildCommand = () => {
//   return `yarn tsx src/server/runtimes/web/web.ts testeranto/runtimes/web/web.js`
// }
// export const webBddCommand = () => {
//   return `yarn tsx  src/server/runtimes/web/hoist.ts testeranto/bundles/allTests/web/example/Calculator.test.mjs`
// }
