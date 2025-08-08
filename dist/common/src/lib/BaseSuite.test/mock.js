"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSuite = exports.MockThen = exports.MockWhen = exports.MockGiven = void 0;
const abstractBase_1 = require("../abstractBase");
const BaseSuite_1 = require("../BaseSuite");
class MockGiven extends abstractBase_1.BaseGiven {
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
class MockWhen extends abstractBase_1.BaseWhen {
    async andWhen(store, whenCB, testResource, pm) {
        const newStore = Object.assign(Object.assign({}, store), { testSelection: true });
        const result = await whenCB(newStore);
        return result;
    }
    addArtifact(name, content) {
        // Mock implementation that just returns this for chaining
        return this;
    }
}
exports.MockWhen = MockWhen;
class MockThen extends abstractBase_1.BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm) {
        // Create test selection with explicit type
        const testSelection = {
            name: store.name,
            index: store.index,
            testSelection: store.testSelection || false,
            error: store.error ? true : undefined,
        };
        try {
            const result = await thenCB(testSelection);
            if (!result || typeof result.testSelection === "undefined") {
                throw new Error(`Invalid test selection result: ${JSON.stringify(result)}`);
            }
            return result;
        }
        catch (e) {
            console.error("[ERROR] MockThen - butThen failed:", e);
            throw e;
        }
    }
}
exports.MockThen = MockThen;
class MockSuite extends BaseSuite_1.BaseSuite {
    constructor(name, index) {
        if (!name) {
            throw new Error("MockSuite requires a non-empty name");
        }
        const suiteName = name || "testSuite"; // Ensure name is never undefined
        super(suiteName, index, {
            testGiven: new MockGiven("testGiven", ["testFeature"], [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))], [
                new MockThen("testThen", async () => Promise.resolve({ testSelection: true })),
            ]),
        });
    }
}
exports.MockSuite = MockSuite;
