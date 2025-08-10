/* eslint-disable @typescript-eslint/no-empty-object-type */

import { assert } from "chai";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { ITestImplementation } from "../../../CoreTypes";

import { IInput, ISelection, IStore, ISubject, O } from "./types";

const mockTestData = {
  name: "Test Suite",
  givens: [
    {
      name: "Given Scenario",
      whens: [{ name: "When Action" }],
      thens: [{ name: "Then Assertion" }],
    },
  ],
};

export const implementation: ITestImplementation<
  {
    iinput: IInput;
    isubject: ISubject;
    istore: IStore;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (sel: ISelection) => ISelection;
    then: (sel: ISelection) => Promise<ISelection>;
  },
  O,
  {}
> = {
  suites: {
    Default: "TestPageView basic rendering",
    Navigation: "TestPageView navigation behavior",
    ErrorStates: "TestPageView error handling",
  },

  givens: {
    Default: () => ({
      route: "results",
      setRoute: () => {},
      navigate: () => {},
      projectName: "test-project",
      testName: "test-suite.test.ts",
      decodedTestPath: "test-suite",
      runtime: "node",
      testData: mockTestData,
      logs: "Test logs content",
      typeErrors: "",
      lintErrors: "",
      testsExist: true,
      errorCounts: {
        runTimeErrors: 0, // BDD test failures
        typeErrors: 0, // Type checker errors
        staticErrors: 0, // Linter errors
      },
    }),
    WithErrors: () => ({
      route: "results",
      setRoute: () => {},
      navigate: () => {},
      projectName: "test-project",
      testName: "test-suite.test.ts",
      decodedTestPath: "test-suite",
      runtime: "node",
      testData: null, // Missing tests.json indicates BDD failure
      logs: undefined,
      typeErrors: "Type error message", // Only shown if tests.json exists
      lintErrors: "Lint error message", // Only shown if tests.json exists
      testsExist: false,
      errorCounts: {
        runTimeErrors: 1, // Highest priority - BDD failed
        typeErrors: 2, // Secondary - type errors
        staticErrors: 3, // Lowest priority - linter errors
      },
    }),
    WithLogs: () => ({
      route: "logs",
      setRoute: () => {},
      navigate: () => {},
      projectName: "test-project",
      testName: "test-suite.test.ts",
      decodedTestPath: "test-suite",
      runtime: "node",
      testData: mockTestData,
      logs: "Detailed test logs\nLine 1\nLine 2",
      typeErrors: "",
      lintErrors: "",
      testsExist: true,
      errorCounts: {
        runTimeErrors: 0,
        typeErrors: 0,
        staticErrors: 0,
      },
    }),
  },

  whens: {
    SwitchToTab: (tabName: string) => (selection) => {
      selection.reactElement = React.cloneElement(selection.reactElement, {
        route: tabName,
      });
      ReactDom.createRoot(selection.domRoot).render(selection.reactElement);
      return selection;
    },
    ClickAiderButton: () => (selection) => {
      const button = selection.container.querySelector(
        'button[aria-label="Aider"]'
      );
      if (button) {
        (button as HTMLElement).click();
      }
      return selection;
    },
  },

  thens: {
    takeScreenshot:
      (name: string) =>
      async ({ htmlElement }, pm) => {
        const p = await pm.page();
        await pm.customScreenShot({ path: name }, p);
        return { htmlElement };
      },
    RendersNavBar: () => async (selection) => {
      const navBar = selection.container.querySelector(".navbar");
      assert.isNotNull(navBar);
      return selection;
    },
    ShowsActiveTab: (tabName: string) => async (selection) => {
      const activeTab = selection.container.querySelector(".tab-pane.active");
      assert.include(activeTab?.textContent, tabName);
      return selection;
    },
    ShowsErrorCounts: () => async (selection) => {
      const badges = selection.container.querySelectorAll(".badge");
      // First check for BDD failures
      if (!selection.testsExist) {
        assert.isAbove(badges.length, 0);
        const bddBadge = selection.container.querySelector(".badge.bg-danger");
        assert.isNotNull(bddBadge);
      }
      // Then check type errors if BDD passed
      else if (selection.errorCounts.typeErrors > 0) {
        const typeBadge =
          selection.container.querySelector(".badge.bg-warning");
        assert.isNotNull(typeBadge);
      }
      // Finally check linter errors if both above passed
      else if (selection.errorCounts.staticErrors > 0) {
        const lintBadge = selection.container.querySelector(".badge.bg-info");
        assert.isNotNull(lintBadge);
      }
      return selection;
    },
    ShowsTestResults: () => async (selection) => {
      // Only expect test results if BDD tests passed
      if (selection.testsExist) {
        const testResults = selection.container.querySelector(".test-results");
        assert.isNotNull(testResults);
      }
      return selection;
    },
    ShowsLogs: () => async (selection) => {
      const logs = selection.container.querySelector("pre");
      assert.isNotNull(logs);
      return selection;
    },
    ShowsTypeErrors: () => async (selection) => {
      const typeErrors = selection.container.querySelector("#types-tab");
      assert.isNotNull(typeErrors);
      return selection;
    },
    ShowsLintErrors: () => async (selection) => {
      const lintErrors = selection.container.querySelector("#lint-tab");
      assert.isNotNull(lintErrors);
      return selection;
    },
    AiderButtonCopiesCommand: () => async (selection) => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });

      await implementation.whens.ClickAiderButton()(selection);
      assert.isTrue(navigator.clipboard.writeText.called);
      return selection;
    },
  },
};
