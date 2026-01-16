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
    command: golangBuildCommand(),
  }

};

export const golangBuildCommand = () => {
  return "sh -c 'echo \"GOLANG BUILDER STARTING\"; cd /workspace && echo \"Running main.go directly with go run...\"; go run src/server/runtimes/golang/main.go 2>&1'";
}

// this image "builds" test bundles. it is not a "docker build" thing
export const golangBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `go run example/Calculator.golingvu.test.go '${jsonStr}'`;
}

export const golangTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
  return `
${config.golang.checks?.map((c) => {
    return c(inputfiles);
  }).join('\n') || ''}

    ${golangBddCommand()}
  `;
}
