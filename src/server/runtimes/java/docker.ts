import { IBuiltConfig, IConfig } from "../../../Types";

export const javaDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
  return {
    build: {
      context: process.cwd(),
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
    command: javaBuildCommand(fpath),
  }

};


export const javaBuildCommand = (fpath: string) => {
  return `java src/server/runtimes/java/java.java /workspace/${fpath}`;
}

export const javaBddCommand = (fpath: string) => {
  return `java testeranto/bundles/java/${fpath} /workspace/java.java`;
}



// export const javaBuildCommand = () => {
//   return "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main";
// }

// // this image "builds" test bundles. it is not a "docker build" thing
// export const javaBddCommand = () => {
//   const jsonStr = JSON.stringify({ ports: [1111] });
//   return `java -jar testeranto/bundles/allTests/java/example/Calculator-test.jar '${jsonStr}'`
// }

// export const javaTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
//   return `
// ${config.java.checks?.map((c) => {
//     return c(inputfiles);
//   }).join('\n') || ''}

//     ${javaBddCommand()}
//   `;
// }
