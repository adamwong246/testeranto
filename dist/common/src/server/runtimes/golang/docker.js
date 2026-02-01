"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.golangTestCommand = exports.golangBddCommand = exports.golangBuildCommand = exports.golangDockerComposeFile = void 0;
const golangDockerComposeFile = (config, container_name) => {
    return {
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
        command: (0, exports.golangBuildCommand)(),
    };
    // return {
    //   build: {
    //     context: process.cwd(), // Use the project root as build context
    //     dockerfile: config.golang.dockerfile,
    //   },
    //   container_name: `golang-builder-${projectName}`,
    //   environment: {
    //     ...config.env,
    //   },
    //   working_dir: "/workspace",
    //   volumes: [
    //     `${process.cwd()}:/workspace`,
    //   ],
    //   command: golangBuildCommand(),
    // }
};
exports.golangDockerComposeFile = golangDockerComposeFile;
const golangBuildCommand = () => {
    return "go run src/server/runtimes/golang/main.go";
    // return `go run src/server/runtimes/golang/golang.go /workspace/testeranto/runtimes/golang/golang.go`;
};
exports.golangBuildCommand = golangBuildCommand;
// this image "builds" test bundles. it is not a "docker build" thing
const golangBddCommand = () => {
    const jsonStr = JSON.stringify({ ports: [1111] });
    return `go run example/cmd/calculator-test`;
};
exports.golangBddCommand = golangBddCommand;
const golangTestCommand = (config, inputfiles) => {
    var _a;
    return `
${((_a = config.golang.checks) === null || _a === void 0 ? void 0 : _a.map((c) => {
        return c(inputfiles);
    }).join('\n')) || ''}

    ${(0, exports.golangBddCommand)()}
  `;
};
exports.golangTestCommand = golangTestCommand;
