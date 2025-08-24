/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITestAdapter } from "../../CoreTypes";

import { I } from "./Tiposkripto.types";
import { MockTiposkripto } from "./MockTiposkripto";

export const testAdapter: ITestAdapter<I> = {
  beforeAll: async (input, testResource, pm) => input as any,
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    try {
      const result = await initializer();
      if (!result) {
        throw new Error("Initializer returned undefined");
      }
      if (!(result instanceof MockTiposkripto)) {
        throw new Error(
          `Initializer returned ${result?.constructor?.name}, expected MockTiposkripto`
        );
      }
      return result;
    } catch (e) {
      console.error("[ERROR] BeforeEach failed:", e);
      throw e;
    }
  },
  andWhen: async (store, whenCB, testResource, utils) => {
    return whenCB(store, utils);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: () => {},
  assertThis: (x: any) => !!x,
};
