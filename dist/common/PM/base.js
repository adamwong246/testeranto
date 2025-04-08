"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Base = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_js_1 = require("./index.js");
const fileStreams3 = [];
const fPaths = [];
const files = {};
const recorders = {};
const screenshots = {};
class PM_Base extends index_js_1.PM {
    constructor(configs) {
        super();
        this.server = {};
        this.configs = configs;
        globalThis["waitForSelector"] = async (pageKey, sel) => {
            const page = (await this.browser.pages()).find(
            /* @ts-ignore:next-line */
            (p) => p.mainFrame()._id === pageKey);
            await (page === null || page === void 0 ? void 0 : page.waitForSelector(sel));
        };
        globalThis["screencastStop"] = async (path) => {
            return recorders[path].stop();
        };
        globalThis["closePage"] = async (pageKey) => {
            const page = (await this.browser.pages()).find(
            /* @ts-ignore:next-line */
            (p) => p.mainFrame()._id === pageKey);
            /* @ts-ignore:next-line */
            return page.close();
        };
        globalThis["goto"] = async (pageKey, url) => {
            const page = (await this.browser.pages()).find(
            /* @ts-ignore:next-line */
            (p) => p.mainFrame()._id === pageKey);
            await (page === null || page === void 0 ? void 0 : page.goto(url));
            return;
        };
        globalThis["newPage"] = () => {
            return this.browser.newPage();
        };
        globalThis["pages"] = () => {
            return this.browser.pages();
        };
        globalThis["mkdirSync"] = (fp) => {
            if (!fs_1.default.existsSync(fp)) {
                return fs_1.default.mkdirSync(fp, {
                    recursive: true,
                });
            }
            return false;
        };
        globalThis["writeFileSync"] = (filepath, contents, testName) => {
            this.writeFileSync(filepath, contents, testName);
        };
        globalThis["createWriteStream"] = (filepath, testName) => {
            return this.createWriteStream(filepath, testName);
            // const f = fs.createWriteStream(filepath);
            // fileStreams3.push(f);
            // // files.add(filepath);
            // if (!files[testName]) {
            //   files[testName] = new Set();
            // }
            // files[testName].add(filepath);
            // return {
            //   ...JSON.parse(JSON.stringify(f)),
            //   uid: fileStreams3.length - 1,
            // };
        };
        globalThis["write"] = (uid, contents) => {
            // fileStreams3[uid].write(contents);
            return this.write(uid, contents);
        };
        globalThis["end"] = (uid) => {
            fileStreams3[uid].end();
        };
        globalThis["customScreenShot"] = async (opts, pageKey, testName) => {
            const page = (await this.browser.pages()).find(
            /* @ts-ignore:next-line */
            (p) => p.mainFrame()._id === pageKey);
            const p = opts.path;
            const dir = path_1.default.dirname(p);
            fs_1.default.mkdirSync(dir, {
                recursive: true,
            });
            if (!files[opts.path]) {
                files[opts.path] = new Set();
            }
            files[opts.path].add(opts.path);
            /* @ts-ignore:next-line */
            const sPromise = page.screenshot(Object.assign(Object.assign({}, opts), { path: p }));
            if (!screenshots[opts.path]) {
                screenshots[opts.path] = [];
            }
            screenshots[opts.path].push(sPromise);
            await sPromise;
            return sPromise;
        };
        globalThis["screencast"] = async (opts, pageKey) => {
            const page = (await this.browser.pages()).find(
            /* @ts-ignore:next-line */
            (p) => p.mainFrame()._id === pageKey);
            const p = opts.path;
            const dir = path_1.default.dirname(p);
            fs_1.default.mkdirSync(dir, {
                recursive: true,
            });
            const recorder = await (page === null || page === void 0 ? void 0 : page.screencast(Object.assign(Object.assign({}, opts), { 
                /* @ts-ignore:next-line */
                path: p })));
            /* @ts-ignore:next-line */
            recorders[opts.path] = recorder;
            return opts.path;
        };
    }
    customclose() {
        throw new Error("Method not implemented.");
    }
    waitForSelector(p, s) {
        throw new Error("Method not implemented.");
    }
    closePage(p) {
        throw new Error("Method not implemented.");
    }
    newPage() {
        throw new Error("Method not implemented.");
    }
    goto(p, url) {
        throw new Error("Method not implemented.");
    }
    $(selector) {
        throw new Error("Method not implemented.");
    }
    screencast(opts) {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore:next-line */
    customScreenShot(opts, cdpPage) {
        throw new Error("Method not implemented.");
    }
    end(accessObject) {
        throw new Error("Method not implemented.");
    }
    existsSync(destFolder) {
        return fs_1.default.existsSync(destFolder);
    }
    async mkdirSync(fp) {
        if (!fs_1.default.existsSync(fp)) {
            return fs_1.default.mkdirSync(fp, {
                recursive: true,
            });
        }
        return false;
    }
    writeFileSync(filepath, contents, testName) {
        return new Promise((res) => {
            fs_1.default.mkdirSync(path_1.default.dirname(filepath), {
                recursive: true,
            });
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            // return ;
            res(fs_1.default.writeFileSync(filepath, contents));
        });
    }
    createWriteStream(filepath, testName) {
        return new Promise((res) => {
            const f = fs_1.default.createWriteStream(filepath);
            fileStreams3.push(f);
            // files.add(filepath);
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            res((fileStreams3.length - 1).toString());
        });
        // return {
        //   ...JSON.parse(JSON.stringify(f)),
        //   uid: fileStreams3.length - 1,
        // };
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
    write(uid, contents) {
        return new Promise((res) => {
            const x = fileStreams3[uid].write(contents);
            res(x);
        });
        // return x
    }
    page() {
        throw new Error("Method not implemented.");
    }
    click(selector) {
        throw new Error("Method not implemented.");
    }
    focusOn(selector) {
        throw new Error("Method not implemented.");
    }
    typeInto(value) {
        throw new Error("Method not implemented.");
    }
    getValue(value) {
        throw new Error("Method not implemented.");
    }
    getAttribute(selector, attribute) {
        throw new Error("Method not implemented.");
    }
    isDisabled(selector) {
        throw new Error("Method not implemented.");
    }
    screencastStop(s) {
        throw new Error("Method not implemented.");
    }
}
exports.PM_Base = PM_Base;
