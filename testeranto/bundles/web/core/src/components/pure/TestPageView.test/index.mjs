import {
  NavBar,
  TestStatusBadge
} from "../../../../chunk-BADF3AZF.mjs";
import {
  Alert_default,
  Button_default,
  Col_default,
  Container_default,
  Nav_default,
  Row_default,
  require_react_dom
} from "../../../../chunk-FNXFUNA7.mjs";
import {
  MemoryRouter
} from "../../../../chunk-QWII7WIM.mjs";
import {
  assert,
  require_react
} from "../../../../chunk-BXV27S2S.mjs";
import {
  Web_default,
  __commonJS,
  __toESM,
  init_buffer,
  init_dirname,
  init_process
} from "../../../../chunk-LU364HVS.mjs";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    init_dirname();
    init_buffer();
    init_process();
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// src/components/pure/TestPageView.test/index.tsx
init_dirname();
init_buffer();
init_process();

// ../testeranto-react/src/react-dom/jsx/web.ts
init_dirname();
init_buffer();
init_process();

// ../testeranto-react/src/react-dom/jsx/dynamic.ts
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react());
var adapter = (testInput) => {
  return {
    beforeAll: async (prototype, artificer) => {
      return await new Promise((resolve, rej) => {
        resolve(null);
      });
    },
    beforeEach: async () => {
      return new Promise((resolve, rej) => {
        resolve((0, import_react.createElement)(testInput));
      });
    },
    andWhen: async function(s, whenCB) {
      return s;
    },
    butThen: async function(s) {
      return s;
    },
    afterEach: async function(store, ndx, artificer) {
      return {};
    },
    afterAll: (store, artificer) => {
      return;
    }
  };
};

// ../testeranto-react/src/react-dom/jsx/web.ts
var web_default = (testImplementations, testSpecifications, testInput) => {
  const t = Web_default(
    testInput,
    testSpecifications,
    testImplementations,
    adapter(testInput)
  );
  return t;
};

// src/components/pure/TestPageView.test/implementation.ts
init_dirname();
init_buffer();
init_process();
var React = __toESM(require_react(), 1);
var ReactDom = __toESM(require_client(), 1);
var mockTestData = {
  name: "Test Suite",
  givens: [
    {
      name: "Given Scenario",
      whens: [{ name: "When Action" }],
      thens: [{ name: "Then Assertion" }]
    }
  ]
};
var implementation = {
  suites: {
    Default: "TestPageView basic rendering",
    Navigation: "TestPageView navigation behavior",
    ErrorStates: "TestPageView error handling"
  },
  givens: {
    Default: () => ({
      route: "results",
      setRoute: () => {
      },
      navigate: () => {
      },
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
        runTimeErrors: 0,
        // BDD test failures
        typeErrors: 0,
        // Type checker errors
        staticErrors: 0
        // Linter errors
      }
    }),
    WithErrors: () => ({
      route: "results",
      setRoute: () => {
      },
      navigate: () => {
      },
      projectName: "test-project",
      testName: "test-suite.test.ts",
      decodedTestPath: "test-suite",
      runtime: "node",
      testData: null,
      // Missing tests.json indicates BDD failure
      logs: void 0,
      typeErrors: "Type error message",
      // Only shown if tests.json exists
      lintErrors: "Lint error message",
      // Only shown if tests.json exists
      testsExist: false,
      errorCounts: {
        runTimeErrors: 1,
        // Highest priority - BDD failed
        typeErrors: 2,
        // Secondary - type errors
        staticErrors: 3
        // Lowest priority - linter errors
      }
    }),
    WithLogs: () => ({
      route: "logs",
      setRoute: () => {
      },
      navigate: () => {
      },
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
        staticErrors: 0
      }
    })
  },
  whens: {
    SwitchToTab: (tabName) => (selection) => {
      selection.reactElement = React.cloneElement(selection.reactElement, {
        route: tabName
      });
      ReactDom.createRoot(selection.domRoot).render(selection.reactElement);
      return selection;
    },
    ClickAiderButton: () => (selection) => {
      const button = selection.container.querySelector(
        'button[aria-label="Aider"]'
      );
      if (button) {
        button.click();
      }
      return selection;
    }
  },
  thens: {
    takeScreenshot: (name) => async ({ htmlElement }, pm) => {
      const p = await pm.page();
      await pm.customScreenShot({ path: name }, p);
      return { htmlElement };
    },
    RendersNavBar: () => async (selection) => {
      const navBar = selection.container.querySelector(".navbar");
      assert.isNotNull(navBar);
      return selection;
    },
    ShowsActiveTab: (tabName) => async (selection) => {
      const activeTab = selection.container.querySelector(".tab-pane.active");
      assert.include(activeTab?.textContent, tabName);
      return selection;
    },
    ShowsErrorCounts: () => async (selection) => {
      const badges = selection.container.querySelectorAll(".badge");
      if (!selection.testsExist) {
        assert.isAbove(badges.length, 0);
        const bddBadge = selection.container.querySelector(".badge.bg-danger");
        assert.isNotNull(bddBadge);
      } else if (selection.errorCounts.typeErrors > 0) {
        const typeBadge = selection.container.querySelector(".badge.bg-warning");
        assert.isNotNull(typeBadge);
      } else if (selection.errorCounts.staticErrors > 0) {
        const lintBadge = selection.container.querySelector(".badge.bg-info");
        assert.isNotNull(lintBadge);
      }
      return selection;
    },
    ShowsTestResults: () => async (selection) => {
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
          writeText: jest.fn().mockResolvedValue(void 0)
        }
      });
      await implementation.whens.ClickAiderButton()(selection);
      assert.isTrue(navigator.clipboard.writeText.called);
      return selection;
    }
  }
};

// src/components/pure/TestPageView.test/specification.ts
init_dirname();
init_buffer();
init_process();
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("TestPageView basic rendering", {
      "renders navigation bar": Given.Default([], [], [Then.RendersNavBar()]),
      "shows error counts": Given.Default([], [], [Then.ShowsErrorCounts()]),
      "shows test results when data exists": Given.Default(
        [],
        [],
        [Then.takeScreenshot("shot.png"), Then.ShowsTestResults()]
      )
    }),
    Suite.Navigation("TestPageView navigation behavior", {
      "shows results tab by default": Given.Default(
        [],
        [],
        [Then.ShowsActiveTab("results")]
      ),
      "switches to logs tab": Given.Default(
        [],
        [When.SwitchToTab("logs")],
        [Then.ShowsActiveTab("logs"), Then.ShowsLogs()]
      ),
      "copies aider command when button clicked": Given.Default(
        [],
        [When.ClickAiderButton()],
        [Then.AiderButtonCopiesCommand()]
      )
    }),
    Suite.ErrorStates("TestPageView error handling", {
      "shows error state when tests fail": Given.WithErrors(
        [],
        [],
        [
          Then.ShowsErrorCounts(),
          Then.ShowsTypeErrors(),
          Then.ShowsLintErrors()
        ]
      ),
      "shows logs when available": Given.WithLogs([], [], [Then.ShowsLogs()])
    })
  ];
};

// src/components/pure/TestPageView.tsx
init_dirname();
init_buffer();
init_process();
var import_react2 = __toESM(require_react(), 1);
var TestPageView = ({
  projectName,
  testName,
  decodedTestPath,
  runtime,
  testsExist,
  errorCounts,
  logs
}) => {
  const [activeTab, setActiveTab] = import_react2.default.useState("tests.json");
  const renderTestResults = (testData) => {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "test-results" }, testData.givens.map((given, i) => /* @__PURE__ */ import_react2.default.createElement("div", { key: i, className: "mb-4 card" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "card-header bg-primary text-white" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "d-flex justify-content-between align-items-center" }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("h4", null, "Given: ", given.name), given.features && given.features.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "mt-1" }, /* @__PURE__ */ import_react2.default.createElement("small", null, "Features:"), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => /* @__PURE__ */ import_react2.default.createElement("li", { key: fi }, feature.startsWith("http") ? /* @__PURE__ */ import_react2.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname) : /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-white" }, feature)))))), given.artifacts && given.artifacts.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "dropdown" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        className: "btn btn-sm btn-light dropdown-toggle",
        type: "button",
        "data-bs-toggle": "dropdown"
      },
      "Artifacts (",
      given.artifacts.length,
      ")"
    ), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => /* @__PURE__ */ import_react2.default.createElement("li", { key: ai }, /* @__PURE__ */ import_react2.default.createElement(
      "a",
      {
        className: "dropdown-item",
        href: `reports/${projectName}/${testName.split(".").slice(0, -1).join(".")}/${runtime}/${artifact}`,
        target: "_blank",
        rel: "noopener noreferrer"
      },
      artifact.split("/").pop()
    ))))))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "card-body" }, given.whens.map((when, j) => /* @__PURE__ */ import_react2.default.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? "bg-danger text-white" : "bg-success text-white"}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "d-flex justify-content-between align-items-start" }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("strong", null, "When:"), " ", when.name, when.features && when.features.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "mt-2" }, /* @__PURE__ */ import_react2.default.createElement("small", null, "Features:"), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => /* @__PURE__ */ import_react2.default.createElement("li", { key: fi }, feature.startsWith("http") ? /* @__PURE__ */ import_react2.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname) : feature)))), when.error && /* @__PURE__ */ import_react2.default.createElement("pre", { className: "mt-2" }, when.error))), when.artifacts && when.artifacts.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "ms-3" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, "Artifacts:"), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => /* @__PURE__ */ import_react2.default.createElement("li", { key: ai }, /* @__PURE__ */ import_react2.default.createElement(
      "a",
      {
        href: `reports/${projectName}/${testName.split(".").slice(0, -1).join(".")}/${runtime}/${artifact}`,
        target: "_blank",
        className: "text-white",
        rel: "noopener noreferrer"
      },
      artifact.split("/").pop()
    )))))))), given.thens.map((then, k) => /* @__PURE__ */ import_react2.default.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? "bg-danger text-white" : "bg-success text-white"}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "d-flex justify-content-between align-items-start" }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("strong", null, "Then:"), " ", then.name, then.features && then.features.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "mt-2" }, /* @__PURE__ */ import_react2.default.createElement("small", null, "Features:"), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => /* @__PURE__ */ import_react2.default.createElement("li", { key: fi }, feature.startsWith("http") ? /* @__PURE__ */ import_react2.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname) : feature)))), then.error && /* @__PURE__ */ import_react2.default.createElement("pre", { className: "mt-2" }, then.error))), then.artifacts && then.artifacts.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "ms-3" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, "Artifacts:"), /* @__PURE__ */ import_react2.default.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => /* @__PURE__ */ import_react2.default.createElement("li", { key: ai }, /* @__PURE__ */ import_react2.default.createElement(
      "a",
      {
        href: `reports/${projectName}/${testName.split(".").slice(0, -1).join(".")}/${runtime}/${artifact}`,
        target: "_blank",
        className: "text-white",
        rel: "noopener noreferrer"
      },
      artifact.split("/").pop()
    ))))))))))));
  };
  return /* @__PURE__ */ import_react2.default.createElement(Container_default, { fluid: true, className: "px-0" }, /* @__PURE__ */ import_react2.default.createElement(
    NavBar,
    {
      title: decodedTestPath,
      backLink: `/projects/${projectName}`,
      navItems: [
        {
          label: "",
          badge: {
            variant: runtime === "node" ? "primary" : runtime === "web" ? "success" : "info",
            text: runtime
          },
          className: "pe-none d-flex align-items-center gap-2"
        }
      ],
      rightContent: /* @__PURE__ */ import_react2.default.createElement(
        Button_default,
        {
          variant: "info",
          onClick: async () => {
            try {
              const promptPath = `testeranto/reports/${projectName}/${testName.split(".").slice(0, -1).join(".")}/${runtime}/prompt.txt`;
              const messagePath = `testeranto/reports/${projectName}/${testName.split(".").slice(0, -1).join(".")}/${runtime}/message.txt`;
              const command = `aider --load ${promptPath} --message-file ${messagePath}`;
              await navigator.clipboard.writeText(command);
              alert("Copied aider command to clipboard!");
            } catch (err) {
              alert("Failed to copy command to clipboard");
              console.error("Copy failed:", err);
            }
          },
          className: "ms-2"
        },
        "\u{1F916}"
      )
    }
  ), /* @__PURE__ */ import_react2.default.createElement(Row_default, { className: "g-0" }, /* @__PURE__ */ import_react2.default.createElement(Col_default, { sm: 3, className: "border-end" }, /* @__PURE__ */ import_react2.default.createElement(Nav_default, { variant: "pills", className: "flex-column" }, Object.keys(logs).map((logName) => {
    const displayName = logName.replace(".json", "").replace(/_/g, " ");
    let statusIndicator = null;
    if (logName === "type_errors.txt" && errorCounts.typeErrors > 0) {
      statusIndicator = /* @__PURE__ */ import_react2.default.createElement("span", { className: "ms-1" }, "\u274C ", errorCounts.typeErrors);
    } else if (logName === "lint_errors.txt" && errorCounts.staticErrors > 0) {
      statusIndicator = /* @__PURE__ */ import_react2.default.createElement("span", { className: "ms-1" }, "\u274C ", errorCounts.staticErrors);
    } else if (logName === "stderr.log" && errorCounts.runTimeErrors > 0) {
      statusIndicator = /* @__PURE__ */ import_react2.default.createElement("span", { className: "ms-1" }, "\u274C ", errorCounts.runTimeErrors);
    } else if (logName === "exit.log" && logs["exit.log"]?.trim() !== "0") {
      statusIndicator = /* @__PURE__ */ import_react2.default.createElement("span", { className: "ms-1" }, "\u26A0\uFE0F");
    } else if (logName === "tests.json" && logs["tests.json"]) {
      statusIndicator = /* @__PURE__ */ import_react2.default.createElement("div", { className: "ms-1" }, /* @__PURE__ */ import_react2.default.createElement(
        TestStatusBadge,
        {
          testName: decodedTestPath,
          testsExist,
          runTimeErrors: errorCounts.runTimeErrors,
          typeErrors: errorCounts.typeErrors,
          staticErrors: errorCounts.staticErrors,
          variant: "compact",
          className: "mt-1"
        }
      ));
    }
    return /* @__PURE__ */ import_react2.default.createElement(Nav_default.Item, { key: logName }, /* @__PURE__ */ import_react2.default.createElement(
      Nav_default.Link,
      {
        eventKey: logName,
        active: activeTab === logName,
        onClick: () => setActiveTab(logName),
        className: "d-flex flex-column align-items-start"
      },
      /* @__PURE__ */ import_react2.default.createElement("div", { className: "d-flex justify-content-between w-100" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-capitalize" }, displayName), statusIndicator)
    ));
  }))), /* @__PURE__ */ import_react2.default.createElement(Col_default, { sm: 9 }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "p-3" }, !testsExist && activeTab === "tests.json" ? /* @__PURE__ */ import_react2.default.createElement(Alert_default, { variant: "danger" }, /* @__PURE__ */ import_react2.default.createElement("h4", null, "Tests did not run to completion"), /* @__PURE__ */ import_react2.default.createElement("p", null, "The test results file (tests.json) was not found or could not be loaded.")) : activeTab === "tests.json" && logs["tests.json"] ? typeof logs["tests.json"] === "string" ? renderTestResults(JSON.parse(logs["tests.json"])) : renderTestResults(logs["tests.json"]) : logs[activeTab] ? /* @__PURE__ */ import_react2.default.createElement("pre", { className: "bg-dark text-white p-3" }, /* @__PURE__ */ import_react2.default.createElement("code", null, typeof logs[activeTab] === "string" ? logs[activeTab] : JSON.stringify(logs[activeTab], null, 2))) : /* @__PURE__ */ import_react2.default.createElement(Alert_default, { variant: "info" }, "No content available for this log")))));
};

// src/components/pure/TestPageView.test/index.tsx
var import_react3 = __toESM(require_react(), 1);
var WrappedTestPageView = (props) => /* @__PURE__ */ import_react3.default.createElement(MemoryRouter, null, /* @__PURE__ */ import_react3.default.createElement(TestPageView, { ...props }));
var TestPageView_default = web_default(
  implementation,
  specification,
  WrappedTestPageView
);
export {
  TestPageView_default as default
};
