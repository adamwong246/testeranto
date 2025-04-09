"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web_js_1 = __importDefault(require("../../../Web.js"));
exports.default = (testInput, testSpecifications, testImplementations, testInterface) => {
    const t = (0, Web_js_1.default)(testInput, testSpecifications, testImplementations, testInterface);
    document.addEventListener("DOMContentLoaded", function () {
        const elem = document.getElementById("root");
        if (elem) {
            return t;
        }
    });
    return t;
};
