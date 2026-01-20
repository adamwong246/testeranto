"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGiven = void 0;
const BaseGiven_1 = require("../BaseGiven");
class MockGiven extends BaseGiven_1.BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
        super(name, features, whens, thens, givenCB, initialValues);
    }
    async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues) {
        // Call the givenCB which is a function that returns the store
        const result = givenCB();
        if (typeof result === "function") {
            return result();
        }
        return result;
    }
    uberCatcher(e) {
        console.error("MockGiven error:", e);
        this.error = e;
    }
}
exports.MockGiven = MockGiven;
