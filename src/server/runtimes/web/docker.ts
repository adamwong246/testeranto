import { IBuiltConfig } from "../../../Types";


export const webDockerComposeFile = (config: IBuiltConfig, projectName: string) => {
  const service: any = {
    build: {
      context: process.cwd(),
      dockerfile: config.web.dockerfile,
    },
    container_name: `web-builder-${projectName}`,
    environment: {
      NODE_ENV: "production",
      DOCKER_ENV: "true",
      // CHROME_HOST: `web-builder`,
      ...config.env,
    },
    working_dir: "/workspace",
    volumes: [
      `${process.cwd()}/src:/workspace/src`,
      `${process.cwd()}/example:/workspace/example`,
      `${process.cwd()}/dist:/workspace/dist`,
      `${process.cwd()}/testeranto:/workspace/testeranto`,
    ],
    // Expose port 9222 for Chrome DevTools Protocol
    // This allows other containers to connect to Chrome
    // Use 'expose' to make the port available to linked containers
    // and 'ports' to also expose to the host for debugging
    command: webBuildCommand(),
  };

  return service;
};


export const webBuildCommand = () => {
  return `yarn tsx src/server/runtimes/web/web.ts testeranto/runtimes/web/web.js`
}

export const webBddCommand = () => {
  return `yarn tsx  src/server/runtimes/web/hoist.ts testeranto/bundles/allTests/web/example/Calculator.test.mjs`
}

////
// import { IBuiltConfig } from "../../../Types";


// const base = (config: IBuiltConfig, projectName: string) => {
//   const service: any = {
//     build: {
//       context: process.cwd(),
//       dockerfile: config.web.dockerfile,
//     },
//     container_name: `web-builder-${projectName}`,
//     environment: {
//       NODE_ENV: "production",
//       DOCKER_ENV: "true",
//       ...config.env,
//     },
//     working_dir: "/workspace",
//     volumes: [
//       `${process.cwd()}/src:/workspace/src`,
//       `${process.cwd()}/example:/workspace/example`,
//       `${process.cwd()}/dist:/workspace/dist`,
//       `${process.cwd()}/testeranto:/workspace/testeranto`,
//     ],
//     // Expose port 9222 for Chrome remote debugging
//     ports: [
//       "9222:9222"
//     ],
//     // Ensure the container stays alive and is accessible
//     // command: webBuildCommand(config.httpPort || 3456),
//   };

//   return service;
// };


// export const webBuildCommand = (config: IBuiltConfig, projectName: string) => {

//   return {
//     ...base(config, projectName),
//     command: `yarn tsx src/server/runtimes/web/web.ts testeranto/runtimes/web/web.js`,

//   }
// }

// export const webBddCommand = (config: IBuiltConfig, projectName: string) => {

//   return {
//     ...base(config, projectName),
//     command: `yarn tsx  src/server/runtimes/web/hoist.ts testeranto/bundles/allTests/web/example/Calculator.test.mjs`,

//   }
// }
