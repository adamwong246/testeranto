"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web_1 = __importDefault(require("../../Web"));
const BaseSuite_1 = require("../BaseSuite");
const test_1 = require("./test");
exports.default = (0, Web_1.default)(BaseSuite_1.BaseSuite, test_1.specification, test_1.implementation, test_1.testInterface);
