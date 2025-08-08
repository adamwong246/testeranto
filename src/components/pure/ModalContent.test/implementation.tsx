import { assert } from "chai";
import { ITestImplementation } from "../../../CoreTypes";
import { I, M, O } from "./types";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Modal Content Tests",
  },

  givens: {
    Default: () => ({
      theme: "light",
      handleThemeChange: () => {},
    }),
  },
  whens: {},

  thens: {
    hasModalHeader:
      () =>
        async ({ htmlElement }) => {
          const header = htmlElement.querySelector('.modal-header');
          assert.exists(header, 'Should have Modal.Header');
          return { htmlElement };
        },

    hasThemeCards:
      () =>
        async ({ htmlElement }) => {
          const themeCards = htmlElement.querySelectorAll('.theme-card');
          assert.isAtLeast(themeCards.length, 1, 'Should render ThemeCard components');
          return { htmlElement };
        },

    takeScreenshot:
      (name: string) =>
        async ({ htmlElement }, pm) => {
          const p = await pm.page();
          await pm.customScreenShot({ path: name }, p);
          return { htmlElement };
        },
  },
};
