"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestClassBuilder = void 0;
const basebuilder_1 = require("../basebuilder");
/**
 * Concrete implementation of BaseBuilder for testing ClassBuilder
 */
class TestClassBuilder extends basebuilder_1.BaseBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
        super(input, {}, // suitesOverrides
        {}, // givenOverides
        {}, // whenOverides
        {}, // thenOverides
        {}, // checkOverides
        testResourceRequirement, testSpecification);
        this.summary = {};
        this.summary = {};
    }
    /**
     * Simplified test run for verification
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
exports.TestClassBuilder = TestClassBuilder;
