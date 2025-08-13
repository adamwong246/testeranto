"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const web_1 = __importDefault(require("testeranto-react/src/react-dom/component/web"));
const implementation_1 = require("./implementation");
const specification_1 = require("./specification");
const AppFrame_1 = require("../AppFrame");
require("../../../App.scss");
const WrappedAppFrame = ({ children }) => (react_1.default.createElement("div", { id: "test-root" },
    react_1.default.createElement(AppFrame_1.AppFrame, { "data-testid": "app-frame" }, children)));
exports.default = (0, web_1.default)(implementation_1.implementation, specification_1.specification, WrappedAppFrame);
