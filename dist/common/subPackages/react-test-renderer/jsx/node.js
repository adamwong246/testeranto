"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_js_1 = __importDefault(require("../../../Node.js"));
const index_js_1 = require("./index.js");
exports.default = (testImplementations, testSpecifications, testInput, testInterface2 = index_js_1.testInterface) => {
    return (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, testInterface2);
};
