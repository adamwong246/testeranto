"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const Web_1 = __importDefault(require("../../../Web"));
exports.default = (testImplementations, testSpecifications, testInput, testInterface2 = _1.testInterface) => {
    return (0, Web_1.default)(testInput, testSpecifications, testImplementations, testInterface2);
};
