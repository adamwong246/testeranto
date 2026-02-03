import { ITestconfigV2 } from "../../types";

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

  // node testeranto/bundles/allTests/node/src/ts/Calculator.test.mjs /workspace/testeranto/runtimes/node/node.mjs

  // const externalTests = true;
  // if (externalTests) {
  //   console.log("external tests", testName)
  //   // return `cat node_modules/testeranto/src/server/runtimes/node/esbuild.ts`
  // return `yarn tsx node_modules/testeranto/src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts /workspace/${nodeConfigPath} ${testName}`;  
  //   // return `cat node_modules/testeranto/src/server/runtimes/node/node.ts`
  //   // return ["sh", "-c", "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main"]
  // } else {
  //   console.log("not external tests")
  //   // return `yarn tsx src/server/runtimes/node/node.ts /workspace/${fpath}`;
  //   return `yarn tsx src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts  /workspace/${nodeConfigPath} ${testName}`;
  // }

}

export const nodeBddCommand = (fpath: string, nodeConfigPath: string) => {
  // return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/node.js`;
  return `yarn tsx testeranto/bundles/allTests/node/src/ts/Calculator.test.mjs /workspace/${nodeConfigPath}`;
  // return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/${nodeConfigPath}`;
  // return `yarn tsx ${fpath} /workspace/${nodeConfigPath}`;

  // "yarn tsx node_modules/testeranto/src/server/runtimes/node/node.ts /workspace/testeranto/testeranto.ts /workspace/testeranto/runtimes/node/node.mjs nodetests"
  // Cannot find module '/workspace/testeranto/bundles/allTests/node/src/ts/Calculator.test.ts' imported from /workspace/
}
