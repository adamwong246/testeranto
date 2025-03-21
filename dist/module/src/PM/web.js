import { PM } from "./index.js";
export class PM_Web extends PM {
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    $(selector) {
        return window["$"](selector);
    }
    screencast(opts) {
        throw new Error("Method not implemented.");
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
}
