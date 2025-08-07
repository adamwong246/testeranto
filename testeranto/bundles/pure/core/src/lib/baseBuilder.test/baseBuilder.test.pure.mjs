import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseBuilder,
  PM,
  TesterantoCore,
  defaultTestResourceRequirement
} from "../../../chunk-OURSJSH7.mjs";

// src/PM/web.ts
var PM_Web = class extends PM {
  constructor(t) {
    super();
    this.testResourceConfiguration = t;
  }
  start() {
    return new Promise((r) => r());
  }
  stop() {
    return new Promise((r) => r());
  }
  getInnerHtml(selector, page2) {
    throw new Error("web.ts getInnHtml not implemented");
  }
  pages() {
    throw new Error("Method not implemented.");
  }
  stopSideCar(n) {
    return window["stopSideCar"](n, this.testResourceConfiguration.name);
  }
  launchSideCar(n) {
    return window["launchSideCar"](n, this.testResourceConfiguration.name);
  }
  waitForSelector(p, s) {
    return window["waitForSelector"](p, s);
  }
  screencast(o, p) {
    return window["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page.mainFrame()._id,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(recorder) {
    return window["screencastStop"](recorder);
  }
  closePage(p) {
    return window["closePage"](p);
  }
  goto(p, url) {
    return window["goto"](p, url);
  }
  newPage() {
    return window["newPage"]();
  }
  $(selector) {
    return window["$"](selector);
  }
  isDisabled(selector) {
    return window["isDisabled"](selector);
  }
  getAttribute(selector, attribute) {
    return window["getAttribute"](selector, attribute);
  }
  getValue(selector) {
    return window["getValue"](selector);
  }
  focusOn(selector) {
    return window["focusOn"](selector);
  }
  typeInto(value) {
    return window["typeInto"](value);
  }
  async page(x) {
    return window["page"](x);
  }
  click(selector) {
    return window["click"](selector);
  }
  customScreenShot(x, y) {
    const opts2 = x[0];
    const page2 = x[1];
    return window["customScreenShot"](
      {
        ...opts2,
        path: this.testResourceConfiguration.fs + "/" + opts2.path
      },
      this.testResourceConfiguration.name,
      page2
    );
  }
  existsSync(destFolder) {
    return window["existsSync"](destFolder);
  }
  mkdirSync(x) {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(uid, contents) {
    return window["write"](uid, contents);
  }
  writeFileSync([filepath, contents]) {
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
  end(uid) {
    return window["end"](uid);
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
};

// src/Web.ts
var WebTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter2) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter2,
      (cb) => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    const t = partialTestResource;
    const pm = new PM_Web(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var Web_default = async (input, testSpecification, testImplementation, testAdapter2, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter2
  );
};

// src/lib/baseBuilder.test/baseBuilder.test.specification.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("Testing BaseBuilder functionality", {
      testInitialization: Given["the default BaseBuilder"](
        ["BaseBuilder should initialize correctly"],
        [],
        [
          Then["it is initialized"](),
          Then["it tracks artifacts"]()
          // Then["it creates jobs"](),
          // Then["it generates TestSpecifications"](),
        ]
      ),
      testSpecsGeneration: Given["the default BaseBuilder"](
        ["BaseBuilder should generate specs from test specification"],
        [],
        [Then["it generates TestSpecifications"]()]
      ),
      testJobsCreation: Given["the default BaseBuilder"](
        ["BaseBuilder should create test jobs"],
        [],
        [Then["it creates jobs"]()]
      )
    })
  ];
};

// src/lib/baseBuilder.test/baseBuilder.test.mock.ts
var MockBaseBuilder = class extends BaseBuilder {
  constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, testResourceRequirement = { ports: 0 }, testSpecification = () => []) {
    super(
      input,
      suitesOverrides,
      givenOverrides,
      whenOverrides,
      thenOverrides,
      testResourceRequirement,
      testSpecification
    );
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
      // logPromise: Promise.resolve(),
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
    "the default BaseBuilder": () => {
      return new MockBaseBuilder(
        {},
        // input
        {},
        // suitesOverrides
        {},
        // givenOverrides
        {},
        // whenOverrides
        {},
        // thenOverrides
        { ports: 0 },
        // testResourceRequirement
        () => []
        // testSpecification
      );
    },
    "a BaseBuilder with TestInput": (input) => {
      return new MockBaseBuilder(
        input,
        {},
        {},
        {},
        {},
        { ports: [] },
        () => []
      );
    },
    "a BaseBuilder with Test Resource Requirements": (requirements) => {
      return new MockBaseBuilder({}, {}, {}, {}, {}, requirements, () => []);
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
    "it is initialized": () => (builder, utils) => {
      utils.writeFileSync("hello.txt", "world");
      if (!(builder instanceof BaseBuilder)) {
        console.error("Builder instance:", builder);
        throw new Error(
          `Builder was not properly initialized - expected BaseBuilder instance but got ${builder?.constructor?.name}`
        );
      }
      [
        "artifacts",
        "testJobs",
        "specs",
        "suitesOverrides",
        "givenOverides",
        "whenOverides",
        "thenOverides"
      ].forEach((prop) => {
        if (!(prop in builder)) {
          throw new Error(`Builder missing required property: ${prop}`);
        }
      });
      return builder;
    },
    "it generates TestSpecifications": () => (builder) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    "it creates jobs": () => (builder) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    "it tracks artifacts": () => (builder) => {
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
    }
  }
};

// src/lib/baseBuilder.test/baseBuilder.test.adapter.ts
var testAdapter = {
  beforeAll: async (input, testResource, pm) => input,
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    console.log("Initializing test with:", {
      subject,
      initializer,
      initialValues
    });
    const result = initializer();
    console.log("Initialization result:", result.toString());
    return result;
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
  assertThis: (x) => x
};

// src/lib/baseBuilder.test/baseBuilder.test.pure.ts
var baseBuilder_test_pure_default = Web_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
export {
  baseBuilder_test_pure_default as default
};
