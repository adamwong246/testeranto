"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@motion-canvas/core");
const combined_mp3_1 = __importDefault(require("./audio/combined.mp3")); // Single combined audio file
const scene1_1 = __importDefault(require("./scenes/scene1"));
const scene2_1 = __importDefault(require("./scenes/scene2"));
const scene3_scene_1 = __importDefault(require("./scenes/scene3?scene"));
exports.default = (0, core_1.makeProject)({
    scenes: [scene1_1.default, scene2_1.default, scene3_scene_1.default],
    audio: combined_mp3_1.default,
    experimentalFeatures: true
});
