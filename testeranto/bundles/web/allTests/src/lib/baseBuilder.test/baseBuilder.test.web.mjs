import {
  BaseBuilder,
  Web_default
} from "../../../chunk-46E6YGGN.mjs";

// src/lib/baseBuilder.test/baseBuilder.test.specification.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("Testing BaseBuilder functionality", {
      testInitialization: Given.Default(
        ["BaseBuilder should initialize correctly"],
        [],
        [
          Then.initializedProperly(),
          Then.artifactsTracked(),
          Then.jobsCreated(),
          Then.specsGenerated()
        ]
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
    Default: () => {
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
    WithCustomInput: (input) => {
      return new MockBaseBuilder(input, {}, {}, {}, {}, {}, { ports: [] });
    },
    WithResourceRequirements: (requirements) => {
      return new MockBaseBuilder({}, {}, {}, {}, {}, {}, requirements);
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
    console.log("Initialization result:", result);
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

// src/lib/baseBuilder.test/baseBuilder.test.web.ts
var baseBuilder_test_web_default = Web_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
export {
  baseBuilder_test_web_default as default
};
