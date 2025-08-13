"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("testeranto-react/src/react-dom/jsx/web"));
const react_router_dom_1 = require("react-router-dom");
const implementation_1 = require("./implementation");
const specification_1 = require("./specification");
const TestPageView_1 = require("../TestPageView");
const react_1 = __importDefault(require("react"));
require("./../../../App.scss");
const WrappedTestPageView = (props) => (react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
    react_1.default.createElement(TestPageView_1.TestPageView, Object.assign({}, props))));
exports.default = (0, web_1.default)(implementation_1.implementation, specification_1.specification, WrappedTestPageView);
