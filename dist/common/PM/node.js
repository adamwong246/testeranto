"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Node = void 0;
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_js_1 = require("./index.js");
const fPaths = [];
class PM_Node extends index_js_1.PM {
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    start() {
        return new Promise((res) => {
            process.on("message", (message) => {
                console.log("MESSAGE", message);
                if (message.path) {
                    this.client = net_1.default.createConnection(message.path, () => {
                        res();
                        // this.client.write("hi from child");
                        // console.error("goodbye node error", e);
                        // process.exit(-1);
                    });
                }
            });
        });
    }
    stop() {
        throw new Error("Method not implemented.");
    }
    waitForSelector(p, s) {
        return globalThis["waitForSelector"](p, s);
    }
    closePage(p) {
        return globalThis["closePage"](p);
    }
    goto(cdpPage, url) {
        return globalThis["goto"](cdpPage.mainFrame()._id, url);
    }
    newPage() {
        return globalThis["newPage"]();
    }
    $(selector) {
        throw new Error("Method not implemented.");
    }
    isDisabled(selector) {
        throw new Error("Method not implemented.");
    }
    getAttribute(selector, attribute) {
        throw new Error("Method not implemented.");
    }
    getValue(selector) {
        throw new Error("Method not implemented.");
    }
    focusOn(selector) {
        throw new Error("Method not implemented.");
    }
    typeInto(value) {
        throw new Error("Method not implemented.");
    }
    page() {
        return globalThis["page"]();
    }
    click(selector) {
        return globalThis["click"](selector);
    }
    screencast(opts, page) {
        return globalThis["screencast"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page.mainFrame()._id, this.testResourceConfiguration.name);
    }
    screencastStop(p) {
        return globalThis["screencastStop"](p);
    }
    customScreenShot(opts, cdpPage) {
        return globalThis["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), cdpPage.mainFrame()._id, this.testResourceConfiguration.name);
    }
    existsSync(destFolder) {
        return globalThis["existsSync"](this.testResourceConfiguration.fs + "/" + destFolder);
    }
    mkdirSync() {
        return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(uid, contents) {
        return new Promise((res) => {
            const key = Math.random().toString();
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    // console.log(`WRITE MATCH`, key);
                    process.removeListener("message", myListener);
                    res(x.written);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify(["write", uid, contents, key]));
        });
        // return globalThis["write"](writeObject.uid, contents);
    }
    writeFileSync(filepath, contents) {
        return new Promise((res) => {
            const key = Math.random().toString();
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    process.removeListener("message", myListener);
                    res(x.uid);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify([
                "writeFileSync",
                this.testResourceConfiguration.fs + "/" + filepath,
                contents,
                this.testResourceConfiguration.name,
                key,
            ]));
        });
        // return globalThis["writeFileSync"](
        //   this.testResourceConfiguration.fs + "/" + filepath,
        //   contents,
        //   this.testResourceConfiguration.name
        // );
    }
    createWriteStream(filepath) {
        return new Promise((res) => {
            const key = Math.random().toString();
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    process.removeListener("message", myListener);
                    res(x.uid);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify([
                "createWriteStream",
                this.testResourceConfiguration.fs + "/" + filepath,
                this.testResourceConfiguration.name,
                key,
            ]));
        });
    }
    end(uid) {
        console.log("end");
        return new Promise((res) => {
            const key = Math.random().toString();
            const myListener = (event) => {
                console.log(`Received end: ${JSON.stringify(event)}`);
                const x = JSON.parse(event);
                console.log(`x: `, x);
                if (x.key === key) {
                    console.log(`end MATCH`, key);
                    process.removeListener("message", myListener);
                    res(x.uid);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify(["end", uid, key]));
        });
        // return globalThis["end"](writeObject.uid);
    }
    customclose() {
        globalThis["customclose"](this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
                const cleanPath = path_1.default.resolve(fPath);
                fPaths.push(cleanPath.replace(process.cwd(), ``));
                const targetDir = cleanPath.split("/").slice(0, -1).join("/");
                fs_1.default.mkdir(targetDir, { recursive: true }, async (error) => {
                    if (error) {
                        console.error(`❗️testArtiFactory failed`, targetDir, error);
                    }
                    fs_1.default.writeFileSync(path_1.default.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
                        encoding: "utf-8",
                    });
                    if (Buffer.isBuffer(value)) {
                        fs_1.default.writeFileSync(fPath, value, "binary");
                        res();
                    }
                    else if (`string` === typeof value) {
                        fs_1.default.writeFileSync(fPath, value.toString(), {
                            encoding: "utf-8",
                        });
                        res();
                    }
                    else {
                        /* @ts-ignore:next-line */
                        const pipeStream = value;
                        const myFile = fs_1.default.createWriteStream(fPath);
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
    // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
    startPuppeteer(options) {
        // return puppeteer.connect(options).then((b) => {
        //   this.browser = b;
        // });
    }
}
exports.PM_Node = PM_Node;
