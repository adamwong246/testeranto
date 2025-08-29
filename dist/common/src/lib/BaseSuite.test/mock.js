"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSuite = exports.MockThen = exports.MockWhen = exports.MockGiven = void 0;
const BaseGiven_1 = require("../BaseGiven");
const BaseSuite_1 = require("../BaseSuite");
const BaseThen_1 = require("../BaseThen");
const BaseWhen_1 = require("../BaseWhen");
class MockGiven extends BaseGiven_1.BaseGiven {
    constructor(name, features, whens, thens) {
        super(name, features, whens, thens, async () => ({ testStore: true, testSelection: false }), // givenCB
        {} // initialValues
        );
    }
    async givenThat() {
        return { testStore: true, testSelection: false };
    }
    uberCatcher(e) {
        console.error("Given error 2:", e);
    }
}
exports.MockGiven = MockGiven;
class MockWhen extends BaseWhen_1.BaseWhen {
    async andWhen(store, whenCB, testResource, pm) {
        // The whenCB expects to be called with the store directly
        // Since I["when"] is (store: TestStore) => Promise<TestStore>
        const result = await whenCB(store);
        return result;
    }
    addArtifact(path) {
        // Mock implementation
    }
}
exports.MockWhen = MockWhen;
class MockThen extends BaseThen_1.BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        // The thenCB expects to be called with the store directly
        // Since I["then"] is (store: TestStore) => Promise<TestSelection>
        const result = await thenCB(store);
        return result;
    }
}
exports.MockThen = MockThen;
class MockSuite extends BaseSuite_1.BaseSuite {
    constructor(name, index) {
        if (!name) {
            throw new Error("MockSuite requires a non-empty name");
        }
        const suiteName = name || "testSuite";
        super(suiteName, index, {
            testGiven: new MockGiven("testGiven", ["testFeature"], [
                new MockWhen("testWhen", async () => Promise.resolve({ testSelection: true })),
            ], [
                new MockThen("testThen", async () => Promise.resolve(new BaseSuite_1.BaseSuite("temp", 0, {}))),
            ]),
        });
    }
}
exports.MockSuite = MockSuite;
