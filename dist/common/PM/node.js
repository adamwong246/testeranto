"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Node = exports.addPageBinding = void 0;
// import puppeteer from "puppeteer";
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core";
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const index_js_1 = require("./index.js");
const fPaths = [];
function addPageBinding(type, name, prefix) {
    // Depending on the frame loading state either Runtime.evaluate or
    // Page.addScriptToEvaluateOnNewDocument might succeed. Let's check that we
    // don't re-wrap Puppeteer's binding.
    if (globalThis[name]) {
        return;
    }
    // We replace the CDP binding with a Puppeteer binding.
    Object.assign(globalThis, {
        [name](...args) {
            var _a, _b, _c;
            // This is the Puppeteer binding.
            const callPuppeteer = globalThis[name];
            (_a = callPuppeteer.args) !== null && _a !== void 0 ? _a : (callPuppeteer.args = new Map());
            (_b = callPuppeteer.callbacks) !== null && _b !== void 0 ? _b : (callPuppeteer.callbacks = new Map());
            const seq = ((_c = callPuppeteer.lastSeq) !== null && _c !== void 0 ? _c : 0) + 1;
            callPuppeteer.lastSeq = seq;
            callPuppeteer.args.set(seq, args);
            // Needs to be the same as CDP_BINDING_PREFIX.
            globalThis[prefix + name](JSON.stringify({
                type,
                name,
                seq,
                args,
                isTrivial: !args.some((value) => {
                    return value instanceof Node;
                }),
            }));
            return new Promise((resolve, reject) => {
                callPuppeteer.callbacks.set(seq, {
                    resolve(value) {
                        callPuppeteer.args.delete(seq);
                        resolve(value);
                    },
                    reject(value) {
                        callPuppeteer.args.delete(seq);
                        reject(value);
                    },
                });
            });
        },
    });
}
exports.addPageBinding = addPageBinding;
class PM_Node extends index_js_1.PM {
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    existsSync(destFolder) {
        return globalThis["existsSync"](this.testResourceConfiguration.fs + "/" + destFolder);
    }
    mkdirSync() {
        return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(writeObject, contents) {
        return globalThis["write"](writeObject.uid, contents);
    }
    writeFileSync(fp, contents) {
        return globalThis["writeFileSync"](this.testResourceConfiguration.fs + "/" + fp, contents);
    }
    createWriteStream(filepath) {
        return globalThis["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath);
    }
    end(writeObject) {
        return globalThis["end"](writeObject.uid);
    }
    // write(accessObject: { uid: number; }, contents: string): boolean {
    //   throw new Error("Method not implemented.");
    // }
    // existsSync(destFolder: string): boolean {
    //   return fs.existsSync(destFolder);
    // }
    // async mkdirSync(destFolder: string) {
    //   if (!fs.existsSync(destFolder)) {
    //     return fs.mkdirSync(destFolder, { recursive: true });
    //   }
    //   return false;
    // }
    // writeFileSync(fp: string, contents: string) {
    //   fs.writeFileSync(fp, contents);
    // }
    // createWriteStream(filepath: string): fs.WriteStream {
    //   return fs.createWriteStream(filepath);
    // }
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
        console.log("start1");
        return puppeteer_core_1.default.connect(options).then((b) => {
            this.browser = b;
        });
        // return new Promise<Browser>((res, rej) => {
        //   // this.browser = await puppeteer.connect(options);
        //   // console.log("start2", this.browser);
        //   // console.log("mark5", this.browser);
        //   // res(this.browser);
        // });
    }
}
exports.PM_Node = PM_Node;
// class PuppetMasterServer extends AbstractPuppetMaster {
//   // constructor(...z: []) {
//   //   super(...z);
//   // }
//   // // pages(): Promise<Page[]>;
//   // pages(): Promise<Page[]> {
//   //   return new Promise<Page[]>((res, rej) => {
//   //     res(super.pages());
//   //   });
//   // }
// }
