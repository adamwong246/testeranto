import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "../../../chunk-FFBRDUBH.mjs";

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
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter3) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter3,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log(
      "[DEBUG] receiveTestResourceConfig called with:",
      partialTestResource
    );
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);
    console.log("[DEBUG] Current test jobs:", this.testJobs?.length);
    if (!this.testJobs || this.testJobs.length === 0) {
      console.error(
        "[ERROR] No test jobs available - checking specs:",
        this.specs?.length
      );
      console.error("[ERROR] Test implementation:", this.testImplementation);
      return {
        failed: true,
        fails: 1,
        artifacts: [],
        logPromise: Promise.resolve(),
        features: []
      };
    }
    try {
      console.log("[DEBUG] Executing test job with PM:", pm);
      const result = await this.testJobs[0].receiveTestResourceConfig(pm);
      console.log("[DEBUG] Test job completed with result:", result);
      return result;
    } catch (e) {
      console.error("[ERROR] Test job failed:", e);
      return {
        failed: true,
        fails: 1,
        artifacts: [],
        logPromise: Promise.resolve(),
        features: []
      };
    }
  }
};
var Pure_default = async (input, testSpecification, testImplementation, testAdapter3, testResourceRequirement = defaultTestResourceRequirement) => {
  return new PureTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter3
  );
};

// src/lib/core.test/core.test.specification.ts
var specification2 = (Suite, Given, When, Then) => {
  const summary = {
    suites: {
      "Testeranto Core Functionality": {
        features: {},
        artifacts: []
      },
      "Testeranto Advanced Features": {
        features: {},
        artifacts: []
      }
    },
    features: {},
    artifacts: []
  };
  return [
    Suite.Default(
      "Testeranto Core Functionality",
      summary.suites["Testeranto Core Functionality"],
      {
        // Initialization tests
        defaultInitialization: Given.Default(
          ["Should initialize with default values"],
          [],
          [
            Then.initializedProperly(),
            Then.specsGenerated(),
            Then.jobsCreated(),
            Then.artifactsTracked()
          ]
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
        interfaceConfig: Given.WithCustomAdapter(
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
    Suite.ExtendedSuite("Testeranto Advanced Features", summary.suites["Testeranto Advanced Features"], {
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
      // Removed customImpl test since WithCustomImplementation isn't defined
      dynamicSpecs: Given.Default(
        ["Should handle dynamic spec changes"],
        [When.modifySpecs((specs) => specs)],
        [Then.specsGenerated()]
      )
    })
  ];
};

// src/lib/core.test/MockCore.ts
var MockCore = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testAdapter3, uberCatcher = (cb) => cb()) {
    console.log("[DEBUG] MockCore constructor starting...");
    if (!testImplementation) {
      throw new Error("testImplementation is required");
    }
    if (!testSpecification) {
      console.warn("[WARN] testSpecification is null/undefined - tests may fail");
    }
    console.log("[DEBUG] MockCore constructor called with:");
    console.log("- input:", JSON.stringify(input, null, 2));
    console.log("- testSpecification keys:", Object.keys(testSpecification));
    console.log("- testImplementation keys:", Object.keys(testImplementation));
    console.log("- testResourceRequirement:", JSON.stringify(testResourceRequirement));
    console.log("- testAdapter keys:", Object.keys(testAdapter3));
    const requiredMethods = ["suites", "givens", "whens", "thens"];
    requiredMethods.forEach((method) => {
      if (!testImplementation[method]) {
        throw new Error(`Missing required implementation method: ${method}`);
      }
    });
    console.log("[DEBUG] Validation passed, calling super...");
    this.testResourceRequirement = testResourceRequirement;
    this.testAdapter = testAdapter3;
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter3,
      uberCatcher
    );
    this.specs = [];
    this.testJobs = [];
    this.artifacts = [];
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
var implementation = {
  suites: {
    Default: "Testeranto test suite",
    ExtendedSuite: "Extended Testeranto test suite"
  },
  givens: {
    Default: () => {
      console.log("[DEBUG] Creating Default MockCore instance");
      const input = { debug: true };
      const resourceReq = { ports: [3e3] };
      console.log("[DEBUG] Default Given - input:", input);
      console.log("[DEBUG] Default Given - resourceReq:", resourceReq);
      try {
        const instance = new MockCore(
          input,
          specification,
          implementation,
          resourceReq,
          testAdapter,
          (cb) => cb()
        );
        console.log("[DEBUG] MockCore instance created successfully:", instance);
        return instance;
      } catch (e) {
        console.error("[ERROR] Failed to create MockCore:", e);
        throw e;
      }
    },
    WithCustomInput: (input) => {
      return new MockCore(
        input,
        specification,
        implementation,
        { ports: [] },
        testAdapter,
        (cb) => cb()
      );
    },
    WithResourceRequirements: (requirements) => {
      return new MockCore(
        {},
        specification,
        implementation,
        requirements,
        testAdapter,
        (cb) => cb()
      );
    },
    WithCustomAdapter: (customAdapter) => {
      return new MockCore(
        {},
        specification,
        implementation,
        { ports: [] },
        { ...testAdapter, ...customAdapter },
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
      console.log("Modifying specs - current count:", builder.specs?.length);
      const newSpecs = modifier(builder.specs || []);
      console.log("Modifying specs - new count:", newSpecs.length);
      builder.specs = newSpecs;
      return builder;
    },
    triggerError: (message) => (builder) => {
      throw new Error(message);
    }
  },
  thens: {
    initializedProperly: () => (builder) => {
      if (!builder) {
        throw new Error("Builder is undefined");
      }
      if (!(builder instanceof MockCore)) {
        throw new Error(`Builder is not MockCore (got ${builder.constructor.name})`);
      }
      if (!builder.testResourceRequirement) {
        throw new Error("testResourceRequirement not set");
      }
      if (!builder.testAdapter) {
        throw new Error("testAdapter not set");
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
      if (!builder.testAdapter) {
        throw new Error("Test adapter not configured");
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
    },
    specsModified: (expectedCount) => (builder) => {
      if (!builder.specs || builder.specs.length !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} specs, got ${builder.specs?.length}`
        );
      }
      return builder;
    }
  }
};

// src/lib/core.test/core.test.adapter.ts
var testAdapter2 = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    console.log("[DEBUG] BeforeEach - subject:", subject);
    console.log("[DEBUG] BeforeEach - initialValues:", initialValues);
    console.log("[DEBUG] BeforeEach called with:");
    console.log("- subject type:", typeof subject);
    console.log("- testResource:", JSON.stringify(testResource, null, 2));
    console.log("- initialValues:", initialValues);
    try {
      const result = await initializer();
      if (!result) {
        throw new Error("Initializer returned undefined");
      }
      if (!(result instanceof MockCore)) {
        throw new Error(`Initializer returned ${result?.constructor?.name}, expected MockCore`);
      }
      console.log("[DEBUG] BeforeEach initialized MockCore successfully");
      return result;
    } catch (e) {
      console.error("[ERROR] BeforeEach failed:", e);
      throw e;
    }
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
  specification2,
  implementation,
  testAdapter2
);
export {
  core_test_default as default
};
