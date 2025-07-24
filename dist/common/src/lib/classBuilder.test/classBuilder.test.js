"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../../Node"));
const classBuilder_1 = require("../classBuilder");
const classBuilder_test_specification_1 = require("./classBuilder.test.specification");
const classBuilder_test_implementation_1 = require("./classBuilder.test.implementation");
const classBuilder_test_adapter_1 = require("./classBuilder.test.adapter");
exports.default = (0, Node_1.default)(classBuilder_1.ClassBuilder.prototype, classBuilder_test_specification_1.specification, classBuilder_test_implementation_1.implementation, classBuilder_test_adapter_1.testAdapter, { ports: 1 } // Add resource requirements
);
