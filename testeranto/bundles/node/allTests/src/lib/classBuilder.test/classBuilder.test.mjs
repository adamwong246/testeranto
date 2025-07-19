import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ClassBuilder,
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "../../../chunk-RDFX5IH4.mjs";

// src/PM/node.ts
import net from "net";
import fs from "fs";
import path from "path";
var fPaths = [];
var PM_Node = class extends PM {
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
  async launchSideCar(n) {
    return this.send(
      "launchSideCar",
      n,
      this.testResourceConfiguration.name
    );
  }
  stopSideCar(n) {
    return this.send(
      "stopSideCar",
      n,
      this.testResourceConfiguration.name
    );
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
};

// src/Node.ts
var ipcfile;
var NodeTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface2) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface2,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log("receiveTestResourceConfig", partialTestResource);
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Node(t, ipcfile);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var testeranto = async (input, testSpecification, testImplementation, testInterface2, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTesteranto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface2
    );
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    ipcfile = process.argv[3];
    const f = await t.receiveTestResourceConfig(process.argv[2]);
    console.error("goodbye node with failures", f.fails);
    process.exit(f.fails);
  } catch (e) {
    console.error("goodbye node with caught error", e);
    process.exit(-1);
  }
};
var Node_default = testeranto;

// src/lib/classBuilder.test/classBuilder.test.specification.ts
var specification = (Suite, Given, When, Then, Check) => {
  console.log("Then", Then);
  debugger;
  return [
    Suite.Default(
      "Basic ClassBuilder Functionality",
      {
        // Basic initialization tests
        initialization: Given.Default(
          ["ClassBuilder should initialize with default values"],
          [],
          [Then.initializedProperly()]
        )
        // customInput: Given.WithCustomInput(
        //   { custom: "input" },
        //   [],
        //   [Then.initializedProperly()]
        // ),
        // resourceRequirements: Given.WithResourceRequirements(
        //   { ports: [3000, 3001] },
        //   [],
        //   [Then.resourceRequirementsSet()]
        // ),
        // // Core functionality tests
        // specGeneration: Given.Default(
        //   ["Should generate specs from test specification"],
        //   [],
        //   [Then.specsGenerated()]
        // ),
        // jobCreation: Given.Default(
        //   ["Should create test jobs from specs"],
        //   [],
        //   [Then.jobsCreated()]
        // ),
        // artifactTracking: Given.Default(
        //   ["Should track artifacts"],
        //   [When.addArtifact(Promise.resolve("test"))],
        //   [Then.artifactsTracked()]
        // ),
        // // Configuration tests
        // overridesConfiguration: Given.Default(
        //   ["Should properly configure all overrides"],
        //   [],
        //   [
        //     Then.suitesOverridesConfigured(),
        //     Then.givensOverridesConfigured(),
        //     Then.whensOverridesConfigured(),
        //     Then.thensOverridesConfigured(),
        //     Then.checksOverridesConfigured(),
        //   ]
        // ),
      },
      []
    )
    // Suite.ExtendedSuite(
    //   "Advanced ClassBuilder Functionality",
    //   {
    //     // Custom implementations
    //     customImplementation: Given.WithCustomImplementation(
    //       implementation,
    //       [],
    //       [Then.specsGenerated(), Then.jobsCreated()]
    //     ),
    //     customSpecification: Given.WithCustomSpecification(
    //       specification,
    //       [],
    //       [Then.specsGenerated(), Then.jobsCreated()]
    //     ),
    //     // Dynamic modification tests
    //     modifySpecs: Given.Default(
    //       ["Should allow modifying specs"],
    //       [When.modifySpecs((specs) => [...specs, "extra"])],
    //       [Then.specsModified(1)]
    //     ),
    //     modifyJobs: Given.Default(
    //       ["Should allow modifying jobs"],
    //       [When.modifyJobs((jobs) => [...jobs, {} as ITestJob])],
    //       [Then.jobsModified(1)]
    //     ),
    //     // Error handling
    //     errorHandling: Given.Default(
    //       ["Should properly handle errors"],
    //       [When.triggerError("test error")],
    //       [Then.errorThrown("test error")]
    //     ),
    //     // Full test run
    //     testRun: Given.Default(
    //       ["Should complete a full test run successfully"],
    //       [],
    //       [Then.testRunSuccessful()]
    //     ),
    //   },
    //   []
    // ),
  ];
};

// src/lib/classBuilder.test/classBuilder.test.implementation.ts
import { PassThrough } from "stream";

// src/lib/classBuilder.test/mock.ts
var TestClassBuilderMock = class extends ClassBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
    super(
      testImplementation,
      testSpecification,
      input,
      suiteKlasser,
      givenKlasser,
      whenKlasser,
      thenKlasser,
      checkKlasser,
      testResourceRequirement
    );
    this.testJobs = [];
    this.specs = [];
    this.artifacts = [];
    this.summary = {};
  }
  // async runTests(puppetMaster: any): Promise<any> {
  //   this.summary = {
  //     [puppetMaster.testResourceConfiguration.name]: {
  //       typeErrors: 0,
  //       staticErrors: 0,
  //       runTimeError: "",
  //       prompt: "",
  //       failingFeatures: {},
  //     },
  //   };
  //   return {
  //     failed: false,
  //     fails: 0,
  //     artifacts: this.artifacts,
  //     logPromise: Promise.resolve(),
  //     features: [],
  //   };
  // }
  // protected async executeTestJob(job: any): Promise<any> {
  //   return job();
  // }
  // protected createArtifact(name: string, content: any): void {
  //   this.artifacts.push({ name, content });
  // }
};

// src/lib/BaseSuite.test/mock.ts
var MockGiven = class extends BaseGiven {
  constructor(name, features, whens, thens) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true }),
      // givenCB
      {}
      // initialValues
    );
  }
  async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm) {
    return { testStore: true };
  }
  uberCatcher(e) {
    console.error("Given error 2:", e);
  }
};
var MockWhen = class extends BaseWhen {
  async andWhen(store, whenCB, testResource, pm) {
    return { ...store, testStore: true };
  }
};
var MockThen = class extends BaseThen {
  async butThen(store, thenCB, testResourceConfiguration, pm) {
    return { testSelection: true };
  }
};
var MockCheck = class extends BaseCheck {
  async checkThat(subject, testResourceConfiguration, artifactory, initializer, initialValues, pm) {
    return { testStore: true };
  }
};
var MockSuite = class extends BaseSuite {
  constructor(name, index) {
    super(
      name,
      index,
      {
        testGiven: new MockGiven(
          "testGiven",
          ["testFeature"],
          [
            new MockWhen(
              "testWhen",
              () => Promise.resolve({ testStore: true })
            )
          ],
          [
            new MockThen(
              "testThen",
              async () => Promise.resolve({ testSelection: true })
            )
          ]
        )
      },
      [
        new MockCheck(
          "testCheck",
          ["testFeature"],
          () => Promise.resolve({ testStore: true }),
          null,
          () => {
          }
        )
      ]
    );
  }
};

// src/lib/classBuilder.test/classBuilder.test.implementation.ts
var implementation = {
  suites: {
    Default: "ClassBuilder test suite",
    ExtendedSuite: "Extended ClassBuilder test suite"
  },
  givens: {
    Default: () => {
      return new TestClassBuilderMock(
        implementation,
        // Use the current implementation
        specification,
        // Use the current specification
        {},
        // Default input
        MockSuite,
        // class {}, // suiteKlasser
        class {
        },
        // givenKlasser
        class {
        },
        // whenKlasser
        class {
        },
        // thenKlasser
        class {
        },
        // checkKlasser
        { ports: [] }
        // Default resource requirements
      );
    },
    WithCustomInput: (input) => {
      return new TestClassBuilderMock(
        implementation,
        specification,
        input,
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        { ports: [] }
      );
    },
    WithResourceRequirements: (requirements) => {
      return new TestClassBuilderMock(
        implementation,
        specification,
        {},
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        requirements
      );
    },
    WithCustomImplementation: (impl) => {
      return new TestClassBuilderMock(
        impl,
        specification,
        {},
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        { ports: [] }
      );
    },
    WithCustomSpecification: (spec) => {
      return new TestClassBuilderMock(
        implementation,
        spec,
        {},
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        class {
        },
        { ports: [] }
      );
    }
  },
  whens: {
    addArtifact: (artifact) => (builder) => {
      builder.artifacts.push(artifact);
      return builder;
    },
    setTestJobs: (jobs) => (builder) => {
      builder.testJobs = jobs;
      return builder;
    },
    modifySpecs: (modifier) => (builder) => {
      builder.specs = modifier(builder.specs || []);
      return builder;
    },
    modifyJobs: (modifier) => (builder) => {
      builder.testJobs = modifier(builder.testJobs || []);
      return builder;
    },
    triggerError: (message) => (builder) => {
      throw new Error(message);
    }
  },
  thens: {
    initializedProperly: () => (builder) => {
      if (!(builder instanceof TestClassBuilder)) {
        throw new Error("Builder was not properly initialized");
      }
      return builder;
    },
    specsGenerated: () => (builder) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    jobsCreated: () => (builder) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    artifactsTracked: () => (builder) => {
      if (!Array.isArray(builder.artifacts)) {
        throw new Error("Artifacts array not initialized");
      }
      return builder;
    },
    resourceRequirementsSet: () => (builder) => {
      if (!builder.testResourceRequirement) {
        throw new Error("Resource requirements not set");
      }
      return builder;
    },
    suitesOverridesConfigured: () => (builder) => {
      if (!builder.suitesOverrides) {
        throw new Error("Suites overrides not configured");
      }
      return builder;
    },
    givensOverridesConfigured: () => (builder) => {
      if (!builder.givenOverides) {
        throw new Error("Givens overrides not configured");
      }
      return builder;
    },
    whensOverridesConfigured: () => (builder) => {
      if (!builder.whenOverides) {
        throw new Error("Whens overrides not configured");
      }
      return builder;
    },
    thensOverridesConfigured: () => (builder) => {
      if (!builder.thenOverides) {
        throw new Error("Thens overrides not configured");
      }
      return builder;
    },
    checksOverridesConfigured: () => (builder) => {
      if (!builder.checkOverides) {
        throw new Error("Checks overrides not configured");
      }
      return builder;
    },
    specsModified: (expectedCount) => (builder) => {
      if (builder.specs.length <= expectedCount) {
        throw new Error(`Expected at least ${expectedCount} modified specs`);
      }
      return builder;
    },
    jobsModified: (expectedCount) => (builder) => {
      if (builder.testJobs.length <= expectedCount) {
        throw new Error(`Expected at least ${expectedCount} modified jobs`);
      }
      return builder;
    },
    errorThrown: (expectedMessage) => (builder) => {
      return builder;
    },
    testRunSuccessful: () => async (builder) => {
      try {
        await builder.testRun({
          testResourceConfiguration: {
            name: "test",
            fs: "/tmp",
            ports: []
          }
        });
        return builder;
      } catch (e) {
        throw new Error(`Test run failed: ${e.message}`);
      }
    }
  },
  checks: {
    Default: () => new PassThrough()
  }
};

// src/lib/classBuilder.test/classBuilder.test.interface.ts
var testInterface = {
  beforeAll: async () => {
  },
  beforeEach: async (subject, initializer) => {
    return initializer();
  },
  andWhen: async (store, whenCB, testResource, utils) => {
    return whenCB(store, utils);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: () => {
  },
  assertThis: (x) => {
  }
};

// src/lib/classBuilder.test/classBuilder.test.ts
var classBuilder_test_default = Node_default(
  ClassBuilder.prototype,
  specification,
  implementation,
  testInterface
);
export {
  classBuilder_test_default as default
};
