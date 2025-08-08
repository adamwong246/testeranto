"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBaseBuilder = void 0;
const basebuilder_1 = require("../basebuilder");
/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
class MockBaseBuilder extends basebuilder_1.BaseBuilder {
    constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, testResourceRequirement = { ports: 0 }, testSpecification = () => []) {
        super(input, suitesOverrides, givenOverrides, whenOverrides, thenOverrides, testResourceRequirement, testSpecification);
        this.summary = {};
    }
    /**
     * Simplified version for testing that doesn't actually run tests
     */
    async testRun(puppetMaster) {
        try {
            this.summary = {
                [puppetMaster.testResourceConfiguration.name]: {
                    typeErrors: 0,
                    staticErrors: 0,
                    runTimeError: "",
                    prompt: "",
                    failingFeatures: {},
                },
            };
            return {
                failed: false,
                fails: 0,
                artifacts: this.artifacts,
                features: [],
            };
        }
        catch (error) {
            console.error("Test run failed:", error);
            return {
                failed: true,
                fails: 1,
                artifacts: this.artifacts,
                features: [],
                error: error.message
            };
        }
    }
}
exports.MockBaseBuilder = MockBaseBuilder;
