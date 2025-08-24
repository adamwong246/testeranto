/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Tiposkripto from "../Tiposkripto";
/**
 * Concrete implementation of Tiposkripto for testing purposes
 */
export class MockTiposkripto extends Tiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = { ports: [] }, testAdapter, uberCatcher = (cb) => cb()) {
        // Validate required implementation methods
        const requiredMethods = ["suites", "givens", "whens", "thens"];
        requiredMethods.forEach((method) => {
            if (!testImplementation[method]) {
                throw new Error(`Missing required implementation method: ${method}`);
            }
        });
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
            features: [],
        };
    }
}
