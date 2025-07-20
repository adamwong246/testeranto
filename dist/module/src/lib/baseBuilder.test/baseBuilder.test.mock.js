import { BaseBuilder } from "../basebuilder";
/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
export class MockBaseBuilder extends BaseBuilder {
    constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, testResourceRequirement = { ports: [] }, testSpecification = () => []) {
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
