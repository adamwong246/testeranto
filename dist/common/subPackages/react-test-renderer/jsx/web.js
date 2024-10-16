"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testImplementations, testSpecifications, testInput, testInterface2 = index_js_1.testInterface) => {
    return (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, testInterface2);
};
