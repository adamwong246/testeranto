"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GitHubAuthService_1 = require("../../services/GitHubAuthService");
const UserProfile = () => {
    const user = GitHubAuthService_1.githubAuthService.userInfo;
    if (!GitHubAuthService_1.githubAuthService.isAuthenticated || !user) {
        return null;
    }
    const handleLogout = () => {
        GitHubAuthService_1.githubAuthService.logout();
    };
    return (react_1.default.createElement(react_bootstrap_1.Dropdown, { align: "end" },
        react_1.default.createElement(react_bootstrap_1.Dropdown.Toggle, { variant: "outline-light", id: "user-profile-dropdown", className: "d-flex align-items-center" },
            react_1.default.createElement(react_bootstrap_1.Image, { src: user.avatar_url, roundedCircle: true, width: "32", height: "32", className: "me-2" }),
            user.login),
        react_1.default.createElement(react_bootstrap_1.Dropdown.Menu, null,
            react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { href: `https://github.com/${user.login}`, target: "_blank" }, "View on GitHub"),
            react_1.default.createElement(react_bootstrap_1.Dropdown.Divider, null),
            react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: handleLogout }, "Sign out"))));
};
exports.UserProfile = UserProfile;
