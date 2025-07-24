"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-object-type */
const Node_1 = __importDefault(require("../../Node"));
const BaseSuite_1 = require("../BaseSuite");
const test_1 = require("./test");
exports.default = (0, Node_1.default)(BaseSuite_1.BaseSuite, test_1.specification, test_1.implementation, test_1.testAdapter);
