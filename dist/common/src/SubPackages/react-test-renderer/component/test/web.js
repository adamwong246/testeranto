"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("../web"));
const index_1 = __importDefault(require("../../../../examples/react/component/index"));
const test_1 = require("../../../../examples/react/component/test");
const implementation_1 = require("./implementation");
exports.default = (0, web_1.default)(implementation_1.testImplementation, test_1.specification, index_1.default);
