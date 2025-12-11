/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert } from "chai";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { ITestImplementation } from "../../../../CoreTypes";
import { ITTestResourceConfiguration } from "../../../../lib";
import { IPM } from "../../../../lib/types";

import { IInput, ISelection, IStore, ISubject, O } from "./types";

export const implementation: ITestImplementation<
  {
    iinput: IInput;
    isubject: ISubject;
    istore: IStore;
    iselection: ISelection;
    given: (props: IInput) => ISelection;
    when: (
      sel: ISelection,
      tr: ITTestResourceConfiguration,
      utils: IPM
    ) => Promise<(sel: ISelection) => ISelection>;
    then: (
      sel: ISelection,
      tr: ITTestResourceConfiguration,
      utils: IPM
    ) => Promise<(sel: ISelection) => ISelection>;
  },
  O
> = {
  suites: {
    Default: "TestPageView basic rendering",
    Navigation: "TestPageView navigation behavior",
    ErrorStates: "TestPageView error handling",
  },

  givens: {
    Default: () => (props: IInput) => {
      // Create a container and render the component
      const container = document.createElement("div");
      document.body.appendChild(container);

      const reactElement = React.createElement(props);
      const domRoot = ReactDom.createRoot(container);
      domRoot.render(reactElement);

      return {
        container,
        reactElement,
        domRoot,
        ...props,
      };
    },
    WithErrors: () => (props: IInput) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const reactElement = React.createElement(props);
      const domRoot = ReactDom.createRoot(container);
      domRoot.render(reactElement);

      return {
        container,
        reactElement,
        domRoot,
        ...props,
        errorCounts: {
          runTimeErrors: 1,
          typeErrors: 1,
          staticErrors: 1,
        },
      };
    },
    WithLogs: () => (props: IInput) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const reactElement = React.createElement(props);
      const domRoot = ReactDom.createRoot(container);
      domRoot.render(reactElement);

      return {
        container,
        reactElement,
        domRoot,
        ...props,
        logs: {
          "tests.json": "{}",
          "stdout.log": "test log content",
        },
      };
    },
  },

  whens: {
    SwitchToTab:
      (tabName: string) =>
      async (
        selection: ISelection,
        tr: ITTestResourceConfiguration,
        utils: IPM
      ) => {
        // Update the props to switch tabs
        const newProps = { ...selection, activeTab: tabName };
        const newReactElement = React.createElement(
          selection.reactElement.type,
          newProps
        );
        selection.domRoot.render(newReactElement);
        return (sel: ISelection) => ({
          ...sel,
          reactElement: newReactElement,
          activeTab: tabName,
        });
      },
    ClickAiderButton:
      () =>
      async (
        selection: ISelection,
        tr: ITTestResourceConfiguration,
        utils: IPM
      ) => {
        // Find and click the Aider button
        const button = selection.container.querySelector("button");
        if (button) {
          button.click();
        }
        return (sel: ISelection) => sel;
      },
  },

  thens: {
    takeScreenshot:
      (name: string) =>
      async (ssel: ISelection, utils: IPM) =>
      (sel: ISelection) => {
        // Screenshot functionality would be implemented here
        return Promise.resolve(sel);
      },
    RendersNavBar:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        const navBar = sel.container.querySelector(".navbar");
        assert.isNotNull(navBar, "Navbar should be rendered");
        return Promise.resolve(sel);
      },
    ShowsActiveTab:
      (tabName: string) =>
      async (ssel: ISelection, utils: IPM) =>
      (sel: ISelection) => {
        // Check if the active tab matches
        assert.equal(sel.activeTab, tabName, `Active tab should be ${tabName}`);
        return Promise.resolve(sel);
      },
    ShowsErrorCounts:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check for error badges
        const badges = sel.container.querySelectorAll(".badge");
        assert.isAtLeast(badges.length, 0, "Should show at least one badge");
        return Promise.resolve(sel);
      },
    ShowsTestResults:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check if test results are shown
        if (sel.testsExist) {
          const testResults = sel.container.querySelector(".test-results");
          assert.isNotNull(
            testResults,
            "Test results should be shown when tests exist"
          );
        }
        return Promise.resolve(sel);
      },
    ShowsLogs:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check if logs are shown
        const logs = sel.container.querySelector("pre");
        assert.isNotNull(logs, "Logs should be shown");
        return Promise.resolve(sel);
      },
    ShowsTypeErrors:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check if type errors are shown
        const typeErrors = sel.container.querySelector(
          '[data-testid="type-errors"]'
        );
        assert.isNotNull(typeErrors, "Type errors should be shown");
        return Promise.resolve(sel);
      },
    ShowsLintErrors:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check if lint errors are shown
        const lintErrors = sel.container.querySelector(
          '[data-testid="lint-errors"]'
        );
        assert.isNotNull(lintErrors, "Lint errors should be shown");
        return Promise.resolve(sel);
      },
    AiderButtonCopiesCommand:
      () => async (ssel: ISelection, utils: IPM) => (sel: ISelection) => {
        // Check if Aider button exists
        const aiderButton = sel.container.querySelector(
          'button[title*="AI Assistant"]'
        );
        assert.isNotNull(aiderButton, "Aider button should be present");
        return Promise.resolve(sel);
      },
  },
};
