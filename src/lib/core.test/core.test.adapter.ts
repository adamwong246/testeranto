/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITestAdapter } from "../../CoreTypes";
import { I } from "./core.test.types";
import { MockCore } from "./MockCore";

export const testAdapter: ITestAdapter<I> = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    try {
      const result = await initializer();
      if (!result) {
        throw new Error("Initializer returned undefined");
      }
      if (!(result instanceof MockCore)) {
        throw new Error(
          `Initializer returned ${result?.constructor?.name}, expected MockCore`
        );
      }

      return result;
    } catch (e) {
      console.error("[ERROR] BeforeEach failed:", e);
      throw e;
    }
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
