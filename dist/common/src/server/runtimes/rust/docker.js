"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rustBddCommand = exports.rustBuildCommand = exports.rustDockerComposeFile = void 0;
const rustDockerComposeFile = (config, container_name, fpath) => {
    return {
        build: {
            context: `${process.cwd()}`,
            dockerfile: config[container_name].dockerfile,
        },
        container_name,
        environment: Object.assign({ NODE_ENV: "production" }, config.env),
        working_dir: "/workspace",
        volumes: [
            `${process.cwd()}/src:/workspace/src`,
            `${process.cwd()}/example:/workspace/example`,
            `${process.cwd()}/dist:/workspace/dist`,
            `${process.cwd()}/testeranto:/workspace/testeranto`,
        ],
        command: (0, exports.rustBuildCommand)(fpath),
    };
};
exports.rustDockerComposeFile = rustDockerComposeFile;
const rustBuildCommand = (fpath) => {
    // return `cat /workspace/testeranto/runtimes/rust/rust.rs`
    // return `cat /workspace/${fpath}`
    // return `echo "${fpath}"`
    // return `CONFIG_PATH="/workspace/${fpath}"  rustc src/server/runtimes/rust/main.rs -o my_program`;
    return `sh -c "CONFIG_PATH=/workspace/${fpath} cargo build --release && ./target/release/my_program"`;
    // return `tree`
};
exports.rustBuildCommand = rustBuildCommand;
const rustBddCommand = (fpath) => {
    return `rustc testeranto/bundles/rust/${fpath} /workspace/rust.rs`;
};
exports.rustBddCommand = rustBddCommand;
