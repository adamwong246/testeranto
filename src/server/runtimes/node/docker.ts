import { IConfig } from "../../../Types";

export const nodeDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
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
    command: nodeBuildCommand(fpath),
  }

};

export const nodeBuildCommand = (fpath: string) => {
  // return `yarn tsx src/server/runtimes/node/node.ts /workspace/testeranto/runtimes/node/node.js`;
  return `yarn tsx src/server/runtimes/node/node.ts /workspace/${fpath}`;
  // return 'ls'
  // return `cat src/server/runtimes/node/node.ts`
  // return 'idk'
}

export const nodeBddCommand = (fpath: string) => {
  // return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/node.js`;
  return `node ${fpath.split('.').slice(0, -1).concat('mjs').join('.')} /workspace/node.js`;
  // return `node testeranto/bundles/node/example/Calculator.test.mjs /workspace/node.js `;
}
