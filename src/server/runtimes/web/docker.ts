import { IBuiltConfig, IConfig } from "../../../Types";

export const webDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
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
    command: webBuildCommand(fpath),

  }

};


export const webBuildCommand = (fpath: string) => {
  // return `yarn tsx src/server/runtimes/web/web.ts /workspace/${fpath}`;
  return `yarn tsx src/server/runtimes/web/web.ts /workspace/${fpath}`;
}

export const webBddCommand = (fpath: string) => {
  // return `node ${fpath} /workspace/web.js `;x
  return `node dist/prebuild/server/runtimes/web/hoist.mjs `;
}


// export const webBuildCommand = () => {
//   return `yarn tsx src/server/runtimes/web/web.ts testeranto/runtimes/web/web.js`
// }

// export const webBddCommand = () => {
//   return `yarn tsx  src/server/runtimes/web/hoist.ts testeranto/bundles/allTests/web/example/Calculator.test.mjs`
// }
