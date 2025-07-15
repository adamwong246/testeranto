import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Pure_default
} from "../../../chunk-KYSOR62N.mjs";
import {
  TesterantoCore
} from "../../../chunk-UED26IMH.mjs";

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
