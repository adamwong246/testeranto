/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestAdapter } from "../../../CoreTypes";
import { I } from "./types";

export const adapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    return initializer();
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    return whenCB(store, pm);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: async (store, key, pm) => {
    if (store?.container) {
      store.container.remove();
    }
    return store;
  },
};
