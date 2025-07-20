import { BaseGiven, BaseWhen, BaseThen } from "../abstractBase";
import { BaseSuite } from "../BaseSuite";
export class MockGiven extends BaseGiven {
    constructor(name, features, whens, thens) {
        super(name, features, whens, thens, async () => ({ testStore: true }), // givenCB
        {} // initialValues
        );
    }
    async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm) {
        return { testStore: true };
    }
    uberCatcher(e) {
        console.error("Given error 2:", e);
    }
}
export class MockWhen extends BaseWhen {
    async andWhen(store, whenCB, testResource, pm) {
        return Object.assign(Object.assign({}, store), { testStore: true });
    }
}
export class MockThen extends BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        return { testSelection: true };
    }
}
export class MockSuite extends BaseSuite {
    constructor(name, index) {
        super(name, index, {
            testGiven: new MockGiven("testGiven", ["testFeature"], [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))], [
                new MockThen("testThen", async () => Promise.resolve({ testSelection: true })),
            ]),
        });
    }
}
