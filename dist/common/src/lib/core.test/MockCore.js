"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCore = void 0;
const core_1 = __importDefault(require("../core"));
/**
 * Concrete implementation of Testeranto for testing purposes
 */
class MockCore extends core_1.default {
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
exports.MockCore = MockCore;
