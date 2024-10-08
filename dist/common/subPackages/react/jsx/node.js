"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../../../Node"));
const index_1 = require("./index");
exports.default = (testImplementations, testSpecifications, testInput, testInterface2 = index_1.testInterface) => {
    return (0, Node_1.default)(testInput, testSpecifications, testImplementations, testInterface2(testInput));
};
