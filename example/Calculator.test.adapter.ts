/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { ITestAdapter } from "testeranto/src/CoreTypes";
import { ITestAdapter } from "../src/CoreTypes";
import { Calculator } from "./Calculator";
import { I } from "./Calculator.test.types";
import { ITTestResourceConfiguration } from "testeranto/src/lib";
// import { IPM } from "testeranto/src/lib/types";

export const adapter: ITestAdapter<I> = {
  beforeAll: async (input, testResource, pm) => {
    console.log("[ADAPTER] beforeAll called with input:", input);
    // input is the Calculator constructor
    return input;
  },

  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    console.log("[ADAPTER] beforeEach called with subject:", subject);
    const result = await initializer();
    console.log("[ADAPTER] beforeEach result:", result);
    console.log("[ADAPTER] display:", result.getDisplay());
    // Make sure we always have a valid Calculator instance
    // if (!result) {
    //   throw new Error("Initializer did not return a valid Calculator instance");
    // }
    // Ensure the display is empty
    // result.clear();
    return result;
  },

  andWhen: async (store, whenCB, testResource, pm) => {
    console.log("[ADAPTER] andWhen called");
    console.log("[ADAPTER] store display:", store.getDisplay());

    // The whenCB should be a function that returns a function which takes the store
    // For press("2"), whenCB is (calculator) => { calculator.press("2"); return calculator; }
    try {
      console.log("[ADAPTER] Calling whenCB which should return a function");
      // whenCB is a function that returns a transformation function
      const transform = whenCB;
      console.log("[ADAPTER] Transform function:", transform);

      // Apply the transformation to the store
      const result = transform(store);
      console.log("[ADAPTER] Result display:", result.getDisplay());

      // Verify the result is a Calculator instance
      if (!(result instanceof Calculator)) {
        throw new Error(`Expected Calculator instance, got ${typeof result}`);
      }
      return result;
    } catch (e) {
      console.error("[ADAPTER] Error in andWhen:", e);
      throw e;
    }
  },
  butThen: async (store, thenCB, testResource, pm) => {
    console.log("[ADAPTER] butThen called with store:", store);
    // thenCB is the function that takes the store and makes assertions
    try {
      // Run the then callback which may throw if assertion fails
      thenCB(store);
      // Return the selection (the display value)
      const display = store.getDisplay();
      console.log("[ADAPTER] butThen returning selection:", display);
      return display;
    } catch (e) {
      console.error("[ADAPTER] Error in butThen:", e);
      throw e;
    }
  },
  afterEach: async (store, key, pm) => {
    // Clean up if needed
    return store;
  },
  afterAll: async (store, pm) => {
    // Clean up if needed
    return store;
  },

  assertThis: (actual: string) => {
    // The actual value comes from butThen which returns the display
    // We don't need to do anything here as assertions are done in thenCB
    return actual;
  },
};
