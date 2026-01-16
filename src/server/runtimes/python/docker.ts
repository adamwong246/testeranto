import { IBuiltConfig } from "../../../Types";

export const pythonDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: config.python.dockerfile,
    },
    container_name: `python-builder-${projectName}`,
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
    command: pythonBuildCommand(),
  }

};

export const pythonBuildCommand = () => {
  return `python src/server/runtimes/python/pitono.py`;
}


export const pythonBDDCommand = (port) => {
  return `python Calculator.test.py`;
}

