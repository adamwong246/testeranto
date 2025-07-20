import { ITestAdapter } from "../../CoreTypes";
import { I } from "./types";

export const testAdapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer) => initializer(),
  andWhen: async (store, whenCB) => whenCB(store),
  butThen: async (store, thenCB) => thenCB(store),
  afterEach: (store) => store,
  afterAll: () => {},
  assertThis: (result) => !!result,
  beforeAll: async (input) => input as any,
};
