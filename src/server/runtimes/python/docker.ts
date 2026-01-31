import { IBuiltConfig, IConfig } from "../../../Types";

export const pythonDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
  return {
    build: {
      context: `${process.cwd()}/example`,
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
    command: pythonBuildCommand(fpath),
  }

};

export const pythonBuildCommand = (fpath: string) => {
  return `python src/server/runtimes/python/pitono.py /workspace/${fpath}`;
}

export const pythonBddCommand = (fpath: string) => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `python ${fpath} '${jsonStr}'`;
}

