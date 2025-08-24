"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTiposkripto = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const Tiposkripto_1 = __importDefault(require("../Tiposkripto"));
/**
 * Concrete implementation of Tiposkripto for testing purposes
 */
class MockTiposkripto extends Tiposkripto_1.default {
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
exports.MockTiposkripto = MockTiposkripto;
