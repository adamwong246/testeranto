"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_plugin_1 = __importDefault(require("@motion-canvas/vite-plugin"));
const ffmpeg_1 = __importDefault(require("@motion-canvas/ffmpeg"));
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, vite_plugin_1.default)(),
        (0, ffmpeg_1.default)(),
    ],
});
