import { MockBaseBuilder } from "./baseBuilder.test.mock";
import { BaseBuilder } from "../basebuilder";
export const implementation = {
    suites: {
        Default: "BaseBuilder test suite",
    },
    givens: {
        Default: () => {
            return new MockBaseBuilder({}, // input
            {}, // suitesOverrides
            {}, // givenOverrides
            {}, // whenOverrides
            {}, // thenOverrides
            { ports: 0 }, // testResourceRequirement
            () => [] // testSpecification
            );
        },
        WithCustomInput: (input) => {
            return new MockBaseBuilder(input, {}, {}, {}, {}, {}, { ports: [] });
        },
        WithResourceRequirements: (requirements) => {
            return new MockBaseBuilder({}, {}, {}, {}, {}, {}, requirements);
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
    },
    thens: {
        initializedProperly: () => (builder) => {
            var _a;
            if (!(builder instanceof BaseBuilder)) {
                console.error("Builder instance:", builder);
                throw new Error(`Builder was not properly initialized - expected BaseBuilder instance but got ${(_a = builder === null || builder === void 0 ? void 0 : builder.constructor) === null || _a === void 0 ? void 0 : _a.name}`);
            }
            // Verify required properties exist
            [
                "artifacts",
                "testJobs",
                "specs",
                "suitesOverrides",
                "givenOverides",
                "whenOverides",
                "thenOverides",
            ].forEach((prop) => {
                if (!(prop in builder)) {
                    throw new Error(`Builder missing required property: ${prop}`);
                }
            });
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
    },
};
