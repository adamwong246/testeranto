"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBaseBuilder = void 0;
const basebuilder_1 = require("../basebuilder");
/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
class MockBaseBuilder extends basebuilder_1.BaseBuilder {
    constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, testResourceRequirement = { ports: [0] }, testSpecification = () => []) {
        // Initialize required arrays
        this.artifacts = [];
        this.testJobs = [];
        super(input, suitesOverrides, givenOverrides, whenOverrides, thenOverrides, testResourceRequirement, testSpecification);
        this.summary = {};
        this.summary = {};
    }
    /**
     * Simplified version for testing that doesn't actually run tests
     */
    testRun(puppetMaster) {
        this.summary = {
            [puppetMaster.testResourceConfiguration.name]: {
                typeErrors: 0,
                staticErrors: 0,
                runTimeError: "",
                prompt: "",
                failingFeatures: {},
            },
        };
        return Promise.resolve({
            failed: false,
            fails: 0,
            artifacts: [],
            logPromise: Promise.resolve(),
            features: [],
        });
    }
}
exports.MockBaseBuilder = MockBaseBuilder;
