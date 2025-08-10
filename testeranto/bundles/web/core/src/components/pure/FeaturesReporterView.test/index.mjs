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

// src/components/pure/FeaturesReporterView.test/index.tsx
init_dirname();
init_buffer();
init_process();

// src/components/pure/FeaturesReporterView.test/implementation.tsx
init_dirname();
init_buffer();
init_process();
var mockTreeData = [
  {
    name: "project-1",
    type: "project",
    children: [
      {
        name: "src/file1.test.ts",
        type: "file",
        path: "src/file1.test.ts",
        children: [
          {
            name: "test1",
            type: "test",
            status: "passed",
            children: [
              {
                name: "given1",
                type: "given",
                status: "passed",
                children: [
                  {
                    name: "then1",
                    type: "then",
                    status: "passed"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
var implementation = {
  suites: {
    Default: "Features Reporter View Tests"
  },
  givens: {
    Default: () => ({
      treeData: mockTreeData
    }),
    WithEmptyData: () => ({
      treeData: []
    })
  },
  whens: {},
  thens: {
    hasProjectNames: () => async ({ htmlElement }) => {
      const projectNodes = htmlElement.querySelectorAll(".tree-node.project");
      assert.isAtLeast(projectNodes.length, 1, "Should show project names");
      return { htmlElement };
    },
    hasFilePaths: () => async ({ htmlElement }) => {
      const fileNodes = htmlElement.querySelectorAll(".tree-node.file");
      assert.isAtLeast(fileNodes.length, 1, "Should show file paths");
      return { htmlElement };
    },
    hasTestNames: () => async ({ htmlElement }) => {
      const testNodes = htmlElement.querySelectorAll(".tree-node.test");
      assert.isAtLeast(testNodes.length, 1, "Should show test names");
      return { htmlElement };
    },
    hasStatusBadges: () => async ({ htmlElement }) => {
      const statusBadges = htmlElement.querySelectorAll(".status-badge");
      assert.isAtLeast(statusBadges.length, 1, "Should show status badges");
      return { htmlElement };
    },
    showsEmptyMessage: () => async ({ htmlElement }) => {
      const emptyMessage = htmlElement.querySelector(".empty-message");
      assert.exists(emptyMessage, "Should show empty message");
      return { htmlElement };
    },
    takeScreenshot: (name) => async ({ htmlElement }, pm) => {
      const p = await pm.page();
      await pm.customScreenShot({ path: name }, p);
      return { htmlElement };
    }
  }
};

// src/components/pure/FeaturesReporterView.test/specification.ts
init_dirname();
init_buffer();
init_process();
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("FeaturesReporterView Component Tests", {
      basicRender: Given.Default(
        [
          "FeaturesReporterView should render",
          "It should show project names",
          "It should show file paths",
          "It should show test names",
          "It should show test statuses"
        ],
        [],
        [
          Then.hasProjectNames(),
          Then.hasFilePaths(),
          Then.hasTestNames(),
          Then.hasStatusBadges(),
          Then.takeScreenshot("features-reporter.png")
        ]
      ),
      emptyState: Given.WithEmptyData(
        [
          "FeaturesReporterView should handle empty state",
          "It should show empty message when no projects exist"
        ],
        [],
        [Then.showsEmptyMessage()]
      )
    })
  ];
};

// src/components/pure/FeaturesReporterView.tsx
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react(), 1);
var FeaturesReporterView = ({ treeData }) => {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "features-reporter" }, /* @__PURE__ */ import_react.default.createElement("h1", null, "File Structure"), /* @__PURE__ */ import_react.default.createElement("div", { className: "tree-container" }, treeData.map((project) => /* @__PURE__ */ import_react.default.createElement("div", { key: project.name, className: "project" }, /* @__PURE__ */ import_react.default.createElement("h3", null, project.name), /* @__PURE__ */ import_react.default.createElement("ul", { className: "file-tree" }, project.children?.map((file) => renderFile(file)))))));
};
function renderFile(node) {
  return /* @__PURE__ */ import_react.default.createElement("li", { key: node.name }, /* @__PURE__ */ import_react.default.createElement("span", null, node.name), node.children && /* @__PURE__ */ import_react.default.createElement("ul", null, node.children.map((child) => renderFile(child))));
}

// src/components/pure/FeaturesReporterView.test/index.tsx
var import_react2 = __toESM(require_react(), 1);
var WrappedFeaturesReporterView = (props) => /* @__PURE__ */ import_react2.default.createElement(MemoryRouter, null, /* @__PURE__ */ import_react2.default.createElement(FeaturesReporterView, { ...props }));
var FeaturesReporterView_default = web_default(
  implementation,
  specification,
  WrappedFeaturesReporterView
);
export {
  FeaturesReporterView_default as default
};
