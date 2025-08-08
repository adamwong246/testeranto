/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TesterantoCore from "../core";
/**
 * Concrete implementation of Testeranto for testing purposes
 */
export class MockCore extends TesterantoCore {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testAdapter, uberCatcher = (cb) => cb()) {
        // Validate required implementation methods
        const requiredMethods = ["suites", "givens", "whens", "thens"];
        requiredMethods.forEach((method) => {
            if (!testImplementation[method]) {
                throw new Error(`Missing required implementation method: ${method}`);
            }
        });
        // this.testResourceRequirement = testResourceRequirement;
        // this.testAdapter = testAdapter;
        super(input, testSpecification, testImplementation, testResourceRequirement, testAdapter, uberCatcher);
        this.specs = [];
        this.testJobs = [];
        this.artifacts = [];
    }
    async receiveTestResourceConfig(partialTestResource) {
        return {
            failed: false,
            fails: 0,
            artifacts: [],
            // logPromise: Promise.resolve(),
            features: [],
        };
    }
}
