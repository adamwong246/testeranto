"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.javaBddCommand = exports.javaBuildCommand = exports.javaDockerComposeFile = void 0;
const javaDockerComposeFile = (config, container_name, fpath) => {
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
        command: (0, exports.javaBuildCommand)(fpath),
    };
};
exports.javaDockerComposeFile = javaDockerComposeFile;
const javaBuildCommand = (fpath) => {
    return `java src/server/runtimes/java/java.java /workspace/${fpath}`;
};
exports.javaBuildCommand = javaBuildCommand;
const javaBddCommand = (fpath) => {
    return `java testeranto/bundles/java/${fpath} /workspace/java.java`;
};
exports.javaBddCommand = javaBddCommand;
// export const javaBuildCommand = () => {
//   return "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main";
// }
// // this image "builds" test bundles. it is not a "docker build" thing
// export const javaBddCommand = () => {
//   const jsonStr = JSON.stringify({ ports: [1111] });
//   return `java -jar testeranto/bundles/allTests/java/example/Calculator-test.jar '${jsonStr}'`
// }
// export const javaTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
//   return `
// ${config.java.checks?.map((c) => {
//     return c(inputfiles);
//   }).join('\n') || ''}
//     ${javaBddCommand()}
//   `;
// }
