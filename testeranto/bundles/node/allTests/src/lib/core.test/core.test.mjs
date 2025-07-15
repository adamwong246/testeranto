import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "../../../chunk-UED26IMH.mjs";

// src/PM/pure.ts
var PM_Pure = class extends PM {
  constructor(t) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }
  getInnerHtml(selector, page) {
    throw new Error("pure.ts getInnHtml not implemented");
    return Promise.resolve("");
  }
  stopSideCar(uid) {
    throw new Error("pure.ts getInnHtml not implemented");
    return Promise.resolve(true);
  }
  start() {
    return new Promise((r) => r());
  }
  stop() {
    return new Promise((r) => r());
  }
  launchSideCar(n) {
    return globalThis["launchSideCar"](n, this.testResourceConfiguration.name);
  }
  pages() {
    return globalThis["pages"]();
  }
  waitForSelector(p, s) {
    return globalThis["waitForSelector"](p, s);
  }
  closePage(p) {
    return globalThis["closePage"](p);
  }
  goto(cdpPage, url) {
    return globalThis["goto"](cdpPage.mainFrame()._id, url);
  }
  newPage() {
    return globalThis["newPage"]();
  }
  $(selector) {
    return globalThis["$"](selector);
  }
  isDisabled(selector) {
    return globalThis["isDisabled"](selector);
  }
  getAttribute(selector, attribute) {
    return globalThis["getAttribute"](selector, attribute);
  }
  getValue(selector) {
    return globalThis["getValue"](selector);
  }
  focusOn(selector) {
    return globalThis["focusOn"](selector);
  }
  typeInto(selector, value) {
    return globalThis["typeInto"](selector, value);
  }
  page() {
    return globalThis["page"]();
  }
  click(selector) {
    return globalThis["click"](selector);
  }
  screencast(opts, page) {
    return globalThis["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(p) {
    return globalThis["screencastStop"](p);
  }
  customScreenShot(opts, page) {
    return globalThis["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  existsSync(destFolder) {
    return globalThis["existsSync"](
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(uid, contents) {
    return globalThis["write"](uid, contents);
  }
  writeFileSync(filepath, contents) {
    return globalThis["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  createWriteStream(filepath) {
    return globalThis["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  end(uid) {
    return globalThis["end"](uid);
  }
  customclose() {
    globalThis["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
  }
  // startPuppeteer(options?: any): any {
  //   // return puppeteer.connect(options).then((b) => {
  //   //   this.browser = b;
  //   // });
  // }
};

// src/Pure.ts
var PureTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface3) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface3,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var Pure_default = async (input, testSpecification, testImplementation, testInterface3, testResourceRequirement = defaultTestResourceRequirement) => {
  return new PureTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface3
  );
};

// src/lib/core.test/core.test.specification.ts
var specification2 = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testeranto Core Functionality",
      {
        // Initialization tests
        defaultInitialization: Given.Default(
          ["Should initialize with default values"],
          [],
          [Then.initializedProperly()]
        ),
        customInputInitialization: Given.WithCustomInput(
          { test: "input" },
          [],
          [Then.initializedProperly()]
        ),
        // Configuration tests  
        resourceConfig: Given.WithResourceRequirements(
          { ports: [3e3, 3001] },
          [],
          [Then.resourceRequirementsSet()]
        ),
        interfaceConfig: Given.WithCustomInterface(
          {
            assertThis: (x) => !!x,
            beforeEach: async (s, i) => i()
          },
          [],
          [Then.interfaceConfigured()]
        ),
        // Core operations
        specGeneration: Given.Default(
          ["Should generate test specs"],
          [],
          [Then.specsGenerated()]
        ),
        jobCreation: Given.Default(
          ["Should create test jobs"],
          [],
          [Then.jobsCreated()]
        ),
        artifactHandling: Given.Default(
          ["Should track artifacts"],
          [When.addArtifact(Promise.resolve("test"))],
          [Then.artifactsTracked()]
        )
      },
      []
    ),
    Suite.ExtendedSuite(
      "Testeranto Advanced Features",
      {
        // Error handling
        errorPropagation: Given.Default(
          ["Should propagate errors properly"],
          [When.triggerError("test error")],
          [Then.errorThrown("test error")]
        ),
        // Dynamic behavior
        specModification: Given.Default(
          ["Should allow spec modification"],
          [When.modifySpecs((specs) => [...specs, { name: "extra" }])],
          [Then.specsModified(1)]
        ),
        // Full lifecycle
        testExecution: Given.Default(
          ["Should execute full test lifecycle"],
          [],
          [Then.testRunSuccessful()]
        ),
        // Custom implementations
        customImpl: Given.WithCustomImplementation(
          {
            ...implementation,
            suites: { Default: "Custom suite" }
          },
          [],
          [Then.specsGenerated()]
        )
      },
      []
    )
  ];
};

// src/lib/core.test/MockCore.ts
var MockCore = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testInterface3 = {}, uberCatcher = (cb) => cb()) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface3,
      uberCatcher
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    return {
      failed: false,
      fails: 0,
      artifacts: [],
      logPromise: Promise.resolve(),
      features: []
    };
  }
};

// src/lib/core.test/core.test.implementation.ts
import { PassThrough } from "stream";
var implementation2 = {
  suites: {
    Default: "Testeranto test suite",
    ExtendedSuite: "Extended Testeranto test suite"
  },
  givens: {
    Default: () => {
      return new MockCore(
        {},
        // input
        specification,
        // testSpecification 
        implementation2,
        // testImplementation
        { ports: [] },
        // testResourceRequirement
        testInterface,
        // testInterface
        (cb) => cb()
        // uberCatcher
      );
    },
    WithCustomInput: (input) => {
      return new MockCore(
        input,
        specification,
        implementation2,
        { ports: [] },
        testInterface,
        (cb) => cb()
      );
    },
    WithResourceRequirements: (requirements) => {
      return new MockCore(
        {},
        specification,
        implementation2,
        requirements,
        testInterface,
        (cb) => cb()
      );
    },
    WithCustomInterface: (customInterface) => {
      return new MockCore(
        {},
        specification,
        implementation2,
        { ports: [] },
        { ...testInterface, ...customInterface },
        (cb) => cb()
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
    triggerError: (message) => (builder) => {
      throw new Error(message);
    }
  },
  thens: {
    initializedProperly: () => (builder) => {
      if (!(builder instanceof MockCore)) {
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
    interfaceConfigured: () => (builder) => {
      if (!builder.testInterface) {
        throw new Error("Test interface not configured");
      }
      return builder;
    },
    errorThrown: (expectedMessage) => (builder) => {
      return builder;
    },
    testRunSuccessful: () => async (builder) => {
      try {
        await builder.receiveTestResourceConfig("");
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

// src/lib/core.test/core.test.interface.ts
var testInterface2 = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    return initializer();
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    return whenCB(store, pm);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: (store, pm) => {
  },
  assertThis: (result) => !!result,
  beforeAll: async (input, testResource, pm) => input
};

// src/lib/core.test/core.test.ts
var core_test_default = Pure_default(
  MockCore.prototype,
  // test subject
  specification2,
  // test scenarios
  implementation2,
  // test operations
  testInterface2,
  // test lifecycle hooks
  { ports: [] },
  // resource requirements
  (cb) => cb()
  // error handler
);
export {
  core_test_default as default
};
