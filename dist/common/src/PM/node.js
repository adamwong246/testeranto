"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Node = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _1 = require(".");
const fPaths = [];
class PM_Node extends _1.PM {
    constructor(t, ipcFile) {
        super();
        this.testResourceConfiguration = t;
        this.client = net_1.default.createConnection(ipcFile, () => {
            return;
        });
    }
    start() {
        throw new Error("DEPRECATED");
    }
    stop() {
        throw new Error("stop not implemented.");
    }
    send(command, ...argz) {
        const key = Math.random().toString();
        if (!this.client) {
            console.error(`Tried to send "${command} (${argz})" but the test has not been started and the IPC client is not established. Exiting as failure!`);
            process.exit(-1);
        }
        return new Promise((res) => {
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    process.removeListener("message", myListener);
                    res(x.payload);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify([command, ...argz, key]));
        });
    }
    async pages() {
        return this.send("pages", ...arguments);
    }
    waitForSelector(p, s) {
        return this.send("waitForSelector", ...arguments);
    }
    closePage(p) {
        return this.send("closePage", ...arguments);
        // return globalThis["closePage"](p);
    }
    goto(page, url) {
        return this.send("goto", ...arguments);
        // return globalThis["goto"](cdpPage.mainFrame()._id, url);
    }
    async newPage() {
        return this.send("newPage");
    }
    $(selector, page) {
        return this.send("$", ...arguments);
    }
    isDisabled(selector) {
        return this.send("isDisabled", ...arguments);
    }
    getAttribute(selector, attribute, p) {
        return this.send("getAttribute", ...arguments);
    }
    getInnerHtml(selector, p) {
        return this.send("getInnerHtml", ...arguments);
    }
    // setValue(selector: string) {
    //   return this.send("getValue", ...arguments);
    // }
    focusOn(selector) {
        return this.send("focusOn", ...arguments);
    }
    typeInto(selector) {
        return this.send("typeInto", ...arguments);
    }
    page() {
        return this.send("page");
    }
    click(selector) {
        return this.send("click", ...arguments);
    }
    screencast(opts, page) {
        return this.send("screencast", Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    screencastStop(p) {
        return this.send("screencastStop", ...arguments);
    }
    customScreenShot(x, y) {
        const opts = x[0];
        const page = x[1];
        return this.send("customScreenShot", Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name, page);
    }
    async existsSync(destFolder) {
        return await this.send("existsSync", this.testResourceConfiguration.fs + "/" + destFolder);
    }
    mkdirSync() {
        return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
    }
    async write(uid, contents) {
        return await this.send("write", ...arguments);
    }
    async writeFileSync(x) {
        const z = arguments["0"];
        // const filepath = z[0];
        // const contents = z[1];
        const filepath = arguments[0];
        const contents = arguments[1];
        return await this.send("writeFileSync", this.testResourceConfiguration.fs + "/" + filepath, contents, this.testResourceConfiguration.name);
    }
    async createWriteStream(filepath) {
        return await this.send("createWriteStream", this.testResourceConfiguration.fs + "/" + filepath, this.testResourceConfiguration.name);
    }
    async end(uid) {
        return await this.send("end", ...arguments);
    }
    async customclose() {
        return await this.send("customclose", this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
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
                    // fs.writeFileSync(
                    //   path.resolve(
                    //     targetDir.split("/").slice(0, -1).join("/"),
                    //     "manifest"
                    //   ),
                    //   fPaths.join(`\n`),
                    //   {
                    //     encoding: "utf-8",
                    //   }
                    // );
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
