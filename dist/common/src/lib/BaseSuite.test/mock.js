"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    async givenThat() {
        return { testStore: true };
    }
    uberCatcher(e) {
        console.error("Given error 2:", e);
    }
}
exports.MockGiven = MockGiven;
class MockWhen extends abstractBase_1.BaseWhen {
    async andWhen(store, whenCB, testResource, pm) {
        // Create a TestSelection from the store
        const selection = { testSelection: true };
        const result = await whenCB(selection)(store);
        // Convert back to TestStore
        return Object.assign(Object.assign({}, store), result);
    }
    addArtifact(path) {
        // Mock implementation
    }
}
exports.MockWhen = MockWhen;
class MockThen extends abstractBase_1.BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm, ...args) {
        // Create a TestSelection from the store
        const selection = { testSelection: true };
        await thenCB(selection);
        return selection;
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
            testGiven: new MockGiven("testGiven", ["testFeature"], [new MockWhen("testWhen", async () => Promise.resolve({ testSelection: true }))], [
                new MockThen("testThen", async () => Promise.resolve(new BaseSuite_1.BaseSuite("temp", 0, {}))),
            ]),
        });
    }
}
exports.MockSuite = MockSuite;
