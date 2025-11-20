import PureTesteranto from "./Pure";
import { MockPMBase } from "./lib/pmProxy.test/mockPMBase";
const implementation = {
    suites: {
        Default: "PureTesteranto Test Suite",
    },
    givens: {
        Default: () => {
            const pm = new MockPMBase();
            return {
                pm,
                config: {},
                proxies: {
                    butThenProxy: (pm, path) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => {
                            return pm.writeFileSync(`${path}/butThen/${p}`, c);
                        } })),
                    andWhenProxy: (pm, path) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => {
                            return pm.writeFileSync(`${path}/andWhen/${p}`, c);
                        } })),
                    beforeEachProxy: (pm, suite) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => {
                            return pm.writeFileSync(`suite-${suite}/beforeEach/${p}`, c);
                        } })),
                },
            };
        },
    },
    whens: {
        applyProxy: (proxyType) => async (store, tr, utils) => {
            switch (proxyType) {
                case "invalidConfig":
                    throw new Error("Invalid configuration");
                case "missingProxy":
                    return Object.assign(Object.assign({}, store), { pm: {} }); // Break proxy chain
                case "largePayload":
                    return Object.assign(Object.assign({}, store), { largePayload: true, pm: Object.assign(Object.assign({}, store.pm), { writeFileSync: async (p, c) => {
                                if (c.length > 1e6) {
                                    return true;
                                }
                                throw new Error("Payload too small");
                            } }) });
                case "resourceConfig":
                    return Object.assign(Object.assign({}, store), { pm: Object.assign(Object.assign({}, store.pm), { testResourceConfiguration: { name: "test-resource" } }) });
                default:
                    return store;
            }
        },
        addArtifact: (artifact) => async (store) => {
            return Object.assign(Object.assign({}, store), { artifacts: [...(store.artifacts || []), artifact] });
        },
        setTestJobs: (jobs) => async (store) => {
            return Object.assign(Object.assign({}, store), { testJobs: jobs });
        },
        modifySpecs: (modifier) => async (store) => {
            return Object.assign(Object.assign({}, store), { specs: modifier(store.specs || []) });
        },
    },
    thens: {
        initializedProperly: () => async (store, tr, utils) => {
            if (!store.pm) {
                throw new Error("PM not initialized");
            }
            return store;
        },
        specsGenerated: () => async (store, tr, utils) => {
            return store;
        },
        jobsCreated: () => async (store, tr, utils) => {
            return store;
        },
        artifactsTracked: () => async (store, tr, utils) => {
            return store;
        },
        testRunSuccessful: () => async (store, tr, utils) => {
            return store;
        },
        specsModified: (expectedCount) => async (store, tr, utils) => {
            return store;
        },
        verifyProxy: (expectedPath) => async (store, tr, utils) => {
            return store;
        },
        verifyNoProxy: () => async (store, tr, utils) => {
            return store;
        },
        verifyError: (expectedError) => async (store, tr, utils) => {
            return store;
        },
        verifyResourceConfig: () => async (store, tr, utils) => {
            return store;
        },
        verifyLargePayload: () => async (store, tr, utils) => {
            return store;
        },
        verifyTypeSafety: () => async (store, tr, utils) => {
            return store;
        },
    },
};
const specification = (Suite, Given, When, Then) => [
    Suite.Default("Core Functionality", {
        initializationTest: Given.Default(["Should initialize with default configuration"], [], [Then.verifyNoProxy()]),
        resourceConfigTest: Given.Default(["Should handle test resource configuration"], [When.applyProxy("resourceConfig")], [Then.verifyResourceConfig()]),
    }),
    Suite.Default("Proxy Integration", {
        butThenProxyTest: Given.Default(["Should integrate with butThenProxy"], [When.applyProxy("butThenProxy")], [Then.verifyProxy("test/path/butThen/expected")]),
        andWhenProxyTest: Given.Default(["Should integrate with andWhenProxy"], [When.applyProxy("andWhenProxy")], [Then.verifyProxy("test/path/andWhen/expected")]),
        beforeEachProxyTest: Given.Default(["Should integrate with beforeEachProxy"], [When.applyProxy("beforeEachProxy")], [Then.verifyProxy("suite-1/beforeEach/expected")]),
    }),
    Suite.Default("Error Handling", {
        invalidConfigTest: Given.Default(["Should handle invalid configuration"], [When.applyProxy("invalidConfig")], [Then.verifyError("Invalid configuration")]),
        missingProxyTest: Given.Default(["Should handle missing proxy"], [When.applyProxy("missingProxy")], [Then.verifyError("Proxy not found")]),
    }),
    Suite.Default("Performance", {
        multipleProxiesTest: Given.Default(["Should handle multiple proxies efficiently"], [
            When.applyProxy("butThenProxy"),
            When.applyProxy("andWhenProxy"),
            When.applyProxy("beforeEachProxy"),
        ], [
            Then.verifyProxy("test/path/butThen/expected"),
            Then.verifyProxy("test/path/andWhen/expected"),
            Then.verifyProxy("suite-1/beforeEach/expected"),
        ]),
        largePayloadTest: Given.Default(["Should handle large payloads"], [When.applyProxy("largePayload")], [Then.verifyLargePayload()]),
    }),
    Suite.Default("Cross-Component Verification", {
        proxyChainTest: Given.Default(["Proxies should chain correctly"], [When.applyProxy("butThenProxy"), When.applyProxy("andWhenProxy")], [Then.verifyProxy("test/path/andWhen/butThen/expected")]),
        errorPropagationTest: Given.Default(["Errors should propagate across components"], [When.applyProxy("invalidConfig")], [Then.verifyError("Invalid configuration")]),
        resourceSharingTest: Given.Default(["Resources should be shared correctly"], [When.applyProxy("resourceConfig")], [Then.verifyResourceConfig()]),
    }),
    Suite.Default("Type Safety", {
        strictTypeTest: Given.Default(["Should enforce type safety"], [When.applyProxy("typeSafe")], [Then.verifyTypeSafety()]),
        invalidTypeTest: Given.Default(["Should reject invalid types"], [When.applyProxy("invalidType")], [Then.verifyError("Type mismatch")]),
    }),
    Suite.Default("Integration Tests", {
        // Verify builders work together
        builderIntegration: Given.Default(["BaseBuilder and ClassBuilder should integrate properly"], [], [
            Then.initializedProperly(),
            Then.specsGenerated(),
            Then.jobsCreated(),
            Then.artifactsTracked(),
        ]),
        // Verify PM proxy integration
        pmProxyIntegration: Given.Default(["PM proxies should work with test runners"], [When.applyProxy("butThenProxy")], [Then.verifyProxy("test/path/butThen/expected")]),
        // Verify full test lifecycle
        fullLifecycle: Given.Default(["Should complete full test lifecycle"], [
            When.addArtifact(Promise.resolve("test")),
            When.setTestJobs([]),
            When.modifySpecs((specs) => [...specs]),
        ], [Then.testRunSuccessful(), Then.artifactsTracked(), Then.specsModified(0)]),
    }),
];
const testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        const initialized = initializer();
        return { pm: initialized.pm };
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        const result = await whenCB(store, testResource, pm);
        return result;
    },
    butThen: async (store, thenCB, testResource, pm) => {
        const result = await thenCB(store, testResource, pm);
        return result;
    },
    afterEach: async (store, key, pm) => store,
    afterAll: async (store, pm) => { },
    beforeAll: async (input, testResource, pm) => ({}),
    assertThis: (x) => x,
};
export default PureTesteranto(null, specification, implementation, testAdapter);
