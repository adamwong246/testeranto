"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../../Node"));
const Tiposkripto_adapter_1 = require("./Tiposkripto.adapter");
const MockTiposkripto_1 = require("./MockTiposkripto");
const Tiposkripto_specification_1 = require("./Tiposkripto.specification");
const Tiposkripto_implementation_1 = require("./Tiposkripto.implementation");
exports.default = (0, Node_1.default)(MockTiposkripto_1.MockTiposkripto.prototype, Tiposkripto_specification_1.specification, Tiposkripto_implementation_1.implementation, Tiposkripto_adapter_1.testAdapter, { ports: 1 });
