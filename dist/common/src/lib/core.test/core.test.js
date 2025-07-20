"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pure_1 = __importDefault(require("../../Pure"));
const core_test_specification_1 = require("./core.test.specification");
const core_test_implementation_1 = require("./core.test.implementation");
const core_test_adapter_1 = require("./core.test.adapter");
const MockCore_1 = require("./MockCore");
exports.default = (0, Pure_1.default)(MockCore_1.MockCore.prototype, // test subject
core_test_specification_1.specification, // test scenarios
core_test_implementation_1.implementation, // test operations
core_test_adapter_1.testAdapter, // test lifecycle hooks
{ ports: [] }, // resource requirements
(cb) => cb() // error handler
);
