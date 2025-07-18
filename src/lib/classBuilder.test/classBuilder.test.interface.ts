/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestInterface } from "../../CoreTypes";
import { I } from "../baseBuilder.test/baseBuilder.test.types";

export const testInterface: ITestInterface<I> = {
  beforeEach: async (subject, initializer) => {
    return initializer();
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
