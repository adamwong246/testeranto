import {
  require_react
} from "./chunk-T4W5FV25.mjs";
import {
  __toESM
} from "./chunk-3KGMXYRN.mjs";

// src/ClassicalComponent/index.tsx
var import_react = __toESM(require_react(), 1);
var ClassicalComponent = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react.default.createElement("h1", { id: "theHeader" }, "Hello Marcus"), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theStat" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react.default.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

export {
  ClassicalComponent
};
