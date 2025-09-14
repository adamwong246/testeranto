"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubLoginButton = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GitHubAuthService_1 = require("../../services/GitHubAuthService");
const GitHubLoginButton = ({ className, variant = 'outline-dark', size, }) => {
    const handleLogin = () => {
        GitHubAuthService_1.githubAuthService.initiateLogin();
    };
    return (react_1.default.createElement(react_bootstrap_1.Button, { className: className, variant: variant, size: size, onClick: handleLogin },
        react_1.default.createElement("i", { className: "bi bi-github me-2" }),
        "Sign in with GitHub"));
};
exports.GitHubLoginButton = GitHubLoginButton;
