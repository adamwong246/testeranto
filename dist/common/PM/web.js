"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Web = void 0;
const index_js_1 = require("./index.js");
const puppeteer_core_browser_js_1 = __importDefault(require("puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"));
class PM_Web extends index_js_1.PM {
    // testResourceConfiguration: ITTestResourceConfiguration;
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    existsSync(destFolder) {
        return window["existsSync"](destFolder);
    }
    mkdirSync() {
        return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(writeObject, contents) {
        return window["write"](writeObject.uid, contents);
    }
    writeFileSync(fp, contents) {
        console.log("WEB writeFileSync", this.testResourceConfiguration);
        return window["writeFileSync"](this.testResourceConfiguration.fs + "/" + fp, contents);
    }
    createWriteStream(filepath) {
        return window["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath);
    }
    end(writeObject) {
        return window["end"](writeObject.uid);
    }
    customclose() {
        return window["customclose"]();
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
    // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
    startPuppeteer(options, destFolder) {
        return fetch(`http://localhost:3234/json/version`)
            .then((v) => {
            return v.json();
        })
            .then((json) => {
            console.log("found endpoint", json.webSocketDebuggerUrl);
            return puppeteer_core_browser_js_1.default
                .connect({
                browserWSEndpoint: json.webSocketDebuggerUrl,
            }
            // options
            // { browserWSEndpoint: "ws://localhost:3234/devtools/browser/RANDOM" }
            )
                .then((b) => {
                this.browser = b;
                const handler2 = {
                    get(target, prop, receiver) {
                        // console.log("handler2 target", target); //, prop, receiver);
                        // console.log("handler2 prop", prop);
                        // console.log("handler2 receiver", receiver);
                        // return target[prop](...arguments);
                        if (prop === "screenshot") {
                            return (x) => {
                                // console.log("custom-screenshot", arguments, x);
                                window["custom-screenshot"](Object.assign(Object.assign({}, x), { path: destFolder + "/" + x.path }));
                            };
                        }
                        else if (prop === "mainFrame") {
                            return () => target[prop](...arguments);
                        }
                        else {
                            return Reflect.get(...arguments);
                        }
                        // if (prop === "mainFrame") {
                        //   return (target[prop] = target.mainFrame);
                        // } else {
                        //   return Reflect.get(...arguments);
                        // }
                        // return target.pages().map((page) => {
                        //   return new Proxy(page, handler1);
                        // });
                    },
                };
                const handler1 = {
                    get(target, prop, receiver) {
                        // console.log("handler1 target", target); //, prop, receiver);
                        // console.log("handler1 prop", prop);
                        // console.log("handler1 receiver", receiver);
                        if (prop === "pages") {
                            return async () => {
                                return target.pages().then((pages) => {
                                    return pages.map((p) => {
                                        return new Proxy(p, handler2);
                                    });
                                });
                                // return (await target.pages()).map((page) => {
                                //   return new Proxy(page, handler2);
                                // });
                            };
                        }
                        return Reflect.get(...arguments);
                    },
                };
                // console.log("this.browser", this.browser);
                // console.log("this.browser.pages", this.browser.pages);
                const proxy3 = new Proxy(this.browser, handler1);
                this.browser = proxy3;
                // console.log("this.browser.pages2", this.browser.pages);
            });
        });
        // console.log("connecting to ws://localhost:3234/devtools/browser/RANDOM");
        // return puppeteer
        //   .connect({
        //     ...options,
        //   })
        //   .finally(() => {
        //     console.log("idk");
        //   });
        // return new Promise<Browser>(async (res, rej) => {
        //   console.log("connecting with options", options);
        //   this.browser = await puppeteer.connect({
        //     ...options,
        //   });
        //   res(this.browser);
        // });
    }
}
exports.PM_Web = PM_Web;
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
