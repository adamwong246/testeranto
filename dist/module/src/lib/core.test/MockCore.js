import TesterantoCore from "../core";
/**
 * Concrete implementation of Testeranto for testing purposes
 */
export class MockCore extends TesterantoCore {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testAdapter = {}, uberCatcher = (cb) => cb()) {
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, uberCatcher);
    }
    async receiveTestResourceConfig(partialTestResource) {
        return {
            failed: false,
            fails: 0,
            artifacts: [],
            logPromise: Promise.resolve(),
            features: [],
        };
    }
}
