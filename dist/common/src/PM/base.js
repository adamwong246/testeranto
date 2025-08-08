"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Base = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileStreams3 = [];
const fPaths = [];
const files = {};
const recorders = {};
const screenshots = {};
class PM_Base {
    constructor(configs) {
        this.configs = configs;
    }
    customclose() {
        throw new Error("customclose not implemented.");
    }
    waitForSelector(p, s) {
        return new Promise((res) => {
            this.doInPage(p, async (page) => {
                const x = page.$(s);
                const y = await x;
                res(y !== null);
                // return page.focus(selector);
            });
        });
    }
    closePage(p) {
        // throw new Error("Method not implemented.");
        return new Promise((res) => {
            this.doInPage(p, async (page) => {
                page.close();
                res({});
                // return page.focus(selector);
            });
        });
    }
    async newPage() {
        return (await this.browser.newPage()).mainFrame()._id;
    }
    goto(p, url) {
        return new Promise((res) => {
            this.doInPage(p, async (page) => {
                await (page === null || page === void 0 ? void 0 : page.goto(url));
                res({});
                // return page.focus(selector);
            });
        });
    }
    $(selector, p) {
        return new Promise((res) => {
            this.doInPage(p, async (page) => {
                const x = await page.$(selector);
                const y = await (x === null || x === void 0 ? void 0 : x.jsonValue());
                res(y);
            });
        });
    }
    async pages() {
        return (await this.browser.pages()).map((p) => {
            return p.mainFrame()._id;
        });
    }
    async screencast(ssOpts, testName, page) {
        const p = ssOpts.path;
        const dir = path_1.default.dirname(p);
        fs_1.default.mkdirSync(dir, {
            recursive: true,
        });
        if (!files[testName]) {
            files[testName] = new Set();
        }
        files[testName].add(ssOpts.path);
        const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
        if (!screenshots[testName]) {
            screenshots[testName] = [];
        }
        screenshots[testName].push(sPromise);
        await sPromise;
        return sPromise;
    }
    async customScreenShot(ssOpts, testName, pageUid) {
        const p = ssOpts.path;
        const dir = path_1.default.dirname(p);
        fs_1.default.mkdirSync(dir, {
            recursive: true,
        });
        if (!files[testName]) {
            files[testName] = new Set();
        }
        files[testName].add(ssOpts.path);
        const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageUid);
        const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
        if (!screenshots[testName]) {
            screenshots[testName] = [];
        }
        screenshots[testName].push(sPromise);
        await sPromise;
        return sPromise;
    }
    async end(uid) {
        await fileStreams3[uid].end();
        return true;
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
    async writeFileSync(...x) {
        const filepath = x[0];
        const contents = x[1];
        const testName = x[2];
        return new Promise(async (res) => {
            fs_1.default.mkdirSync(path_1.default.dirname(filepath), {
                recursive: true,
            });
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            await fs_1.default.writeFileSync(filepath, contents);
            res(true);
        });
    }
    async createWriteStream(filepath, testName) {
        const folder = filepath.split("/").slice(0, -1).join("/");
        return new Promise((res) => {
            if (!fs_1.default.existsSync(folder)) {
                return fs_1.default.mkdirSync(folder, {
                    recursive: true,
                });
            }
            const f = fs_1.default.createWriteStream(filepath);
            fileStreams3.push(f);
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            res(fileStreams3.length - 1);
        });
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
    async write(uid, contents) {
        return new Promise((res) => {
            const x = fileStreams3[uid].write(contents);
            res(x);
        });
    }
    page(p) {
        return p;
    }
    click(selector, page) {
        return page.click(selector);
    }
    async focusOn(selector, p) {
        this.doInPage(p, (page) => {
            return page.focus(selector);
        });
    }
    async typeInto(value, p) {
        this.doInPage(p, (page) => {
            return page.keyboard.type(value);
        });
    }
    // setValue(value: string, p: string) {
    //   this.doInPage(p, (page) => {
    //     return page.keyboard.type(value);
    //   });
    // }
    getAttribute(selector, attribute, p) {
        this.doInPage(p, (page) => {
            return page.$eval(selector, (input) => input.getAttribute(attribute));
        });
    }
    async getInnerHtml(selector, p) {
        return new Promise((res, rej) => {
            this.doInPage(p, async (page) => {
                const e = await page.$(selector);
                if (!e) {
                    rej();
                }
                else {
                    const text = await (await e.getProperty("textContent")).jsonValue();
                    res(text);
                }
            });
        });
    }
    isDisabled(selector, p) {
        this.doInPage(p, async (page) => {
            return await page.$eval(selector, (input) => {
                return input.disabled;
            });
        });
    }
    screencastStop(s) {
        return recorders[s].stop();
    }
    async doInPage(p, cb) {
        (await this.browser.pages()).forEach((page) => {
            const frame = page.mainFrame();
            if (frame._id === p) {
                return cb(page);
            }
        });
    }
}
exports.PM_Base = PM_Base;
