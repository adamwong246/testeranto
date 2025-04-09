"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_js_1 = __importDefault(require("../../../Node.js"));
const static_js_1 = require("./static.js");
exports.default = (testImplementations, testSpecifications, testInput) => {
    return (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, (0, static_js_1.testInterfacer)(testInput));
};
