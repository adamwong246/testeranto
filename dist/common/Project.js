"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_js_1 = require("./src/Project.js");
const testeranto_js_1 = __importDefault(require("./testeranto.js"));
exports.default = new Project_js_1.ITProject(testeranto_js_1.default);
