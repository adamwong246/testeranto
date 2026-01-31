import { IConfig } from "../../../Types";

export const rubyDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
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
    command: rubyBuildCommand(fpath),
  }
};

export const rubyBuildCommand = (fpath: string) => {
  console.log("mark 1", fpath)
  return `ruby src/server/runtimes/ruby/ruby.rb /workspace/${fpath}`;
}

export const rubyBddCommand = (fpath: string) => {
  // const jsonStr = JSON.stringify({ ports: [1111] });
  // return `ruby example/Calculator-test.rb '${jsonStr}'`;
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `ruby ${fpath} '${jsonStr}'`;
}
