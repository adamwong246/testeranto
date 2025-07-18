"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web_1 = __importDefault(require("../../Web"));
const baseBuilder_test_specification_1 = require("./baseBuilder.test.specification");
const baseBuilder_test_implementation_1 = require("./baseBuilder.test.implementation");
const baseBuilder_test_interface_1 = require("./baseBuilder.test.interface");
const basebuilder_1 = require("../basebuilder");
exports.default = (0, Web_1.default)(basebuilder_1.BaseBuilder.prototype, baseBuilder_test_specification_1.specification, baseBuilder_test_implementation_1.implementation, baseBuilder_test_interface_1.testInterface);
