import { IBuiltConfig } from "../../../Types";

export const rustDockerComposeFile = (config: IBuiltConfig, projectName: string): object => {

  return {
    build: {
      context: process.cwd(),
      dockerfile: config.rust.dockerfile,
    },
    container_name: `rust-builder-${projectName}`,
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
    command: rustBuildCommand(),
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

export const rustBuildCommand = () => {
  return "cd /workspace && rustc src/server/runtimes/rust/main.rs -o /tmp/rust-builder && /tmp/rust-builder";
}

// this image "builds" test bundles. it is not a "docker build" thing
export const rustBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `testeranto/bundles/allTests/rust/example/Calculator-test.bin '${jsonStr}'`
}

export const rustTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
  return `
${config.rust.checks?.map((c) => {
    return c(inputfiles);
  }).join('\n') || ''}

    ${rustBddCommand()}
  `;
}
