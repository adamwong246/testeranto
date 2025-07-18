import { assert } from "chai";

import { I } from "./types";
import { ITestInterface } from "../../CoreTypes";
import { andWhenProxy, butThenProxy } from "../pmProxy";
import { IPM } from "../types";
import { MockPMBase } from "./mockPMBase";
// import { butThenProxy, andWhenProxy, beforeEachProxy } from "../pmProxy";

export const testInterface: ITestInterface<I> = {
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
    const proxiedPM = andWhenProxy(pm, "some/path");
    return whenCB(store, proxiedPM);
  },

  butThen: async (store, thenCB, testResource, pm) => {
    const proxiedPM = butThenProxy(pm, "some/path");
    return thenCB(store, proxiedPM);
  },

  afterEach: async (store, key, pm) => store,
  afterAll: async (store, pm) => {},
  beforeAll: async (input, testResource, pm, theGivenString) => {
    return {
      beforeEachProxy: input.butThenProxy(
        new MockPMBase() as unknown as IPM,
        theGivenString
      ),
    };
  },

  assertThis: (returnedFilePath, expectation) => {
    assert.equal(returnedFilePath, expectation);
  },
};
