"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageNavbar = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const NavBar_1 = require("./pure/NavBar");
const TestPageNavbar = ({ decodedTestPath, projectName, runtime, setShowAiderModal, isWebSocketConnected }) => {
    return react_1.default.createElement(NavBar_1.NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
            {
                label: "",
                badge: {
                    variant: runtime === "node"
                        ? "primary"
                        : runtime === "web"
                            ? "success"
                            : runtime === "golang"
                                ? "warning"
                                : "info",
                    text: runtime,
                },
                className: "pe-none d-flex align-items-center gap-2",
            },
        ], rightContent: react_1.default.createElement(react_bootstrap_1.Button, { variant: "info", onClick: () => setShowAiderModal(true), className: "ms-2 position-relative", title: isWebSocketConnected
                ? "AI Assistant"
                : "AI Assistant (WebSocket not connected)", disabled: !isWebSocketConnected },
            "\uD83E\uDD16",
            !isWebSocketConnected && (react_1.default.createElement("span", { className: "position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle", title: "WebSocket disconnected" },
                react_1.default.createElement("span", { className: "visually-hidden" }, "WebSocket disconnected")))) });
};
exports.TestPageNavbar = TestPageNavbar;
