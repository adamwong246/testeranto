"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-object-type */
const Node_1 = __importDefault(require("../../Node"));
const baseBuilder_test_specification_1 = require("./baseBuilder.test.specification");
const baseBuilder_test_implementation_1 = require("./baseBuilder.test.implementation");
const baseBuilder_test_adapter_1 = require("./baseBuilder.test.adapter");
const baseBuilder_test_mock_1 = require("./baseBuilder.test.mock");
exports.default = (0, Node_1.default)(baseBuilder_test_mock_1.MockBaseBuilder.prototype, baseBuilder_test_specification_1.specification, baseBuilder_test_implementation_1.implementation, baseBuilder_test_adapter_1.testAdapter);
