import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  puppeteer_core_default
} from "./chunk-L7PQJBZK.mjs";
import {
  init_cjs_shim
} from "./chunk-THMF2HPO.mjs";

// ../testeranto/src/Node.ts
init_cjs_shim();

// ../testeranto/src/lib/core.ts
init_cjs_shim();

// ../testeranto/src/lib/index.ts
init_cjs_shim();
var BaseTestInterface = {
  beforeAll: async (s) => s,
  beforeEach: async function(subject, initialValues, x, testResource, pm) {
    return subject;
  },
  afterEach: async (s) => s,
  afterAll: (store) => void 0,
  butThen: async (store, thenCb) => thenCb(store),
  andWhen: (a) => a,
  assertThis: () => null
};
var DefaultTestInterface = (p) => {
  return {
    ...BaseTestInterface,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

// ../testeranto/src/lib/abstractBase.ts
init_cjs_shim();
var BaseSuite = class {
  constructor(name, index, givens = {}, checks = []) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }
  toObj() {
    return {
      name: this.name,
      givens: Object.keys(this.givens).map((k) => this.givens[k].toObj()),
      fails: this.fails
    };
  }
  setup(s, artifactory, tr, pm) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return t;
  }
  afterAll(store, artifactory, pm) {
    return store;
  }
  async run(input, testResourceConfiguration, artifactory, tLog, pm) {
    this.testResourceConfiguration = testResourceConfiguration;
    tLog("test resources: ", JSON.stringify(testResourceConfiguration));
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const sName = this.name;
    for (const [gNdx, g] of Object.entries(this.givens)) {
      const subject = await this.setup(
        input,
        suiteArtifactory,
        testResourceConfiguration,
        pm
      );
      const giver = this.givens[gNdx];
      try {
        this.store = await giver.give(
          subject,
          gNdx,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          pm,
          sNdx
        );
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
      }
    }
    const afterAllProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          return (fp, contents) => target[prop](`suite-${sNdx}/afterAll/${fp}`, contents);
        }
        if (prop === "browser") {
          return new Proxy(target[prop], {
            get(bTarget, bProp, bReceiver) {
              if (bProp === "pages") {
                return async () => {
                  return bTarget.pages().then((pages) => {
                    return pages.map((page) => {
                      return new Proxy(page, {
                        get(pTarget, pProp, pReciever) {
                          if (pProp === "screenshot") {
                            return async (x) => {
                              console.log(
                                "custom-screenshot-MARK-afterAllProxy",
                                // arguments,
                                // x,
                                window["custom-screenshot"].toString()
                              );
                              return await window["custom-screenshot"]({
                                ...x,
                                path: `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll/` + x.path
                              });
                            };
                          } else {
                            return Reflect.get(...arguments);
                          }
                        }
                      });
                    });
                  });
                };
              }
            }
          });
        }
        return Reflect.get(...arguments);
      }
    });
    try {
      this.afterAll(this.store, artifactory, afterAllProxy);
    } catch (e) {
      console.error(e);
    }
    return this;
  }
};
var BaseGiven = class {
  constructor(name, features, whens, thens, givenCB, initialValues) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }
  beforeAll(store, artifactory) {
    return store;
  }
  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      // fail: this.fail ? [this.fail] : false,
      features: this.features
    };
  }
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      for (const [whenNdx, whenStep] of this.whens.entries()) {
        const beforeEachProxy = new Proxy(pm, {
          get(target, prop, receiver) {
            if (prop === "writeFileSync") {
              console.log("beforeEachProx", arguments, target[prop]);
              return (fp, contents) => target[prop](
                `suite-${suiteNdx}/given-${key}/when/${whenNdx}/beforeEach/${fp}`,
                contents
              );
            }
            return Reflect.get(...arguments);
          }
        });
        this.store = await this.givenThat(
          subject,
          testResourceConfiguration,
          givenArtifactory,
          this.givenCB,
          beforeEachProxy
          // pm
        );
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          // `${this.name}/${whenNdx}`
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }
      console.log("mark-then1");
      for (const thenStep of this.thens) {
        console.log("mark-then", thenStep);
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm
        );
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog(e);
      tLog("\x07");
    } finally {
      try {
        const afterEachProxy = new Proxy(pm, {
          get(target, prop, receiver) {
            if (prop === "writeFileSync") {
              return (fp, contents) => target[prop](
                `suite-${suiteNdx}/given-${key}/afterAll/${fp}`,
                contents
              );
            }
            if (prop === "browser") {
              return new Proxy(target[prop], {
                get(bTarget, bProp, bReceiver) {
                  if (bProp === "pages") {
                    return async () => {
                      return bTarget.pages().then((pages) => {
                        return pages.map((page) => {
                          return new Proxy(page, {
                            get(pTarget, pProp, pReciever) {
                              if (pProp === "screenshot") {
                                return async (x) => {
                                  console.log(
                                    "custom-screenshot-MARK-afterEachProxy",
                                    window["custom-screenshot"].toString()
                                  );
                                  return await window["custom-screenshot"]({
                                    ...x,
                                    path: `${testResourceConfiguration.fs}/suite-${suiteNdx}/given-${key}/afterEach/` + x.path
                                  });
                                };
                              } else {
                                return Reflect.get(...arguments);
                              }
                            }
                          });
                        });
                      });
                    };
                  }
                }
              });
            }
            return Reflect.get(...arguments);
          }
        });
        await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, whenCB) {
    this.name = name;
    this.whenCB = whenCB;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, key) {
    tLog(" When:", this.name);
    const name = this.name;
    const andWhenProxy = new Proxy(pm, {
      get(target, prop, receiver) {
        if (prop === "writeFileSync") {
          console.log("andWhenProxy", arguments, target[prop]);
          return (fp, contents) => (
            // target[prop](`${key}/andWhen/${fp}`, contents);
            target[prop](`${key}/andWhen/${fp}`, contents)
          );
        }
        return Reflect.get(...arguments);
      }
    });
    try {
      return await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        andWhenProxy
      );
    } catch (e) {
      this.error = true;
      throw e;
    }
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, pm) {
    tLog(" Then:", this.name);
    try {
      const x = await this.butThen(
        store,
        this.thenCB,
        testResourceConfiguration
      );
      return x;
    } catch (e) {
      console.log("test failed", e);
      this.error = e.message;
      throw e;
    }
  }
};
var BaseCheck = class {
  constructor(name, features, checkCB, whens, thens) {
    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;
  }
  async afterEach(store, key, cb, pm) {
    return;
  }
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
    tLog(`
 Check: ${this.name}`);
    const store = await this.checkThat(
      subject,
      testResourceConfiguration,
      artifactory
    );
    await this.checkCB(
      Object.entries(this.whens).reduce((a, [key2, when]) => {
        a[key2] = async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog,
            pm,
            "x"
          );
        };
        return a;
      }, {}),
      Object.entries(this.thens).reduce((a, [key2, then]) => {
        a[key2] = async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration,
            tLog,
            pm
          );
          tester(t);
        };
        return a;
      }, {})
    );
    await this.afterEach(store, key, () => {
    }, pm);
    return;
  }
};

// ../testeranto/src/lib/classBuilder.ts
init_cjs_shim();

// ../testeranto/src/lib/basebuilder.ts
init_cjs_shim();
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification) {
    this.input = input;
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check()
    );
    this.testJobs = this.specs.map((suite) => {
      const suiteRunner = (suite2) => async (puppetMaster, tLog) => {
        await puppetMaster.startPuppeteer(
          {
            browserWSEndpoint: puppetMaster.testResourceConfiguration.browserWSEndpoint
          },
          puppetMaster.testResourceConfiguration.fs
        );
        return await suite2.run(
          input,
          puppetMaster.testResourceConfiguration,
          (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
            tLog,
            (p) => {
              this.artifacts.push(p);
            }
          )(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value),
          tLog,
          puppetMaster
        );
      };
      const runner = suiteRunner(suite);
      return {
        test: suite,
        // testResourceRequirement,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(puppetMaster) {
          await puppetMaster.mkdirSync();
          const logFilePath = "log.txt";
          const access = await puppetMaster.createWriteStream(logFilePath);
          const tLog = (...l) => {
            puppetMaster.write(access, `${l.toString()}
`);
          };
          const suiteDone = await runner(
            puppetMaster,
            tLog
          );
          const logPromise = new Promise((res, rej) => {
            puppetMaster.end(access);
            res(true);
          });
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          puppetMaster.writeFileSync(`exitcode`, numberOfFailures.toString());
          puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts: this.artifacts || [],
            logPromise
          };
        }
      };
    });
  }
  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }
  Given() {
    return this.givenOverides;
  }
  When() {
    return this.whenOverides;
  }
  Then() {
    return this.thenOverides;
  }
  Check() {
    return this.checkOverides;
  }
};

// ../testeranto/src/lib/classBuilder.ts
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens,
            checks
          );
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, givEn]) => {
        a[key] = (features, whens, thens, givEn2) => {
          return new givenKlasser.prototype.constructor(
            key,
            features,
            whens,
            thens,
            testImplementation.givens[key],
            givEn2
          );
        };
        return a;
      },
      {}
    );
    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]) => {
        a[key] = (payload) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          );
        };
        return a;
      },
      {}
    );
    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]) => {
        a[key] = (expected, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      },
      {}
    );
    const classyChecks = Object.entries(testImplementation.checks).reduce(
      (a, [key, z]) => {
        a[key] = (somestring, features, callback) => {
          return new checkKlasser.prototype.constructor(
            somestring,
            features,
            callback,
            classyWhens,
            classyThens
          );
        };
        return a;
      },
      {}
    );
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks,
      testResourceRequirement,
      testSpecification
      // puppetMaster
    );
  }
};

// ../testeranto/src/lib/core.ts
var Testeranto = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface) {
    const fullTestInterface = DefaultTestInterface(testInterface);
    super(
      testImplementation,
      testSpecification,
      input,
      class extends BaseSuite {
        afterAll(store, artifactory, pm) {
          return fullTestInterface.afterAll(
            store,
            (fPath, value) => {
              artifactory(`afterAll4-${this.name}/${fPath}`, value);
            },
            pm
            // {
            //   ...utils,
            //   browser: proxy,
            // }
          );
        }
        assertThat(t) {
          fullTestInterface.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
          console.log("mark12");
          return (fullTestInterface.beforeAll || (async (input2, artifactory2, tr2, pm2) => input2))(s, this.testResourceConfiguration, artifactory, pm);
        }
      },
      class Given extends BaseGiven {
        async givenThat(subject, testResource, artifactory, initializer, pm) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            (fPath, value) => (
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value)
            ),
            testResource,
            this.initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath, value) => artifactory(`after/${fPath}`, value),
                pm
              )
            )
          );
        }
      },
      class When extends BaseWhen {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullTestInterface.andWhen(
            store,
            whenCB,
            testResource,
            pm
          );
        }
      },
      class Then extends BaseThen {
        async butThen(store, thenCB, testResourceConfiguration) {
          return await fullTestInterface.butThen(
            store,
            thenCB,
            testResourceConfiguration
          );
        }
      },
      class Check extends BaseCheck {
        constructor(name, features, checkCallback, whens, thens, initialValues) {
          super(name, features, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }
        async checkThat(subject, testResourceConfiguration, artifactory, pm) {
          return fullTestInterface.beforeEach(
            subject,
            this.initialValues,
            (fPath, value) => artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath, value) => (
                  // TODO does not work?
                  artifactory(`afterEach2-${this.name}/${fPath}`, value)
                ),
                pm
              )
            )
          );
        }
      },
      testResourceRequirement
      // puppetMaster
    );
  }
};

// ../testeranto/src/PM/node.ts
init_cjs_shim();
import fs from "fs";
import path from "path";

// ../testeranto/src/PM/index.ts
init_cjs_shim();
var PM = class {
  // pages(): Promise<Page[]>;
  // pages(): Promise<Page[]> {
  //   return new Promise<Page[]>((res, rej) => {
  //     res(super.pages());
  //   });
  // }
};

// ../testeranto/src/PM/node.ts
var fPaths = [];
var PM_Node = class extends PM {
  constructor(t) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }
  existsSync(destFolder) {
    return globalThis["existsSync"](
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(writeObject, contents) {
    return globalThis["write"](writeObject.uid, contents);
  }
  writeFileSync(fp, contents) {
    return globalThis["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + fp,
      contents
    );
  }
  createWriteStream(filepath) {
    return globalThis["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath
    );
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
            fs.writeFileSync(
              path.resolve(
                targetDir.split("/").slice(0, -1).join("/"),
                "manifest"
              ),
              fPaths.join(`
`),
              {
                encoding: "utf-8"
              }
            );
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
    console.log("start1");
    return puppeteer_core_default.connect(options).then((b) => {
      this.browser = b;
    });
  }
  // launchNode = (src: string, dest: string) => {
  //   console.log("launchNode", src);
  //   // childProcesses[src] = "running";
  //   const destFolder = dest.replace(".mjs", "");
  //   const argz = JSON.stringify({
  //     scheduled: true,
  //     name: src,
  //     ports: [3333],
  //     // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
  //     // fs: destFolder,
  //     fs: ".",
  //   });
  //   const builtfile = dest + ".mjs";
  //   console.log("importing and running ", builtfile);
  //   // import(builtfile).then(async (v) => {
  //   //   console.log("v", (await v.default).receiveTestResourceConfig(argz));
  //   // });
  //   // console.log("launchNode", src, dest, " -> ", destFolder, argz);
  //   // const child = utilityProcess.fork(dest + ".mjs", [argz], {
  //   //   cwd: destFolder,
  //   //   stdio: "pipe",
  //   // });
  //   // const nodeGuid = uuidv4();
  //   // nodeChildren[nodeGuid] = child;
  //   // if (!fs.existsSync(destFolder)) {
  //   //   fs.mkdirSync(destFolder, { recursive: true });
  //   // }
  //   // fs.rmSync(`${destFolder}/stdout.log`, { force: true });
  //   // fs.rmSync(`${destFolder}/stderr.log`, { force: true });
  //   // const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);
  //   // const stderr = fs.createWriteStream(`${destFolder}/stderr.log`);
  //   // child
  //   //   .on("message", (data) => {
  //   //     console.log("from child", JSON.stringify(data));
  //   //     if (data.launchWeb) {
  //   //       const guid = uuidv4();
  //   //       const webChild = launchWebSecondary(process.cwd() + data.launchWeb);
  //   //       // child.postMessage({ webLaunched: guid });
  //   //       webChild.webContents.on("did-finish-load", () => {
  //   //         // webChild.webContents.send("message", "hello world");
  //   //         child.postMessage({ webLaunched: guid });
  //   //         webChildren[guid] = webChild;
  //   //         node2web[nodeGuid] = [...(node2web[nodeGuid] || []), guid];
  //   //       });
  //   //     }
  //   //     if (data.teardown) {
  //   //       webChildren[data.teardown].close();
  //   //       delete webChildren[data.teardown];
  //   //       node2web[nodeGuid] = node2web[nodeGuid].filter(
  //   //         (x) => x !== data.teardown
  //   //       );
  //   //     }
  //   //   })
  //   //   .on("exit", (data) => {
  //   //     stdout.close();
  //   //     stderr.close();
  //   //     console.log(`ending node ${src}`);
  //   //     onDone(src);
  //   //   });
  //   // child.stdout?.pipe(stdout);
  //   // child.stderr?.pipe(stderr);
  // };
  // const launchWebSecondary = (htmlFile: string): BrowserWindow => {
  //   console.log("launchWebSecondary", htmlFile);
  //   const subWin = new BrowserWindow({
  //     show: false,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       nodeIntegrationInWorker: true,
  //       contextIsolation: false,
  //       preload: path.join(app.getAppPath(), "preload.js"),
  //       offscreen: false,
  //       devTools: true,
  //     },
  //   });
  //   remoteMain.enable(subWin.webContents);
  //   subWin.webContents.openDevTools();
  //   subWin.loadFile(htmlFile);
  //   return subWin;
  //   // const uuid = uuidv4();
  //   // windows[uuid] = subWin;
  //   // return uuid;
  // };
  // const launchWeb = (t: string, dest: string) => {
  //   console.log("launchWeb", t);
  //   childProcesses[t] = "running";
  //   const destFolder = dest.replace(".mjs", "");
  //   const subWin = new BrowserWindow({
  //     show: true,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       nodeIntegrationInWorker: true,
  //       contextIsolation: false,
  //       preload: path.join(app.getAppPath(), "preload.js"),
  //       offscreen: false,
  //       devTools: true,
  //     },
  //   });
  //   webChildren[uuidv4()] = subWin;
  //   remoteMain.enable(subWin.webContents);
  //   const webArgz = JSON.stringify({
  //     name: dest,
  //     ports: [].toString(),
  //     fs: destFolder,
  //   });
  //   // console.log("webArgz", webArgz);
  //   subWin.loadFile(`${dest}.html`, {
  //     query: {
  //       requesting: encodeURIComponent(webArgz),
  //     },
  //   });
  //   if (!fs.existsSync(destFolder)) {
  //     fs.mkdirSync(destFolder, { recursive: true });
  //   }
  //   const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);
  //   subWin.webContents.on(
  //     "console-message",
  //     (event, level, message, line, sourceId) => {
  //       stdout.write(
  //         JSON.stringify(
  //           {
  //             event,
  //             level,
  //             message: JSON.stringify(message),
  //             line,
  //             sourceId,
  //           },
  //           null,
  //           2
  //         )
  //       );
  //       stdout.write("\n");
  //     }
  //   );
  //   subWin.on("closed", () => {
  //     stdout.close();
  //     console.log(`ending web ${t}`);
  //     // childProcesses[t] = "done";
  //     onDone(t);
  //   });
  //   ipcMain.on("message", (message, data) => {
  //     console.log("ipcMain message: " + JSON.stringify(data));
  //     // process.exit();
  //   });
  // };
  // return await import("${dest}.mjs");
  // launchWeb = (t: string, dest: string) => {
  //   console.log("launchWeb", t);
  //   // // childProcesses[t] = "running";
  //   // const destFolder = dest.replace(".mjs", "");
  //   // const webArgz = JSON.stringify({
  //   //   name: dest,
  //   //   ports: [].toString(),
  //   //   fs: destFolder,
  //   // });
  //   // const evaluation = `import('file:///Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.mjs').then(async (x) => {
  //   //   return (await x.default).receiveTestResourceConfig(${webArgz})
  //   // })`;
  //   // // console.log("evaluation", evaluation);
  //   // const y = browser
  //   //   .newPage()
  //   //   .then(async (page) => {
  //   //     // const codeString = "1 + 1";
  //   //     await page.goto(
  //   //       // "file:///Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.html"
  //   //       `file://${`${dest}.html`}`
  //   //     );
  //   //     //         page.url
  //   //     //         page.setContent(`
  //   //     // <!DOCTYPE html>
  //   //     // <html lang="en">
  //   //     // <head>
  //   //     // </head>
  //   //     // <body>
  //   //     //   <h1>/Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.html</h1>
  //   //     //   <div id="root">
  //   //     //   </div>
  //   //     // </body>
  //   //     // <footer></footer>
  //   //     // </html>
  //   //     // `);
  //   //     // return await page.evaluate((code) => eval(code), evaluation);
  //   //     return await page.evaluate(evaluation);
  //   //     // return await page.evaluate(async () => {
  //   //     //   return await import(dest);
  //   //     // });
  //   //   })
  //   //   .then((x) => {
  //   //     console.log("mark1", x);
  //   //   });
  //   // .then((x) => {
  //   //   console.log("mark0", x);
  //   // })
  //   // .catch((z) => {
  //   //   console.log("mark2", z);
  //   // });
  //   //   const subWin = new BrowserWindow({
  //   //     show: true,
  //   //     webPreferences: {
  //   //       nodeIntegration: true,
  //   //       nodeIntegrationInWorker: true,
  //   //       contextIsolation: false,
  //   //       preload: path.join(app.getAppPath(), "preload.js"),
  //   //       offscreen: false,
  //   //       devTools: true,
  //   //     },
  //   //   });
  //   //   webChildren[uuidv4()] = subWin;
  //   //   remoteMain.enable(subWin.webContents);
  //   //   // console.log("webArgz", webArgz);
  //   //   subWin.loadFile(`${dest}.html`, {
  //   //     query: {
  //   //       requesting: encodeURIComponent(webArgz),
  //   //     },
  //   //   });
  //   //   if (!fs.existsSync(destFolder)) {
  //   //     fs.mkdirSync(destFolder, { recursive: true });
  //   //   }
  //   //   const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);
  //   //   subWin.webContents.on(
  //   //     "console-message",
  //   //     (event, level, message, line, sourceId) => {
  //   //       stdout.write(
  //   //         JSON.stringify(
  //   //           {
  //   //             event,
  //   //             level,
  //   //             message: JSON.stringify(message),
  //   //             line,
  //   //             sourceId,
  //   //           },
  //   //           null,
  //   //           2
  //   //         )
  //   //       );
  //   //       stdout.write("\n");
  //   //     }
  //   //   );
  //   //   subWin.on("closed", () => {
  //   //     stdout.close();
  //   //     console.log(`ending web ${t}`);
  //   //     // childProcesses[t] = "done";
  //   //     onDone(t);
  //   //   });
  //   //   ipcMain.on("message", (message, data) => {
  //   //     console.log("ipcMain message: " + JSON.stringify(data));
  //   //     // process.exit();
  //   //   });
  // };
};

// ../testeranto/src/Node.ts
var NodeTesteranto = class extends Testeranto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log(
      "receiveTestResourceConfig!!",
      this.testJobs[0].receiveTestResourceConfig
    );
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Node(t);
    const { failed, artifacts, logPromise } = await this.testJobs[0].receiveTestResourceConfig(pm);
    console.log("test is done, awaiting test result write to fs");
    Promise.all([...artifacts, logPromise]).then(async () => {
    });
  }
};
var Node_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  return new NodeTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};

export {
  Node_default
};
