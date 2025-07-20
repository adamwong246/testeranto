import mock from "./mock";
import { specification } from "./classBuilder.test.specification";
import { MockSuite } from "../BaseSuite.test/mock";
export const implementation = {
    suites: {
        Default: "ClassBuilder test suite",
        ExtendedSuite: "Extended ClassBuilder test suite",
    },
    givens: {
        Default: () => {
            return new mock(implementation, // Use the current implementation
            specification, // Use the current specification
            {}, // Default input
            MockSuite, 
            // class {}, // suiteKlasser
            class {
            }, // givenKlasser
            class {
            }, // whenKlasser
            class {
            }, // thenKlasser
            class {
            }, // checkKlasser
            { ports: [] } // Default resource requirements
            );
        },
        WithCustomInput: (input) => {
            return new mock(implementation, specification, input, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, { ports: [] });
        },
        WithResourceRequirements: (requirements) => {
            return new mock(implementation, specification, {}, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, requirements);
        },
        WithCustomImplementation: (impl) => {
            return new mock(impl, specification, {}, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, { ports: [] });
        },
        WithCustomSpecification: (spec) => {
            return new mock(implementation, spec, {}, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, { ports: [] });
        },
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
        },
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
            // This is handled by the test runner
            return builder;
        },
        testRunSuccessful: () => async (builder) => {
            try {
                await builder.testRun({
                    testResourceConfiguration: {
                        name: "test",
                        fs: "/tmp",
                        ports: [],
                    },
                });
                return builder;
            }
            catch (e) {
                throw new Error(`Test run failed: ${e.message}`);
            }
        },
    },
};
