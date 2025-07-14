/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";
import fs from "fs";
import path from "path";
import { PM } from ".";
const fPaths = [];
export class PM_Node extends PM {
    constructor(t, ipcFile) {
        super();
        this.testResourceConfiguration = t;
        this.client = net.createConnection(ipcFile, () => {
            return;
        });
    }
    start() {
        throw new Error("DEPREFECATED");
        // console.log("START");
        // return new Promise((res) => {
        //   process.on("message", (message: { path?: string }) => {
        //     console.log("MESSAGE");
        //     if (message.path) {
        //       this.client = net.createConnection(message.path, () => {
        //         res();
        //       });
        //     }
        //   });
        // });
    }
    stop() {
        throw new Error("stop not implemented.");
    }
    send(command, ...argz) {
        const key = Math.random().toString();
        // console.log("SEND", key, command, ...argz);
        if (!this.client) {
            console.error(`Tried to send "${command} (${argz})" but the test has not been started and the IPC client is not established. Exiting as failure!`);
            process.exit(-1);
        }
        return new Promise((res) => {
            const myListener = (event) => {
                const x = JSON.parse(event);
                if (x.key === key) {
                    process.removeListener("message", myListener);
                    res(x.payload);
                }
            };
            process.addListener("message", myListener);
            this.client.write(JSON.stringify([command, ...argz, key]));
        });
    }
    async launchSideCar(n) {
        return this.send("launchSideCar", n, this.testResourceConfiguration.name);
    }
    stopSideCar(n) {
        return this.send("stopSideCar", n, this.testResourceConfiguration.name);
    }
    async pages() {
        return this.send("pages", ...arguments);
    }
    waitForSelector(p, s) {
        return this.send("waitForSelector", ...arguments);
    }
    closePage(p) {
        return this.send("closePage", ...arguments);
        // return globalThis["closePage"](p);
    }
    goto(page, url) {
        return this.send("goto", ...arguments);
        // return globalThis["goto"](cdpPage.mainFrame()._id, url);
    }
    async newPage() {
        return this.send("newPage");
    }
    $(selector, page) {
        return this.send("$", ...arguments);
    }
    isDisabled(selector) {
        return this.send("isDisabled", ...arguments);
    }
    getAttribute(selector, attribute, p) {
        return this.send("getAttribute", ...arguments);
    }
    getInnerHtml(selector, p) {
        return this.send("getInnerHtml", ...arguments);
    }
    // setValue(selector: string) {
    //   return this.send("getValue", ...arguments);
    // }
    focusOn(selector) {
        return this.send("focusOn", ...arguments);
    }
    typeInto(selector) {
        return this.send("typeInto", ...arguments);
    }
    page() {
        return this.send("page");
    }
    click(selector) {
        return this.send("click", ...arguments);
    }
    screencast(opts, page) {
        return this.send("screencast", Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    screencastStop(p) {
        return this.send("screencastStop", ...arguments);
    }
    customScreenShot(x, y) {
        const opts = x[0];
        const page = x[1];
        return this.send("customScreenShot", Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name, page);
    }
    async existsSync(destFolder) {
        return await this.send("existsSync", this.testResourceConfiguration.fs + "/" + destFolder);
    }
    mkdirSync() {
        return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
    }
    async write(uid, contents) {
        return await this.send("write", ...arguments);
    }
    async writeFileSync(filepath, contents) {
        // console.log("mark55");
        return await this.send("writeFileSync", this.testResourceConfiguration.fs + "/" + filepath, contents, this.testResourceConfiguration.name);
    }
    async createWriteStream(filepath) {
        return await this.send("createWriteStream", this.testResourceConfiguration.fs + "/" + filepath, this.testResourceConfiguration.name);
    }
    async end(uid) {
        return await this.send("end", ...arguments);
    }
    async customclose() {
        return await this.send("customclose", this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
                const cleanPath = path.resolve(fPath);
                fPaths.push(cleanPath.replace(process.cwd(), ``));
                const targetDir = cleanPath.split("/").slice(0, -1).join("/");
                fs.mkdir(targetDir, { recursive: true }, async (error) => {
                    if (error) {
                        console.error(`❗️testArtiFactory failed`, targetDir, error);
                    }
                    // fs.writeFileSync(
                    //   path.resolve(
                    //     targetDir.split("/").slice(0, -1).join("/"),
                    //     "manifest"
                    //   ),
                    //   fPaths.join(`\n`),
                    //   {
                    //     encoding: "utf-8",
                    //   }
                    // );
                    if (Buffer.isBuffer(value)) {
                        fs.writeFileSync(fPath, value, "binary");
                        res();
                    }
                    else if (`string` === typeof value) {
                        fs.writeFileSync(fPath, value.toString(), {
                            encoding: "utf-8",
                        });
                        res();
                    }
                    else {
                        const pipeStream = value;
                        const myFile = fs.createWriteStream(fPath);
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
        // return puppeteer.connect(options).then((b) => {
        //   this.browser = b;
        // });
    }
}
