import {
  require_react,
  require_react_dom
} from "../../chunk-X4RTFM5S.mjs";
import {
  __commonJS,
  __toESM
} from "../../chunk-TTFRSOOU.mjs";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
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

// src/ClassicalComponent/test.ts
var import_client = __toESM(require_client(), 1);
var import_react2 = __toESM(require_react(), 1);

// src/ClassicalComponent/index.tsx
var import_react = __toESM(require_react(), 1);
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
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react.default.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theStat" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react.default.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// src/ClassicalComponent/test.ts
document.addEventListener("DOMContentLoaded", function() {
  const elem = document.getElementById("root");
  if (elem) {
    import_client.default.createRoot(elem).render(import_react2.default.createElement(ClassicalComponent, {}));
  }
});
