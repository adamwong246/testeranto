import { PassThrough } from "stream";
import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";

import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Web extends PM {
  server: PuppetMasterServer;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }

  existsSync(destFolder: string): boolean {
    return window["existsSync"](destFolder);
  }

  mkdirSync() {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(writeObject: { uid: number }, contents: string) {
    return window["write"](writeObject.uid, contents);
  }

  writeFileSync(filepath: string, contents: string) {
    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }

  createWriteStream(filepath: string): any {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }

  end(writeObject: { uid: number }) {
    return window["end"](writeObject.uid);
  }

  customclose() {
    window["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void) {
    return (fPath, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((res, rej) => {
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
        })
      );
    };
  }

  startPuppeteer(options, destFolder: string): Promise<any> {
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
                    return await window["custom-screenshot"](
                      {
                        ...x,
                        // path: destFolder + "/" + x.path,
                        path: x.path,
                      },
                      name
                    );
                  };
                } else if (prop === "mainFrame") {
                  return () => target[prop](...arguments);
                } else {
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
