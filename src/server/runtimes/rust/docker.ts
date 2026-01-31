
import { IConfig } from "../../../Types";

export const rustDockerComposeFile = (config: IConfig, container_name: string, fpath: string) => {
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
    command: rustBuildCommand(fpath),
  }

};


export const rustBuildCommand = (fpath: string) => {
  return `rust src/server/runtimes/rust/rust.rs /workspace/${fpath}`;
}

export const rustBddCommand = (fpath: string) => {
  return `rust testeranto/bundles/rust/${fpath} /workspace/rust.rs`;
}


// export const rustBuildCommand = () => {
//   return "cd /workspace && rustc src/server/runtimes/rust/main.rs -o /tmp/rust-builder && /tmp/rust-builder";
// }

// // this image "builds" test bundles. it is not a "docker build" thing
// export const rustBddCommand = () => {
//   const jsonStr = JSON.stringify({ ports: [1111] });
//   return `testeranto/bundles/allTests/rust/example/Calculator-test.bin '${jsonStr}'`
// }

// export const rustTestCommand = (config: IBuiltConfig, inputfiles: string[]) => {
//   return `
// ${config.rust.checks?.map((c) => {
//     return c(inputfiles);
//   }).join('\n') || ''}

//     ${rustBddCommand()}
//   `;
// }
