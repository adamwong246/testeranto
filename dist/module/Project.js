import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from 'readline';
import { glob } from "glob";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import esbuildFeaturesConfiger from "./esbuildConfigs/features.js";
import webHtmlFrame from "./web.html.js";
import reportHtmlFrame from "./report.html.js";
import childProcess from 'child_process';
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const getRunnables = (tests, payload = [new Set(), new Set()]) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt[0].add(cv[0]);
        }
        else if (cv[1] === "web") {
            pt[1].add(cv[0]);
        }
        if (cv[2].length) {
            getRunnables(cv[2], payload);
        }
        return pt;
    }, payload);
};
export class ITProject {
    constructor(config) {
        var _a;
        this.mode = `up`;
        this.config = config;
        process.stdin.on('keypress', (str, key) => {
            if (key.name === 'q') {
                this.initiateShutdown("'q' command");
            }
        });
        process.stdin.on('keypress', (str, key) => {
            if (key.name === 'x') {
                console.log("Shutting down hard!");
                process.exit(-1);
            }
        });
        const childElectron = childProcess.spawn("yarn", ["electron", "node_modules/testeranto/dist/common/electron.js"]);
        // childElectron.stdout.on('data', function (msg) {
        //   console.log(msg.toString())
        // });
        const fileStream = fs.createWriteStream(`./${this.config.outdir}/electron.log`);
        (_a = childElectron.stdout) === null || _a === void 0 ? void 0 : _a.pipe(fileStream);
        Promise.resolve(Promise.all([
            ...this.getSecondaryEndpointsPoints("web"),
        ]
            .map(async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
            const htmlFilePath = path.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
            const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
            return fs.promises.mkdir(path.dirname(htmlFilePath), { recursive: true }).then(x => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath)));
        })));
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        glob(`./${config.outdir}/chunk-*.mjs`, { ignore: 'node_modules/**' }).then((chunks) => {
            console.log("deleting chunks", chunks);
            chunks.forEach((chunk) => {
                console.log("deleting chunk", chunk);
                fs.unlinkSync(chunk);
            });
        });
        fs.copyFileSync("node_modules/testeranto/dist/prebuild/report.js", "./docs/Report.js");
        fs.copyFileSync("node_modules/testeranto/dist/prebuild/report.css", "./docs/Report.css");
        fs.writeFileSync(`${config.outdir}/report.html`, reportHtmlFrame());
        Promise.all([
            esbuild.context(esbuildFeaturesConfiger(config))
                .then(async (featuresContext) => {
                console.log("features entry points", config.features);
                await featuresContext.watch();
                return featuresContext;
            }),
            esbuild.context(esbuildNodeConfiger(config, nodeEntryPoints))
                .then(async (nodeContext) => {
                console.log("node entry points", nodeEntryPoints);
                await nodeContext.watch();
                return nodeContext;
            }),
            esbuild.context(esbuildWebConfiger(config, webEntryPoints))
                .then(async (esbuildWeb) => {
                console.log("web entry points", webEntryPoints);
                await esbuildWeb.watch();
                return esbuildWeb;
            }),
        ]).then(async (contexts) => {
            Promise.all(config.tests.map(async ([test, runtime]) => {
                return {
                    test,
                    runtime
                };
            })).then(async (modules) => {
                fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify({
                    modules,
                    buildDir: process.cwd() + "/" + config.outdir
                }, null, 2));
            });
            if (config.devMode === false) {
                console.log("Your tests were built but not run because devMode was false. Exiting gracefully");
                process.exit(0);
            }
            else {
                // no-op
            }
        });
    }
    getSecondaryEndpointsPoints(runtime) {
        const meta = (ts, st) => {
            ts.forEach((t) => {
                if (t[1] === runtime) {
                    st.add(t[0]);
                }
                if (Array.isArray(t[2])) {
                    meta(t[2], st);
                }
            });
            return st;
        };
        return Array.from(meta(this.config.tests, new Set()));
    }
    initiateShutdown(reason) {
        console.log("Shutdown initiated because", reason);
        this.mode = "down";
    }
}
// pm2.connect(async (err) => {
//   if (err) {
//     console.error(err);
//     process.exit(-1);
//   } else {
//     console.log(`pm2 is connected`);
//   }
//   // run a websocket as an alternative to node IPC
//   webSocketServer = new WebSocketServer({
//     port: 8080,
//     host: "localhost",
//   });
//   webSocketServer.on('open', () => {
//     console.log('open');
//   });
//   webSocketServer.on('close', (data) => {
//     console.log('webSocketServer close: %s', data);
//   });
//   webSocketServer.on('listening', () => {
//     console.log("webSocketServer listening", webSocketServer.address());
//   });
//   webSocketServer.on('connection', (webSocket: WebSocket) => {
//     webSocket.on('message', (webSocketData) => {
//       const payload = JSON.parse(webSocketData.valueOf().toString() as any);
//       const messageType = payload.type;
//       if (messageType === "testeranto:hola") {
//         const name = payload.data.requirement.name;
//         const requestedResources = payload.data;
//         this.websockets[name] = webSocket
//         console.log('hola WS! connected: ' + name + ' in ' + Object.getOwnPropertyNames(this.websockets))
//         this.requestResource(requestedResources.requirement, 'ws');
//       } else if (messageType === "testeranto:adios") {
//         console.log("adios WS", payload.data.testResourceConfiguration.name);
//         this.releaseTestResourceWs(payload as any);
//       }
//     });
//   });
//   const makePath = (fPath: string, rt: IRunTime): string => {
//     return path.resolve("./" + config.outdir + "/" +
//       rt +
//       // (rt === "electron" || rt === "chromium" ? "web" : "node") +
//       "/" + fPath.replace(path.extname(fPath), "") + ".mjs");
//   };
//   const bootInterval = setInterval(async () => {
//     const filesToLookup = this.tests
//       .map(([p, rt]) => {
//         const filepath = makePath(p, rt);
//         return {
//           filepath,
//           exists: fsExists(filepath),
//         };
//       });
//     const allFilesExist = (
//       await Promise.all(filesToLookup.map((f) => f.exists))
//     ).every((b) => b);
//     if (!allFilesExist) {
//       console.log(this.spinner(), "waiting for files to build...")
//       filesToLookup.forEach((f) => {
//         console.log(f.exists, "\t", f.filepath);
//       })
//     } else {
//       clearInterval(bootInterval);
//       pm2.launchBus((err, pm2_bus) => {
//         pm2_bus.on("testeranto:hola", (packet: { data: { requirement: ITTestResourceRequirement } }) => {
//           this.requestResource(
//             packet.data.requirement,
//             'ipc'
//           );
//         });
//         pm2_bus.on("testeranto:adios", (payload: IAdiosIPC) => {
//           this.releaseTestResourcePm2(payload.data);
//         });
//       });
//       this
//         .tests
//         .reduce((m, [inputFilePath, runtime]) => {
//           const script = makePath(inputFilePath, runtime);
//           const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify(
//             {
//               name: inputFilePath,
//               ports: [],
//               fs: path.resolve(
//                 process.cwd(),
//                 config.outdir,
//                 inputFilePath
//               ),
//             }
//           )}'`;
//           if (runtime === "web") {
//             pm2.start(electron_pm2_StartOptions(
//               partialTestResourceByCommandLineArg,
//               inputFilePath,
//               config
//             ),
//               (err, proc) => {
//                 if (err) {
//                   console.error(err);
//                   return pm2.disconnect();
//                 }
//               }
//             );
//             // } else if (runtime === "chromium") {
//             //   pm2.start(
//             //     chromium_pm2_StartOptions(
//             //       partialTestResourceByCommandLineArg,
//             //       inputFilePath,
//             //       config,
//             //     ),
//             //     (err, proc) => {
//             //       if (err) {
//             //         console.error(err);
//             //         return pm2.disconnect();
//             //       }
//             //     }
//             //   );
//           } else if (runtime === "node") {
//             const resolvedPath = path.resolve(script);
//             console.log("watching", resolvedPath);
//             pm2.start(node_pm2_StartOptions(
//               partialTestResourceByCommandLineArg,
//               inputFilePath,
//               config,
//               resolvedPath
//             ), (err, proc) => {
//               if (err) {
//                 console.error(err);
//                 return pm2.disconnect();
//               }
//             });
//           }
//           this.exitCodes[inputFilePath] = null;
//           return [inputFilePath, ...m];
//         }, []);
//       setInterval(this.mainLoop, TIMEOUT).unref();
//     }
//   }, TIMEOUT).unref();
// });
// public requestResource(
//   requirement: ITTestResourceRequirement,
//   protocol: ISchedulerProtocols
// ) {
//   this.resourceQueue.push({ requirement, protocol });
// }
// const OPEN_PORT = "";
// type ISchedulerProtocols = `ipc` | `ws`;
// type IAdios = {
//   name: string;
//   failed: any;
//   testResourceConfiguration: {
//     name: string;
//   };
//   results: {
//     fails: any[];
//     givens: any[];
//     name: string;
//   };
// };
// type IAdiosIPC = {
//   process: {
//     namespace: string;
//     versioning: object;
//     name: string;
//     pm_id: number;
//   };
//   data: IAdios
//   at: string;
// };
// clearScreen: boolean;
// devMode: boolean;
// exitCodes: Record<number, string> = {};
// features: TesterantoFeatures;
// ports: Record<string, string> = {};
// tests: ITestTypes[];
// websockets: Record<string, WebSocket> = {};
// resourceQueue: {
//   requirement: ITTestResourceRequirement,
//   protocol: ISchedulerProtocols,
// }[] = [];
// private spinCycle = 0;
// private spinAnimation = "←↖↑↗→↘↓↙";
// console.log("sending", JSON.stringify(this.tests));
// childElectron.stdin.write(JSON.stringify(this.tests));
// not necessary
// this.esWebServerDetails = await eWeb.serve({
//   servedir: jsonConfig.outdir,
// });
// fs.copyFileSync("node_modules/testeranto/dist/index.css", "index.css")
// 
