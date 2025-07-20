"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSuite = exports.MockThen = exports.MockWhen = exports.MockGiven = void 0;
const abstractBase_1 = require("../abstractBase");
const BaseSuite_1 = require("../BaseSuite");
class MockGiven extends abstractBase_1.BaseGiven {
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
exports.MockGiven = MockGiven;
class MockWhen extends abstractBase_1.BaseWhen {
    async andWhen(store, whenCB, testResource, pm) {
        return Object.assign(Object.assign({}, store), { testStore: true });
    }
}
exports.MockWhen = MockWhen;
class MockThen extends abstractBase_1.BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        return { testSelection: true };
    }
}
exports.MockThen = MockThen;
class MockSuite extends BaseSuite_1.BaseSuite {
    constructor(name, index) {
        super(name, index, {
            testGiven: new MockGiven("testGiven", ["testFeature"], [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))], [
                new MockThen("testThen", async () => Promise.resolve({ testSelection: true })),
            ]),
        });
    }
}
exports.MockSuite = MockSuite;
