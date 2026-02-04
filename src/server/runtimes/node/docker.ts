import { ITestconfigV2 } from "../../../Types";

export const nodeDockerComposeFile = (
  config: ITestconfigV2,
  container_name: string,
  projectConfigPath: string,
  nodeConfigPath: string,
  testName: string
) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile,
    },
    container_name,
    environment: {
      NODE_ENV: "production",
      ENV: "node",  // <- important
      ...config.env,
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`,
    ],
    command: nodeBuildCommand(projectConfigPath, nodeConfigPath, testName),
  }
};

export const nodeBuildCommand = (projectConfigPath: string, nodeConfigPath: string, testName: string) => {
  return `yarn tsx node_modules/testeranto/src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts /workspace/${nodeConfigPath} ${testName}`;
}

export const nodeBddCommand = (fpath: string, nodeConfigPath: string) => {
  return `yarn tsx testeranto/bundles/allTests/node/src/ts/Calculator.test.mjs /workspace/${nodeConfigPath}`;
}
