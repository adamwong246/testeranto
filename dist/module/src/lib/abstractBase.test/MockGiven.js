/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGiven } from "../BaseGiven";
export class MockGiven extends BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
        super(name, features, whens, thens, givenCB, initialValues);
    }
    async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm) {
        // Call the givenCB which is a function that returns the store
        const result = givenCB();
        if (typeof result === 'function') {
            return result();
        }
        return result;
    }
    uberCatcher(e) {
        console.error("MockGiven error:", e);
        this.error = e;
    }
}
