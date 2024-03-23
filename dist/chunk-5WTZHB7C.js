import {
  require_client
} from "./chunk-6LWWU2HF.js";
import {
  require_react
} from "./chunk-WLWHQ7FI.js";
import {
  __toESM
} from "./chunk-4ATCX2XT.js";

// src/ClassicalComponent.tsx
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());
var ClassicalComponent = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  // componentDidMount() {
  //   console.info("componentDidMount");
  //   // const x = fetch("http://www.google.com")
  //   //   .then((response) => response.text())
  //   //   .then(x => {
  //   //     console.warn("i am a genius", x)
  //   //   });
  //   // console.info("x", x);
  //   // const y = fetch("http://www.google.com/", { mode: `no-cors` })
  //   //   // .then((response) => response.text())
  //   //   .then(x => {
  //   //     console.log("i am a genius!")
  //   //   });
  //   // console.info(y);
  // }
  render() {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react.default.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react.default.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};
var LaunchClassicalComponent = () => {
  document.addEventListener("DOMContentLoaded", function() {
    const elem = document.getElementById("root");
    if (elem) {
      console.log("DOMContentLoaded and root found", ClassicalComponent);
      import_client.default.createRoot(elem).render(import_react.default.createElement(ClassicalComponent));
    }
  });
};

export {
  ClassicalComponent,
  LaunchClassicalComponent
};
