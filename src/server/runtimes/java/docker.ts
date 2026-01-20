import { IBuiltConfig } from "../../../Types";

export const javaDockerComposeFile = (config: IBuiltConfig, projectName: string): object => {

  return {
    build: {
      context: process.cwd(),
      dockerfile: config.java.dockerfile,
    },
    container_name: `java-builder-${projectName}`,
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
    command: javaBuildCommand(),
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

export const javaBuildCommand = () => {
  return "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main";
}

// this image "builds" test bundles. it is not a "docker build" thing
export const javaBddCommand = () => {
  const jsonStr = JSON.stringify({ ports: [1111] });
  return `java -jar testeranto/bundles/allTests/java/example/Calculator-test.jar '${jsonStr}'`
}

export const javaTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
  return `
${config.java.checks?.map((c) => {
    return c(inputfiles);
  }).join('\n') || ''}

    ${javaBddCommand()}
  `;
}
