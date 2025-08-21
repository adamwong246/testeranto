/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert } from "chai";
import { andWhenProxy, butThenProxy } from "../pmProxy";
import { MockPMBase } from "./mockPMBase";
// import { butThenProxy, andWhenProxy, beforeEachProxy } from "../pmProxy";
export const testAdapter = {
    beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
        return subject;
        // const mockPM = MockPMBase();
        // return {
        //   beforeEachProxy: subject.butThenProxy(
        //     new MockPMBase() as unknown as IPM,
        //     initializer
        //   ),
        // };
    },
    andWhen: async (store, whenCB, testResource, pm) => {
        const proxiedPM = andWhenProxy(pm, "some/path", (path) => {
            console.log("Artifact added:", path);
            return path;
        });
        return whenCB(store, proxiedPM);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        const proxiedPM = butThenProxy(pm, "some/path", (path) => {
            console.log("Artifact added:", path);
            return path;
        });
        return thenCB(store, proxiedPM);
    },
    afterEach: async (store, key, pm) => store,
    afterAll: async (store, pm) => { },
    beforeAll: async (input, testResource, pm, theGivenString) => {
        return {
            beforeEachProxy: input.butThenProxy(new MockPMBase(), theGivenString),
        };
    },
    assertThis: (actualResult, expectedResult) => {
        // Handle both path assertions and our new test result
        if (typeof actualResult === 'string' && actualResult.startsWith('PASS')) {
            assert.equal(actualResult, 'PASS', 'tests.json should be written with correct path and content');
        }
        else if (typeof actualResult === 'string' && actualResult.startsWith('FAIL')) {
            // For the tests.json write test, we want to see what's actually happening
            assert.fail(`Test failed: ${actualResult}`);
        }
        else {
            assert.equal(actualResult, expectedResult);
        }
    },
};
