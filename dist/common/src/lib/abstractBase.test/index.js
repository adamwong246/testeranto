"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../../Node"));
const specification_1 = require("./specification");
const implementation_1 = require("./implementation");
const interface_1 = require("./interface");
const MockGiven_1 = require("./MockGiven");
const MockThen_1 = require("./MockThen");
const MockWhen_1 = require("./MockWhen");
exports.default = (0, Node_1.default)({
    MockGiven: MockGiven_1.MockGiven,
    MockWhen: MockWhen_1.MockWhen,
    MockThen: MockThen_1.MockThen,
}, specification_1.specification, implementation_1.implementation, interface_1.testInterface);
