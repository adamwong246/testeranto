import {
  PM,
  Tiposkripto
} from "./chunk-MNYRTJ7L.mjs";
import {
  defaultTestResourceRequirement
} from "./chunk-GD6O3ZZC.mjs";

// src/PM/node.ts
import net from "net";
import fs from "fs";
import path from "path";
var fPaths = [];
var PM_Node = class extends PM {
  testResourceConfiguration;
  client;
  constructor(t, ipcFile) {
    super();
    this.testResourceConfiguration = t;
    this.client = net.createConnection(ipcFile, () => {
      return;
    });
  }
  start() {
    throw new Error("DEPRECATED");
  }
  stop() {
    throw new Error("stop not implemented.");
  }
  send(command, ...argz) {
    const key = Math.random().toString();
    if (!this.client) {
      console.error(
        `Tried to send "${command} (${argz})" but the test has not been started and the IPC client is not established. Exiting as failure!`
      );
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
  async pages() {
    return this.send("pages", ...arguments);
  }
  waitForSelector(p, s) {
    return this.send("waitForSelector", ...arguments);
  }
  closePage(p) {
    return this.send("closePage", ...arguments);
  }
  goto(page, url) {
    return this.send("goto", ...arguments);
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
    return this.send(
      "screencast",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(p) {
    return this.send("screencastStop", ...arguments);
  }
  customScreenShot(x, y) {
    const opts = x[0];
    const page = x[1];
    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      this.testResourceConfiguration.name,
      page
    );
  }
  async existsSync(destFolder) {
    return await this.send(
      "existsSync",
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
  }
  async write(uid, contents) {
    return await this.send("write", ...arguments);
  }
  async writeFileSync(filepath, contents) {
    const z = arguments["0"];
    return await this.send(
      "writeFileSync",
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  async createWriteStream(filepath) {
    return await this.send(
      "createWriteStream",
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  async end(uid) {
    return await this.send("end", ...arguments);
  }
  async customclose() {
    return await this.send(
      "customclose",
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
          const cleanPath = path.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            if (Buffer.isBuffer(value)) {
              fs.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        })
      );
    };
  }
  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options) {
  }
  // async launchSideCar(
  //   n: number
  // ): Promise<[number, ITTestResourceConfiguration]> {
  //   return this.send<[number, ITTestResourceConfiguration]>(
  //     "launchSideCar",
  //     n,
  //     this.testResourceConfiguration.name
  //   );
  // }
  // stopSideCar(n: number): Promise<any> {
  //   return this.send<ITTestResourceConfiguration>(
  //     "stopSideCar",
  //     n,
  //     this.testResourceConfiguration.name
  //   );
  // }
};

// src/lib/Node.ts
var ipcfile;
var NodeTiposkripto = class extends Tiposkripto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    console.log("111 NodeTiposkripto constructor");
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    let testResourceConfig;
    if (partialTestResource && partialTestResource.trim() !== "") {
      try {
        testResourceConfig = JSON.parse(partialTestResource);
      } catch (e) {
        console.error("Error parsing test resource config from command line:", e);
        console.error("Received:", partialTestResource);
        const envTestResources = process.env.TEST_RESOURCES;
        if (envTestResources) {
          try {
            testResourceConfig = JSON.parse(envTestResources);
          } catch (envErr) {
            console.error("Error parsing test resource config from environment:", envErr);
            throw new Error("Could not parse test resource configuration");
          }
        } else {
          throw new Error("No test resource configuration provided");
        }
      }
    } else {
      const envTestResources = process.env.TEST_RESOURCES;
      if (envTestResources) {
        try {
          testResourceConfig = JSON.parse(envTestResources);
        } catch (e) {
          console.error("Error parsing test resource config from environment:", e);
          throw new Error("Could not parse test resource configuration");
        }
      } else {
        throw new Error("No test resource configuration provided");
      }
    }
    let ipcFilePath = ipcfile;
    if (!ipcFilePath || ipcFilePath.trim() === "") {
      ipcFilePath = process.env.IPC_FILE || "/tmp/tpipe_default";
    }
    return await this.testJobs[0].receiveTestResourceConfig(
      new PM_Node(testResourceConfig, ipcFilePath)
    );
  }
};
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    ipcfile = process.argv[3];
    if (!ipcfile || ipcfile.trim() === "") {
      ipcfile = process.env.IPC_FILE || "/tmp/tpipe_default";
    }
    process.exit((await t.receiveTestResourceConfig(process.argv[2])).fails);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(-1);
  }
};
var Node_default = tiposkripto;
export {
  NodeTiposkripto,
  Node_default as default
};
