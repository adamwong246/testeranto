import {
  NavBar,
  TestStatusBadge
} from "../../../../chunk-BADF3AZF.mjs";
import {
  Alert_default,
  Badge_default,
  Card_default,
  Col_default,
  Container_default,
  ListGroup_default,
  Nav_default,
  Row_default,
  Tab_default,
  Table_default
} from "../../../../chunk-FNXFUNA7.mjs";
import {
  MemoryRouter
} from "../../../../chunk-QWII7WIM.mjs";
import {
  web_default
} from "../../../../chunk-VAYOSMXI.mjs";
import {
  assert,
  require_react
} from "../../../../chunk-BXV27S2S.mjs";
import {
  __toESM,
  init_buffer,
  init_dirname,
  init_process
} from "../../../../chunk-LU364HVS.mjs";

// src/components/pure/ProjectPageView.test/index.tsx
init_dirname();
init_buffer();
init_process();

// src/components/pure/ProjectPageView.test/implementation.tsx
init_dirname();
init_buffer();
init_process();
var implementation = {
  suites: {
    Default: "Project Page View Tests"
  },
  givens: {
    Default: () => ({
      summary: {
        "test-suite-1": {
          testsExist: true,
          runTimeErrors: 0,
          typeErrors: 2,
          staticErrors: 1
        },
        "test-suite-2": {
          testsExist: true,
          runTimeErrors: 1,
          typeErrors: 0,
          staticErrors: 0
        }
      },
      nodeLogs: {
        errors: [],
        warnings: [
          {
            text: "Unused variable",
            location: { file: "src/file1.ts", line: 10 },
            pluginName: "typescript"
          }
        ],
        metafile: {
          inputs: {
            "src/file1.ts": { bytes: 1024 },
            "src/file2.ts": { bytes: 2048 }
          },
          outputs: {
            "dist/file1.js": { bytes: 1536, entryPoint: true },
            "dist/file2.js": { bytes: 2560 }
          }
        }
      },
      webLogs: {
        errors: [],
        warnings: [],
        metafile: {
          inputs: {
            "src/file1.ts": { bytes: 1024 },
            "src/file2.ts": { bytes: 2048 }
          },
          outputs: {
            "dist/file1.js": { bytes: 1536, entryPoint: true },
            "dist/file2.js": { bytes: 2560 }
          }
        }
      },
      pureLogs: {
        errors: [
          {
            text: "Syntax error",
            location: { file: "src/file3.ts", line: 5 },
            pluginName: "typescript"
          }
        ],
        warnings: [],
        metafile: {
          inputs: {
            "src/file3.ts": { bytes: 512 },
            "src/file4.ts": { bytes: 768 }
          },
          outputs: {
            "dist/file3.js": { bytes: 1024, entryPoint: true },
            "dist/file4.js": { bytes: 1280 }
          }
        }
      },
      config: {
        tests: [
          ["test-suite-1", "node"],
          ["test-suite-2", "web"]
        ]
      },
      loading: false,
      error: null,
      projectName: "test-project",
      route: "tests",
      setRoute: () => {
      },
      navigate: () => {
      }
    }),
    WithError: () => ({
      summary: null,
      nodeLogs: null,
      webLogs: null,
      pureLogs: null,
      config: { tests: [] },
      loading: false,
      error: "Test error message",
      projectName: "test-project",
      route: "tests",
      setRoute: () => {
      },
      navigate: () => {
      }
    })
  },
  whens: {},
  thens: {
    hasContainerFluid: () => async ({ htmlElement }) => {
      const container = htmlElement.querySelector(".container-fluid");
      assert.exists(container, "Should have container-fluid div");
      return { htmlElement };
    },
    hasNavBar: () => async ({ htmlElement }) => {
      const navBar = htmlElement.querySelector("nav.navbar");
      assert.exists(navBar, "Should render NavBar component");
      return { htmlElement };
    },
    hasNavBarTitle: () => async ({ htmlElement }) => {
      const navBarTitle = htmlElement.querySelector("nav.navbar .navbar-brand")?.textContent;
      assert.isNotEmpty(navBarTitle, "NavBar should have title");
      return { htmlElement };
    },
    hasTestTable: () => async ({ htmlElement }) => {
      const testTable = htmlElement.querySelector("table");
      assert.exists(testTable, "Should render test table");
      return { htmlElement };
    },
    rendersTestSuite1: () => async ({ htmlElement }) => {
      const testTable = htmlElement.querySelector("table");
      const testNames = Array.from(testTable.querySelectorAll("tbody tr td:first-child")).map((el) => el.textContent);
      assert.include(testNames, "test-suite-1", "Should render test-suite-1");
      return { htmlElement };
    },
    rendersTestSuite2: () => async ({ htmlElement }) => {
      const testTable = htmlElement.querySelector("table");
      const testNames = Array.from(testTable.querySelectorAll("tbody tr td:first-child")).map((el) => el.textContent);
      assert.include(testNames, "test-suite-2", "Should render test-suite-2");
      return { htmlElement };
    },
    unhappyPath: () => async ({ htmlElement }) => {
      const errorAlert = htmlElement.querySelector(".alert-danger");
      assert.exists(errorAlert, "Should show error alert");
      const errorText = errorAlert?.textContent;
      assert.include(errorText, "Test error message", "Should display error message");
      return { htmlElement };
    },
    takeScreenshot: (name) => async ({ htmlElement }, pm) => {
      const p = await pm.page();
      await pm.customScreenShot({ path: name }, p);
      return { htmlElement };
    }
  }
};

// src/components/pure/ProjectPageView.test/specification.ts
init_dirname();
init_buffer();
init_process();
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("ProjectPageView Component Tests", {
      basicRender: Given.Default(
        [
          "ProjectPageView should render",
          "It should contain a container-fluid div",
          "It should render the NavBar component",
          "NavBar should display project title",
          "It should render test results table",
          "It should display test-suite-1 results",
          "It should display test-suite-2 results"
        ],
        [],
        [
          Then.hasContainerFluid(),
          Then.hasNavBar(),
          Then.hasNavBarTitle(),
          Then.hasTestTable(),
          Then.rendersTestSuite1(),
          Then.rendersTestSuite2(),
          Then.takeScreenshot("happy-state.png")
        ]
      ),
      errorHandling: Given.WithError(
        [
          "ProjectPageView should handle errors",
          "It should display error messages when present",
          "It should capture screenshots of error state"
        ],
        [],
        [Then.unhappyPath(), Then.takeScreenshot("error-state.png")]
      )
    })
  ];
};

// src/components/pure/ProjectPageView.tsx
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react(), 1);
var BuildLogViewer = ({ logs, runtime }) => {
  if (!logs)
    return /* @__PURE__ */ import_react.default.createElement(Alert_default, { variant: "info" }, "Loading ", runtime.toLowerCase(), " build logs...");
  const hasErrors = logs.errors?.length > 0;
  const hasWarnings = logs.warnings?.length > 0;
  const [activeTab, setActiveTab] = import_react.default.useState("summary");
  return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(Tab_default.Container, { activeKey: activeTab, onSelect: (k) => setActiveTab(k || "summary") }, /* @__PURE__ */ import_react.default.createElement(Nav_default, { variant: "tabs", className: "mb-3" }, /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(Nav_default.Link, { eventKey: "summary" }, "Build Summary")), /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(Nav_default.Link, { eventKey: "warnings" }, hasWarnings ? `\u26A0\uFE0F Warnings (${logs.warnings.length})` : "Warnings")), /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(Nav_default.Link, { eventKey: "errors" }, hasErrors ? `\u274C Errors (${logs.errors.length})` : "Errors"))), /* @__PURE__ */ import_react.default.createElement(Tab_default.Content, null, /* @__PURE__ */ import_react.default.createElement(Tab_default.Pane, { eventKey: "summary" }, /* @__PURE__ */ import_react.default.createElement(Card_default, null, /* @__PURE__ */ import_react.default.createElement(Card_default.Header, { className: "d-flex justify-content-between align-items-center" }, /* @__PURE__ */ import_react.default.createElement("h5", null, "Build Summary"), /* @__PURE__ */ import_react.default.createElement("div", null, hasErrors && /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "danger", className: "me-2" }, logs.errors.length, " Error", logs.errors.length !== 1 ? "s" : ""), hasWarnings && /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "warning", text: "dark" }, logs.warnings.length, " Warning", logs.warnings.length !== 1 ? "s" : ""), !hasErrors && !hasWarnings && /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "success" }, "Build Successful"))), /* @__PURE__ */ import_react.default.createElement(Card_default.Body, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "mb-3" }, /* @__PURE__ */ import_react.default.createElement("h6", null, "Input Files (", Object.keys(logs.metafile?.inputs || {}).length, ")"), /* @__PURE__ */ import_react.default.createElement(ListGroup_default, { className: "max-h-200 overflow-auto" }, Object.keys(logs.metafile?.inputs || {}).map((file) => /* @__PURE__ */ import_react.default.createElement(ListGroup_default.Item, { key: file, className: "py-2" }, /* @__PURE__ */ import_react.default.createElement("code", null, file), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-muted small" }, logs.metafile.inputs[file].bytes, " bytes"))))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h6", null, "Output Files (", Object.keys(logs.metafile?.outputs || {}).length, ")"), /* @__PURE__ */ import_react.default.createElement(ListGroup_default, { className: "max-h-200 overflow-auto" }, Object.keys(logs.metafile?.outputs || {}).map((file) => /* @__PURE__ */ import_react.default.createElement(ListGroup_default.Item, { key: file, className: "py-2" }, /* @__PURE__ */ import_react.default.createElement("code", null, file), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-muted small" }, logs.metafile.outputs[file].bytes, " bytes", logs.metafile.outputs[file].entryPoint && /* @__PURE__ */ import_react.default.createElement("span", { className: "ms-2 badge bg-info" }, "Entry Point"))))))))), /* @__PURE__ */ import_react.default.createElement(Tab_default.Pane, { eventKey: "warnings" }, hasWarnings ? /* @__PURE__ */ import_react.default.createElement(Card_default, { className: "border-warning" }, /* @__PURE__ */ import_react.default.createElement(Card_default.Header, { className: "bg-warning text-white d-flex justify-content-between align-items-center" }, /* @__PURE__ */ import_react.default.createElement("span", null, "Build Warnings (", logs.warnings.length, ")"), /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "light", text: "dark" }, (/* @__PURE__ */ new Date()).toLocaleString())), /* @__PURE__ */ import_react.default.createElement(Card_default.Body, { className: "p-0" }, /* @__PURE__ */ import_react.default.createElement(ListGroup_default, { variant: "flush" }, logs.warnings.map((warn, i) => /* @__PURE__ */ import_react.default.createElement(ListGroup_default.Item, { key: i, className: "text-warning" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "d-flex justify-content-between" }, /* @__PURE__ */ import_react.default.createElement("strong", null, warn.location?.file || "Unknown file", warn.location?.line && `:${warn.location.line}`), /* @__PURE__ */ import_react.default.createElement("small", { className: "text-muted" }, warn.pluginName ? `[${warn.pluginName}]` : "")), /* @__PURE__ */ import_react.default.createElement("div", { className: "mt-1" }, /* @__PURE__ */ import_react.default.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(warn)))))))) : /* @__PURE__ */ import_react.default.createElement(Alert_default, { variant: "info" }, "No warnings found")), /* @__PURE__ */ import_react.default.createElement(Tab_default.Pane, { eventKey: "errors" }, hasErrors ? /* @__PURE__ */ import_react.default.createElement(Card_default, { className: "border-danger" }, /* @__PURE__ */ import_react.default.createElement(Card_default.Header, { className: "bg-danger text-white d-flex justify-content-between align-items-center" }, /* @__PURE__ */ import_react.default.createElement("span", null, "Build Errors (", logs.errors.length, ")"), /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "light", text: "dark" }, (/* @__PURE__ */ new Date()).toLocaleString())), /* @__PURE__ */ import_react.default.createElement(Card_default.Body, { className: "p-0" }, /* @__PURE__ */ import_react.default.createElement(ListGroup_default, { variant: "flush" }, logs.errors.map((err, i) => /* @__PURE__ */ import_react.default.createElement(ListGroup_default.Item, { key: i, className: "text-danger" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "d-flex justify-content-between" }, /* @__PURE__ */ import_react.default.createElement("strong", null, err.location?.file || "Unknown file", err.location?.line && `:${err.location.line}`), /* @__PURE__ */ import_react.default.createElement("small", { className: "text-muted" }, err.pluginName ? `[${err.pluginName}]` : "")), /* @__PURE__ */ import_react.default.createElement("div", { className: "mt-1" }, /* @__PURE__ */ import_react.default.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(err)))))))) : /* @__PURE__ */ import_react.default.createElement(Alert_default, { variant: "success" }, /* @__PURE__ */ import_react.default.createElement("h5", null, "No Errors Found"), /* @__PURE__ */ import_react.default.createElement("p", { className: "mb-0" }, "The build completed without any errors."))))));
};
var ProjectPageView = ({
  summary,
  nodeLogs,
  webLogs,
  pureLogs,
  config,
  loading,
  error,
  projectName,
  activeTab,
  setActiveTab
}) => {
  if (loading)
    return /* @__PURE__ */ import_react.default.createElement("div", null, "Loading project data...");
  if (error)
    return /* @__PURE__ */ import_react.default.createElement(Alert_default, { variant: "danger" }, "Error: ", error);
  if (!summary)
    return /* @__PURE__ */ import_react.default.createElement(Alert_default, { variant: "warning" }, "No data found for project");
  const testStatuses = Object.entries(summary).map(([testName, testData]) => {
    const runTime = config.tests?.find((t) => t[0] === testName)?.[1] || "node";
    return {
      testName,
      testsExist: testData.testsExist !== false,
      runTimeErrors: Number(testData.runTimeErrors) || 0,
      typeErrors: Number(testData.typeErrors) || 0,
      staticErrors: Number(testData.staticErrors) || 0,
      runTime
    };
  });
  return /* @__PURE__ */ import_react.default.createElement(Container_default, { fluid: true }, /* @__PURE__ */ import_react.default.createElement(
    NavBar,
    {
      title: projectName,
      backLink: "/"
    }
  ), /* @__PURE__ */ import_react.default.createElement(Row_default, { className: "g-0" }, /* @__PURE__ */ import_react.default.createElement(Col_default, { sm: 3, className: "border-end" }, /* @__PURE__ */ import_react.default.createElement(Nav_default, { variant: "pills", className: "flex-column" }, /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(
    Nav_default.Link,
    {
      active: activeTab === "tests",
      onClick: () => setActiveTab("tests"),
      className: "d-flex flex-column align-items-start"
    },
    /* @__PURE__ */ import_react.default.createElement("div", { className: "d-flex justify-content-between w-100" }, /* @__PURE__ */ import_react.default.createElement("span", null, "Tests"), testStatuses.some((t) => t.runTimeErrors > 0) ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "danger" }, "\u274C") : testStatuses.some((t) => t.typeErrors > 0 || t.staticErrors > 0) ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "warning", text: "dark" }, "\u26A0\uFE0F") : /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "success" }, "\u2713"))
  )), /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(
    Nav_default.Link,
    {
      active: activeTab === "node",
      onClick: () => setActiveTab("node"),
      className: "d-flex justify-content-between align-items-center"
    },
    "Node build logs",
    nodeLogs?.errors?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "danger" }, "\u274C ", nodeLogs.errors.length) : nodeLogs?.warnings?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "warning", text: "dark" }, "\u26A0\uFE0F") : null
  )), /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(
    Nav_default.Link,
    {
      active: activeTab === "web",
      onClick: () => setActiveTab("web"),
      className: "d-flex justify-content-between align-items-center"
    },
    "Web build logs",
    webLogs?.errors?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "danger" }, "\u274C ", webLogs.errors.length) : webLogs?.warnings?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "warning", text: "dark" }, "\u26A0\uFE0F") : null
  )), /* @__PURE__ */ import_react.default.createElement(Nav_default.Item, null, /* @__PURE__ */ import_react.default.createElement(
    Nav_default.Link,
    {
      active: activeTab === "pure",
      onClick: () => setActiveTab("pure"),
      className: "d-flex justify-content-between align-items-center"
    },
    "Pure build logs",
    pureLogs?.errors?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "danger" }, "\u274C ", pureLogs.errors.length) : pureLogs?.warnings?.length ? /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "warning", text: "dark" }, "\u26A0\uFE0F") : null
  )))), /* @__PURE__ */ import_react.default.createElement(Col_default, { sm: 9 }, /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3" }, activeTab === "tests" ? /* @__PURE__ */ import_react.default.createElement(Table_default, { striped: true, bordered: true, hover: true }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("th", null, "Test"), /* @__PURE__ */ import_react.default.createElement("th", null, "Runtime"), /* @__PURE__ */ import_react.default.createElement("th", null, "Status"), /* @__PURE__ */ import_react.default.createElement("th", null, "Type Errors"), /* @__PURE__ */ import_react.default.createElement("th", null, "Lint Errors"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, testStatuses.map((test) => /* @__PURE__ */ import_react.default.createElement("tr", { key: test.testName, "data-testid": `test-row-${test.testName}` }, /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}` }, test.testName)), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: "secondary", className: "ms-2" }, test.runTime)), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement(
    TestStatusBadge,
    {
      testName: test.testName,
      testsExist: test.testsExist,
      runTimeErrors: test.runTimeErrors,
      typeErrors: test.typeErrors,
      staticErrors: test.staticErrors
    }
  )), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types` }, test.typeErrors > 0 ? `\u274C ${test.typeErrors}` : "\u2705")), /* @__PURE__ */ import_react.default.createElement("td", null, /* @__PURE__ */ import_react.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint` }, test.staticErrors > 0 ? `\u274C ${test.staticErrors}` : "\u2705")))))) : activeTab === "node" ? /* @__PURE__ */ import_react.default.createElement(BuildLogViewer, { logs: nodeLogs, runtime: "Node" }) : activeTab === "web" ? /* @__PURE__ */ import_react.default.createElement(BuildLogViewer, { logs: webLogs, runtime: "Web" }) : activeTab === "pure" ? /* @__PURE__ */ import_react.default.createElement(BuildLogViewer, { logs: pureLogs, runtime: "Pure" }) : null))));
};

// src/components/pure/ProjectPageView.test/index.tsx
var import_react2 = __toESM(require_react(), 1);
var WrappedProjectPageView = (props) => /* @__PURE__ */ import_react2.default.createElement(MemoryRouter, null, /* @__PURE__ */ import_react2.default.createElement(ProjectPageView, { ...props }, " "));
var ProjectPageView_default = web_default(
  implementation,
  specification,
  WrappedProjectPageView
);
export {
  ProjectPageView_default as default
};
