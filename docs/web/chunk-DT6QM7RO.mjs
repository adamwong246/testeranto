import {
  puppeteer_core_browser_default
} from "./chunk-FWI6RUOP.mjs";

// ../testeranto/src/PM/index.ts
var PM = class {
  // pages(): Promise<Page[]>;
  // pages(): Promise<Page[]> {
  //   return new Promise<Page[]>((res, rej) => {
  //     res(super.pages());
  //   });
  // }
};

// ../testeranto/src/PM/web.ts
var PM_Web = class extends PM {
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
    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  createWriteStream(filepath) {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  end(writeObject) {
    return window["end"](writeObject.uid);
  }
  customclose() {
    window["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
        })
      );
    };
  }
  startPuppeteer(options, destFolder) {
    const name = this.testResourceConfiguration.name;
    return fetch(`http://localhost:3234/json/version`).then((v) => {
      return v.json();
    }).then((json) => {
      return puppeteer_core_browser_default.connect({
        browserWSEndpoint: json.webSocketDebuggerUrl
      }).then((b) => {
        this.browser = b;
        const handler2 = {
          get(target, prop, receiver) {
            if (prop === "screenshot") {
              return async (x) => {
                return await window["custom-screenshot"](
                  {
                    ...x,
                    // path: destFolder + "/" + x.path,
                    path: x.path
                  },
                  name
                );
              };
            } else if (prop === "mainFrame") {
              return () => target[prop](...arguments);
            } else {
              return Reflect.get(...arguments);
            }
          }
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
          }
        };
        const proxy3 = new Proxy(this.browser, handler1);
        this.browser = proxy3;
      });
    });
  }
};

// ../testeranto/src/lib/index.ts
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
      const beforeEachProxy = new Proxy(pm, {
        get(target, prop, receiver) {
          if (prop === "writeFileSync") {
            console.log("beforeEachProx", arguments, target[prop]);
            return (fp, contents) => target[prop](
              `suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`,
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
      );
      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }
      for (const thenStep of this.thens) {
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
                                  return await pTarget[pProp]({
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

// ../testeranto/src/lib/basebuilder.ts
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
          );
        }
        assertThat(t) {
          fullTestInterface.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
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

// ../testeranto/src/Web.ts
var WebTesteranto = class extends Testeranto {
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
    const t = partialTestResource;
    const pm = new PM_Web(t);
    const { failed, artifacts, logPromise } = await this.testJobs[0].receiveTestResourceConfig(pm);
    console.log("test is done, awaiting test result write to fs");
    pm.customclose();
  }
};
var Web_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};

export {
  Web_default
};
