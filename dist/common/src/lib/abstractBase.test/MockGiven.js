"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGiven = void 0;
const abstractBase_1 = require("../abstractBase");
class MockGiven extends abstractBase_1.BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
        super(name, features, whens, thens, givenCB, initialValues);
    }
    async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm) {
        return givenCB();
    }
    uberCatcher(e) {
        console.error("MockGiven error:", e);
        this.error = e;
    }
}
exports.MockGiven = MockGiven;
