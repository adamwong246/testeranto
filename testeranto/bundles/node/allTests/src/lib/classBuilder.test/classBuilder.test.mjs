import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MockSuite
} from "../../../chunk-H2IBV7SY.mjs";
import {
  Node_default
} from "../../../chunk-ZHOULXPN.mjs";
import {
  ClassBuilder
} from "../../../chunk-IDCUSTSM.mjs";

// src/lib/classBuilder.test/mock.ts
var TestClassBuilderMock = class extends ClassBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement) {
    super(
      testImplementation,
      testSpecification,
      input,
      suiteKlasser,
      givenKlasser,
      whenKlasser,
      thenKlasser,
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

// src/lib/classBuilder.test/classBuilder.test.implementation.ts
var implementation = {
  suites: {
    Default: "ClassBuilder test suite",
    ExtendedSuite: "Extended ClassBuilder test suite"
  },
  givens: {
    Default: () => {
      console.log("Creating default test builder instance");
      const builder = new TestClassBuilderMock(
        implementation,
        // Use the current implementation
        specification,
        // Use the current specification
        {},
        // Default input
        MockSuite,
        class {
        },
        // givenKlasser
        class {
        },
        // whenKlasser
        class {
        },
        // thenKlasser
        { ports: [] }
        // Default resource requirements
      );
      console.log("Builder created:", builder);
      return builder;
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
      console.log("Checking builder initialization:", {
        builder,
        isMock: builder instanceof TestClassBuilderMock,
        constructor: builder?.constructor?.name,
        props: Object.keys(builder)
      });
      if (!builder) {
        throw new Error("Builder is undefined");
      }
      if (!(builder instanceof TestClassBuilderMock)) {
        throw new Error(
          `Builder was not properly initialized. Expected mock instance but got ${builder?.constructor?.name}`
        );
      }
      const requiredProps = ["specs", "testJobs", "artifacts"];
      for (const prop of requiredProps) {
        if (!(prop in builder)) {
          throw new Error(`Missing required property: ${prop}`);
        }
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
  }
};

// src/lib/classBuilder.test/classBuilder.test.specification.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("Basic ClassBuilder Functionality", {
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
          Then.thensOverridesConfigured()
        ]
      )
    }),
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
          specification,
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
      []
    )
  ];
};

// src/lib/classBuilder.test/classBuilder.test.adapter.ts
var testAdapter = {
  beforeAll: async () => {
  },
  beforeEach: async (subject, initializer) => {
    console.log("Running beforeEach with initializer:", initializer);
    const result = await initializer();
    console.log("Initializer returned:", result);
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
  assertThis: (x) => {
  }
};

// src/lib/classBuilder.test/classBuilder.test.ts
var classBuilder_test_default = Node_default(
  ClassBuilder.prototype,
  specification,
  implementation,
  testAdapter,
  { ports: 1 }
  // Add resource requirements
);
export {
  classBuilder_test_default as default
};
