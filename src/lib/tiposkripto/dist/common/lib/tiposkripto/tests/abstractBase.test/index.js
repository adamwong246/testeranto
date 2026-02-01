"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tiposkripto_1 = __importDefault(require("../../src/Tiposkripto"));
const adapter_1 = require("./adapter");
const implementation_1 = require("./implementation");
const MockGiven_1 = require("./MockGiven");
const MockThen_1 = require("./MockThen");
const MockWhen_1 = require("./MockWhen");
const specification_1 = require("./specification");
exports.default = (0, Tiposkripto_1.default)({
    MockGiven: MockGiven_1.MockGiven,
    MockWhen: MockWhen_1.MockWhen,
    MockThen: MockThen_1.MockThen,
}, specification_1.specification, implementation_1.implementation, adapter_1.testAdapter);
