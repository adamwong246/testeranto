"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFrame = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const SettingsButton_1 = require("./SettingsButton");
const AppFrame = ({ children }) => {
    return (react_1.default.createElement("div", { className: "d-flex flex-column min-vh-100", key: window.location.pathname },
        react_1.default.createElement("main", { className: "flex-grow-1 p-3" },
            react_1.default.createElement(react_bootstrap_1.Container, { fluid: true }, children)),
        react_1.default.createElement("footer", { className: "bg-light py-2 d-flex justify-content-between align-items-center" },
            react_1.default.createElement(SettingsButton_1.SettingsButton, null),
            react_1.default.createElement(react_bootstrap_1.Container, { className: "text-end", fluid: true },
                "made with \u2764\uFE0F and ",
                react_1.default.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto")))));
};
exports.AppFrame = AppFrame;
