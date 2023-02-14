import * as esbuild from 'esbuild';
import pm2 from 'pm2';
import fs from "fs";
import path from "path";
const TIMEOUT = 1000;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";
const featureOutPath = "./dist/";
const reportOutPath = "./dist/report";
class TesterantoProject {
    constructor(tests, features, ports) {
        this.tests = tests;
        this.features = features;
        this.ports = ports;
    }
    builder() {
        const text = JSON.stringify({ tests: this.tests, features: this.features });
        const p = "./dist/testeranto.config.json";
        fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
            fs.promises.writeFile(p, text);
        });
    }
}
export class Scheduler {
    constructor(project) {
        // testSrcMd5s: object;
        // featureSrcMd5: string;
        this.spinCycle = 0;
        this.spinAnimation = "←↖↑↗→↘↓↙";
        const portsToUse = project.ports;
        this.ports = {};
        portsToUse.forEach((port) => {
            this.ports[port] = OPEN_PORT;
        });
        this.queue = [];
        this.jobs = {};
        // this.testSrcMd5s = {};
        // this.featureTestJoin = {};
        this.project = project;
        pm2.connect((err) => {
            if (err) {
                console.error(err);
                process.exit(2);
            }
            const theTests = this.project.tests.reduce((m, [kn, fn, cn]) => {
                m[kn] = pm2.start({
                    script: "./dist/" + fn.split(".ts")[0] + ".js",
                    name: cn
                }, (err, apps) => {
                    if (err) {
                        console.error(err);
                        return pm2.disconnect();
                    }
                });
                return m;
            }, {});
            pm2.launchBus((err, pm2_bus) => {
                pm2_bus.on('testeranto:hola', (packet) => {
                    // this.push()
                });
                pm2_bus.on('testeranto:done', function (packet) {
                    console.log(packet);
                });
                pm2_bus.on('testeranto:killed', function (packet) {
                    console.log(packet);
                });
                pm2_bus.on('testeranto:aborted', function (packet) {
                    console.log(packet);
                });
            });
            setInterval(async () => {
                console.log(this.spinner(), this.queue.length, this.ports);
                this.pop();
            }, TIMEOUT);
        });
    }
    async abort(key) {
        if (this.jobs[key]) {
            console.log("aborting...", key, this.jobs[key]);
            await this.jobs[key].aborter();
            // await this.jobs[key].cancellablePromise.cancel();
            delete this.jobs[key];
        }
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
    // private push(testJob: ITestJob, key) {
    //   // this.queue.push({
    //   //   key,
    //   //   // aborter: testJob.test.aborter,
    //   //   aborter: testJob.test.aborter,
    //   //   getCancellablePromise: this.startJob(testJob, key),
    //   //   testResourceRequired: testJob.testResource
    //   // });
    // }
    pop() {
        const qi = this.queue.pop();
        if (!qi) {
            console.log('feed me some tests plz');
            return;
        }
        // const { key, aborter, testResourceRequired, getCancellablePromise } = qi;
        // this.abort(key);
        // if (testResourceRequired.ports === 0) {
        //   // this.jobs[key] = {
        //   //   aborter,
        //   //   cancellablePromise: getCancellablePromise({}).then(() => delete this.jobs[key])
        //   // }
        // }
        // if (testResourceRequired.ports > 0) {
        //   // clear any port-slots associated with this job
        //   Object.values(this.ports).forEach((jobMaybe, portNumber) => {
        //     if (jobMaybe && jobMaybe === key) {
        //       this.ports[portNumber] = OPEN_PORT;
        //     }
        //   });
        //   // find a list of open ports
        //   const foundOpenPorts = Object.keys(this.ports)
        //     .filter((p) => this.ports[p] === OPEN_PORT);
        //   // if there are enough open port-slots...
        //   if (foundOpenPorts.length >= testResourceRequired.ports) {
        //     const selectionOfPorts = foundOpenPorts.slice(0, testResourceRequired.ports);
        //     //  init the promise with ports which are open.
        //     // const testPromise = getCancellablePromise(selectionOfPorts)
        //     //   // when the promise is done...
        //     //   .then(() => {
        //     //     // clear any ports which were used
        //     //     Object.keys(this.ports)
        //     //       .forEach((p, k) => {
        //     //         const jobExistsAndMatches = this.ports[p] === key;
        //     //         if (jobExistsAndMatches) {
        //     //           this.ports[p] = OPEN_PORT;
        //     //         }
        //     //       });
        //     //     delete this.jobs[key]
        //     //   });
        //     // mark the selected ports as occupied
        //     for (const foundOpenPort of selectionOfPorts) {
        //       this.ports[foundOpenPort] = key;
        //     }
        //     // this.jobs[key] = {
        //     //   aborter,
        //     //   cancellablePromise: testPromise
        //     // };
        //   } else {
        //     console.log(`no port was open so send the ${key} job to the back of the queue`)
        //     this.queue.push(qi);
        //   }
        // }
    }
}
console.log("build.sh", process.cwd(), process.argv);
console.log(path.resolve(process.cwd(), process.argv[2]));
fs.readFile(
// path.resolve(process.cwd(), process.argv[2]),
"./testeranto.config.json", async (err, testerantoConfigImport) => {
    const testerantoConfig = JSON.parse(testerantoConfigImport.toString());
    console.log("testerantoConfig", testerantoConfig);
    const entryPoints = [
        testerantoConfig.features,
        ...testerantoConfig.tests.map(([key, sourcefile, className]) => {
            return sourcefile;
        })
    ];
    console.log("entryPoints", entryPoints);
    let ctx = await esbuild.context({
        entryPoints,
        bundle: true,
        minify: false,
        format: "esm",
        platform: 'node',
        supported: { "dynamic-import": true },
        // target: ["esnext"],
        write: true,
        outdir: 'dist/tests',
        packages: 'external',
        plugins: [
            ...testerantoConfig.loaders || [],
            {
                name: 'import-path',
                setup(build) {
                    build.onResolve({ filter: /^\.{1,2}\// }, args => {
                        const importedPath = args.resolveDir + "/" + args.path;
                        const absolutePath = path.resolve(importedPath);
                        const absolutePath2 = path.resolve(testerantoConfig.features).split(".ts").slice(0, -1).join('.ts');
                        if (absolutePath === absolutePath2) {
                            return {
                                path: process.cwd() + "/dist/tests/testerantoFeatures.test.js",
                                external: true
                            };
                        }
                        else {
                            // if (absolutePath === process.cwd() + "/contracts") {
                            //   return {
                            //     path: path.resolve(importedPath), external: false
                            //   }
                            // }
                        }
                    });
                },
            },
        ],
        external: [
            testerantoConfig.features
        ]
    });
    await ctx.watch();
    // let { host, port } = await ctx.serve({
    //   servedir: 'dist',
    // })
    fs.promises.writeFile("./dist/testeranto.config.js", JSON.stringify(testerantoConfig));
    console.log("watch.ts tProject", testerantoConfig);
    const tProject = new TesterantoProject(testerantoConfig.tests, testerantoConfig.features, testerantoConfig.ports);
    new Scheduler(tProject);
});
