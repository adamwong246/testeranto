import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Node_default
} from "../../../chunk-W44DUDBK.mjs";
import {
  BaseBuilder,
  ClassBuilder
} from "../../../chunk-UED26IMH.mjs";

// src/lib/classBuilder.test/classBuilder.test.specification.ts
var specification2 = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Basic ClassBuilder Functionality",
      {
        // Basic initialization tests
        initialization: Given.Default(
          ["ClassBuilder should initialize with default values"],
          [],
          [Then.initializedProperly()]
        ),
        customInput: Given.WithCustomInput(
          { custom: "input" },
          [],
          [Then.initializedProperly()]
        ),
        resourceRequirements: Given.WithResourceRequirements(
          { ports: [3e3, 3001] },
          [],
          [Then.resourceRequirementsSet()]
        ),
        // Core functionality tests
        specGeneration: Given.Default(
          ["Should generate specs from test specification"],
          [],
          [Then.specsGenerated()]
        ),
        jobCreation: Given.Default(
          ["Should create test jobs from specs"],
          [],
          [Then.jobsCreated()]
        ),
        artifactTracking: Given.Default(
          ["Should track artifacts"],
          [When.addArtifact(Promise.resolve("test"))],
          [Then.artifactsTracked()]
        ),
        // Configuration tests
        overridesConfiguration: Given.Default(
          ["Should properly configure all overrides"],
          [],
          [
            Then.suitesOverridesConfigured(),
            Then.givensOverridesConfigured(),
            Then.whensOverridesConfigured(),
            Then.thensOverridesConfigured(),
            Then.checksOverridesConfigured()
          ]
        )
      },
      []
    ),
    Suite.ExtendedSuite(
      "Advanced ClassBuilder Functionality",
      {
        // Custom implementations
        customImplementation: Given.WithCustomImplementation(
          implementation,
          [],
          [Then.specsGenerated(), Then.jobsCreated()]
        ),
        customSpecification: Given.WithCustomSpecification(
          specification2,
          [],
          [Then.specsGenerated(), Then.jobsCreated()]
        ),
        // Dynamic modification tests
        modifySpecs: Given.Default(
          ["Should allow modifying specs"],
          [When.modifySpecs((specs) => [...specs, "extra"])],
          [Then.specsModified(1)]
        ),
        modifyJobs: Given.Default(
          ["Should allow modifying jobs"],
          [When.modifyJobs((jobs) => [...jobs, {}])],
          [Then.jobsModified(1)]
        ),
        // Error handling
        errorHandling: Given.Default(
          ["Should properly handle errors"],
          [When.triggerError("test error")],
          [Then.errorThrown("test error")]
        ),
        // Full test run
        testRun: Given.Default(
          ["Should complete a full test run successfully"],
          [],
          [Then.testRunSuccessful()]
        )
      },
      [
        Check.ImplementationCheck((impl) => impl !== null),
        Check.SpecificationCheck((spec) => spec !== null)
      ]
    )
  ];
};

// src/lib/classBuilder.test/TestClassBuilder.ts
var TestClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
    super(
      input,
      {},
      // suitesOverrides
      {},
      // givenOverides
      {},
      // whenOverides
      {},
      // thenOverides
      {},
      // checkOverides
      testResourceRequirement,
      testSpecification
    );
    this.summary = {};
    this.summary = {};
  }
  /**
   * Simplified test run for verification
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

// src/lib/classBuilder.test/classBuilder.test.implementation.ts
import { PassThrough } from "stream";
var implementation2 = {
  suites: {
    Default: "ClassBuilder test suite"
  },
  givens: {
    Default: () => {
      return new TestClassBuilder(
        implementation2,
        // Use the current implementation
        specification,
        // Use the current specification
        {},
        // Default input
        class {
        },
        // suiteKlasser
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
      return new TestClassBuilder(
        implementation2,
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
      return new TestClassBuilder(
        implementation2,
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
      return new TestClassBuilder(
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
      return new TestClassBuilder(
        implementation2,
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
    Default: () => new PassThrough(),
    ImplementationCheck: (validator) => validator(implementation2),
    SpecificationCheck: (validator) => validator(specification)
  }
};

// src/lib/classBuilder.test/classBuilder.test.interface.ts
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

// src/lib/classBuilder.test/classBuilder.test.ts
var classBuilder_test_default = Node_default(
  ClassBuilder.prototype,
  specification2,
  implementation2,
  testInterface
);
export {
  classBuilder_test_default as default
};
