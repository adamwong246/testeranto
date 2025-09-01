"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapter = void 0;
const chai_1 = require("chai");
const pmProxy_1 = require("../pmProxy");
const mockPMBase_1 = require("./mockPMBase");
// import { butThenProxy, andWhenProxy, beforeEachProxy } from "../pmProxy";
exports.testAdapter = {
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
        const proxiedPM = (0, pmProxy_1.andWhenProxy)(pm, "some/path", (path) => {
            console.log("Artifact added:", path);
            return path;
        });
        return whenCB(store, proxiedPM);
    },
    butThen: async (store, thenCB, testResource, pm) => {
        const proxiedPM = (0, pmProxy_1.butThenProxy)(pm, "some/path", (path) => {
            console.log("Artifact added:", path);
            return path;
        });
        return thenCB(store, proxiedPM);
    },
    afterEach: async (store, key, pm) => store,
    afterAll: async (store, pm) => { },
    beforeAll: async (input, testResource, pm, theGivenString) => {
        return {
            beforeEachProxy: input.butThenProxy(new mockPMBase_1.MockPMBase(), theGivenString),
        };
    },
    assertThis: (actualResult, expectedResult) => {
        // Handle both path assertions and our new test result
        if (typeof actualResult === 'string' && actualResult.startsWith('PASS')) {
            chai_1.assert.equal(actualResult, 'PASS', 'tests.json should be written with correct path and content');
        }
        else if (typeof actualResult === 'string' && actualResult.startsWith('FAIL')) {
            // For the tests.json write test, we want to see what's actually happening
            chai_1.assert.fail(`Test failed: ${actualResult}`);
        }
        else {
            chai_1.assert.equal(actualResult, expectedResult);
        }
    },
};
