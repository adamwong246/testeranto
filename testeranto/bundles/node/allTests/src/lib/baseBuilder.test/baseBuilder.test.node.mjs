import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseBuilder,
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "../../../chunk-RDFX5IH4.mjs";

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
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Pure(t);
    try {
      return await this.testJobs[0].receiveTestResourceConfig(pm);
    } catch (e) {
      return -2;
    }
  }
};
var Pure_default = async (input, testSpecification, testImplementation, testInterface2, testResourceRequirement = defaultTestResourceRequirement) => {
  return new PureTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface2
  );
};

// src/lib/baseBuilder.test/baseBuilder.test.specification.ts
var specification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing BaseBuilder functionality",
      {
        testInitialization: Given.Default(
          ["BaseBuilder should initialize correctly"],
          [],
          [Then.initializedProperly()]
        ),
        testSpecsGeneration: Given.Default(
          ["BaseBuilder should generate specs from test specification"],
          [],
          [Then.specsGenerated()]
        ),
        testJobsCreation: Given.Default(
          ["BaseBuilder should create test jobs"],
          [],
          [Then.jobsCreated()]
        )
      },
      []
    )
  ];
};

// src/lib/baseBuilder.test/baseBuilder.test.implementation.ts
import { PassThrough } from "stream";

// src/lib/baseBuilder.test/baseBuilder.test.mock.ts
var MockBaseBuilder = class extends BaseBuilder {
  constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, checkOverrides = {}, testResourceRequirement = { ports: [] }, testSpecification = () => []) {
    super(
      input,
      suitesOverrides,
      givenOverrides,
      whenOverrides,
      thenOverrides,
      checkOverrides,
      testResourceRequirement,
      testSpecification
    );
    this.summary = {};
    this.summary = {};
  }
  /**
   * Simplified version for testing that doesn't actually run tests
   */
  testRun(puppetMaster) {
    this.summary = {
      [puppetMaster.testResourceConfiguration.name]: {
        typeErrors: 0,
        staticErrors: 0,
        runTimeError: "",
        prompt: "",
        failingFeatures: {}
      }
    };
    return Promise.resolve({
      failed: false,
      fails: 0,
      artifacts: [],
      logPromise: Promise.resolve(),
      features: []
    });
  }
};

// src/lib/baseBuilder.test/baseBuilder.test.implementation.ts
var implementation = {
  suites: {
    Default: "BaseBuilder test suite"
  },
  givens: {
    Default: () => {
      return new MockBaseBuilder(
        {},
        {},
        {},
        {},
        {},
        {},
        { ports: [] },
        () => []
      );
    },
    WithCustomInput: (input) => {
      return new MockBaseBuilder(
        input,
        {},
        {},
        {},
        {},
        {},
        { ports: [] },
        () => []
      );
    },
    WithResourceRequirements: (requirements) => {
      return new MockBaseBuilder(
        {},
        {},
        {},
        {},
        {},
        {},
        requirements,
        () => []
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
    }
  },
  thens: {
    initializedProperly: () => (builder) => {
      if (!(builder instanceof BaseBuilder)) {
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
    }
  },
  checks: {
    Default: () => new PassThrough()
    // Not used in these tests
  }
};

// src/lib/baseBuilder.test/baseBuilder.test.interface.ts
var testInterface = {
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

// src/lib/baseBuilder.test/baseBuilder.test.node.ts
var baseBuilder_test_node_default = Pure_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testInterface
);
export {
  baseBuilder_test_node_default as default
};
