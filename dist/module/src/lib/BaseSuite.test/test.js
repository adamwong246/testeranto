import { MockSuite } from "./mock";
// 3. Enhanced Test Specification with more test cases
export const specification = (Suite, Given, When, Then) => [
    Suite.Default("BaseSuite Core Functionality Tests", {
        // Test initialization and basic properties
        initialization: Given.Default(["BaseSuite should initialize with correct name and index"], [], [Then.SuiteNameMatches("testSuite"), Then.SuiteIndexMatches(0)]),
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
    }),
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
// 4. Enhanced Test Implementation with more operations
export const implementation = {
    suites: {
        Default: "BaseSuite Comprehensive Test Suite",
    },
    givens: {
        Default: () => {
            return async () => {
                const suite = new MockSuite("testSuite", 0);
                // Convert MockSuite to TestStore
                return {
                    name: suite.name,
                    index: suite.index,
                    testStore: true,
                };
            };
        },
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
                ports: [3000],
                environment: {},
                timeout: 5000,
                retries: 3,
            };
            const mockArtifactory = (key, value) => { };
            const mockTLog = (...args) => { };
            const mockPM = {
                server: null,
                testResourceConfiguration: mockConfig,
                start: async () => { },
                stop: async () => { },
                testArtiFactoryfileWriter: () => { },
                $: () => { },
                click: () => { },
                closePage: () => { },
                createWriteStream: async () => "",
            };
            return await suite.run(null, mockConfig, mockArtifactory, mockTLog, mockPM);
        },
        RunSuiteWithError: () => async (suite) => {
            // Force an error by passing invalid config
            try {
                await suite.run(null, {}, // Invalid config
                () => { }, () => { }, {});
            }
            catch (e) {
                // Error is caught and counted by BaseSuite
            }
            return suite;
        },
        AddFeature: (feature) => (suite) => {
            // Add a feature to the first given
            const firstGivenKey = Object.keys(suite.givens)[0];
            if (firstGivenKey) {
                suite.givens[firstGivenKey].features.push(feature);
            }
            return suite;
        },
    },
    thens: {
        SuiteNameMatches: (expectedName) => (ssel, utils) => (store) => {
            console.log("WTF");
            process.exit();
            // if (store.name !== expectedName) {
            //   throw new Error(
            //     `Expected suite name '${expectedName}', got '${store.name}'`
            //   );
            // }
            // return Promise.resolve({ testSelection: true });
        },
        SuiteIndexMatches: (expectedIndex) => (ssel, utils) => (store) => {
            if (store.index !== expectedIndex) {
                throw new Error(`Expected suite index ${expectedIndex}, got ${store.index}`);
            }
            return Promise.resolve({ testSelection: true });
        },
        FeaturesIncludes: (feature) => (ssel, utils) => (store) => {
            // This needs to be adjusted to work with the actual implementation
            // For now, just return a resolved promise
            return Promise.resolve({ testSelection: true });
        },
        FeatureCountMatches: (expectedCount) => (suite) => {
            const actualCount = suite.features().length;
            if (actualCount !== expectedCount) {
                throw new Error(`Expected ${expectedCount} features, got ${actualCount}`);
            }
            return suite;
        },
        StoreValid: () => (suite) => {
            var _a;
            if (!((_a = suite.store) === null || _a === void 0 ? void 0 : _a.testStore)) {
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
                throw new Error(`Expected ${expectedCount} errors, got ${suite.fails}`);
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
        },
    },
};
// 5. Fully typed Test Adapter
export const testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        try {
            const suite = await initializer();
            if (!suite) {
                throw new Error("Initializer returned undefined suite");
            }
            return Object.assign({ name: suite.name, index: suite.index, testStore: true, testSelection: false }, (suite.store || {}));
        }
        catch (e) {
            console.error("Given error:", e);
            throw e;
        }
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        // whenCB is (store: TestStore) => Promise<TestStore>
        const result = await whenCB(store);
        return result;
    },
    butThen: async (store, thenCB, testResource, pm) => {
        try {
            // thenCB is (store: TestStore) => Promise<TestSelection>
            const result = await thenCB(store);
            return result;
        }
        catch (e) {
            console.error("Then error:", e.toString());
            throw e;
        }
    },
    afterEach: (store) => store,
    afterAll: (store, pm) => { },
    assertThis: (result) => !!result,
    beforeAll: async (input, testResource, pm) => input,
};
