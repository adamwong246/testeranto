import { IBuiltConfig, IRunTime } from "../../../Types";

export const pythonBDDCommand = (port) => {
  return `cd /workspace && python -m example/xyz -v`;
}

export const pythonDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(),  // Project root (where docker-compose is run from)
      dockerfile: config.python.dockerfile,
    },
    container_name: `python-builder-${projectName}`,
    environment: {
      PYTHONUNBUFFERED: "1",
      ...config.env,
    },
    volumes: [
      `${process.cwd()}:/workspace`,
    ],

    working_dir: "/workspace",
    command: "python main.py",
  }

};
