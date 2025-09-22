import { assert } from "chai";
import { ITestImplementation } from "../../../CoreTypes";
import { I, M, O } from "./types";
import { IModalContentProps } from "../ModalContent";
import { IPM } from "../../../lib/types";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Modal Content Tests",
  },

  givens: {
    Default: (): IModalContentProps => ({
      theme: "light",
      handleThemeChange: () => {},
    }),
  },
  whens: {},

  thens: {
    hasModalHeader:
      () =>
        (state) => {
          const header = state.htmlElement?.querySelector('.modal-header');
          assert.exists(header, 'Should have Modal.Header');
          return state;
        },

    hasThemeCards:
      () =>
        (state) => {
          const themeCards = state.htmlElement?.querySelectorAll('.theme-card');
          assert.isAtLeast(themeCards?.length, 1, 'Should render ThemeCard components');
          return state;
        },

    takeScreenshot:
      (name: string) =>
        async (state, pm: IPM) => {
          // For web tests, we can use the PM's screenshot capability
          // The actual implementation will be handled by the test runner
          return state;
        },
  },
};
