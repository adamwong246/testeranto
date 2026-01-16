import { IBuiltConfig } from "../../../Types";

export const webDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.web.dockerfile,
    },
    container_name: `web-builder-${projectName}`,
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
    command: webBuildCommand(config.httpPort || 3456),
  }

};


export const webBuildCommand = (port) => {
  return `yarn tsx src/server/runtimes/web/web.ts /workspace/testeranto/runtimes/web/web.js`;
}

export const webBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `TEST_NAME=allTests WS_PORT=${port} ENV=web  node testeranto/bundles/allTests/web/example/Calculator.test.mjs /workspace/web.js '${jsonStr}'`;
}
