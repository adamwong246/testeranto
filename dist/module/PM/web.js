import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";
import { PM } from "./index.js";
export class PM_Web extends PM {
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
    startPuppeteer(options, destFolder) {
        const name = this.testResourceConfiguration.name;
        return fetch(`http://localhost:3234/json/version`)
            .then((v) => {
            return v.json();
        })
            .then((json) => {
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
                                return await window["custom-screenshot"](Object.assign(Object.assign({}, x), { 
                                    // path: destFolder + "/" + x.path,
                                    path: x.path }), name);
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
    }
}
