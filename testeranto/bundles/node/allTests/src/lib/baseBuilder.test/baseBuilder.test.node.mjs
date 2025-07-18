import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Pure_default
} from "../../../chunk-YZWFKYY3.mjs";
import {
  BaseBuilder
} from "../../../chunk-RF3LIUSG.mjs";

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

// src/lib/baseBuilder.test/TestBaseBuilder.ts
var TestBaseBuilder = class extends BaseBuilder {
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
      return new TestBaseBuilder(
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
      return new TestBaseBuilder(
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
      return new TestBaseBuilder(
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
  BaseBuilder.prototype,
  specification,
  implementation,
  testInterface
);
export {
  baseBuilder_test_node_default as default
};
