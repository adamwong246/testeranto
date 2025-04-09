"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pure_js_1 = __importDefault(require("../../../Pure.js"));
const interface_1 = require("./interface");
exports.default = (testImplementations, testSpecifications, testInput) => (0, Pure_js_1.default)(testInput, testSpecifications, testImplementations, interface_1.testInterface);
