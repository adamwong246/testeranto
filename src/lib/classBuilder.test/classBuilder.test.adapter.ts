/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITestAdapter } from "../../CoreTypes";

import { I } from "../baseBuilder.test/baseBuilder.test.types";

export const testAdapter: ITestAdapter<I> = {
  beforeAll: async () => {},
  beforeEach: async (subject, initializer) => {
    console.log("Running beforeEach with initializer:", initializer);
    const result = await initializer();
    console.log("Initializer returned:", result);
    return result;
  },
  andWhen: async (store, whenCB, testResource, utils) => {
    return whenCB(store, utils);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: () => {},
  assertThis: (x: any) => {},
};
