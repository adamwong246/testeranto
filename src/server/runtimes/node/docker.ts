import { ITestconfigV2 } from "../../types";

export const nodeDockerComposeFile = (
  config: ITestconfigV2, container_name: string, projectConfigPath: string, nodeConfigPath: string, testName: string
) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config[container_name].dockerfile,
    },
    container_name,
    environment: {
      NODE_ENV: "production",
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

const externalTests = true;

export const nodeBuildCommand = (projectConfigPath: string, nodeConfigPath: string, testName: string) => {

  if (externalTests) {
    console.log("external tests", testName)
    // return `cat node_modules/testeranto/src/server/runtimes/node/esbuild.ts`
    return `yarn tsx node_modules/testeranto/src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts /workspace/${nodeConfigPath} ${testName}`;
    // return `cat node_modules/testeranto/src/server/runtimes/node/node.ts`
    // return ["sh", "-c", "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main"]
  } else {
    console.log("not external tests")
    // return `yarn tsx src/server/runtimes/node/node.ts /workspace/${fpath}`;
    return `yarn tsx src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts  /workspace/${nodeConfigPath} ${testName}`;
  }

}

export const nodeBddCommand = (fpath: string, nodeConfigPath: string) => {
  // return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/node.js`;
  // return `yarn tsx ${fpath} /workspace/node.js`;
  return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/${nodeConfigPath}`;
  // return `yarn tsx ${fpath} /workspace/${nodeConfigPath}`;
}
