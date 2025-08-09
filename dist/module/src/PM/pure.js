/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM } from ".";
const fPaths = [];
export class PM_Pure extends PM {
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
        // Pure runtime doesn't need filesystem checks
        return Promise.resolve(true);
    }
    mkdirSync() {
        // Pure runtime doesn't need directories
        return true;
    }
    write(uid, contents) {
        // Pure runtime doesn't need file writing
        return Promise.resolve(true);
    }
    writeFileSync() {
        // Pure runtime doesn't need file writing
        return Promise.resolve(true);
    }
    createWriteStream() {
        // Pure runtime doesn't need file streams
        return {
            write: () => true,
            end: () => { }
        };
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
