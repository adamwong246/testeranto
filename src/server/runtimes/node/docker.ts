import { IBuiltConfig } from "../../../Types";

export const nodeDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.node.dockerfile,
    },
    container_name: `node-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      ...config.env,
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
    ],
    command: `sh -c "pwd; ls -al; yarn tsx dist/prebuild/server/runtimes/node/node.mjs /workspace/allTests.ts"`,
    // command: `sh -c "ls -al"`,
  }

};


export const nodeBddCommand = (port) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `TEST_NAME=allTests WS_PORT=${port} ENV=node  node testeranto/bundles/allTests/node/example/Calculator.test.mjs allTests.ts '${jsonStr}' || echo "Build process exited with code $?, but keeping container alive for health checks";`;
}
