/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestAdapter } from "../../CoreTypes";
import { I } from "./baseBuilder.test.types";
import { ITTestResourceConfiguration } from "..";
import { IPM } from "../types";

export const testAdapter: ITestAdapter<I> = {
  beforeAll: async (input, testResource, pm) => {
    return input;
  },
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const result = initializer()();
    return result;
  },
  andWhen: async (store, whenCB, testResource, utils) => {
    const result = whenCB(store, utils);
    return result;
  },
  butThen: async (store, thenCB, testResource, pm) => {
    const result = thenCB(store, pm);
    return result;
  },
  afterEach: async (store, key, pm) => {
    return store;
  },
  afterAll: (store, pm) => {},
  assertThis: (x: any) => x,
};
