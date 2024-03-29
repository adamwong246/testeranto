import { WebSocketServer } from 'ws';
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import fsExists from "fs.promises.exists";
import pm2 from "pm2";
import readline from 'readline';
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const TIMEOUT = 2000;
const OPEN_PORT = "";
let webSocketServer;
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
            pm2.list((err, procs) => {
                procs.forEach((proc) => {
                    var _a, _b;
                    procsTable.push({ name: proc.name, pid: proc.pid, pm_id: proc.pm_id, mem: (_a = proc.monit) === null || _a === void 0 ? void 0 : _a.memory, cpu: (_b = proc.monit) === null || _b === void 0 ? void 0 : _b.cpu });
                });
                console.table(procsTable);
                console.table(this.resourceQueue);
                // console.log("webSocketServer.clients", webSocketServer.clients.size);
                // console.log("resourceQueue", this.resourceQueue);
                const resourceRequest = this.resourceQueue.pop();
                if (!resourceRequest) {
                    if (!this.devMode && this.mode === "up") {
                        this.initiateShutdown("resource request queue is empty");
                    }
                    if (this.mode === "down" && procsTable.every((p) => p.pid === 0 || p.pid === undefined)) {
                        this.shutdown();
                    }
                }
                else {
                    console.log("handling", resourceRequest);
                    if (resourceRequest.protocol === "ipc") {
                        this.allocateViaIpc(resourceRequest);
                    }
                    else if (resourceRequest.protocol === "ws") {
                        this.allocateViaWs(resourceRequest);
                    }
                }
                if (this.devMode) {
                    if (this.mode === "up") {
                        console.log(this.spinner(), "Running tests while watching for changes. Use 'q' to initiate shutdown");
                    }
                    else {
                        console.log(this.spinner(), "Shutdown is in progress. Please wait.");
                    }
                }
                else {
                    if (this.mode === "up") {
                        console.log(this.spinner(), "Running tests without watching for changes. Use 'q' to initiate shutdown");
                    }
                    else {
                        console.log(this.spinner(), "Shutdown is in progress. Please wait.");
                    }
                }
                // console.log(this.spinner());
                // console.log(
                //   this.spinner(),
                //   this.mode === `up`
                //     ? `press "q" to initiate graceful shutdown`
                //     : `please wait while testeranto shuts down gracefully...`
                // );
            });
        };
        this.clearScreen = config.clearScreen;
        this.devMode = config.devMode;
        Object.values(config.ports).forEach((port) => {
            this.ports[port] = OPEN_PORT;
        });
        const testPath = `${process.cwd()}/${config.tests}`;
        const featurePath = `${process.cwd()}/${config.features}`;
        process.on('SIGINT', () => this.initiateShutdown("CTRL+C"));
        process.on('SIGQUIT', () => this.initiateShutdown("Keyboard quit"));
        process.on('SIGTERM', () => this.initiateShutdown("'kill' command"));
        process.stdin.on('keypress', (str, key) => {
            if (key.name === 'q') {
                this.initiateShutdown("'q' command");
            }
        });
        import(testPath).then((tests) => {
            this.tests = tests.default;
            import(featurePath).then((features) => {
                this.features = features.default;
                Promise.resolve(Promise.all([
                    ...this.getSecondaryEndpointsPoints("web")
                ]
                    .map(async (sourceFilePath) => {
                    const sourceFileSplit = sourceFilePath.split("/");
                    const sourceDir = sourceFileSplit.slice(0, -1);
                    const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
                    const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
                    const htmlFilePath = path.normalize(`${process.cwd()}/${config.outdir}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
                    const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
                    return fs.promises.mkdir(path.dirname(htmlFilePath), { recursive: true }).then(x => fs.writeFileSync(htmlFilePath, `
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
                const [nodeEntryPoints, webEntryPoints] = getRunnables(this.tests);
                const esbuildConfigNode = {
                    define: {
                        "process.env.FLUENTFFMPEG_COV": "0"
                    },
                    absWorkingDir: process.cwd(),
                    banner: {
                        js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
                    },
                    target: "esnext",
                    // packages: "external",
                    format: "esm",
                    splitting: true,
                    outExtension: { '.js': '.mjs' },
                    platform: "node",
                    external: ["tests.test.js", "features.test.js"],
                    outbase: config.outbase,
                    outdir: config.outdir,
                    jsx: 'transform',
                    entryPoints: [...nodeEntryPoints],
                    bundle: true,
                    minify: config.minify === true,
                    write: true,
                    loader: {
                        '.js': 'jsx',
                        '.png': 'binary',
                        '.jpg': 'binary',
                    },
                    plugins: [
                        ...(config.plugins || []),
                        {
                            name: 'rebuild-notify',
                            setup(build) {
                                build.onEnd(result => {
                                    console.log(`node build ended with ${result.errors.length} errors`);
                                    // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                                });
                            }
                        },
                    ],
                };
                const esbuildConfigWeb = {
                    // packages: "external",
                    format: "esm",
                    splitting: true,
                    outExtension: { '.js': '.mjs' },
                    external: ["stream", "tests.test.js", "features.test.js"],
                    platform: "browser",
                    outbase: config.outbase,
                    outdir: config.outdir,
                    jsx: 'transform',
                    entryPoints: [
                        ...webEntryPoints,
                        testPath,
                        featurePath,
                    ],
                    bundle: true,
                    minify: config.minify === true,
                    write: true,
                    loader: {
                        '.js': 'jsx',
                        '.png': 'binary',
                        '.jpg': 'binary',
                    },
                    plugins: [
                        ...(config.plugins || []),
                        {
                            name: 'rebuild-notify',
                            setup(build) {
                                build.onEnd(result => {
                                    console.log(`web build ended with ${result.errors.length} errors`);
                                    // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                                });
                            }
                        },
                    ],
                };
                esbuild.build({
                    bundle: true,
                    entryPoints: ["./node_modules/testeranto/dist/module/Report.js"],
                    minify: config.minify === true,
                    outbase: config.outbase,
                    write: true,
                    outfile: `${config.outdir}/Report.js`,
                    external: ["tests.test.js", "features.test.js"]
                });
                fs.writeFileSync(`${config.outdir}/report.html`, `
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
                    esbuild.context(esbuildConfigNode).then(async (nodeContext) => {
                        await nodeContext.watch();
                    }),
                    esbuild.context(esbuildConfigWeb).then(async (esbuildWeb) => {
                        await esbuildWeb.watch();
                    })
                ]);
                pm2.connect(async (err) => {
                    if (err) {
                        console.error(err);
                        process.exit(-1);
                    }
                    else {
                        console.log(`pm2 is connected`);
                    }
                    // run a websocket as an alternative to node IPC
                    webSocketServer = new WebSocketServer({
                        port: 8080,
                        host: "localhost",
                    });
                    webSocketServer.on('open', () => {
                        console.log('open');
                        // process.exit()
                    });
                    webSocketServer.on('close', (data) => {
                        console.log('webSocketServer close: %s', data);
                        // process.exit()
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
                    const makePath = (fPath, rt) => {
                        return path.resolve("./" + config.outdir + "/" + fPath.replace(path.extname(fPath), "") + ".mjs");
                    };
                    const bootInterval = setInterval(async () => {
                        const filesToLookup = this.tests
                            .map(([p, rt]) => {
                            const filepath = makePath(p, rt);
                            return {
                                filepath,
                                exists: fsExists(filepath),
                            };
                        });
                        const allFilesExist = (await Promise.all(filesToLookup.map((f) => f.exists))).every((b) => b);
                        if (!allFilesExist) {
                            console.log(this.spinner(), "waiting for files to build...");
                            filesToLookup.forEach((f) => {
                                console.log(f.exists, "\t", f.filepath);
                            });
                        }
                        else {
                            clearInterval(bootInterval);
                            pm2.launchBus((err, pm2_bus) => {
                                pm2_bus.on("testeranto:hola", (packet) => {
                                    console.log("hola IPC", packet);
                                    this.requestResource(packet.data.requirement, 'ipc');
                                });
                                pm2_bus.on("testeranto:adios", (packet) => {
                                    console.log("adios IPC", packet);
                                    this.releaseTestResources(packet.data.name);
                                });
                            });
                            this
                                .tests
                                .reduce((m, [inputFilePath, runtime]) => {
                                const script = makePath(inputFilePath, runtime);
                                const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify({
                                    name: inputFilePath,
                                    ports: [],
                                    fs: path.resolve(process.cwd(), config.outdir, inputFilePath),
                                })}'`;
                                if (runtime === "web") {
                                    const fileAsList = inputFilePath.split("/");
                                    const fileListHead = fileAsList.slice(0, -1);
                                    const fname = fileAsList[fileAsList.length - 1];
                                    const fnameOnly = fname.split(".").slice(0, -1).join(".");
                                    const htmlFile = [config.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
                                    const jsFile = htmlFile.split(".html")[0] + ".mjs";
                                    console.log("watching", jsFile);
                                    pm2.start({
                                        script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify({
                                            name: inputFilePath,
                                            ports: [],
                                            fs: path.resolve(process.cwd(), config.outdir, inputFilePath),
                                        })}'`,
                                        name: inputFilePath,
                                        autorestart: false,
                                        args: partialTestResourceByCommandLineArg,
                                        watch: [jsFile],
                                    }, (err, proc) => {
                                        if (err) {
                                            console.error(err);
                                            return pm2.disconnect();
                                        }
                                    });
                                }
                                else if (runtime === "node") {
                                    pm2.start({
                                        name: inputFilePath,
                                        script: `node ${script} '${JSON.stringify({
                                            name: inputFilePath,
                                            ports: [],
                                            fs: path.resolve(process.cwd(), config.outdir, inputFilePath),
                                        })}'`,
                                        autorestart: false,
                                        watch: [script],
                                        args: partialTestResourceByCommandLineArg
                                    }, (err, proc) => {
                                        if (err) {
                                            console.error(err);
                                            return pm2.disconnect();
                                        }
                                    });
                                }
                                return [inputFilePath, ...m];
                            }, []);
                            setInterval(this.mainLoop, TIMEOUT).unref();
                        }
                    }, TIMEOUT).unref();
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
        console.log("Stopping PM2");
        pm2.stop("all", (e) => console.error(e));
        pm2.killDaemon((e) => console.error(e));
        pm2.disconnect();
        process.exit();
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
    async releaseTestResources(name) {
        pm2.list((err, processes) => {
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
    allocateViaWs(resourceRequest) {
        const pName = resourceRequest.requirement.name;
        const testResourceRequirement = resourceRequest.requirement;
        pm2.list((err, processes) => {
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
                        pm2.sendDataToProcessId(p.pid, message, function (err, res) {
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
                            pm2.sendDataToProcessId(p.pid, message, function (err, res) {
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
        pm2.list((err, processes) => {
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
                        pm2.sendDataToProcessId(p.pm_id, message, function (err, res) {
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
                            pm2.sendDataToProcessId(p.pm_id, message, function (err, res) {
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
