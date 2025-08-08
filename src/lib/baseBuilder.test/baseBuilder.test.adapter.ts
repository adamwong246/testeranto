/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestAdapter } from "../../CoreTypes";

import { I } from "./baseBuilder.test.types";

export const testAdapter: ITestAdapter<I> = {
  beforeAll: async (input, testResource, pm) => input,
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const result = initializer();
    console.log("Initialization result:", JSON.stringify(result, null, 2));
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
  assertThis: (x: any) => x,
};
