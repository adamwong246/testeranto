"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicalComponent = void 0;
const react_1 = __importDefault(require("react"));
class ClassicalComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }
    render() {
        return (react_1.default.createElement("div", { style: { border: "3px solid black" } },
            react_1.default.createElement("h1", { id: "theHeader" }, "Hello Marcus"),
            react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)),
            react_1.default.createElement("p", null,
                "foo: ",
                this.props.foo),
            react_1.default.createElement("pre", { id: "theStat" }, JSON.stringify(this.state)),
            react_1.default.createElement("p", null,
                "count: ",
                this.state.count,
                " times"),
            react_1.default.createElement("button", { id: "theButton", onClick: async () => {
                    this.setState({ count: this.state.count + 1 });
                } }, "Click")));
    }
}
exports.ClassicalComponent = ClassicalComponent;
exports.default = ClassicalComponent;
