"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsButton = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const SettingsButton = () => {
    return (react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/settings" }, "Settings"));
};
exports.SettingsButton = SettingsButton;
