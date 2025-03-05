"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskMan_js_1 = __importDefault(require("./src/TaskMan.js"));
const testeranto_js_1 = __importDefault(require("./testeranto.js"));
exports.default = (0, TaskMan_js_1.default)(testeranto_js_1.default);
