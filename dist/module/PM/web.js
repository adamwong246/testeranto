import { PM } from "./index.js";
import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";
function waitForFunctionCall() {
    return new Promise((resolve) => {
        window["myFunction"] = () => {
            // Do something when myFunction is called
            console.log("myFunction was called!");
            resolve(); // Resolve the promise
        };
    });
}
const files = new Set();
export class PM_Web extends PM {
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
    writeFileSync(filepath, contents) {
        console.log("WEB writeFileSync", filepath);
        files.add(filepath);
        return window["writeFileSync"](this.testResourceConfiguration.fs + "/" + filepath, contents);
    }
    createWriteStream(filepath) {
        files.add(filepath);
        return window["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath);
    }
    end(writeObject) {
        return window["end"](writeObject.uid);
    }
    customclose() {
        window["writeFileSync"](this.testResourceConfiguration.fs + "/manifest.json", 
        // files.entries()
        JSON.stringify(Array.from(files))).then(() => {
            window["customclose"]();
        });
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
    startPuppeteer(options, destFolder) {
        return fetch(`http://localhost:3234/json/version`)
            .then((v) => {
            return v.json();
        })
            .then((json) => {
            console.log("found endpoint", json.webSocketDebuggerUrl);
            return puppeteer
                .connect({
                browserWSEndpoint: json.webSocketDebuggerUrl,
            })
                .then((b) => {
                this.browser = b;
                const handler2 = {
                    get(target, prop, receiver) {
                        if (prop === "screenshot") {
                            return async (x) => {
                                // debugger;
                                files.add(x.path);
                                console.log("aloha", files);
                                return await window["custom-screenshot"](Object.assign(Object.assign({}, x), { path: destFolder + "/" + x.path }));
                            };
                        }
                        else if (prop === "mainFrame") {
                            return () => target[prop](...arguments);
                        }
                        else {
                            return Reflect.get(...arguments);
                        }
                    },
                };
                const handler1 = {
                    get(target, prop, receiver) {
                        if (prop === "pages") {
                            return async () => {
                                return target.pages().then((pages) => {
                                    return pages.map((p) => {
                                        return new Proxy(p, handler2);
                                    });
                                });
                            };
                        }
                        return Reflect.get(...arguments);
                    },
                };
                const proxy3 = new Proxy(this.browser, handler1);
                this.browser = proxy3;
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
