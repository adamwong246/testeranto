"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../../Node"));
const implementation_1 = require("./implementation");
const specification_1 = require("./specification");
const adapter_1 = require("./adapter");
const pmProxy_1 = require("../pmProxy");
exports.default = (0, Node_1.default)({
    butThenProxy: pmProxy_1.butThenProxy,
}, specification_1.specification, implementation_1.implementation, adapter_1.testAdapter);
