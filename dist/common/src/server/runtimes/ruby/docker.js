"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rubyBddCommand = exports.rubyBuildCommand = exports.rubyDockerComposeFile = void 0;
const rubyDockerComposeFile = (config, container_name, projectConfigPath, rubyConfigPath, testName) => {
    return {
        build: {
            context: process.cwd(),
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
        command: (0, exports.rubyBuildCommand)(projectConfigPath, rubyConfigPath, testName),
    };
};
exports.rubyDockerComposeFile = rubyDockerComposeFile;
const rubyBuildCommand = (projectConfigPath, rubyConfigPath, testName) => {
    return `bundle exec rubeno /workspace/testeranto/testeranto.ts /workspace/${rubyConfigPath} ${testName}`;
};
exports.rubyBuildCommand = rubyBuildCommand;
const rubyBddCommand = (fpath) => {
    // const jsonStr = JSON.stringify({ ports: [1111] });
    // return `ruby example/Calculator-test.rb '${jsonStr}'`;
    const jsonStr = JSON.stringify({ ports: [1111] });
    return `ruby ${fpath} '${jsonStr}'`;
};
exports.rubyBddCommand = rubyBddCommand;
