"use strict";
// import { IRunTime } from "../Types";
// import { IOutputs, filesHash } from "./utils";
// import ansiC from "ansi-colors";
// import fs from "fs";
// export const metafileOutputs = async (platform: IRunTime) => {
//   let metafilePath: string;
//   if (platform === "python") {
//     metafilePath = `./testeranto/metafiles/python/core.json`;
//   } else {
//     metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
//   }
//   // Check if the file exists
//   if (!fs.existsSync(metafilePath)) {
//     if (platform === "python") {
//       console.log(
//         ansiC.yellow(
//           ansiC.inverse(`Pitono metafile not found yet: ${metafilePath}`)
//         )
//       );
//     }
//     return;
//   }
//   let metafile;
//   try {
//     const fileContent = fs.readFileSync(metafilePath).toString();
//     const parsedData = JSON.parse(fileContent);
//     // Handle different metafile structures
//     if (platform === "python") {
//       // Pitono metafile might be the entire content or have a different structure
//       metafile = parsedData.metafile || parsedData;
//     } else {
//       metafile = parsedData.metafile;
//     }
//     if (!metafile) {
//       console.log(
//         ansiC.yellow(ansiC.inverse(`No metafile found in ${metafilePath}`))
//       );
//       return;
//     }
//   } catch (error) {
//     console.error(`Error reading metafile at ${metafilePath}:`, error);
//     return;
//   }
//   const outputs: IOutputs = metafile.outputs;
//   Object.keys(outputs).forEach(async (k) => {
//     const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
//     if (!k.startsWith(pattern)) {
//       return false;
//     }
//     const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
//       if (!fs.existsSync(i)) return false;
//       if (i.startsWith("node_modules")) return false;
//       if (i.startsWith("./node_modules")) return false;
//       return true;
//     });
//     const f = `${k.split(".").slice(0, -1).join(".")}/`;
//     if (!fs.existsSync(f)) {
//       fs.mkdirSync(f);
//     }
//     const entrypoint = outputs[k].entryPoint;
//     if (entrypoint) {
//       const changeDigest = await filesHash(addableFiles);
//       if (changeDigest === changes[entrypoint]) {
//         // skip
//       } else {
//         changes[entrypoint] = changeDigest;
//         this.tscCheck({
//           platform,
//           addableFiles,
//           entrypoint: entrypoint,
//         });
//         this.eslintCheck(entrypoint, platform, addableFiles);
//         this.makePrompt(entrypoint, addableFiles, platform);
//       }
//     }
//   });
// };
