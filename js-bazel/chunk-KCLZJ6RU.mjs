var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../testeranto/dist/module/core.js
var defaultTestResource = { fs: ".", ports: [] };
var defaultTestResourceRequirement = {
  fs: ".",
  ports: 0,
  name: ""
};
var BaseSuite = class {
  constructor(name, givens = {}, checks = []) {
    this.name = name;
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
    const subject = await this.setup(input, artifactory("-1"));
    tLog("\nSuite:", this.name, testResourceConfiguration);
    tLog("subject:", subject);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(subject, k, testResourceConfiguration, this.test, artifactory(k), tLog);
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, thater.name, testResourceConfiguration, this.test, artifactory, tLog);
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
      errors: this.error,
      features: this.features
    };
  }
  async afterEach(store, key, artifactory) {
    return;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
    tLog(`
 Given: ${this.name}`);
    try {
      this.store = await this.givenThat(subject, testResourceConfiguration, artifactory);
      tLog(`
 Given this.store`, this.store);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration, tLog);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog("\x07");
    } finally {
      try {
        await this.afterEach(this.store, key, artifactory);
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
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, nameKey, logWriter) {
    const classySuites = Object.entries(testImplementation.Suites).reduce((a, [key]) => {
      a[key] = (somestring, givens, checks) => {
        return new suiteKlasser.prototype.constructor(somestring, givens, checks);
      };
      return a;
    }, {});
    const classyGivens = Object.entries(testImplementation.Givens).reduce((a, [key, z]) => {
      a[key] = (features, whens, thens, ...xtrasW) => {
        return new givenKlasser.prototype.constructor(key, features, whens, thens, z(...xtrasW));
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
      return await suite.run(input, testResourceConfiguration, logWriter.testArtiFactoryfileWriter(tLog)(testResourceConfiguration.fs + "/"), tLog);
    };
    const toReturn = suites.map((suite) => {
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
          access.close();
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => suiteDone.givens[k].error).length;
          console.log(`suiteDone.givens`, suiteDone.givens);
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
        }
      };
    });
    return toReturn;
  }
};
var TesterantoLevelTwo = class extends TesterantoLevelOne {
  constructor(input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = defaultTestResourceRequirement, assertioner, beforeEach, afterEach, afterAll, butThen, andWhen, actionHandler, logWriter) {
    super(testImplementation, testSpecification, input, class extends BaseSuite {
      async setup(s, artifactory) {
        return (testInterface.beforeAll || (async (input2, artificer) => input2))(s, artifactory);
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
        return beforeEach(subject, this.initialValues, testResource, artifactory);
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, artifactory)));
      }
      afterAll(store, artifactory) {
        return afterAll(store, artifactory);
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
        return beforeEach(subject, this.initialValues, testResourceConfiguration, artifactory);
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, artifactory)));
      }
    }, testResourceRequirement, nameKey, logWriter);
  }
};

// ../testeranto/dist/module/NodeWriter.js
import fs from "fs";
import path from "path";
var fPaths = [];
var NodeWriter = {
  startup: async (testResourceArg, t, testResourceRequirement) => {
    const partialTestResource = JSON.parse(testResourceArg);
    if (partialTestResource.fs && partialTestResource.ports) {
      await t.receiveTestResourceConfig(partialTestResource);
    } else {
      console.log("test configuration is incomplete", partialTestResource);
      if (process.send) {
        console.log("requesting test resources from pm2 ...", testResourceRequirement);
        process.send({
          type: "testeranto:hola",
          data: {
            testResourceRequirement
          }
        });
        console.log("awaiting test resources from pm2...");
        process.on("message", async function(packet) {
          console.log("message: ", packet);
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
          console.log("secondTestResource", secondTestResource);
          if (await t.receiveTestResourceConfig(secondTestResource)) {
            process.send({
              type: "testeranto:adios",
              data: {
                testResourceConfiguration: t.test.testResourceConfiguration,
                results: t.toObj()
              }
            }, (err) => {
              if (!err) {
                console.log(`\u2705`);
              } else {
                console.error(`\u2757\uFE0F`, err);
              }
            });
          }
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
  },
  createWriteStream: (filepath) => {
    return fs.createWriteStream(filepath);
  },
  writeFileSync: (fp, contents) => {
    fs.writeFileSync(fp, contents);
  },
  mkdirSync: async (fp) => {
    await fs.mkdirSync(fp, { recursive: true });
  },
  testArtiFactoryfileWriter: (tLog) => (fp) => (givenNdx) => (key, value) => {
    tLog("testArtiFactory =>", key);
    const fPath = `${fp}/${givenNdx}/${key}`;
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
      } else if (`string` === typeof value) {
        fs.writeFileSync(fPath, value.toString(), {
          encoding: "utf-8"
        });
      } else {
        const pipeStream = value;
        const myFile = fs.createWriteStream(fPath);
        pipeStream.pipe(myFile);
        pipeStream.on("close", () => {
          myFile.close();
        });
      }
    });
  }
};

// ../testeranto/dist/module/core-node.js
console.log("node-core argv", process.argv);
var core_node_default = async (input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = defaultTestResourceRequirement) => {
  const mrt = new TesterantoLevelTwo(input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement, testInterface.assertioner || (async (t2) => t2), testInterface.beforeEach || async function(subject, initialValues, testResource) {
    return subject;
  }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => void 0), testInterface.butThen || (async (a) => a), testInterface.andWhen, testInterface.actionHandler || function(b) {
    return b;
  }, NodeWriter);
  const t = mrt[0];
  const testResourceArg = process.argv[2] || `{}`;
  try {
    const partialTestResource = JSON.parse(testResourceArg);
    if (partialTestResource.fs && partialTestResource.ports) {
      await t.receiveTestResourceConfig(partialTestResource);
    } else {
      console.log("test configuration is incomplete", partialTestResource);
      if (process.send) {
        console.log("requesting test resources via IPC ...", testResourceRequirement);
        process.send({
          type: "testeranto:hola",
          data: {
            testResourceRequirement
          }
        });
        console.log("awaiting test resources via IPC...");
        process.on("message", async function(packet) {
          console.log("message: ", packet);
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
          console.log("secondTestResource", secondTestResource);
          if (await t.receiveTestResourceConfig(secondTestResource)) {
            process.send({
              type: "testeranto:adios",
              data: {
                testResourceConfiguration: t.test.testResourceConfiguration,
                results: t.toObj()
              }
            }, (err) => {
              if (!err) {
                console.log(`\u2705`);
              } else {
                console.error(`\u2757\uFE0F`, err);
              }
            });
          }
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
  __require,
  __commonJS,
  __toESM,
  core_node_default
};
