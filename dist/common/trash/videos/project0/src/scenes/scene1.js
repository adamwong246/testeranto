"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _2d_1 = require("@motion-canvas/2d");
const core_1 = require("@motion-canvas/core");
const durations_json_1 = __importDefault(require("../audio/durations.json"));
const _2d_2 = require("@motion-canvas/2d");
// import testerantoLogo from '../../../../logo.svg';
// import { all, createRef, waitFor, waitUntil } from '@motion-canvas/core';
const CodeBlock_1 = require("@motion-canvas/2d/lib/components/CodeBlock");
const signals_1 = require("@motion-canvas/core/lib/signals");
exports.default = (0, _2d_1.makeScene2D)(function* (view) {
    // Create background
    const background = (0, core_1.createRef)();
    const title = (0, core_1.createRef)();
    const codeExplosion = (0, core_1.createRef)();
    const codeCount = (0, signals_1.createSignal)(0);
    // console.log('Logo path:', testerantoLogo); // Debug logo path
    view.add(React.createElement(React.Fragment, null,
        React.createElement(_2d_1.Rect, { ref: background, width: '100%', height: '100%', fill: '#1e1e2e' }),
        React.createElement(_2d_1.Txt, { ref: title, text: "AI has changed the game forever", fontSize: 60, fontFamily: 'JetBrains Mono', fill: '#cdd6f4', y: -300, opacity: 0 }),
        React.createElement(_2d_2.Layout, { ref: codeExplosion, layout: true, direction: 'column', gap: 20, wrap: 'wrap', width: 1000, height: 600 })));
    // Animation sequence - perfectly timed to audio
    const totalDuration = durations_json_1.default.problem.duration;
    // Audio synchronization setup
    const audioOffset = 0.5; // Start animation 0.5s before audio
    yield* (0, core_1.waitFor)(audioOffset);
    // Start audio playback with precise timing
    try {
        yield* (0, core_1.all)(title().opacity(1, totalDuration * 0.08), // ~1.5s for title
        (0, core_1.waitFor)(totalDuration * 0.08 - audioOffset));
    }
    catch (error) {
        console.error('Audio synchronization error:', error);
        yield* title().opacity(1, 1.5); // Fallback timing
    }
    yield* title().opacity(1, totalDuration * 0.08); // ~1.5s for title
    // Code explosion effect
    const explosionDuration = totalDuration * 0.16; // ~3s
    const colors = ['#f38ba8', '#fab387', '#f9e2af', '#a6e3a1', '#89b4fa', '#cba6f7'];
    const files = ['App.tsx', 'index.html', 'styles.css', 'utils.js', 'config.json', 'api.ts'];
    for (let i = 0; i < 50; i++) {
        const x = (Math.random() - 0.5) * 1800;
        const y = (Math.random() - 0.5) * 1000;
        const scale = 0.5 + Math.random() * 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const file = files[Math.floor(Math.random() * files.length)];
        codeExplosion().add(React.createElement(CodeBlock_1.CodeBlock, { code: `// ${file}`, fontSize: 24, fontFamily: 'JetBrains Mono', fill: color, x: x, y: y, scale: scale, opacity: 0 }));
        codeCount(codeCount() + 1);
        yield* (0, core_1.waitFor)(explosionDuration / 50); // Divide by number of iterations
    }
    // Files appear
    yield* (0, core_1.all)(...codeExplosion().children().map(child => child.opacity(1, totalDuration * 0.08)));
    // Highlight relevant files
    const relevantFiles = codeExplosion().children().slice(0, 3);
    yield* (0, core_1.all)(...relevantFiles.map(file => file.scale(2, totalDuration * 0.08).to(1, totalDuration * 0.08)));
    // Zoom effect
    yield* (0, core_1.all)(...relevantFiles.map(file => file.scale(3, totalDuration * 0.11).to(2, totalDuration * 0.11)));
    // Final message
    yield* (0, core_1.all)(title().text("AI has changed testing forever", totalDuration * 0.11), ...relevantFiles.map(file => file.fill('#a6e3a1', totalDuration * 0.11)));
    yield* (0, core_1.waitFor)(totalDuration * 0.2); // Final buffer
});
