"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("testeranto-react/src/react-dom/component/web"));
const implementation_1 = require("./implementation");
const specification_1 = require("./specification");
const ModalContent_1 = require("../ModalContent");
const react_1 = __importDefault(require("react"));
const WrappedModalContent = (props) => (react_1.default.createElement(ModalContent_1.ModalContent, Object.assign({}, props)));
exports.default = (0, web_1.default)(implementation_1.implementation, specification_1.specification, WrappedModalContent);
