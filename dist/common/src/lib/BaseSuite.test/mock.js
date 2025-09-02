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
        // Create a TestSelection from the store
        const selection = {
            testSelection: store.testStore,
            testStore: store.testStore
        };
        // Call whenCB with the selection
        await whenCB(selection);
        return store;
    }
    addArtifact(path) {
        // Mock implementation
    }
}
exports.MockWhen = MockWhen;
class MockThen extends BaseThen_1.BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        // Create a TestSelection from the store
        const selection = {
            testSelection: store.testStore,
            testStore: store.testStore
        };
        // Call thenCB with the selection
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
            testGiven: new MockGiven("testGiven", ["testFeature"], [
                new MockWhen("testWhen", async () => Promise.resolve({ testSelection: true })),
            ], [
                new MockThen("testThen", async () => Promise.resolve(new BaseSuite_1.BaseSuite("temp", 0, {}))),
            ]),
        });
    }
}
exports.MockSuite = MockSuite;
