import { ITestImplementation } from "../../CoreTypes";

import { I, O } from "./types";

export const implementation: ITestImplementation<I, O> = {
  suites: {
    Default: "Abstract Base Test Suite",
  },

  givens: {
    Default: () => ({
      testStore: { value: "initial" },
      testSelection: { selected: true },
    }),
    WithError: () => ({
      testStore: { value: "error" },
      testSelection: { selected: false },
    }),
  },

  whens: {
    modifyStore: (newValue: string) => (store) => ({
      ...store,
      testStore: { value: newValue },
    }),
    throwError: () => () => {
      throw new Error("Test error");
    },
  },

  thens: {
    verifyStore: (expected: string) => (store) => {
      if (store.testStore.value !== expected) {
        throw new Error(`Expected ${expected}, got ${store.testStore.value}`);
      }
      return store;
    },
    verifyError: (expected: string) => (store) => {
      if (!store.error || !store.error.message.includes(expected)) {
        throw new Error(`Expected error "${expected}" not found`);
      }
      return store;
    },
  },
};
