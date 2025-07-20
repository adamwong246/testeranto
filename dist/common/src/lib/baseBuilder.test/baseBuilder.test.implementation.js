"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const baseBuilder_test_mock_1 = require("./baseBuilder.test.mock");
const basebuilder_1 = require("../basebuilder");
exports.implementation = {
    suites: {
        Default: "BaseBuilder test suite",
    },
    givens: {
        Default: () => {
            return new baseBuilder_test_mock_1.MockBaseBuilder({}, {}, {}, {}, {}, {}, { ports: [] }, () => []);
        },
        WithCustomInput: (input) => {
            return new baseBuilder_test_mock_1.MockBaseBuilder(input, {}, {}, {}, {}, {}, { ports: [] }, () => []);
        },
        WithResourceRequirements: (requirements) => {
            return new baseBuilder_test_mock_1.MockBaseBuilder({}, {}, {}, {}, {}, {}, requirements, () => []);
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
            if (!(builder instanceof basebuilder_1.BaseBuilder)) {
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
    },
};
