"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tiposkripto_1 = __importDefault(require("../src/lib/tiposkripto/Tiposkripto"));
const Calculator_1 = require("./Calculator");
const Calculator_test_adapter_1 = require("./Calculator.test.adapter");
const Calculator_test_implementation_1 = require("./Calculator.test.implementation");
const Calculator_test_specification_1 = require("./Calculator.test.specification");
// import { TsAnalyzer } from "./TsAnalyzer";
exports.default = (0, Tiposkripto_1.default)(Calculator_1.Calculator, Calculator_test_specification_1.specification, Calculator_test_implementation_1.implementation, Calculator_test_adapter_1.adapter, { ports: 1000 }
// new TsAnalyzer()
);
