import {
  ModalContent
} from "../../../../chunk-EIYZKF2C.mjs";
import "../../../../chunk-FNXFUNA7.mjs";
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

// src/components/pure/ModalContent.test/index.tsx
init_dirname();
init_buffer();
init_process();

// src/components/pure/ModalContent.test/implementation.tsx
init_dirname();
init_buffer();
init_process();
var implementation = {
  suites: {
    Default: "Modal Content Tests"
  },
  givens: {
    Default: () => ({
      theme: "light",
      handleThemeChange: () => {
      }
    })
  },
  whens: {},
  thens: {
    hasModalHeader: () => async ({ htmlElement }) => {
      const header = htmlElement.querySelector(".modal-header");
      assert.exists(header, "Should have Modal.Header");
      return { htmlElement };
    },
    hasThemeCards: () => async ({ htmlElement }) => {
      const themeCards = htmlElement.querySelectorAll(".theme-card");
      assert.isAtLeast(themeCards.length, 1, "Should render ThemeCard components");
      return { htmlElement };
    },
    takeScreenshot: (name) => async ({ htmlElement }, pm) => {
      const p = await pm.page();
      await pm.customScreenShot({ path: name }, p);
      return { htmlElement };
    }
  }
};

// src/components/pure/ModalContent.test/specification.ts
init_dirname();
init_buffer();
init_process();
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("ModalContent Component Tests", {
      basicRender: Given.Default(
        [
          "ModalContent should render",
          "It should contain a Modal.Header",
          "It should render the ThemeCard components"
        ],
        [],
        [
          Then.hasModalHeader(),
          Then.hasThemeCards(),
          Then.takeScreenshot("modal-content.png")
        ]
      )
    })
  ];
};

// src/components/pure/ModalContent.test/index.tsx
var import_react = __toESM(require_react(), 1);
var WrappedModalContent = (props) => /* @__PURE__ */ import_react.default.createElement(ModalContent, { ...props });
var ModalContent_default = web_default(
  implementation,
  specification,
  WrappedModalContent
);
export {
  ModalContent_default as default
};
