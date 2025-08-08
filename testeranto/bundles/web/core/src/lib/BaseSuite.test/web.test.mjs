import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Web_default,
  init_buffer,
  init_dirname,
  init_process
} from "../../../chunk-DYBZPQJQ.mjs";

// src/lib/BaseSuite.test/web.test.ts
init_dirname();
init_buffer();
init_process();

// src/lib/BaseSuite.test/test.ts
init_dirname();
init_buffer();
init_process();

// src/lib/BaseSuite.test/mock.ts
init_dirname();
init_buffer();
init_process();
var MockGiven = class extends BaseGiven {
  constructor(name, features, whens, thens) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true, testSelection: false }),
      // givenCB
      {}
      // initialValues
    );
  }
  async givenThat() {
    return { testStore: true, testSelection: false };
  }
  uberCatcher(e) {
    console.error("Given error 2:", e);
  }
};
var MockWhen = class extends BaseWhen {
  async andWhen(store, whenCB, testResource, pm) {
    const newStore = {
      ...store,
      testSelection: true
      // Ensure testSelection is set for assertions
    };
    const result = await whenCB(newStore);
    return result;
  }
  addArtifact(name, content) {
    return this;
  }
};
var MockThen = class extends BaseThen {
  async butThen(store, thenCB, testResourceConfiguration, pm) {
    const testSelection = {
      name: store.name,
      index: store.index,
      testSelection: store.testSelection || false,
      error: store.error ? true : void 0
    };
    try {
      const result = await thenCB(testSelection);
      if (!result || typeof result.testSelection === "undefined") {
        throw new Error(
          `Invalid test selection result: ${JSON.stringify(result)}`
        );
      }
      return result;
    } catch (e) {
      console.error("[ERROR] MockThen - butThen failed:", e);
      throw e;
    }
  }
};
var MockSuite = class extends BaseSuite {
  constructor(name, index) {
    if (!name) {
      throw new Error("MockSuite requires a non-empty name");
    }
    const suiteName = name || "testSuite";
    super(suiteName, index, {
      testGiven: new MockGiven(
        "testGiven",
        ["testFeature"],
        [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))],
        [
          new MockThen(
            "testThen",
            async () => Promise.resolve({ testSelection: true })
          )
        ]
      )
    });
  }
};

// src/lib/BaseSuite.test/test.ts
var specification = (Suite, Given, When, Then) => [
  Suite.Default("BaseSuite Core Functionality Tests", {
    // Test initialization and basic properties
    initialization: Given.Default(
      ["BaseSuite should initialize with correct name and index"],
      [],
      [Then.SuiteNameMatches("testSuite"), Then.SuiteIndexMatches(0)]
    )
    // // Test execution flow
    // execution: Given.Default(
    //   ["BaseSuite should execute all phases successfully"],
    //   [When.RunSuite()],
    //   [Then.StoreValid()]
    // ),
    // // Test multiple features
    // multipleFeatures: Given.Default(
    //   ["BaseSuite should handle multiple features"],
    //   [When.AddFeature("additionalFeature")],
    //   [
    //     Then.FeaturesIncludes("testFeature"),
    //     Then.FeaturesIncludes("additionalFeature"),
    //     Then.FeatureCountMatches(2),
    //   ]
    // ),
    // // Test error handling
    // errorHandling: Given.Default(
    //   ["BaseSuite should handle errors gracefully"],
    //   [When.RunSuiteWithError()],
    //   [Then.ErrorCountMatches(1), Then.FailedFlagSet()]
    // ),
  })
  // Suite.Default("Comprehensive Integration", {
  //   fullStackTest: Given.Default(
  //     ["All components should work together"],
  //     [
  //       When.addArtifact(Promise.resolve("test")),
  //       When.modifySpecs((specs) => [...specs, "extra"]),
  //       When.modifyJobs((jobs) => [...jobs, {}]),
  //     ],
  //     [
  //       Then.specsModified(1),
  //       Then.jobsModified(1),
  //       Then.artifactsTracked(),
  //       Then.testRunSuccessful(),
  //     ]
  //   ),
  // }),
];
var implementation = {
  suites: {
    Default: "BaseSuite Comprehensive Test Suite"
  },
  givens: {
    Default: () => {
      const suite = new MockSuite("testSuite", 0);
      return suite;
    }
  },
  whens: {
    addArtifact: (artifact) => (suite) => {
      suite.artifacts.push(artifact);
      return suite;
    },
    modifySpecs: (modifier) => (suite) => {
      suite.specs = modifier(suite.specs);
      return suite;
    },
    modifyJobs: (modifier) => (suite) => {
      suite.testJobs = modifier(suite.testJobs);
      return suite;
    },
    RunSuite: () => async (suite) => {
      const mockConfig = {
        name: "test",
        fs: "/tmp",
        ports: [3e3],
        environment: {},
        timeout: 5e3,
        retries: 3
      };
      const mockArtifactory = (key, value) => {
      };
      const mockTLog = (...args) => {
      };
      const mockPM = {
        server: null,
        testResourceConfiguration: mockConfig,
        start: async () => {
        },
        stop: async () => {
        },
        testArtiFactoryfileWriter: () => {
        },
        $: () => {
        },
        click: () => {
        },
        closePage: () => {
        },
        createWriteStream: async () => ""
      };
      return await suite.run(
        null,
        mockConfig,
        mockArtifactory,
        mockTLog,
        mockPM
      );
    },
    RunSuiteWithError: () => async (suite) => {
      try {
        await suite.run(
          null,
          {},
          // Invalid config
          () => {
          },
          () => {
          },
          {}
        );
      } catch (e) {
      }
      return suite;
    },
    AddFeature: (feature) => (suite) => {
      const firstGivenKey = Object.keys(suite.givens)[0];
      if (firstGivenKey) {
        suite.givens[firstGivenKey].features.push(feature);
      }
      return suite;
    }
  },
  thens: {
    SuiteNameMatches: (expectedName) => (selection) => {
      if (!selection.name) {
        throw new Error(`Suite name is undefined. Expected: ${expectedName}`);
      }
      if (selection.name !== expectedName) {
        throw new Error(
          `Expected suite name '${expectedName}', got '${selection.name}'`
        );
      }
      return selection;
    },
    SuiteIndexMatches: (expectedIndex) => (selection) => {
      if (selection.index !== expectedIndex) {
        throw new Error(
          `Expected suite index ${expectedIndex}, got ${selection.index}`
        );
      }
      return selection;
    },
    FeaturesIncludes: (feature) => (suite) => {
      if (!suite.features().includes(feature)) {
        throw new Error(`Expected features to include ${feature}`);
      }
      return suite;
    },
    FeatureCountMatches: (expectedCount) => (suite) => {
      const actualCount = suite.features().length;
      if (actualCount !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} features, got ${actualCount}`
        );
      }
      return suite;
    },
    StoreValid: () => (suite) => {
      if (!suite.store?.testStore) {
        throw new Error("Expected valid store after execution");
      }
      return suite;
    },
    NoErrorsOccurred: () => (suite) => {
      if (suite.failed || suite.fails > 0) {
        throw new Error("Expected no errors to occur during execution");
      }
      return suite;
    },
    ErrorCountMatches: (expectedCount) => (suite) => {
      if (suite.fails !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} errors, got ${suite.fails}`
        );
      }
      return suite;
    },
    FailedFlagSet: () => (suite) => {
      if (!suite.failed) {
        throw new Error("Expected failed flag to be set after error");
      }
      return suite;
    },
    AllTestsCompleted: () => (suite) => {
      if (!suite.store) {
        throw new Error("Expected all tests to be completed");
      }
      return suite;
    },
    CleanExit: () => (suite) => {
      if (suite.failed && suite.fails === 0) {
        throw new Error("Expected clean exit state");
      }
      return suite;
    },
    specsModified: (expectedCount) => (suite) => {
      if (suite.specs.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} modified specs`);
      }
      return suite;
    },
    jobsModified: (expectedCount) => (suite) => {
      if (suite.testJobs.length !== expectedCount) {
        throw new Error(`Expected ${expectedCount} modified jobs`);
      }
      return suite;
    },
    artifactsTracked: () => (suite) => {
      if (suite.artifacts.length === 0) {
        throw new Error("Expected artifacts to be tracked");
      }
      return suite;
    },
    testRunSuccessful: () => (suite) => {
      if (suite.failed) {
        throw new Error("Expected test run to be successful");
      }
      return suite;
    }
  }
};
var testAdapter = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    try {
      const suite = await initializer();
      if (!suite) {
        throw new Error("Initializer returned undefined suite");
      }
      return {
        name: suite.name,
        index: suite.index,
        testStore: true,
        testSelection: false,
        ...suite.store || {}
      };
    } catch (e) {
      console.error("Given error:", e);
      throw e;
    }
  },
  andWhen: async (store, whenCB, testResource, pm) => whenCB(store, pm),
  butThen: async (store, thenCB, testResource, pm) => {
    const testSelection = {
      testSelection: store.testSelection || false,
      error: store.error ? true : void 0,
      name: store.name,
      index: store.index
    };
    try {
      const result = await thenCB(testSelection);
      if (!result || typeof result.testSelection === "undefined") {
        throw new Error(
          `Invalid test selection result: ${JSON.stringify(result)}`
        );
      }
      return result;
    } catch (e) {
      console.error("Then error:", e.toString());
      console.error("Full store state:", JSON.stringify(store, null, 2));
      throw e;
    }
  },
  afterEach: (store) => store,
  afterAll: (store, pm) => {
  },
  assertThis: (result) => !!result,
  beforeAll: async (input, testResource, pm) => input
};

// src/lib/BaseSuite.test/web.test.ts
var web_test_default = Web_default(
  BaseSuite,
  specification,
  implementation,
  testAdapter
);
export {
  web_test_default as default
};
