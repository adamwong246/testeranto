import {
  Badge_default,
  Container_default,
  Nav_default,
  Navbar_default
} from "./chunk-FNXFUNA7.mjs";
import {
  Link
} from "./chunk-QWII7WIM.mjs";
import {
  require_react
} from "./chunk-BXV27S2S.mjs";
import {
  __toESM,
  init_buffer,
  init_dirname,
  init_process
} from "./chunk-LU364HVS.mjs";

// src/components/pure/NavBar.tsx
init_dirname();
init_buffer();
init_process();
var import_react = __toESM(require_react(), 1);
var NavBar = ({
  title,
  backLink,
  navItems = [],
  rightContent
}) => {
  return /* @__PURE__ */ import_react.default.createElement(Navbar_default, { bg: "light", expand: "lg", className: "mb-4", sticky: "top" }, /* @__PURE__ */ import_react.default.createElement(Container_default, { fluid: true }, backLink && /* @__PURE__ */ import_react.default.createElement(
    Nav_default.Link,
    {
      as: Link,
      to: backLink,
      className: "me-2 fs-3 text-primary",
      style: {
        padding: "0.25rem 0.75rem",
        border: "2px solid var(--bs-primary)",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem"
      },
      title: "Go up one level"
    },
    "\u2191"
  ), /* @__PURE__ */ import_react.default.createElement(Navbar_default.Brand, { className: backLink ? "ms-2" : "" }, title), /* @__PURE__ */ import_react.default.createElement(Navbar_default.Toggle, { "aria-controls": "basic-navbar-nav" }), /* @__PURE__ */ import_react.default.createElement(Navbar_default.Collapse, { id: "basic-navbar-nav" }, navItems.length > 0 && /* @__PURE__ */ import_react.default.createElement(Nav_default, { className: "me-auto" }, navItems.map((item, i) => {
    const className = [
      item.className,
      item.active ? "text-primary fw-bold border-bottom border-2 border-primary" : "",
      typeof item.label === "string" && item.label.includes("\u274C") ? "text-danger fw-bold" : "",
      typeof item.label === "string" && item.label.includes("\u2705") ? "text-success fw-bold" : "",
      !item.active && typeof item.label !== "string" ? "text-secondary" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ import_react.default.createElement(
      Nav_default.Link,
      {
        key: i,
        as: item.to ? Link : "div",
        to: item.to,
        active: item.active,
        className,
        style: {
          ":hover": {
            color: "var(--bs-primary)",
            textDecoration: "none"
          }
        }
      },
      item.label,
      item.badge && /* @__PURE__ */ import_react.default.createElement(Badge_default, { bg: item.badge.variant, className: "ms-2" }, item.badge.text)
    );
  })), rightContent && /* @__PURE__ */ import_react.default.createElement(Nav_default, null, rightContent))));
};

// src/components/TestStatusBadge.tsx
init_dirname();
init_buffer();
init_process();
var import_react2 = __toESM(require_react(), 1);
var TestStatusBadge = (props) => {
  const hasTests = props.testsExist !== false;
  const testCompleted = props.runTimeErrors !== -1;
  const hasRuntimeErrors = props.runTimeErrors > 0;
  let bddStatus;
  if (!hasTests) {
    bddStatus = { text: "\u274C No Tests", variant: "danger" };
  } else if (!testCompleted) {
    bddStatus = { text: "\u274C No Tests", variant: "danger" };
  } else if (hasRuntimeErrors) {
    bddStatus = { text: `\u274C BDD (${props.runTimeErrors})`, variant: "danger" };
  } else {
    bddStatus = { text: "\u2705 BDD", variant: "success" };
  }
  if (props.variant === "compact") {
    console.groupEnd();
    return /* @__PURE__ */ import_react2.default.createElement(Badge_default, { bg: bddStatus.variant }, bddStatus.text);
  }
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "d-flex gap-2" }, /* @__PURE__ */ import_react2.default.createElement(Badge_default, { bg: bddStatus.variant }, bddStatus.text));
};

export {
  NavBar,
  TestStatusBadge
};
