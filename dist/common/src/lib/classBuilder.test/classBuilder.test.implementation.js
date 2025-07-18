"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const stream_1 = require("stream");
const TestClassBuilder_1 = require("./TestClassBuilder");
const classBuilder_test_specification_1 = require("./classBuilder.test.specification");
exports.implementation = {
    suites: {
        Default: "ClassBuilder test suite",
    },
    givens: {
        Default: () => {
            return new TestClassBuilder_1.TestClassBuilder(exports.implementation, // Use the current implementation
            classBuilder_test_specification_1.specification, // Use the current specification
            {}, // Default input
            class {
            }, // suiteKlasser
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
            return new TestClassBuilder_1.TestClassBuilder(exports.implementation, classBuilder_test_specification_1.specification, input, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, { ports: [] });
        },
        WithResourceRequirements: (requirements) => {
            return new TestClassBuilder_1.TestClassBuilder(exports.implementation, classBuilder_test_specification_1.specification, {}, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, requirements);
        },
        WithCustomImplementation: (impl) => {
            return new TestClassBuilder_1.TestClassBuilder(impl, classBuilder_test_specification_1.specification, {}, class {
            }, class {
            }, class {
            }, class {
            }, class {
            }, { ports: [] });
        },
        WithCustomSpecification: (spec) => {
            return new TestClassBuilder_1.TestClassBuilder(exports.implementation, spec, {}, class {
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
            if (!(builder instanceof TestClassBuilder_1.TestClassBuilder)) {
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
    checks: {
        Default: () => new stream_1.PassThrough(),
        ImplementationCheck: (validator) => validator(exports.implementation),
        SpecificationCheck: (validator) => validator(classBuilder_test_specification_1.specification),
    },
};
