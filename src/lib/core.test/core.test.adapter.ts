/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestAdapter } from "../../CoreTypes";

import { I } from "./core.test.types";

export const testAdapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    return initializer();
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    return whenCB(store, pm);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: (store, pm) => {},
  assertThis: (result) => !!result,
  beforeAll: async (input, testResource, pm) => input as any,
};
