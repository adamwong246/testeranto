import { IBuiltConfig } from "../../../Types";

export const golangDockerComposeFile = (config: IBuiltConfig, projectName: string): object => {

  return {
    build: {
      context: process.cwd(),
      dockerfile: config.golang.dockerfile,
    },
    container_name: `golang-builder-${projectName}`,
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
    command: golangBuildCommand(),
  }

  // return {
  //   build: {
  //     context: process.cwd(), // Use the project root as build context
  //     dockerfile: config.golang.dockerfile,
  //   },
  //   container_name: `golang-builder-${projectName}`,
  //   environment: {
  //     ...config.env,
  //   },
  //   working_dir: "/workspace",
  //   volumes: [
  //     `${process.cwd()}:/workspace`,
  //   ],
  //   command: golangBuildCommand(),
  // }

};

export const golangBuildCommand = () => {
  return "go run src/server/runtimes/golang/main.go";
  // return `go run src/server/runtimes/golang/golang.go /workspace/testeranto/runtimes/golang/golang.go`;
}

// this image "builds" test bundles. it is not a "docker build" thing
export const golangBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `go run example/cmd/calculator-test`
}

export const golangTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
  return `
${config.golang.checks?.map((c) => {
    return c(inputfiles);
  }).join('\n') || ''}

    ${golangBddCommand()}
  `;
}
