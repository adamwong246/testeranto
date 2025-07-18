import { BaseGiven } from "../abstractBase";
export class MockGiven extends BaseGiven {
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
