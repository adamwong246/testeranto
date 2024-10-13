"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITProject = void 0;
const esbuild_1 = __importDefault(require("esbuild"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import pm2 from "pm2";
const readline_1 = __importDefault(require("readline"));
// import WebSocket, { WebSocketServer } from 'ws';
const glob_1 = require("glob");
const node_js_1 = __importDefault(require("./esbuildConfigs/node.js"));
const web_js_1 = __importDefault(require("./esbuildConfigs/web.js"));
const web_html_js_1 = __importDefault(require("./web.html.js"));
const child_process_1 = __importDefault(require("child_process"));
const childElectron = child_process_1.default.spawn("yarn", ["electron", "node_modules/testeranto/dist/common/electron.js"]);
childElectron.stdout.on('data', function (msg) {
    console.log(msg.toString());
});
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const TIMEOUT = 500;
const OPEN_PORT = "";
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
class ITProject {
    constructor(config) {
        this.exitCodes = {};
        this.mode = `up`;
        this.ports = {};
        this.websockets = {};
        this.resourceQueue = [];
        this.spinCycle = 0;
        this.spinAnimation = "←↖↑↗→↘↓↙";
        this.mainLoop = async () => {
            if (this.clearScreen) {
                console.clear();
            }
            const procsTable = [];
            //     pm2.list((err, procs) => {
            //       procs.forEach((proc) => {
            //         procsTable.push({
            //           name: proc.name,
            //           pid: proc.pid,
            //           pm_id: proc.pm_id,
            //           mem: proc.monit?.memory,
            //           cpu: proc.monit?.cpu,
            //           "exit code": this.exitCodes[proc.name as string]
            //         })
            //       })
            //       console.table(procsTable);
            //       console.table(this.resourceQueue);
            //       console.log("webSocketServer.clients", Object.keys(this.websockets));
            //       const resourceRequest = this.resourceQueue.pop();
            //       if (!resourceRequest) {
            //         if (!this.devMode && this.mode === "up") {
            //           this.initiateShutdown("resource request queue is empty");
            //         }
            //         if (
            //           this.mode === "down" &&
            //           (
            //             procsTable.every(
            //               (p) => p.pid === 0 || p.pid === undefined
            //             ) ||
            //             procsTable.length === 0
            //           )
            //         ) {
            //           this.shutdown();
            //         }
            //       } else {
            //         if (resourceRequest.protocol === "ipc") {
            //           this.allocateViaIpc(resourceRequest)
            //         } else if (resourceRequest.protocol === "ws") {
            //           this.allocateViaWs(resourceRequest)
            //         }
            //       }
            //       const upMessage = `
            //   Running tests while watching for changes.
            //   Use 'q' to initiate shutdown and 'x' to kill.
            //   esbuild web server - ${JSON.stringify(this.esWebServerDetails)}
            // `;
            //       const downMessage = "Shutdown is in progress. Please wait.";
            //       if (this.devMode) {
            //         if (this.mode === "up") {
            //           console.log(this.spinner(), upMessage);
            //         } else {
            //           console.log(this.spinner(), downMessage);
            //         }
            //       } else {
            //         if (this.mode === "up") {
            //           console.log(this.spinner(), upMessage);
            //         } else {
            //           console.log(this.spinner(), downMessage);
            //         }
            //       }
            //     });
        };
        this.clearScreen = config.clearScreen;
        this.devMode = config.devMode;
        Object.values(config.ports).forEach((port) => { this.ports[port] = OPEN_PORT; });
        const testPath = `${process.cwd()}/${config.tests}`;
        const featurePath = `${process.cwd()}/${config.features}`;
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
        // const watchPoints = [];
        Promise.resolve().then(() => __importStar(require(testPath))).then((tests) => {
            this.tests = tests.default;
            Promise.resolve().then(() => __importStar(require(featurePath))).then(async (features) => {
                this.features = features.default;
                await Promise.resolve(Promise.all([
                    ...this.getSecondaryEndpointsPoints("web"),
                ]
                    .map(async (sourceFilePath) => {
                    const sourceFileSplit = sourceFilePath.split("/");
                    const sourceDir = sourceFileSplit.slice(0, -1);
                    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
                    const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
                    const htmlFilePath = path_1.default.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
                    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
                    return fs_1.default.promises.mkdir(path_1.default.dirname(htmlFilePath), { recursive: true }).then(x => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_js_1.default)(jsfilePath, htmlFilePath)));
                })));
                const [nodeEntryPoints, webEntryPoints] = getRunnables(this.tests);
                (0, glob_1.glob)('./dist/chunk-*.mjs', { ignore: 'node_modules/**' }).then((chunks) => {
                    console.log("deleting chunks", chunks);
                    chunks.forEach((chunk) => {
                        console.log("deleting chunk", chunk);
                        fs_1.default.unlinkSync(chunk);
                    });
                });
                esbuild_1.default.build({
                    bundle: true,
                    entryPoints: ["./node_modules/testeranto/dist/module/Report.js"],
                    minify: config.minify === true,
                    outbase: config.outbase,
                    write: true,
                    outfile: `${config.outdir}/Report.js`,
                    external: ["tests.test.js", "features.test.js"]
                });
                fs_1.default.writeFileSync(`${config.outdir}/report.html`, `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />
  <link rel="stylesheet" href="./Report.css" />

  <script type="importmap">
    {
    "imports": {
      "tests.test.js": "./tests.test.js",
      "features.test.js": "./features.test.js"
    }
  }
  </script>


  <script src="./Report.js"></script>
</head>

<body>
  <div id="root">
    react is loading
  </div>
</body>

</html>
        `);
                Promise.all([
                    esbuild_1.default.context((0, node_js_1.default)(config, nodeEntryPoints))
                        .then(async (nodeContext) => {
                        await nodeContext.watch();
                        return nodeContext;
                    }),
                    esbuild_1.default.context((0, web_js_1.default)(config, [...webEntryPoints, testPath, featurePath]))
                        .then(async (esbuildWeb) => {
                        await esbuildWeb.watch();
                        return esbuildWeb;
                    })
                ]).then(async ([eNode, eWeb]) => {
                    if (config.devMode === false) {
                        console.log("Your tests were built but not run because devMode was false. Exiting gracefully");
                        process.exit(0);
                    }
                    else {
                        console.log("sending", JSON.stringify(this.tests));
                        childElectron.stdin.write(JSON.stringify(this.tests));
                        // not necessary
                        // this.esWebServerDetails = await eWeb.serve({
                        //   servedir: 'dist',
                        // });
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
                    }
                });
            });
        });
    }
    requestResource(requirement, protocol) {
        this.resourceQueue.push({ requirement, protocol });
    }
    getSecondaryEndpointsPoints(runtime) {
        if (runtime) {
            return this.tests
                .filter((t) => {
                return (t[1] === runtime);
            })
                .map((tc) => tc[0]);
        }
        return this.tests
            .map((tc) => tc[0]);
    }
    initiateShutdown(reason) {
        console.log("Shutdown initiated because", reason);
        this.mode = "down";
    }
    shutdown() {
        let i = 0;
        new Promise((res, reh) => {
            console.log("final results: ");
            const procsTable = [];
            // pm2.list((err, procs) => {
            //   procs.forEach((proc, ndx) => {
            //     const exitCode = this.exitCodes[proc.name as string]
            //     if (exitCode !== 0) {
            //       i++;
            //     }
            //     procsTable.push({
            //       name: proc.name,
            //       pm_id: proc.pm_id,
            //       exitCode
            //     })
            //     if (ndx === procs.length - 1) {
            //       console.table(procsTable);
            //       res(i)
            //     }
            //   })
            // })
        }).then((failures) => {
            // pm2.stop("all", (e) => console.error(e));
            // pm2.disconnect();
            console.log(`gracefully exiting with ${failures} failures`);
            process.exit(failures);
        });
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
    async releaseTestResourceWs(payload) {
        const name = payload.data.testResourceConfiguration.name;
        const failed = payload.data.failed;
        this.exitCodes[name] = failed;
        Object.keys(this.ports).forEach((port) => {
            if (this.ports[port] === name) {
                this.ports[port] = OPEN_PORT;
            }
        });
    }
    async releaseTestResourcePm2(payload) {
        const name = payload.testResourceConfiguration.name;
        const failed = payload.failed;
        this.exitCodes[name] = failed;
        // pm2.list((err, processes) => {
        //   processes.forEach((proc: pm2.ProcessDescription) => {
        //     if (proc.name === name) {
        //       Object.keys(this.ports).forEach((port: string) => {
        //         if (this.ports[port] === name) {
        //           this.ports[port] = OPEN_PORT;
        //         }
        //       });
        //     }
        //   });
        // });
    }
    allocateViaWs(resourceRequest) {
        const name = resourceRequest.requirement.name;
        const testResourceRequirement = resourceRequest.requirement;
        const websocket = this.websockets[name];
        if ((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) === 0) {
            websocket.send(JSON.stringify({
                data: {
                    testResourceConfiguration: {
                        ports: [],
                    },
                }
            }));
        }
        else if (((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) || 0) > 0) {
            // clear any port-slots associated with this job
            Object.values(this.ports).forEach((jobMaybe, portNumber) => {
                if (jobMaybe && jobMaybe === name) {
                    this.ports[portNumber] = OPEN_PORT;
                }
            });
            // find a list of open ports
            const foundOpenPorts = Object.keys(this.ports).filter((p) => this.ports[p] === OPEN_PORT);
            if (foundOpenPorts.length >= testResourceRequirement.ports) {
                const selectionOfPorts = foundOpenPorts.slice(0, testResourceRequirement.ports);
                websocket.send(JSON.stringify({
                    data: {
                        testResourceConfiguration: {
                            ports: selectionOfPorts,
                        },
                    }
                }));
                // mark the selected ports as occupied
                for (const foundOpenPort of selectionOfPorts) {
                    this.ports[foundOpenPort] = name;
                }
            }
            else {
                console.log(`no port was open so send the ${name} job to the back of the resourceQueue`);
                this.resourceQueue.push(resourceRequest);
            }
        }
    }
    allocateViaIpc(resourceRequest) {
        const pName = resourceRequest.requirement.name;
        const testResourceRequirement = resourceRequest.requirement;
        // pm2.list((err, processes) => {
        //   console.error(err);
        //   processes.forEach((p) => {
        //     if (p.name === pName && p.pid) {
        //       const message = {
        //         // these fields must be present
        //         id: p.pid,
        //         topic: "some topic",
        //         type: "process:msg",
        //         // Data to be sent
        //         data: {
        //           testResourceConfiguration: {
        //             ports: [],
        //             // fs: fPath,
        //           },
        //           id: p.pm_id,
        //         },
        //       };
        //       if (testResourceRequirement?.ports === 0) {
        //         pm2.sendDataToProcessId(
        //           p.pm_id as number,
        //           message,
        //           function (err, res) {
        //             // console.log("sendDataToProcessId", err, res, message);
        //           }
        //         );
        //       }
        //       if ((testResourceRequirement?.ports || 0) > 0) {
        //         // clear any port-slots associated with this job
        //         Object.values(this.ports).forEach((jobMaybe, portNumber) => {
        //           if (jobMaybe && jobMaybe === pName) {
        //             this.ports[portNumber] = OPEN_PORT;
        //           }
        //         });
        //         // find a list of open ports
        //         const foundOpenPorts = Object.keys(this.ports).filter(
        //           (p) => this.ports[p] === OPEN_PORT
        //         );
        //         // if there are enough open port-slots...
        //         if (foundOpenPorts.length >= testResourceRequirement.ports) {
        //           const selectionOfPorts = foundOpenPorts.slice(
        //             0,
        //             testResourceRequirement.ports
        //           );
        //           const message = {
        //             // these fields must be present
        //             id: p.pid, // id of process from "pm2 list" command or from pm2.list(errback) method
        //             topic: "some topic",
        //             // process:msg will be send as 'message' on target process
        //             type: "process:msg",
        //             // Data to be sent
        //             data: {
        //               testResourceConfiguration: {
        //                 // fs: fPath,
        //                 ports: selectionOfPorts,
        //               },
        //               id: p.pid,
        //             },
        //           };
        //           pm2.sendDataToProcessId(
        //             p.pm_id as number,
        //             message,
        //             function (err, res) {
        //               // no-op
        //             }
        //           );
        //           // mark the selected ports as occupied
        //           for (const foundOpenPort of selectionOfPorts) {
        //             this.ports[foundOpenPort] = p.pid.toString();
        //           }
        //         } else {
        //           console.log(
        //             `no port was open so send the ${p.pid} job to the back of the resourceQueue`
        //           );
        //           this.resourceQueue.push(resourceRequest);
        //         }
        //       }
        //     }
        //   })
        // })
    }
}
exports.ITProject = ITProject;
