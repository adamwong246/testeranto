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
exports.ITProject = exports.ITProjectTests = void 0;
const ws_1 = require("ws");
const esbuild_1 = __importDefault(require("esbuild"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_promises_exists_1 = __importDefault(require("fs.promises.exists"));
const pm2_1 = __importDefault(require("pm2"));
const TIMEOUT = 2000;
const OPEN_PORT = "";
let webSocketServer;
class Scheduler {
    constructor(project) {
        this.spinCycle = 0;
        this.spinAnimation = "←↖↑↗→↘↓↙";
        this.mainLoop = async () => {
            if (this.project.clearScreen) {
                console.clear();
            }
            // console.log(
            //   `# of processes in resourceQueue:`,
            //   this.resourceQueue.length,
            //   "/",
            //   this.project.getSecondaryEndpointsPoints().length
            // );
            // pm2.list((err, procs) => {
            //   procs.forEach((proc) => {
            //     console.log(proc.name, proc.pid, proc.pm_id, proc.monit)
            //   })
            // });
            // console.log("webSocketServer.clients", webSocketServer.clients.size);
            console.log("resourceQueue", this.resourceQueue);
            this.tick();
            // this.checkForShutDown();
            console.log(this.spinner(), this.mode === `up`
                ? `press "q" to initiate graceful shutdown`
                : `please wait while testeranto shuts down gracefully...`);
        };
        this.project = project;
        this.resourceQueue = [];
        this.jobs = {};
        this.ports = {};
        this.websockets = {};
        Object.values(this.project.ports).forEach((port) => {
            this.ports[port] = OPEN_PORT;
        });
        this.mode = `up`;
        this.summary = {};
        pm2_1.default.connect(async (err) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            else {
                console.log(`pm2 is connected`);
            }
            // run a websocket as an alternative to node IPC
            webSocketServer = new ws_1.WebSocketServer({
                port: 8080,
                host: "localhost",
            });
            webSocketServer.on('open', () => {
                console.log('open');
                process.exit();
            });
            webSocketServer.on('close', (data) => {
                console.log('webSocketServer close: %s', data);
                process.exit();
            });
            webSocketServer.on('listening', () => {
                console.log("webSocketServer listening", webSocketServer.address());
                // process.exit()
            });
            webSocketServer.on('connection', (webSocket) => {
                console.log('webSocketServer connection');
                webSocket.on('message', (webSocketData) => {
                    console.log('webSocket message: %s', webSocketData);
                    const payload = webSocketData.valueOf();
                    const name = payload.data.name;
                    const messageType = payload.type;
                    const requestedResources = payload.data;
                    this.websockets[name] = webSocket;
                    console.log('connected: ' + name + ' in ' + Object.getOwnPropertyNames(this.websockets));
                    if (messageType === "testeranto:hola") {
                        console.log("hola WS", requestedResources);
                        this.requestResource(requestedResources, 'ws');
                    }
                    else if (messageType === "testeranto:adios") {
                        console.log("adios WS", name);
                        this.releaseTestResources(name);
                    }
                });
            });
            const makePath = (fPath) => {
                const ext = path_1.default.extname(fPath);
                const x = "./" + project.outdir + "/" + fPath.replace(ext, "") + ".js";
                return path_1.default.resolve(x);
            };
            const bootInterval = setInterval(async () => {
                const filesToLookup = this.project.tests
                    .map(([p, rt]) => {
                    const filepath = makePath(p);
                    return {
                        filepath,
                        exists: (0, fs_promises_exists_1.default)(filepath),
                    };
                });
                const allFilesExist = (await Promise.all(filesToLookup.map((f) => f.exists))).every((b) => b);
                if (!allFilesExist) {
                    console.log(this.spinner(), "waiting for files to be bundled...", filesToLookup);
                }
                else {
                    clearInterval(bootInterval);
                    pm2_1.default.launchBus((err, pm2_bus) => {
                        pm2_bus.on("testeranto:hola", (packet) => {
                            console.log("hola IPC", packet);
                            this.requestResource(packet.data.requirement, 'ipc');
                        });
                        pm2_bus.on("testeranto:adios", (packet) => {
                            console.log("adios IPC", packet);
                            this.releaseTestResources(packet.data.name);
                        });
                    });
                    this.project
                        .tests
                        .reduce((m, [inputFilePath, runtime]) => {
                        const script = makePath(inputFilePath);
                        this.summary[inputFilePath] = undefined;
                        const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify({
                            name: inputFilePath,
                            ports: [],
                            fs: path_1.default.resolve(process.cwd(), project.outdir, inputFilePath),
                        })}'`;
                        if (runtime === "puppeteer") {
                            const sourceFileSplit = inputFilePath.split("/");
                            const sourceDir = sourceFileSplit.slice(0, -1);
                            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
                            const sourceFileNameWithoutExtensions = sourceFileName.split(".").slice(0, -1).join(".");
                            const htmlFilePath = path_1.default.normalize(`/${project.outdir}/${sourceDir.join("/")}/${sourceFileNameWithoutExtensions}.html`);
                            pm2_1.default.start({
                                script: `node ./node_modules/testeranto/dist/common/Puppeteer.js ${htmlFilePath} '${JSON.stringify({
                                    name: inputFilePath,
                                    ports: [],
                                    fs: path_1.default.resolve(process.cwd(), project.outdir, inputFilePath),
                                })}'`,
                                name: inputFilePath,
                                autorestart: false,
                                args: partialTestResourceByCommandLineArg,
                            }, (err, proc) => {
                                if (err) {
                                    console.error(err);
                                    return pm2_1.default.disconnect();
                                }
                            });
                        }
                        else if (runtime === "electron") {
                            const fileAsList = inputFilePath.split("/");
                            const fileListHead = fileAsList.slice(0, -1);
                            const fname = fileAsList[fileAsList.length - 1];
                            const fnameOnly = fname.split(".").slice(0, -1).join(".");
                            const htmlFile = [this.project.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
                            pm2_1.default.start({
                                script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify({
                                    name: inputFilePath,
                                    ports: [],
                                    fs: path_1.default.resolve(process.cwd(), project.outdir, inputFilePath),
                                })}'`,
                                name: inputFilePath,
                                autorestart: false,
                                args: partialTestResourceByCommandLineArg,
                            }, (err, proc) => {
                                if (err) {
                                    console.error(err);
                                    return pm2_1.default.disconnect();
                                }
                            });
                        }
                        else if (runtime === "node") {
                            pm2_1.default.start({
                                name: inputFilePath,
                                script: `node ${script} '${JSON.stringify({
                                    name: inputFilePath,
                                    ports: [],
                                    fs: path_1.default.resolve(process.cwd(), project.outdir, inputFilePath),
                                })}'`,
                                autorestart: false,
                                watch: [script],
                                args: partialTestResourceByCommandLineArg
                            }, (err, proc) => {
                                if (err) {
                                    console.error(err);
                                    return pm2_1.default.disconnect();
                                }
                            });
                        }
                        return [inputFilePath, ...m];
                    }, []);
                    setInterval(this.mainLoop, TIMEOUT).unref();
                }
            }, TIMEOUT).unref();
        });
    }
    shutdown() {
        this.mode = `down`;
        pm2_1.default.list((err, processes) => {
            processes.forEach((proc) => {
                proc.pm_id &&
                    pm2_1.default.stop(proc.pm_id, (err, proc) => {
                        console.error(err);
                    });
            });
        });
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
    requestResource(requirement, protocol) {
        this.resourceQueue.push({ requirement, protocol });
    }
    async releaseTestResources(name) {
        pm2_1.default.list((err, processes) => {
            processes.forEach((proc) => {
                if (proc.name === name) {
                    Object.keys(this.ports).forEach((port) => {
                        if (this.ports[port] === name) {
                            this.ports[port] = OPEN_PORT;
                        }
                    });
                }
            });
        });
    }
    tick() {
        const resourceRequest = this.resourceQueue.pop();
        if (!resourceRequest) {
            console.log("feed me a test!");
            return;
        }
        else {
            console.log("handling", resourceRequest);
        }
        if (resourceRequest.protocol === "ipc") {
            this.allocateViaIpc(resourceRequest);
        }
        else if (resourceRequest.protocol === "ws") {
            this.allocateViaWs(resourceRequest);
        }
    }
    allocateViaWs(resourceRequest) {
        const pName = resourceRequest.requirement.name;
        const testResourceRequirement = resourceRequest.requirement;
        pm2_1.default.list((err, processes) => {
            console.error(err);
            processes.forEach((p) => {
                if (p.name === pName && p.pid) {
                    const message = {
                        // these fields must be present
                        id: p.pid,
                        topic: "some topic",
                        type: "process:msg",
                        // Data to be sent
                        data: {
                            testResourceConfiguration: {
                                ports: [],
                                // fs: fPath,
                            },
                            id: p.pm_id,
                        },
                    };
                    if ((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) === 0) {
                        pm2_1.default.sendDataToProcessId(p.pid, message, function (err, res) {
                            // console.log("sendDataToProcessId", err, res, message);
                        });
                    }
                    if (((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) || 0) > 0) {
                        // clear any port-slots associated with this job
                        Object.values(this.ports).forEach((jobMaybe, portNumber) => {
                            if (jobMaybe && jobMaybe === pName) {
                                this.ports[portNumber] = OPEN_PORT;
                            }
                        });
                        // find a list of open ports
                        const foundOpenPorts = Object.keys(this.ports).filter((p) => this.ports[p] === OPEN_PORT);
                        // if there are enough open port-slots...
                        if (foundOpenPorts.length >= testResourceRequirement.ports) {
                            const selectionOfPorts = foundOpenPorts.slice(0, testResourceRequirement.ports);
                            const message = {
                                // these fields must be present
                                id: p.pid,
                                topic: "some topic",
                                // process:msg will be send as 'message' on target process
                                type: "process:msg",
                                // Data to be sent
                                data: {
                                    testResourceConfiguration: {
                                        // fs: fPath,
                                        ports: selectionOfPorts,
                                    },
                                    id: p.pid,
                                },
                            };
                            pm2_1.default.sendDataToProcessId(p.pid, message, function (err, res) {
                                // no-op
                            });
                            // mark the selected ports as occupied
                            for (const foundOpenPort of selectionOfPorts) {
                                this.ports[foundOpenPort] = p.pid.toString();
                            }
                        }
                        else {
                            console.log(`no port was open so send the ${p.pid} job to the back of the resourceQueue`);
                            this.resourceQueue.push(resourceRequest);
                        }
                    }
                }
            });
        });
    }
    allocateViaIpc(resourceRequest) {
        console.log("allocateViaIpc", resourceRequest);
        const pName = resourceRequest.requirement.name;
        const testResourceRequirement = resourceRequest.requirement;
        pm2_1.default.list((err, processes) => {
            // console.log("mark1", processes);
            console.error(err);
            processes.forEach((p) => {
                console.log("p.pid, p.name, p.pm_id", p.pid, p.name, p.pm_id);
                if (p.name === pName && p.pid) {
                    const message = {
                        // these fields must be present
                        id: p.pid,
                        topic: "some topic",
                        type: "process:msg",
                        // Data to be sent
                        data: {
                            testResourceConfiguration: {
                                ports: [],
                                // fs: fPath,
                            },
                            id: p.pm_id,
                        },
                    };
                    console.log("message", message);
                    if ((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) === 0) {
                        pm2_1.default.sendDataToProcessId(p.pm_id, message, function (err, res) {
                            // console.log("sendDataToProcessId", err, res, message);
                        });
                    }
                    if (((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) || 0) > 0) {
                        // clear any port-slots associated with this job
                        Object.values(this.ports).forEach((jobMaybe, portNumber) => {
                            if (jobMaybe && jobMaybe === pName) {
                                this.ports[portNumber] = OPEN_PORT;
                            }
                        });
                        // find a list of open ports
                        const foundOpenPorts = Object.keys(this.ports).filter((p) => this.ports[p] === OPEN_PORT);
                        // if there are enough open port-slots...
                        if (foundOpenPorts.length >= testResourceRequirement.ports) {
                            const selectionOfPorts = foundOpenPorts.slice(0, testResourceRequirement.ports);
                            const message = {
                                // these fields must be present
                                id: p.pid,
                                topic: "some topic",
                                // process:msg will be send as 'message' on target process
                                type: "process:msg",
                                // Data to be sent
                                data: {
                                    testResourceConfiguration: {
                                        // fs: fPath,
                                        ports: selectionOfPorts,
                                    },
                                    id: p.pid,
                                },
                            };
                            pm2_1.default.sendDataToProcessId(p.pm_id, message, function (err, res) {
                                // no-op
                            });
                            // mark the selected ports as occupied
                            for (const foundOpenPort of selectionOfPorts) {
                                this.ports[foundOpenPort] = p.pid.toString();
                            }
                        }
                        else {
                            console.log(`no port was open so send the ${p.pid} job to the back of the resourceQueue`);
                            this.resourceQueue.push(resourceRequest);
                        }
                    }
                }
            });
        });
    }
}
exports.default = Scheduler;
const getRunnables = (tests, payload = [new Set(), new Set()]) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt[0].add(cv[0]);
        }
        else if (cv[1] === "electron") {
            pt[1].add(cv[0]);
        }
        if (cv[2].length) {
            getRunnables(cv[2], payload);
        }
        return pt;
    }, payload);
};
class ITProjectTests {
}
exports.ITProjectTests = ITProjectTests;
class ITProject {
    constructor(config) {
        this.buildMode = config.buildMode;
        this.clearScreen = config.clearScreen;
        this.collateEntry = config.collateEntry;
        this.collateMode = config.collateMode;
        this.loaders = config.loaders;
        this.minify = config.minify;
        this.outbase = config.outbase;
        this.outdir = config.outdir;
        this.ports = config.ports;
        this.runMode = config.runMode;
        this.__dirname = config.__dirname;
        const testPath = `${process.cwd()}/${config.tests}`;
        const featurePath = `${process.cwd()}/${config.features}`;
        Promise.resolve().then(() => __importStar(require(testPath))).then((tests) => {
            this.tests = tests.default;
            Promise.resolve().then(() => __importStar(require(featurePath))).then((features) => {
                this.features = features.default;
                const runnables = getRunnables(this.tests);
                const esbuildConfigNode = {
                    packages: "external",
                    external: ["tests.test.js", "features.test.js"],
                    platform: "node",
                    outbase: this.outbase,
                    outdir: this.outdir,
                    jsx: `transform`,
                    entryPoints: [
                        ...runnables[0]
                    ],
                    bundle: true,
                    minify: this.minify === true,
                    write: true,
                    plugins: [
                        ...(this.loaders || []),
                    ],
                };
                Promise.resolve(Promise.all([...this.getSecondaryEndpointsPoints("puppeteer"),
                    ...this.getSecondaryEndpointsPoints("electron")]
                    .map(async (sourceFilePath) => {
                    const sourceFileSplit = sourceFilePath.split("/");
                    const sourceDir = sourceFileSplit.slice(0, -1);
                    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
                    const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
                    const htmlFilePath = path_1.default.normalize(`${process.cwd()}/${this.outdir}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
                    const jsfilePath = `./${sourceFileNameMinusJs}.js`;
                    return fs_1.default.promises.mkdir(path_1.default.dirname(htmlFilePath), { recursive: true }).then(x => fs_1.default.writeFileSync(htmlFilePath, `
      <!DOCTYPE html>
          <html lang="en">
          <head>
            <script type="module" src="${jsfilePath}"></script>
          </head>

          <body>
            <h1>${htmlFilePath}</h1>
            <div id="root">
              
            </div>
          </body>

          <footer></footer>

          </html>
      `));
                })));
                const esbuildConfigWeb = {
                    external: ["stream", "tests.test.js", "features.test.js"],
                    platform: "browser",
                    format: "esm",
                    outbase: this.outbase,
                    outdir: this.outdir,
                    jsx: `transform`,
                    entryPoints: [
                        ...runnables[1],
                        testPath,
                        featurePath,
                    ],
                    bundle: true,
                    minify: this.minify === true,
                    write: true,
                    splitting: true,
                    plugins: [
                        ...(this.loaders || []),
                        {
                            name: "testeranto-redirect",
                            setup(build) {
                                build.onResolve({ filter: /^.*\/testeranto\/$/ }, (args) => {
                                    return {
                                        path: path_1.default.join(process.cwd(), `..`, "node_modules", `testeranto`),
                                    };
                                });
                            },
                        },
                    ],
                };
                esbuild_1.default.build({
                    bundle: true,
                    entryPoints: ["./node_modules/testeranto/dist/module/Report.js"],
                    minify: this.minify === true,
                    outbase: this.outbase,
                    write: true,
                    outfile: `${this.outdir}/Report.js`,
                    external: ["tests.test.js", "features.test.js"]
                });
                fs_1.default.writeFileSync(`${this.outdir}/report.html`, `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />
  <link rel="stylesheet" href="/dist/report.css" />

  <script type="importmap">
    {
    "imports": {
      "tests.test.js": "/dist/tests.test.js",
      "features.test.js": "/dist/features.test.js"
    }
  }
  </script>


  <script src="/dist/report.js"></script>
</head>

<body>
  <div id="root">
    react is loading
  </div>
</body>

</html>
        `);
                console.log("buildMode   -", this.buildMode);
                console.log("runMode     -", this.runMode);
                console.log("collateMode -", this.collateMode);
                if (this.buildMode === "on") {
                    console.log("esbuildConfigNode", esbuildConfigNode);
                    esbuild_1.default.build(esbuildConfigNode).then(async (eBuildResult) => {
                        console.log("node tests", eBuildResult);
                    });
                    esbuild_1.default.build(esbuildConfigWeb).then(async (eBuildResult) => {
                        console.log("electron tests", eBuildResult);
                    });
                }
                else if (this.buildMode === "watch") {
                    Promise.all([
                        esbuild_1.default.context(esbuildConfigNode).then(async (nodeContext) => {
                            nodeContext.watch();
                        }),
                        esbuild_1.default.context(esbuildConfigWeb).then(async (esbuildWeb) => {
                            if (this.runMode) {
                                // unlike the server side, we need to run an http server to handle chunks imported into web-tests.
                                esbuildWeb.serve({
                                    port: 8000,
                                    servedir: ".",
                                    onRequest: (args) => {
                                        // console.log("onRequest", args)
                                    }
                                }).then((esbuildServerResult) => {
                                    console.log("esbuildServer result", esbuildServerResult);
                                }, (esbuildServerFailure) => {
                                    console.log("esbuildServer failure", esbuildServerFailure);
                                    process.exit(-1);
                                });
                            }
                        })
                    ]);
                }
                else {
                    console.log("skipping 'build' phase");
                }
                if (this.runMode) {
                    const scheduler = new Scheduler(this);
                    process.stdin.on("keypress", (str, key) => {
                        if (key.name === "q") {
                            // process.stdin.setRawMode(false);
                            console.log("Shutting down gracefully...");
                            scheduler.shutdown();
                        }
                        if (key.ctrl && key.name === "c") {
                            console.log("Shutting down ungracefully!");
                            process.exit(-1);
                        }
                    });
                }
                else {
                    console.log("skipping 'run' phase");
                }
            });
        });
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
}
exports.ITProject = ITProject;
// if (this.collateMode === "on") {
//   esbuild.build(collateOpts).then(async (eBuildResult) => {
//     console.log("ts collation", eBuildResult);
//   });
// } else if (this.collateMode === "watch") {
//   esbuild.context(collateOpts).then(async (ectx) => {
//     ectx.watch();
//   });
// } else if (this.collateMode === "serve") {
//   esbuild.context(collateOpts).then((esbuildContext) => {
//     hotReload(esbuildContext, collateDir);
//   });
// } else if (this.collateMode === "watch+serve") {
//   esbuild.context(collateOpts).then((esbuildContext) => {
//     hotReload(esbuildContext, collateDir);
//     esbuildContext.watch();
//     console.log(`serving collated reports @ ${"http://localhost:8000/"}`);
//   });
// } else if (this.collateMode === "dev") {
//   console.log("mark2", process.cwd());
//   esbuild.build({
//     bundle: true,
//     entryPoints: [config.collateEntry],
//     format: "iife",
//     jsx: `transform`,
//     minify: this.minify === true,
//     outbase: this.outbase,
//     outdir: collateDir,
//     write: true,
//   });
// } else {
//   console.log("skipping 'collate' phase");
// }
// const hotReload = (ectx, collateDir, port?: string) => {
//   ectx.serve({ servedir: collateDir, host: "localhost" }).then(() => {
//     if (port) {
//       createServer((req, res) => {
//         const { url, method, headers } = req;
//         if (req.url === "/esbuild")
//           return clients.push(
//             /* @ts-ignore:next-line */
//             res.writeHead(200, {
//               "Content-Type": "text/event-stream",
//               "Cache-Control": "no-cache",
//               Connection: "keep-alive",
//             })
//           );
//         /* @ts-ignore:next-line */
//         const path = ~url.split("/").pop().indexOf(".") ? url : `/index.html`; //for PWA with router
//         req.pipe(
//           request(
//             { hostname: "0.0.0.0", port, path, method, headers },
//             (prxRes) => {
//               /* @ts-ignore:next-line */
//               res.writeHead(prxRes.statusCode, prxRes.headers);
//               prxRes.pipe(res, { end: true });
//             }
//           ),
//           { end: true }
//         );
//       }).listen(port);
//       setTimeout(() => {
//         console.log("tick");
//         const op = {
//           darwin: ["open"],
//           linux: ["xdg-open"],
//           win32: ["cmd", "/c", "start"],
//         };
//         const ptf = process.platform;
//         if (clients.length === 0)
//           spawn(op[ptf][0], [
//             ...[op[ptf].slice(1)],
//             `http://localhost:${port}`,
//           ]);
//       }, 1000); //open the default browser only if it is not opened yet
//     }
//   });
// };
// const collateDir = ".";
// const collateOpts: BuildOptions = {
//   format: "iife",
//   outbase: this.outbase,
//   outdir: collateDir,
//   jsx: `transform`,
//   entryPoints: [config.collateEntry],
//   bundle: true,
//   write: true,
//   banner: {
//     js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
//   },
//   plugins: [
//     {
//       name: "hot-refresh",
//       setup(build) {
//         build.onEnd((result) => {
//           console.log(`collation transpilation`, result);
//           /* @ts-ignore:next-line */
//           clients.forEach((res) => res.write("data: update\n\n"));
//           clients.length = 0;
//           // console.log(error ? error : '...')
//         });
//       },
//     },
//   ],
// };
