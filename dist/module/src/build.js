// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import ansiC from "ansi-colors";
// import fs from "fs";
// import path from "path";
// import readline from "readline";
// import esbuild from "esbuild";
import path from "path";
import { getRunnables } from "./utils";
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
const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testName });
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
const { pythonEntryPoints, nodeEntryPoints, nodeEntryPointSidecars, webEntryPoints, webEntryPointSidecars, pureEntryPoints, pureEntryPointSidecars, golangEntryPoints, golangEntryPointSidecars, } = getRunnables(config.tests, testName);
// Handle golang runtime using the entry points from getRunnables
const golangFiles = [
    ...Object.keys(golangEntryPoints),
    ...Object.keys(golangEntryPointSidecars),
];
// Add golang to the list of runtimes
let golangDone = false;
// Define onDone first
const onDone = async () => {
    if (nodeDone && webDone && importDone && golangDone) {
        status = "built";
    }
    if (nodeDone && webDone && importDone && golangDone && mode === "once") {
        console.log(ansiC.inverse(`${testName} was built and the builder exited successfully.`));
        process.exit();
    }
};
const onGolangDone = () => {
    golangDone = true;
    onDone();
};
const onNodeDone = () => {
    nodeDone = true;
    onDone();
};
//   const onWebDone = () => {
//     webDone = true;
//     onDone();
//   };
//   const onImportDone = () => {
//     importDone = true;
//     onDone();
//   };
// <<<<<<< HEAD
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
// =======
// Process golang entry points
if (golangFiles.length > 0) {
    console.log(`Processing ${golangFiles.length} Go files for runtime "golang"`);
    // Get file sizes for inputs
    const inputEntries = await Promise.all(golangFiles.map(async (file) => {
        try {
            // Use the appropriate source map to get the file path
            const filePath = golangEntryPoints[file] || golangEntryPointSidecars[file];
            const stats = await fs.promises.stat(filePath);
            return [
                file,
                {
                    bytes: stats.size,
                    imports: [],
                },
            ];
        }
        catch (error) {
            console.error(`Error getting file size for ${file}:`, error);
            return [
                file,
                {
                    bytes: 0,
                    imports: [],
                },
            ];
        }
    }));
    // Create a metafile for Go builds
    const goMetafile = {
        inputs: Object.fromEntries(inputEntries),
        outputs: {
            [`${config.buildDir}/golang/bin/${testName}`]: {
                imports: [],
                exports: [],
                entryPoint: golangFiles[0], // Use the first .go file as entry point
                inputs: Object.fromEntries(golangFiles.map((file) => [
                    file,
                    {
                        bytesInOutput: 0, // This would be the actual size in the binary
                    },
                ])),
                bytes: 0,
            },
        },
    };
    // Write the metafile
    const metafilePath = `${config.buildDir}/golang.meta.json`;
    await fs.promises.mkdir(path.dirname(metafilePath), { recursive: true });
    await fs.promises.writeFile(metafilePath, JSON.stringify(goMetafile, null, 2));
    // For actual Go compilation, you would invoke the Go compiler here
    // For example:
    // const { exec } = require('child_process');
    // exec(`go build -o ${config.buildDir}/golang/bin/${testName} ${golangFiles.join(' ')}`);
    onGolangDone();
}
else {
    console.log('No Go files found for runtime "golang"');
    onGolangDone();
}
// >>>>>>> golingvu
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
// For golang, we'll use the filtered list
const golangProcessingEntryPoints = {};
const golangProcessingSidecars = {};
golangFiles.forEach((file) => {
    if (nodeEntryPoints[file] || webEntryPoints[file] || pureEntryPoints[file]) {
        golangProcessingEntryPoints[file] = allEntryPoints[file];
    }
    if (nodeEntryPointSidecars[file] ||
        webEntryPointSidecars[file] ||
        pureEntryPointSidecars[file]) {
        golangProcessingSidecars[file] = allEntryPoints[file];
    }
});
const x = [
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)],
    ["golang", Object.keys(golangProcessingEntryPoints)],
];
//   x.forEach(async ([runtime, keys]) => {
//     keys.forEach(async (k) => {
//       const folder = `testeranto/reports/${testName}/${k
//         .split(".")
//         .slice(0, -1)
//         .join(".")}/${runtime}`;
//       await fs.mkdirSync(folder, { recursive: true });
//     });
//   });
[
    [pureEntryPoints, pureEntryPointSidecars, "pure"],
    [webEntryPoints, webEntryPointSidecars, "web"],
    [nodeEntryPoints, nodeEntryPointSidecars, "node"],
    [golangProcessingEntryPoints, golangProcessingSidecars, "golang"],
].forEach(([eps, eps2, runtime]) => {
    [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
        const fp = path.resolve(`testeranto`, `reports`, testName, ep.split(".").slice(0, -1).join("."), runtime);
        fs.mkdirSync(fp, { recursive: true });
    });
});
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
