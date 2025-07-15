import { ITestInterface } from "../../CoreTypes";
import { I } from "./types";

export const testInterface: ITestInterface<I> = {
  beforeEach: async (subject, initializer) => initializer(),
  andWhen: async (store, whenCB) => whenCB(store),
  butThen: async (store, thenCB) => thenCB(store),
  afterEach: (store) => store,
  afterAll: () => {},
  assertThis: (result) => !!result,
  beforeAll: async (input) => input as any
};
