import { IConfig } from "../../../Types";

export const rustDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
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
    command: rustBuildCommand(fpath),
  }

};

export const rustBuildCommand = (fpath: string) => {
  return `rustc src/server/runtimes/rust/rust.rs /workspace/${fpath}`;
}

export const rustBddCommand = (fpath: string) => {
  return `rustc testeranto/bundles/rust/${fpath} /workspace/rust.rs`;
}
