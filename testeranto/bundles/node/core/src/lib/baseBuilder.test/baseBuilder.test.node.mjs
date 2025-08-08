import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Node_default
} from "../../../chunk-FY5VYZH2.mjs";
import {
  BaseBuilder,
  init_cjs_shim
} from "../../../chunk-QPFMTGMK.mjs";

// src/lib/baseBuilder.test/baseBuilder.test.node.ts
init_cjs_shim();

// src/lib/baseBuilder.test/baseBuilder.test.specification.ts
init_cjs_shim();
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

// src/lib/baseBuilder.test/baseBuilder.test.implementation.ts
init_cjs_shim();

// src/lib/baseBuilder.test/baseBuilder.test.mock.ts
init_cjs_shim();
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
init_cjs_shim();
var testAdapter = {
  beforeAll: async (input, testResource, pm) => input,
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
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

// src/lib/baseBuilder.test/baseBuilder.test.node.ts
var baseBuilder_test_node_default = Node_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
export {
  baseBuilder_test_node_default as default
};
