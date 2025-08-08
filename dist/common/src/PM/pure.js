"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Pure = void 0;
const _1 = require(".");
const fPaths = [];
class PM_Pure extends _1.PM {
    getInnerHtml(selector, page) {
        throw new Error("pure.ts getInnHtml not implemented");
        return Promise.resolve("");
    }
    stopSideCar(uid) {
        throw new Error("pure.ts getInnHtml not implemented");
        return Promise.resolve(true);
    }
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    start() {
        return new Promise((r) => r());
    }
    stop() {
        return new Promise((r) => r());
    }
    launchSideCar(n) {
        return globalThis["launchSideCar"](n, this.testResourceConfiguration.name);
    }
    pages() {
        return globalThis["pages"]();
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
        return globalThis["$"](selector);
    }
    isDisabled(selector) {
        return globalThis["isDisabled"](selector);
    }
    getAttribute(selector, attribute) {
        return globalThis["getAttribute"](selector, attribute);
    }
    getValue(selector) {
        return globalThis["getValue"](selector);
    }
    focusOn(selector) {
        return globalThis["focusOn"](selector);
    }
    typeInto(selector, value) {
        return globalThis["typeInto"](selector, value);
    }
    page() {
        return globalThis["page"]();
    }
    click(selector) {
        return globalThis["click"](selector);
    }
    screencast(opts, page) {
        return globalThis["screencast"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    screencastStop(p) {
        return globalThis["screencastStop"](p);
    }
    customScreenShot(opts, page) {
        return globalThis["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    existsSync(destFolder) {
        return globalThis["existsSync"](this.testResourceConfiguration.fs + "/" + destFolder);
    }
    mkdirSync() {
        return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(uid, contents) {
        return globalThis["write"](uid, contents);
    }
    writeFileSync(x) {
        // eslint-disable-next-line prefer-rest-params
        const z = arguments["0"];
        const filepath = z[0];
        const contents = z[1];
        return globalThis["writeFileSync"](this.testResourceConfiguration.fs + "/" + filepath, contents, this.testResourceConfiguration.name);
    }
    createWriteStream(filepath) {
        return globalThis["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath, this.testResourceConfiguration.name);
    }
    end(uid) {
        return globalThis["end"](uid);
    }
    customclose() {
        globalThis["customclose"](this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        // return (fPath, value: string | Buffer | PassThrough) => {
        //   callback(
        //     new Promise<void>((res) => {
        //       tLog("testArtiFactory =>", fPath);
        //       const cleanPath = path.resolve(fPath);
        //       fPaths.push(cleanPath.replace(process.cwd(), ``));
        //       const targetDir = cleanPath.split("/").slice(0, -1).join("/");
        //       fs.mkdir(targetDir, { recursive: true }, async (error) => {
        //         if (error) {
        //           console.error(`❗️testArtiFactory failed`, targetDir, error);
        //         }
        //         fs.writeFileSync(
        //           path.resolve(
        //             targetDir.split("/").slice(0, -1).join("/"),
        //             "manifest"
        //           ),
        //           fPaths.join(`\n`),
        //           {
        //             encoding: "utf-8",
        //           }
        //         );
        //         if (Buffer.isBuffer(value)) {
        //           fs.writeFileSync(fPath, value, "binary");
        //           res();
        //         } else if (`string` === typeof value) {
        //           fs.writeFileSync(fPath, value.toString(), {
        //             encoding: "utf-8",
        //           });
        //           res();
        //         } else {
        //           const pipeStream: PassThrough = value;
        //           const myFile = fs.createWriteStream(fPath);
        //           pipeStream.pipe(myFile);
        //           pipeStream.on("close", () => {
        //             myFile.close();
        //             res();
        //           });
        //         }
        //       });
        //     })
        //   );
        // };
    }
}
exports.PM_Pure = PM_Pure;
