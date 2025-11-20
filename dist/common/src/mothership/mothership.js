"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Docker from "dockerode";
console.log("hello mothership");
// const app = express();
// app.use(express.json());
// // const docker = new Docker();
// // Track running services
// const runningServices = new Map();
// // Service to build file mapping
// const serviceBuildFiles = {
//   "node-build": "src/builders/node.ts",
//   "web-build": "src/builders/web.ts",
//   "golang-build": "src/builders/golang.ts",
//   "python-build": "src/builders/python.ts",
// };
// // Automatically start build services on mothership startup
// async function initializeServices() {
//   console.log("Initializing build services...");
//   for (const serviceName of Object.keys(serviceBuildFiles)) {
//     try {
//       // Get all containers
//       // const containers = await docker.listContainers({ all: true });
//       // Find the container for the requested service
//       // const containerInfo = containers.find((container) =>
//       //   container.Names.some((name) => name.includes(serviceName))
//       // );
//       // if (containerInfo) {
//       //   // const container = docker.getContainer(containerInfo.Id);
//       //   // Start the container if it's not running
//       //   if (containerInfo.State !== "running") {
//       //     console.log(`Starting ${serviceName}...`);
//       //     await container.start();
//       //   } else {
//       //     console.log(`${serviceName} is already running`);
//       //   }
//       //   runningServices.set(serviceName, containerInfo.Id);
//       // } else {
//       //   console.warn(`Container for ${serviceName} not found`);
//       // }
//     } catch (error) {
//       console.error(`Error initializing ${serviceName}:`, error);
//     }
//   }
//   console.log("Build services initialization complete");
// }
// // Initialize services when mothership starts
// initializeServices();
// app.get("/", (req, res) => {
//   res.send("Mothership is running");
// });
// // Start a specific service
// app.post("/services/:serviceName/start", async (req, res) => {
//   const { serviceName } = req.params;
//   try {
//     // // Get all containers
//     // const containers = await docker.listContainers({ all: true });
//     // // Find the container for the requested service
//     // const containerInfo = containers.find((container) =>
//     //   container.Names.some((name) => name.includes(serviceName))
//     // );
//     // if (!containerInfo) {
//     //   return res
//     //     .status(404)
//     //     .json({ error: `Service ${serviceName} not found` });
//     // }
//     // const container = docker.getContainer(containerInfo.Id);
//     // // Start the container if it's not running
//     // if (containerInfo.State !== "running") {
//     //   await container.start();
//     // }
//     // runningServices.set(serviceName, containerInfo.Id);
//     // res.status(200).json({
//     //   status: "started",
//     //   service: serviceName,
//     //   containerId: containerInfo.Id,
//     // });
//   } catch (error) {
//     console.error(`Error starting service ${serviceName}:`, error);
//     res
//       .status(500)
//       .json({ error: `Failed to start service: ${error.message}` });
//   }
// });
// // Stop a specific service
// app.post("/services/:serviceName/stop", async (req, res) => {
//   const { serviceName } = req.params;
//   try {
//     // const containerId = runningServices.get(serviceName);
//     // if (!containerId) {
//     //   return res
//     //     .status(404)
//     //     .json({ error: `Service ${serviceName} is not running` });
//     // }
//     // const container = docker.getContainer(containerId);
//     // await container.stop();
//     // runningServices.delete(serviceName);
//     res.status(200).json({
//       status: "stopped",
//       service: serviceName,
//     });
//   } catch (error) {
//     console.error(`Error stopping service ${serviceName}:`, error);
//     res.status(500).json({ error: `Failed to stop service: ${error.message}` });
//   }
// });
// // Get status of all services
// app.get("/services", async (req, res) => {
//   try {
//     // const containers = await docker.listContainers({ all: true });
//     // const services = containers
//     //   .filter((container) =>
//     //     container.Names.some((name) =>
//     //       name.match(
//     //         /_(node-build|web-build|golang-build|python-build|mothership)_/
//     //       )
//     //     )
//     //   )
//     //   .map((container) => ({
//     //     name: container.Names[0].replace("/", ""),
//     //     id: container.Id,
//     //     status: container.State,
//     //     image: container.Image,
//     //   }));
//     // res.status(200).json({ services });
//   } catch (error) {
//     console.error("Error listing services:", error);
//     res
//       .status(500)
//       .json({ error: `Failed to list services: ${error.message}` });
//   }
// });
// // Trigger a build in a specific service
// app.post("/build/:serviceName", async (req, res) => {
//   // const { serviceName } = req.params;
//   // try {
//   //   const containerId = runningServices.get(serviceName);
//   //   if (!containerId) {
//   //     return res
//   //       .status(404)
//   //       .json({ error: `Service ${serviceName} is not running` });
//   //   }
//   //   // const container = docker.getContainer(containerId);
//   //   // Execute the build command in the container
//   //   const buildFile = serviceBuildFiles[serviceName];
//   //   if (!buildFile) {
//   //     return res
//   //       .status(400)
//   //       .json({ error: `No build file configured for ${serviceName}` });
//   //   }
//   //   // Run the TypeScript build file using ts-node
//   //   const exec = await container.exec({
//   //     Cmd: ["npx", "ts-node", "--transpile-only", buildFile],
//   //     AttachStdout: true,
//   //     AttachStderr: true,
//   //   });
//   //   // Start the exec instance
//   //   const stream = await exec.start({ hijack: true, stdin: false });
//   //   // Collect output
//   //   let output = "";
//   //   stream.on("data", (chunk: Buffer) => {
//   //     output += chunk.toString();
//   //   });
//   //   stream.on("end", () => {
//   //     res.status(200).json({
//   //       status: "build completed",
//   //       service: serviceName,
//   //       output: output,
//   //     });
//   //   });
//   //   stream.on("error", (error) => {
//   //     console.error(`Stream error for ${serviceName}:`, error);
//   //     res.status(500).json({ error: `Build stream error: ${error.message}` });
//   //   });
//   // } catch (error) {
//   //   console.error(`Error triggering build for ${serviceName}:`, error);
//   //   res
//   //     .status(500)
//   //     .json({ error: `Failed to trigger build: ${error.message}` });
//   // }
// });
// // Get build file for each service
// app.get("/build-files", (req, res) => {
//   res.status(200).json(serviceBuildFiles);
// });
// // Claim resource endpoint
// app.get("/claim", (req, res) => {
//   const { resource } = req.query;
//   console.log(`Resource claimed: ${resource}`);
//   res.status(200).json({ status: "claimed", resource });
// });
// export default (port: number) => {
//   app.listen(port, () => {
//     console.log(`Mothership listening on port ${port}`);
//   });
//   return app;
// };
