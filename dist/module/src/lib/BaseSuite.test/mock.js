/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGiven } from "../BaseGiven";
import { BaseSuite } from "../BaseSuite";
import { BaseThen } from "../BaseThen";
import { BaseWhen } from "../BaseWhen";
export class MockGiven extends BaseGiven {
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
export class MockWhen extends BaseWhen {
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
export class MockThen extends BaseThen {
    async butThen(store, thenCB, testResourceConfiguration, pm, ...args) {
        // Create a TestSelection from the store
        const selection = { testSelection: true };
        await thenCB(selection);
        return selection;
    }
}
export class MockSuite extends BaseSuite {
    constructor(name, index) {
        if (!name) {
            throw new Error("MockSuite requires a non-empty name");
        }
        const suiteName = name || "testSuite";
        super(suiteName, index, {
            testGiven: new MockGiven("testGiven", ["testFeature"], [
                new MockWhen("testWhen", async () => Promise.resolve({ testSelection: true })),
            ], [
                new MockThen("testThen", async () => Promise.resolve(new BaseSuite("temp", 0, {}))),
            ]),
        });
    }
}
