import fs from "fs";
import fsExists from "fs.promises.exists";
import pm2 from "pm2";
import { spawn } from "child_process";
import path from "path";
import esbuild from "esbuild";
import { createServer, request } from "http";
const TIMEOUT = 2000;
const OPEN_PORT = "";
const clients = [];
const hotReload = (ectx, collateDir, port) => {
    ectx.serve({ servedir: collateDir, host: "localhost" }).then(() => {
        if (port) {
            createServer((req, res) => {
                const { url, method, headers } = req;
                if (req.url === "/esbuild")
                    return clients.push(
                    /* @ts-ignore:next-line */
                    res.writeHead(200, {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        Connection: "keep-alive",
                    }));
                /* @ts-ignore:next-line */
                const path = ~url.split("/").pop().indexOf(".") ? url : `/index.html`; //for PWA with router
                req.pipe(request({ hostname: "0.0.0.0", port, path, method, headers }, (prxRes) => {
                    /* @ts-ignore:next-line */
                    res.writeHead(prxRes.statusCode, prxRes.headers);
                    prxRes.pipe(res, { end: true });
                }), { end: true });
            }).listen(port);
            setTimeout(() => {
                console.log("tick");
                const op = {
                    darwin: ["open"],
                    linux: ["xdg-open"],
                    win32: ["cmd", "/c", "start"],
                };
                const ptf = process.platform;
                if (clients.length === 0)
                    spawn(op[ptf][0], [
                        ...[op[ptf].slice(1)],
                        `http://localhost:${port}`,
                    ]);
            }, 1000); //open the default browser only if it is not opened yet
        }
    });
};
export default class Scheduler {
    constructor(project) {
        this.spinCycle = 0;
        this.spinAnimation = "←↖↑↗→↘↓↙";
        this.project = project;
        this.queue = [];
        this.jobs = {};
        this.ports = {};
        Object.values(this.project.ports).forEach((port) => {
            this.ports[port] = OPEN_PORT;
        });
        this.mode = `up`;
        this.summary = {};
        pm2.connect(async (err) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            else {
                console.log(`pm2 is connected`);
            }
            this.pm2 = pm2;
            const makePath = (fPath) => {
                const ext = path.extname(fPath);
                const x = "./" + project.outdir + "/" + fPath.replace(ext, "") + ".mjs";
                return path.resolve(x);
            };
            const bootInterval = setInterval(async () => {
                const filesToLookup = this.project
                    .getSecondaryEndpointsPoints()
                    .map((f) => {
                    const filepath = makePath(f[0]);
                    return {
                        filepath,
                        exists: fsExists(filepath),
                    };
                });
                const allFilesExist = (await Promise.all(filesToLookup.map((f) => f.exists))).every((b) => b);
                if (!allFilesExist) {
                    console.log(this.spinner(), "waiting for files to be bundled...", filesToLookup);
                }
                else {
                    clearInterval(bootInterval);
                    this.project
                        .getSecondaryEndpointsPoints()
                        .reduce((m, [inputFilePath, runtime]) => {
                        const script = makePath(inputFilePath);
                        this.summary[inputFilePath] = undefined;
                        const partialTestResourceByCommandLineArg = `${script} '${JSON.stringify({
                            ports: [],
                            fs: path.resolve(process.cwd(), project.outdir, inputFilePath),
                        })}'`;
                        m[inputFilePath] = pm2.start({
                            script: `yarn electron node_modules/testeranto/dist/common/electron.js ./js-bazel/myTests/ClassicalReact.html '${JSON.stringify({
                                ports: [],
                                fs: path.resolve(process.cwd(), project.outdir, inputFilePath),
                            })}'`,
                            name: `electron test`,
                            autorestart: false,
                            // watch: [script],
                            // env: {
                            //   ELECTRON_NO_ASAR: `true`,
                            //   ELECTRON_RUN_AS_NODE: `true`,
                            // },
                            args: partialTestResourceByCommandLineArg,
                        }, (err, proc) => {
                            if (err) {
                                console.error(err);
                                return pm2.disconnect();
                            }
                        });
                        return m;
                    }, {});
                    pm2.launchBus((err, pm2_bus) => {
                        pm2_bus.on("testeranto:hola", (packet) => {
                            console.log("hola", packet);
                            this.push(packet);
                        });
                        pm2_bus.on("testeranto:adios", (packet) => {
                            console.log("adios", packet);
                            this.releaseTestResources(packet);
                        });
                    });
                    setInterval(async () => {
                        if (this.project.clearScreen) {
                            console.clear();
                        }
                        console.log(`# of processes in queue:`, this.queue.length, "/", this.project.getSecondaryEndpointsPoints().length);
                        console.log(`summary:`, this.summary);
                        console.log(`ports:`, this.ports);
                        // pm2.list((err, procs) => {
                        //   procs.forEach((proc) => {
                        //     console.log(proc.name, proc.pid, proc.pm_id, proc.monit)
                        //   })
                        // });
                        this.pop();
                        this.checkForShutDown();
                        console.log(this.spinner(), this.mode === `up`
                            ? `press "q" to initiate graceful shutdown`
                            : `please wait while testeranto shuts down gracefully...`);
                    }, TIMEOUT).unref();
                }
            }, TIMEOUT).unref();
        });
    }
    // this is called every cycle
    // if there are no running processes, none waiting and we are in shutdown mode,
    // write the summary to a file and end self with summarized exit code
    checkForShutDown() {
        const sums = Object.entries(this.summary).filter((s) => s[1] !== undefined);
    }
    async abort(pm2Proc) {
        this.pm2.stop(pm2Proc.process.pm_id, (err, proc) => {
            console.error(err);
        });
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
    push(process) {
        this.queue.push(process);
    }
    pop() {
        const p = this.queue.pop();
        if (!p) {
            console.log("feed me a test");
            return;
        }
        const pid = p.process.pm_id;
        const testResourceRequirement = p.data.testResourceRequirement;
        // const fPath = path.resolve(this.project.resultsdir + `/` + p.process.name);
        const message = {
            // these fields must be present
            id: p.process.pm_id,
            topic: "some topic",
            type: "process:msg",
            // Data to be sent
            data: {
                testResourceConfiguration: {
                    ports: [],
                    // fs: fPath,
                },
                id: p.process.pm_id,
            },
        };
        if ((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) === 0) {
            this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
                // console.log("sendDataToProcessId", err, res, message);
            });
        }
        if (((testResourceRequirement === null || testResourceRequirement === void 0 ? void 0 : testResourceRequirement.ports) || 0) > 0) {
            // clear any port-slots associated with this job
            Object.values(this.ports).forEach((jobMaybe, portNumber) => {
                if (jobMaybe && jobMaybe === pid.toString()) {
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
                    id: p.process.pm_id,
                    topic: "some topic",
                    // process:msg will be send as 'message' on target process
                    type: "process:msg",
                    // Data to be sent
                    data: {
                        testResourceConfiguration: {
                            // fs: fPath,
                            ports: selectionOfPorts,
                        },
                        id: p.process.pm_id,
                    },
                };
                console.log("mark1");
                this.pm2.sendDataToProcessId(p.process.pm_id, message, function (err, res) {
                    // no-op
                });
                // mark the selected ports as occupied
                for (const foundOpenPort of selectionOfPorts) {
                    this.ports[foundOpenPort] = pid.toString();
                }
            }
            else {
                console.log(`no port was open so send the ${pid} job to the back of the queue`);
                this.queue.push(p);
            }
        }
    }
    async releaseTestResources(pm2Proc) {
        if (pm2Proc) {
            (pm2Proc.data.testResource || []).forEach((p, k) => {
                const jobExistsAndMatches = this.ports[p] === pm2Proc.process.pm_id.toString();
                if (jobExistsAndMatches) {
                    this.ports[p] = OPEN_PORT;
                }
            });
        }
        else {
            console.error("idk?!");
        }
    }
    shutdown() {
        this.mode = `down`;
        pm2.list((err, processes) => {
            processes.forEach((proc) => {
                proc.pm_id &&
                    this.pm2.stop(proc.pm_id, (err, proc) => {
                        console.error(err);
                    });
            });
        });
    }
}
export class ITProject {
    constructor(config) {
        this.buildMode = config.buildMode;
        this.clearScreen = config.clearScreen;
        this.collateEntry = config.collateEntry;
        this.collateMode = config.collateMode;
        this.features = config.features;
        this.loaders = config.loaders;
        this.minify = config.minify;
        this.outbase = config.outbase;
        this.outdir = config.outdir;
        this.ports = config.ports;
        this.runMode = config.runMode;
        this.tests = config.tests;
        const collateDir = ".";
        const collateOpts = {
            format: "iife",
            outbase: this.outbase,
            outdir: collateDir,
            jsx: `transform`,
            entryPoints: [config.collateEntry],
            bundle: true,
            minify: this.minify === true,
            write: true,
            banner: {
                js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
            },
            plugins: [
                {
                    name: "hot-refresh",
                    setup(build) {
                        build.onEnd((result) => {
                            console.log(`collation transpilation`, result);
                            /* @ts-ignore:next-line */
                            clients.forEach((res) => res.write("data: update\n\n"));
                            clients.length = 0;
                            // console.log(error ? error : '...')
                        });
                    },
                },
            ],
        };
        const nodeRuntimeEsbuildConfig = {
            platform: "node",
            format: "esm",
            outbase: this.outbase,
            outdir: this.outdir,
            jsx: `transform`,
            entryPoints: [
                // these are the tested artifacts
                ...this.getSecondaryEndpointsPoints("node"),
                // these do the testing
                ...this.tests.map((t) => t[1]),
            ],
            bundle: true,
            minify: this.minify === true,
            write: true,
            outExtension: { ".js": ".mjs" },
            packages: "external",
            splitting: true,
            plugins: [
                ...(this.loaders || []),
                {
                    name: "testeranto-redirect",
                    setup(build) {
                        build.onResolve({ filter: /^.*\/testeranto\/$/ }, async (args) => {
                            return {
                                path: path.join(process.cwd(), `..`, "node_modules", `testeranto`),
                            };
                        });
                    },
                },
            ],
        };
        this.getSecondaryEndpointsPoints("electron").map((sourcefile) => {
            const outFileBaseName = sourcefile[0].split("/").slice(0, -1).join("/");
            fs.writeFile(`${this.outdir}/${outFileBaseName}.html`, `
<!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module" src="/${outFileBaseName}.mjs"></script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        });
        const electronRuntimeEsbuildConfig = {
            // target: `node`,
            platform: "browser",
            format: "esm",
            outbase: this.outbase,
            outdir: this.outdir,
            jsx: `transform`,
            entryPoints: [...this.getSecondaryEndpointsPoints("electron")],
            bundle: true,
            minify: this.minify === true,
            write: true,
            outExtension: { ".js": ".mjs" },
            // packages: "external",
            external: ["fs"],
            splitting: true,
            plugins: [
                ...(this.loaders || []),
                {
                    name: "testeranto-redirect",
                    setup(build) {
                        build.onResolve({ filter: /^.*\/testeranto\/$/ }, (args) => {
                            return {
                                path: path.join(process.cwd(), `..`, "node_modules", `testeranto`),
                            };
                        });
                    },
                },
            ],
        };
        console.log("buildMode   -", this.buildMode);
        console.log("runMode     -", this.runMode);
        console.log("collateMode -", this.collateMode);
        if (this.buildMode === "on") {
            esbuild.build(nodeRuntimeEsbuildConfig).then(async (eBuildResult) => {
                console.log("node tests", eBuildResult);
            });
            esbuild.build(electronRuntimeEsbuildConfig).then(async (eBuildResult) => {
                console.log("electron tests", eBuildResult);
            });
        }
        else if (this.buildMode === "watch") {
            esbuild.context(nodeRuntimeEsbuildConfig).then(async (ectx) => {
                ectx.watch();
            });
            esbuild.context(electronRuntimeEsbuildConfig).then(async (ectx) => {
                // unlike the server side, we need to run an http server to handle chunks imported into web-tests.
                if (this.runMode) {
                    ectx.serve({
                        servedir: "js-bazel",
                    });
                }
            });
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
    }
    getSecondaryEndpointsPoints(runtime) {
        if (runtime) {
            return this.tests
                .map((t) => {
                return t.filter((c) => c[1] === runtime).map((tc) => tc[0]);
            }, [])
                .flat();
        }
        return this.tests
            .map((t) => {
            return t.map((tc) => tc[1]);
        }, [])
            .flat();
    }
}
