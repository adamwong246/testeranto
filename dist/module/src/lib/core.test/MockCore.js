/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TesterantoCore from "../core";
/**
 * Concrete implementation of Testeranto for testing purposes
 */
export class MockCore extends TesterantoCore {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testAdapter, uberCatcher = (cb) => cb()) {
        console.log("[DEBUG] MockCore constructor starting...");
        if (!testImplementation) {
            throw new Error("testImplementation is required");
        }
        if (!testSpecification) {
            console.warn("[WARN] testSpecification is null/undefined - tests may fail");
        }
        console.log("[DEBUG] MockCore constructor called with:");
        console.log("- input:", JSON.stringify(input, null, 2));
        console.log("- testSpecification keys:", Object.keys(testSpecification));
        console.log("- testImplementation keys:", Object.keys(testImplementation));
        console.log("- testResourceRequirement:", JSON.stringify(testResourceRequirement));
        console.log("- testAdapter keys:", Object.keys(testAdapter));
        // Validate required implementation methods
        const requiredMethods = ["suites", "givens", "whens", "thens"];
        requiredMethods.forEach((method) => {
            if (!testImplementation[method]) {
                throw new Error(`Missing required implementation method: ${method}`);
            }
        });
        console.log("[DEBUG] Validation passed, calling super...");
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
