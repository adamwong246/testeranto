"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const classBuilder_1 = require("../classBuilder");
/**
 * Concrete testable implementation of ClassBuilder for testing
 */
class TestClassBuilderMock extends classBuilder_1.ClassBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
        super(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement);
        this.testJobs = [];
        this.specs = [];
        this.artifacts = [];
        this.summary = {};
    }
}
exports.default = TestClassBuilderMock;
