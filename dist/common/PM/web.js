"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Web = void 0;
const index_js_1 = require("./index.js");
class PM_Web extends index_js_1.PM {
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    start() {
        console.log("mark6");
        return new Promise((r) => r());
    }
    stop() {
        return new Promise((r) => r());
    }
    waitForSelector(p, s) {
        return window["waitForSelector"](p, s);
    }
    screencast(opts) {
        return window["screencast"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name);
    }
    screencastStop(recorder) {
        return window["screencastStop"](recorder);
    }
    closePage(p) {
        return window["closePage"](p);
    }
    goto(p, url) {
        return window["goto"](p, url);
    }
    newPage() {
        return window["newPage"]();
    }
    $(selector) {
        return window["$"](selector);
    }
    isDisabled(selector) {
        return window["isDisabled"](selector);
    }
    getAttribute(selector, attribute) {
        return window["getValue"](selector, attribute);
    }
    getValue(selector) {
        return window["getValue"](selector);
    }
    focusOn(selector) {
        return window["focusOn"](selector);
    }
    typeInto(value) {
        return window["typeInto"](value);
    }
    page() {
        return window["page"]();
    }
    click(selector) {
        return window["click"](selector);
    }
    customScreenShot(opts) {
        return window["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name);
    }
    existsSync(destFolder) {
        return window["existsSync"](destFolder);
    }
    mkdirSync(x) {
        return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(writeObject, contents) {
        return window["write"](writeObject.uid, contents);
    }
    writeFileSync(filepath, contents) {
        return window["writeFileSync"](this.testResourceConfiguration.fs + "/" + filepath, contents, this.testResourceConfiguration.name);
    }
    createWriteStream(filepath) {
        return window["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath, this.testResourceConfiguration.name);
    }
    end(writeObject) {
        return window["end"](writeObject.uid);
    }
    customclose() {
        window["customclose"](this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
                // const cleanPath = path.resolve(fPath);
                // fPaths.push(cleanPath.replace(process.cwd(), ``));
                // const targetDir = cleanPath.split("/").slice(0, -1).join("/");
                // fs.mkdir(targetDir, { recursive: true }, async (error) => {
                //   if (error) {
                //     console.error(`❗️testArtiFactory failed`, targetDir, error);
                //   }
                //   fs.writeFileSync(
                //     path.resolve(
                //       targetDir.split("/").slice(0, -1).join("/"),
                //       "manifest"
                //     ),
                //     fPaths.join(`\n`),
                //     {
                //       encoding: "utf-8",
                //     }
                //   );
                //   if (Buffer.isBuffer(value)) {
                //     fs.writeFileSync(fPath, value, "binary");
                //     res();
                //   } else if (`string` === typeof value) {
                //     fs.writeFileSync(fPath, value.toString(), {
                //       encoding: "utf-8",
                //     });
                //     res();
                //   } else {
                //     /* @ts-ignore:next-line */
                //     const pipeStream: PassThrough = value;
                //     const myFile = fs.createWriteStream(fPath);
                //     pipeStream.pipe(myFile);
                //     pipeStream.on("close", () => {
                //       myFile.close();
                //       res();
                //     });
                //   }
                // });
            }));
        };
    }
}
exports.PM_Web = PM_Web;
