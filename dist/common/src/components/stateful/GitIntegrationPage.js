"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitIntegrationPage = void 0;
const react_1 = __importDefault(require("react"));
const GitIntegrationView_1 = require("../pure/GitIntegrationView");
const GitIntegrationPage = () => {
    return (react_1.default.createElement(GitIntegrationView_1.GitIntegrationView, null));
};
exports.GitIntegrationPage = GitIntegrationPage;
