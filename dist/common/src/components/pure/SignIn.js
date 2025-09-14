"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignIn = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GitHubAuthService_1 = require("../../services/GitHubAuthService");
const GitHubLoginButton_1 = require("./GitHubLoginButton");
const SignIn = () => {
    return (react_1.default.createElement(react_bootstrap_1.Container, { className: "d-flex align-items-center justify-content-center min-vh-100" },
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, { md: 12 },
                react_1.default.createElement(react_bootstrap_1.Card, null,
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "text-center" },
                        react_1.default.createElement("h3", { className: "mb-0" }, "Sign In")),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "text-center" }, GitHubAuthService_1.githubAuthService.isConfigured() ? (react_1.default.createElement(GitHubLoginButton_1.GitHubLoginButton, null)) : (react_1.default.createElement("div", null,
                        react_1.default.createElement("p", { className: "text-danger" }, "GitHub authentication is not configured"),
                        react_1.default.createElement("p", null, "Please contact the administrator")))))))));
};
exports.SignIn = SignIn;
