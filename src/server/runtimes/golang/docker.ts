import { IBuiltConfig } from "../../../Types";

export const golangDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  return {
    build: {
      context: process.cwd(), // Use the project root as build context
      dockerfile: config.golang.dockerfile,
    },
    container_name: `golang-builder-${projectName}`,
    environment: {
      ...config.env,
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}:/workspace`,
    ],
  }

};

export const golangBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `go run example/Calculator.golingvu.test.go '${jsonStr}'`;
}

export const golangTestCommand = (config: IBuiltConfig, inputfiles: string[],) => {
  return `
${config.golang.checks.map((c) => {
    return c(inputfiles);
  }).join('\n')
    }

    ${golangBddCommand()}
  `;
}