// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import ansiC from "ansi-colors";
// import fs from "fs";
// import path from "path";
// import readline from "readline";
// import esbuild from "esbuild";

// import { ITestconfig, IRunTime, ITestTypes, IBuiltConfig } from "./lib";
// import { IProject } from "./Types";
// import { getRunnables } from "./utils";
// import { AppHtml } from "./utils/buildTemplates";

// import esbuildNodeConfiger from "./esbuildConfigs/node";
// import esbuildWebConfiger from "./esbuildConfigs/web";
// import esbuildImportConfiger from "./esbuildConfigs/pure";
// import webHtmlFrame from "./web.html";

// readline.emitKeypressEvents(process.stdin);
// if (process.stdin.isTTY) process.stdin.setRawMode(true);

// const testName = process.argv[2];

// let mode = process.argv[3] as "once" | "dev";
// if (mode !== "once" && mode !== "dev") {
//   console.error(`The 4th argument should be 'dev' or 'once', not '${mode}'.`);
//   process.exit(-1);
// }

// import(process.cwd() + "/" + "testeranto.config.ts").then(async (module) => {
//   const pckge = (await import(`${process.cwd()}/package.json`)).default;
//   const bigConfig: IProject = module.default;

//   const project = bigConfig.projects[testName];
//   if (!project) {
//     console.error("no project found for", testName, "in testeranto.config.ts");
//     process.exit(-1);
//   }

//   fs.writeFileSync(
//     `${process.cwd()}/testeranto/projects.json`,
//     JSON.stringify(Object.keys(bigConfig.projects), null, 2)
//   );

//   const rawConfig: ITestconfig = bigConfig.projects[testName];

//   const getSecondaryEndpointsPoints = (runtime?: IRunTime): string[] => {
//     const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
//       ts.forEach((t) => {
//         if (t[1] === runtime) {
//           st.add(t[0]);
//         }
//         if (Array.isArray(t[3])) {
//           meta(t[3], st);
//         }
//       });
//       return st;
//     };
//     return Array.from(meta(config.tests, new Set()));
//   };

//   // const getSideCars = (runtime?: IRunTime): string[] => {
//   //   return Array.from(
//   //     new Set(
//   //       config.tests
//   //         .reduce((mm, t) => {
//   //           mm = mm.concat(t[3]);
//   //           return mm;
//   //         }, [] as ITestTypes[])
//   //         .filter((t) => {
//   //           return t[1] === runtime;
//   //         })
//   //         .map((t) => {
//   //           return t[0];
//   //         })
//   //     )
//   //   );
//   // };

//   const config: IBuiltConfig = {
//     ...rawConfig,
//     buildDir: process.cwd() + "/testeranto/bundles/" + testName,
//   };

//   console.log(
//     `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
//   );
//   process.stdin.on("keypress", (str, key) => {
//     if (key.name === "q") {
//       console.log("Testeranto-Build is shutting down...");
//       mode = "once";
//       onDone();
//     } else if (key.name === "x") {
//       console.log("Testeranto-Build is shutting down forcefully...");
//       process.exit(-1);
//     } else {
//       console.log(
//         `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
//       );
//     }
//   });
//   let nodeDone: boolean = false;
//   let webDone: boolean = false;
//   let importDone: boolean = false;

//   let status: "build" | "built" = "build";

//   const {
//     nodeEntryPoints,
//     nodeEntryPointSidecars,
//     webEntryPoints,
//     webEntryPointSidecars,
//     pureEntryPoints,
//     pureEntryPointSidecars,
//   } = getRunnables(config.tests, testName);

//   const onNodeDone = () => {
//     nodeDone = true;
//     onDone();
//   };

//   const onWebDone = () => {
//     webDone = true;
//     onDone();
//   };

//   const onImportDone = () => {
//     importDone = true;
//     onDone();
//   };

//   const onDone = async () => {
//     if (nodeDone && webDone && importDone) {
//       status = "built";
//     }
//     if (nodeDone && webDone && importDone && mode === "once") {
//       console.log(
//         ansiC.inverse(
//           `${testName} was built and the builder exited successfully.`
//         )
//       );
//       process.exit();
//     }
//   };

//   fs.writeFileSync(`${process.cwd()}/testeranto/projects.html`, AppHtml());

//   Object.keys(bigConfig.projects).forEach((projectName) => {
//     console.log(`testeranto/reports/${projectName}`);
//     if (!fs.existsSync(`testeranto/reports/${projectName}`)) {
//       fs.mkdirSync(`testeranto/reports/${projectName}`);
//     }

//     fs.writeFileSync(
//       `testeranto/reports/${projectName}/config.json`,
//       JSON.stringify(config, null, 2)
//     );
//   });

//   Promise.resolve(
//     Promise.all(
//       [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
//         const sourceFileSplit = sourceFilePath.split("/");
//         const sourceDir = sourceFileSplit.slice(0, -1);
//         const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
//         const sourceFileNameMinusJs = sourceFileName
//           .split(".")
//           .slice(0, -1)
//           .join(".");

//         const htmlFilePath = path.normalize(
//           `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
//             "/"
//           )}/${sourceFileNameMinusJs}.html`
//         );
//         const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
//         const cssFilePath = `./${sourceFileNameMinusJs}.css`;

//         return fs.promises
//           .mkdir(path.dirname(htmlFilePath), { recursive: true })
//           .then((x) =>
//             fs.writeFileSync(
//               htmlFilePath,
//               webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
//             )
//           );
//       })
//     )
//   );

//   // glob(`${process.cwd()}/testeranto/bundles/${testName}/chunk-*.mjs`, {
//   //   ignore: "node_modules/**",
//   // }).then((chunks) => {
//   //   chunks.forEach((chunk) => {
//   //     fs.unlinkSync(chunk);
//   //   });
//   // });

//   const x: [IRunTime, string[]][] = [
//     ["pure", Object.keys(pureEntryPoints)],
//     ["node", Object.keys(nodeEntryPoints)],
//     ["web", Object.keys(webEntryPoints)],
//   ];

//   x.forEach(async ([runtime, keys]) => {
//     keys.forEach(async (k) => {
//       const folder = `testeranto/reports/${testName}/${k
//         .split(".")
//         .slice(0, -1)
//         .join(".")}/${runtime}`;

//       await fs.mkdirSync(folder, { recursive: true });
//     });
//   });

//   [
//     [pureEntryPoints, pureEntryPointSidecars, "pure"],
//     [webEntryPoints, webEntryPointSidecars, "web"],
//     [nodeEntryPoints, nodeEntryPointSidecars, "node"],
//   ].forEach(
//     ([eps, eps2, runtime]: [
//       Record<string, string>,
//       Record<string, string>,
//       IRunTime
//     ]) => {
//       [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
//         const fp = path.resolve(
//           `testeranto`,
//           `reports`,
//           testName,
//           ep.split(".").slice(0, -1).join("."),
//           runtime
//         );
//         fs.mkdirSync(fp, { recursive: true });
//       });
//     }
//   );

//   await Promise.all([
//     ...(
//       [
//         [
//           esbuildImportConfiger,
//           pureEntryPoints,
//           pureEntryPointSidecars,
//           onImportDone,
//         ],
//         [
//           esbuildNodeConfiger,
//           nodeEntryPoints,
//           nodeEntryPointSidecars,
//           onNodeDone,
//         ],
//         [esbuildWebConfiger, webEntryPoints, webEntryPointSidecars, onWebDone],
//       ] as [
//         (a, b, c) => any,
//         Record<string, string>,
//         Record<string, string>,
//         () => void
//       ][]
//     ).map(([configer, entryPoints, sidecars, done]) => {
//       esbuild
//         .context(
//           configer(
//             config,
//             [...Object.keys(entryPoints), ...Object.keys(sidecars)],
//             testName
//           )
//         )
//         .then(async (ctx) => {
//           if (mode === "dev") {
//             await ctx.watch().then((v) => {
//               done();
//             });
//           } else {
//             ctx.rebuild().then((v) => {
//               done();
//             });
//           }

//           return ctx;
//         });
//     }),
//   ]);
// });
