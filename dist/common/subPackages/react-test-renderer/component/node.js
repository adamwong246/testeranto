"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_js_1 = __importDefault(require("../../../Node.js"));
const interface_js_1 = require("./interface.js");
exports.default = (testImplementations, testSpecifications, testInput) => (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, interface_js_1.testInterface);
