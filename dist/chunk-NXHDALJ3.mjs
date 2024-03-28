import { createRequire } from 'module';const require = createRequire(import.meta.url);

// ../testeranto/dist/module/core.js
var defaultTestResource = { name: "", fs: ".", ports: [] };
var defaultTestResourceRequirement = {
  ports: 0
};
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
  setup(s, artifactory) {
    return new Promise((res) => res(s));
  }
  test(t) {
    return t;
  }
  async run(input, testResourceConfiguration, artifactory, tLog) {
    this.testResourceConfiguration = testResourceConfiguration;
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    const subject = await this.setup(input, suiteArtifactory);
    tLog("\nSuite:", this.index, this.name);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(subject, k, testResourceConfiguration, this.test, suiteArtifactory, tLog);
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, thater.name, testResourceConfiguration, this.test, suiteArtifactory, tLog);
    }
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      giver.afterAll(this.store, artifactory);
    }
    return this;
  }
};
var BaseGiven = class {
  constructor(name, features, whens, thens) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }
  beforeAll(store, artifactory) {
    return store;
  }
  afterAll(store, artifactory) {
    return store;
  }
  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      features: this.features
    };
  }
  async afterEach(store, key, artifactory) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration, tLog);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog(e);
      tLog("\x07");
    } finally {
      try {
        await this.afterEach(this.store, key, givenArtifactory);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, actioner) {
    this.name = name;
    this.actioner = actioner;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog) {
    tLog(" When:", this.name);
    try {
      return await this.andWhen(store, this.actioner, testResourceConfiguration);
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
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog) {
    tLog(" Then:", this.name);
    try {
      return this.thenCB(await this.butThen(store, testResourceConfiguration));
    } catch (e) {
      console.log("test failed", e);
      this.error = true;
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
  async afterEach(store, key, cb) {
    return;
  }
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
    tLog(`
 Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
    await this.checkCB(Object.entries(this.whens).reduce((a, [key2, when]) => {
      a[key2] = async (payload) => {
        return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
      };
      return a;
    }, {}), Object.entries(this.thens).reduce((a, [key2, then]) => {
      a[key2] = async (payload) => {
        const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
        tester(t);
      };
      return a;
    }, {}));
    await this.afterEach(store, key);
    return;
  }
};
var TesterantoLevelZero = class {
  constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides) {
    this.cc = cc;
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
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
var TesterantoLevelOne = class {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, logWriter) {
    this.artifacts = [];
    const classySuites = Object.entries(testImplementation.Suites).reduce((a, [key], index) => {
      a[key] = (somestring, givens, checks) => {
        return new suiteKlasser.prototype.constructor(somestring, index, givens, checks);
      };
      return a;
    }, {});
    const classyGivens = Object.keys(testImplementation.Givens).reduce((a, key) => {
      a[key] = (features, whens, thens, ...xtrasW) => {
        return new givenKlasser.prototype.constructor(key, features, whens, thens, testImplementation.Givens[key](...xtrasW));
      };
      return a;
    }, {});
    const classyWhens = Object.entries(testImplementation.Whens).reduce((a, [key, whEn]) => {
      a[key] = (payload) => {
        return new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
      };
      return a;
    }, {});
    const classyThens = Object.entries(testImplementation.Thens).reduce((a, [key, thEn]) => {
      a[key] = (expected, x) => {
        return new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
      };
      return a;
    }, {});
    const classyChecks = Object.entries(testImplementation.Checks).reduce((a, [key, z]) => {
      a[key] = (somestring, features, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
      };
      return a;
    }, {});
    const classyTesteranto = new class extends TesterantoLevelZero {
    }(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks);
    const suites = testSpecification(
      /* @ts-ignore:next-line */
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check(),
      logWriter
    );
    const suiteRunner = (suite) => async (testResourceConfiguration, tLog) => {
      return await suite.run(input, testResourceConfiguration, (fPath, value) => logWriter.testArtiFactoryfileWriter(tLog, (p) => {
        artifacts.push(p);
      })(testResourceConfiguration.fs + "/" + fPath, value), tLog);
    };
    const artifacts = this.artifacts;
    this.testJobs = suites.map((suite) => {
      const runner = suiteRunner(suite);
      return {
        test: suite,
        testResourceRequirement,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(testResourceConfiguration = defaultTestResource) {
          console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);
          await logWriter.mkdirSync(testResourceConfiguration.fs);
          const logFilePath = `${testResourceConfiguration.fs}/log.txt`;
          const access = await logWriter.createWriteStream(logFilePath);
          const tLog = (...l) => {
            console.log(...l);
            access.write(`${l.toString()}
`);
          };
          const suiteDone = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = `${testResourceConfiguration.fs}/results.json`;
          logWriter.writeFileSync(resultsFilePath, JSON.stringify(suiteDone.toObj(), null, 2));
          const logPromise = new Promise((res, rej) => {
            access.on("finish", () => {
              res(true);
            });
          });
          access.end();
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts,
            logPromise
          };
        }
      };
    });
  }
};
var TesterantoLevelTwo = class extends TesterantoLevelOne {
  constructor(input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement, assertioner, beforeEach, afterEach, afterAll, butThen, andWhen, actionHandler, logWriter) {
    super(testImplementation, testSpecification, input, class extends BaseSuite {
      async setup(s, artifactory) {
        return (testInterface.beforeAll || (async (input2, artificer) => input2))(s, artifactory, this.testResourceConfiguration);
      }
      test(t) {
        return assertioner(t);
      }
    }, class Given extends BaseGiven {
      constructor(name, features, whens, thens, initialValues) {
        super(name, features, whens, thens);
        this.initialValues = initialValues;
      }
      async givenThat(subject, testResource, artifactory) {
        return beforeEach(subject, this.initialValues, testResource, (fPath, value) => (
          // TODO does not work?
          artifactory(`beforeEach/${fPath}`, value)
        ));
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
      }
      afterAll(store, artifactory) {
        return afterAll(store, (fPath, value) => (
          // TODO does not work?
          artifactory(`afterAll4-${this.name}/${fPath}`, value)
        ));
      }
    }, class When extends BaseWhen {
      constructor(name, actioner, payload) {
        super(name, (store) => {
          return actionHandler(actioner);
        });
        this.payload = payload;
      }
      async andWhen(store, actioner, testResource) {
        return await andWhen(store, actioner, testResource);
      }
    }, class Then extends BaseThen {
      constructor(name, callback) {
        super(name, callback);
      }
      async butThen(store, testResourceConfiguration) {
        return await butThen(store, this.thenCB, testResourceConfiguration);
      }
    }, class Check extends BaseCheck {
      constructor(name, features, checkCallback, whens, thens, initialValues) {
        super(name, features, checkCallback, whens, thens);
        this.initialValues = initialValues;
      }
      async checkThat(subject, testResourceConfiguration, artifactory) {
        return beforeEach(subject, this.initialValues, testResourceConfiguration, (fPath, value) => artifactory(`before/${fPath}`, value));
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, (fPath, value) => (
          // TODO does not work?
          artifactory(`afterEach2-${this.name}/${fPath}`, value)
        ))));
      }
    }, testResourceRequirement, logWriter);
  }
};

// ../testeranto/dist/module/NodeWriter.js
import fs from "fs";
import path from "path";
var fPaths = [];
var NodeWriter = {
  createWriteStream: (filepath) => {
    return fs.createWriteStream(filepath);
  },
  writeFileSync: (fp, contents) => {
    fs.writeFileSync(fp, contents);
  },
  mkdirSync: async (fp) => {
    await fs.mkdirSync(fp, { recursive: true });
  },
  testArtiFactoryfileWriter: (tLog, callback) => (fPath, value) => {
    callback(new Promise((res, rej) => {
      tLog("testArtiFactory =>", fPath);
      const cleanPath = path.resolve(fPath);
      fPaths.push(cleanPath.replace(process.cwd(), ``));
      const targetDir = cleanPath.split("/").slice(0, -1).join("/");
      fs.mkdir(targetDir, { recursive: true }, async (error) => {
        if (error) {
          console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
        }
        fs.writeFileSync(path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`
`), {
          encoding: "utf-8"
        });
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
    }));
  }
};

// ../testeranto/dist/module/Node.js
var Node_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, testResourceRequirement, testInterface.assertioner || (async (t2) => t2), testInterface.beforeEach || async function(subject, initialValues, testResource) {
    return subject;
  }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => void 0), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler || function(b) {
    return b;
  }, NodeWriter);
  const t = mrt.testJobs[0];
  const testResourceArg = process.argv[2] || `{}`;
  try {
    const partialTestResource = JSON.parse(testResourceArg);
    if (testResourceRequirement.ports == 0) {
      const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
      Promise.all([...artifacts, logPromise]).then(async () => {
        process.exit(await failed ? 1 : 0);
      });
    } else {
      console.log("test configuration is incomplete", partialTestResource);
      if (process.send) {
        console.log("requesting test resources via IPC ...", testResourceRequirement);
        process.send({
          type: "testeranto:hola",
          data: {
            requirement: Object.assign(Object.assign({}, testResourceRequirement), { name: partialTestResource.name })
          }
        });
        console.log("awaiting test resources via IPC...");
        process.on("message", async function(packet) {
          console.log("message: ", packet);
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
          console.log("secondTestResource", secondTestResource);
          const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
          process.send({
            type: "testeranto:adios",
            data: {
              testResourceConfiguration: t.test.testResourceConfiguration,
              results: t.toObj()
            }
          }, async (err) => {
            if (!err) {
              Promise.all([...artifacts, logPromise]).then(async () => {
                process.exit(await failed ? 1 : 0);
              });
            } else {
              console.error(err);
              process.exit(1);
            }
          });
        });
      } else {
        console.log("Pass run-time test resources by STDIN", process.stdin);
        process.stdin.on("data", async (data) => {
          console.log("data: ", data);
          const resourcesFromStdin = JSON.parse(data.toString());
          const secondTestResource = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(resourcesFromStdin))), JSON.parse(JSON.stringify(partialTestResource)));
          await t.receiveTestResourceConfig(secondTestResource);
        });
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};

export {
  Node_default
};
