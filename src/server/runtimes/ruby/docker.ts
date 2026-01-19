import { IBuiltConfig } from "../../../Types";

export const rubyDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.ruby?.dockerfile || "testeranto/runtimes/ruby/ruby.Dockerfile",
    },
    container_name: `ruby-builder-${projectName}`,
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
    command: rubyBuildCommand(),
  }
};

export const rubyBuildCommand = () => {
  return `ls; pwd; `;
}

export const rubyBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `ruby example/Calculator-test.rb '${jsonStr}'`;
}
