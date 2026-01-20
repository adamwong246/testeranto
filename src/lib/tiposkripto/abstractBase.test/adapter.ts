import { ITestAdapter } from "../../../CoreTypes";
import { I } from "./types";

export const testAdapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer, testResource, initialValues) => {
    const result = await initializer();
    // Ensure the result matches the expected type
    if (typeof result === "function") {
      // If it's a function, call it to get the actual store
      return result();
    }
    return result;
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    return whenCB(store);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store);
  },
  afterEach: async (store, key, pm) => Promise.resolve(store),
  afterAll: async (store, pm) => {},
  assertThis: (result) => !!result,
  beforeAll: async (input, testResource, pm) => input as any,
};
