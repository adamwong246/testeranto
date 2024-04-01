"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web_1 = __importDefault(require("../../../Web"));
const _1 = require(".");
exports.default = (testImplementations, testSpecifications, testInput) => (0, Web_1.default)(testInput, testSpecifications, testImplementations, _1.testInterface);
