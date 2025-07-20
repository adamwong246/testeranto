/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassBuilder } from "../classBuilder";
/**
 * Concrete testable implementation of ClassBuilder for testing
 */
export default class TestClassBuilderMock extends ClassBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement) {
        super(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement);
        this.testJobs = [];
        this.specs = [];
        this.artifacts = [];
        this.summary = {};
    }
}
