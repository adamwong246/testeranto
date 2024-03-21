"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
require("bootstrap/dist/css/bootstrap.min.css");
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        client_1.default.createRoot(elem).render(react_1.default.createElement(Report, {}));
    }
});
class Report extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: {}
        };
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("style", null, `
pre, code, p {
  max-width: 30rem;
}
footer {
  background-color: lightgray;
  margin: 0.5rem;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  right: 0;
}
          `),
            react_1.default.createElement("h1", null, "hello report"),
            react_1.default.createElement("footer", null,
                "made with \u2764\uFE0F and ",
                react_1.default.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
    }
}
exports.Report = Report;
