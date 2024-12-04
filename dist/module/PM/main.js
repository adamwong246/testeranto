import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import { PM } from "./index.js";
const fPaths = [];
const fileStreams3 = [];
const files = {}; // = new Set<string>();
const screenshots = {};
export class PM_Main extends PM {
    constructor(configs) {
        super();
        this.launchNode = async (src, dest) => {
            console.log("launchNode", src);
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.error("missing test config");
                process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            let portsToUse = [];
            if (testConfigResource.ports === 0) {
                argz = JSON.stringify({
                    scheduled: true,
                    name: src,
                    ports: portsToUse,
                    fs: destFolder,
                    browserWSEndpoint: this.browser.wsEndpoint(),
                });
            }
            else if (testConfigResource.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
                    }
                    argz = JSON.stringify({
                        scheduled: true,
                        name: src,
                        // ports: [3333],
                        ports: portsToUse,
                        fs: ".",
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else {
                    this.queue.push(src);
                    return;
                }
            }
            else {
                console.error("negative port makes no sense", src);
                process.exit(-1);
            }
            const builtfile = dest + ".mjs";
            this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
                return module.default.then((defaultModule) => {
                    defaultModule
                        .receiveTestResourceConfig(argz)
                        .then((x) => {
                        console.log("then", x);
                        return x;
                    })
                        .catch((e) => {
                        console.log("catch", e);
                    });
                });
            });
            for (let i = 0; i <= portsToUse.length; i++) {
                this.ports[i] = true; //port is open again
            }
        };
        this.launchWeb = (t, dest) => {
            console.log("launchWeb", t, dest);
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: dest,
                ports: [].toString(),
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const evaluation = `import('${dest}.mjs').then(async (x) => {
      console.log("imported", x, (x.default));
      try {
        await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
            const fileStreams2 = [];
            // const screenshots2: Promise<any>[] = [];
            const doneFileStream2 = [];
            this.browser
                .newPage()
                .then((page) => {
                page.exposeFunction("custom-screenshot", async (ssOpts, testName) => {
                    console.log("main.ts browser custom-screenshot", testName);
                    const p = ssOpts.path;
                    const dir = path.dirname(p);
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                    files[testName].add(ssOpts.path);
                    const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
                    if (!screenshots[testName]) {
                        screenshots[testName] = [];
                    }
                    screenshots[testName].push(sPromise);
                    // sPromise.then(())
                    await sPromise;
                    return sPromise;
                    // page.evaluate(`window["screenshot done"]`);
                });
                page.exposeFunction("writeFileSync", (fp, contents, testName) => {
                    const dir = path.dirname(fp);
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                    const p = new Promise(async (res, rej) => {
                        fs.writeFileSync(fp, contents);
                        res(fp);
                    });
                    doneFileStream2.push(p);
                    if (!files[testName]) {
                        files[testName] = new Set();
                    }
                    files[testName].add(fp);
                    return p;
                });
                page.exposeFunction("existsSync", (fp, contents) => {
                    return fs.existsSync(fp);
                });
                page.exposeFunction("mkdirSync", (fp) => {
                    if (!fs.existsSync(fp)) {
                        return fs.mkdirSync(fp, {
                            recursive: true,
                        });
                    }
                    return false;
                });
                page.exposeFunction("createWriteStream", (fp, testName) => {
                    const f = fs.createWriteStream(fp);
                    if (!files[testName]) {
                        files[testName] = new Set();
                    }
                    files[testName].add(fp);
                    const p = new Promise((res, rej) => {
                        res(fp);
                    });
                    doneFileStream2.push(p);
                    f.on("close", async () => {
                        await p;
                    });
                    fileStreams2.push(f);
                    return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams2.length - 1 });
                });
                page.exposeFunction("write", async (uid, contents) => {
                    return fileStreams2[uid].write(contents);
                });
                page.exposeFunction("end", async (uid) => {
                    return fileStreams2[uid].end();
                });
                page.exposeFunction("customclose", (p, testName) => {
                    fs.writeFileSync(p + "/manifest.json", JSON.stringify(Array.from(files[testName])));
                    delete files[testName];
                    console.log("screenshots", testName, screenshots);
                    Promise.all(screenshots[testName] || []).then(() => {
                        delete screenshots[testName];
                        page.close();
                    });
                    // globalThis["writeFileSync"](
                    //   p + "/manifest.json",
                    //   // files.entries()
                    //   JSON.stringify(Array.from(files[testName]))
                    // );
                    // console.log("closing doneFileStream2", doneFileStream2);
                    // console.log("closing doneFileStream2", doneFileStream2);
                    // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
                    //   page.close();
                    // });
                    // Promise.all(screenshots).then(() => {
                    //   page.close();
                    // });
                    // setTimeout(() => {
                    //   console.log("Delayed for 1 second.");
                    //   page.close();
                    // }, 5000);
                    // return page.close();
                });
                return page;
            })
                .then(async (page) => {
                await page.goto(`file://${`${dest}.html`}`, {});
                page.evaluate(evaluation).finally(() => {
                    console.log("evaluation failed.", dest);
                });
                return page;
            });
        };
        this.server = {};
        this.configs = configs;
        this.ports = {};
        this.configs.ports.forEach((element) => {
            this.ports[element] = "true"; // set ports as open
        });
        globalThis["mkdirSync"] = (fp) => {
            if (!fs.existsSync(fp)) {
                return fs.mkdirSync(fp, {
                    recursive: true,
                });
            }
            return false;
        };
        globalThis["writeFileSync"] = (filepath, contents, testName) => {
            // Create directories if they don't exist
            const dir = path.dirname(filepath.split("/").slice(0, -1).join("/"));
            fs.mkdirSync(dir, {
                recursive: true,
            });
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            return fs.writeFileSync(filepath, contents);
        };
        globalThis["createWriteStream"] = (filepath, testName) => {
            const f = fs.createWriteStream(filepath);
            fileStreams3.push(f);
            // files.add(filepath);
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams3.length - 1 });
        };
        globalThis["write"] = (uid, contents) => {
            fileStreams3[uid].write(contents);
        };
        globalThis["end"] = (uid) => {
            fileStreams3[uid].end();
        };
        globalThis["customclose"] = (p, testName) => {
            if (!files[testName]) {
                files[testName] = new Set();
            }
            fs.writeFileSync(p + "/manifest.json", JSON.stringify(Array.from(files[testName])));
            delete files[testName];
            // globalThis["writeFileSync"](
            //   p + "/manifest.json",
            //   // files.entries()
            //   JSON.stringify(Array.from(files[testName]))
            // );
            // fileStreams3[uid].end();
        };
        // page.exposeFunction("customclose", () => {
        //   console.log("closing doneFileStream2", doneFileStream2);
        //   // console.log("closing doneFileStream2", doneFileStream2);
        //   Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
        //     page.close();
        //   });
        //   // page.close();
        //   // Promise.all(screenshots).then(() => {
        //   //   page.close();
        //   // });
        //   // setTimeout(() => {
        //   //   console.log("Delayed for 1 second.");
        //   //   page.close();
        //   // }, 5000);
        //   // return page.close();
        // });
    }
    async startPuppeteer(options, destfolder) {
        this.browser = await puppeteer.launch(options);
        return this.browser;
    }
    end(accessObject) {
        throw new Error("Method not implemented.");
    }
    existsSync(destFolder) {
        return fs.existsSync(destFolder);
    }
    async mkdirSync(fp) {
        if (!fs.existsSync(fp)) {
            return fs.mkdirSync(fp, {
                recursive: true,
            });
        }
        return false;
    }
    writeFileSync(fp, contents) {
        fs.writeFileSync(fp, contents);
    }
    createWriteStream(filepath) {
        return fs.createWriteStream(filepath);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
                const cleanPath = path.resolve(fPath);
                fPaths.push(cleanPath.replace(process.cwd(), ``));
                const targetDir = cleanPath.split("/").slice(0, -1).join("/");
                fs.mkdir(targetDir, { recursive: true }, async (error) => {
                    if (error) {
                        console.error(`❗️testArtiFactory failed`, targetDir, error);
                    }
                    fs.writeFileSync(path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
                        encoding: "utf-8",
                    });
                    if (Buffer.isBuffer(value)) {
                        fs.writeFileSync(fPath, value, "binary");
                        res();
                    }
                    else if (`string` === typeof value) {
                        fs.writeFileSync(fPath, value.toString(), {
                            encoding: "utf-8",
                        });
                        res();
                    }
                    else {
                        /* @ts-ignore:next-line */
                        const pipeStream = value;
                        const myFile = fs.createWriteStream(fPath);
                        pipeStream.pipe(myFile);
                        pipeStream.on("close", () => {
                            myFile.close();
                            res();
                        });
                    }
                });
            }));
        };
    }
    write(accessObject, contents) {
        throw new Error("Method not implemented.");
    }
}
