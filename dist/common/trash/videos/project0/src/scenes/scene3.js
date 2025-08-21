"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _2d_1 = require("@motion-canvas/2d");
const core_1 = require("@motion-canvas/core");
const durations_json_1 = __importDefault(require("../audio/durations.json"));
exports.default = (0, _2d_1.makeScene2D)(function* (view) {
    // Create background
    const background = (0, core_1.createRef)();
    const title = (0, core_1.createRef)();
    const semanticLayer = (0, core_1.createRef)();
    const gherkinEditor = (0, core_1.createRef)();
    const envSwitcher = (0, core_1.createRef)();
    const promptBuilder = (0, core_1.createRef)();
    view.add(React.createElement(React.Fragment, null,
        React.createElement(_2d_1.Rect, { ref: background, width: '100%', height: '100%', fill: '#1e1e2e' }),
        React.createElement(_2d_1.Txt, { ref: title, text: "How Testeranto Works", fontSize: 60, fontFamily: 'JetBrains Mono', fill: '#cdd6f4', y: -300 }),
        React.createElement(_2d_1.Circle, { ref: semanticLayer, size: 0, fill: 'rgba(137, 180, 250, 0.2)', lineWidth: 4, stroke: '#89b4fa' }),
        React.createElement(_2d_1.Rect, { ref: gherkinEditor, width: 0, height: 0, fill: '#313244', radius: 8, x: -300 }),
        React.createElement(_2d_1.Layout, { ref: envSwitcher, layout: true, direction: 'row', gap: 40, y: 100 }),
        React.createElement(_2d_1.Layout, { ref: promptBuilder, layout: true, direction: 'column', gap: 20, x: 300 })));
    const totalDuration = durations_json_1.default.how_it_works.duration;
    // Debug audio setup
    console.log('Audio duration:', totalDuration);
    // Start animations with small buffer
    yield* (0, core_1.waitFor)(0.5);
    // Semantic layer animation with easing
    yield* (0, core_1.all)(semanticLayer().size(600, 1, core_1.easeInOutCubic), (0, core_1.waitUntil)('semantic-layer-complete'));
    // Gherkin editor animation with text typing effect
    yield* (0, core_1.all)(gherkinEditor().size([400, 200], 0.5), ...(gherkinEditor().findAll().map((text, i) => text.opacity(1, 0.3).delay(i * 0.1))), (0, core_1.waitUntil)('gherkin-complete'));
    // Add sample Gherkin text
    gherkinEditor().add(React.createElement(_2d_1.Txt, { text: "Feature: AI Testing\\n  Scenario: Fix broken tests\\n    Given a failing test\\n    When I analyze with AI\\n    Then it should suggest fixes", fill: "#cdd6f4", fontFamily: "JetBrains Mono", fontSize: 18, lineHeight: 28, textAlign: "left", padding: 20, opacity: 0 }));
    // Environment switcher
    const envs = ['Browser', 'Node', 'Pure JS'];
    envs.forEach((env, i) => {
        envSwitcher().add(React.createElement(_2d_1.Rect, { width: 120, height: 80, fill: '#45475a', radius: 8 },
            React.createElement(_2d_1.Txt, { text: env, fill: '#cdd6f4', fontFamily: 'JetBrains Mono', fontSize: 24 })));
    });
    for (let i = 0; i < envSwitcher().children().length; i++) {
        yield* envSwitcher().children()[i].opacity(1, 0.3);
        yield* (0, core_1.waitFor)(0.2);
    }
    yield* (0, core_1.waitUntil)('env-switcher-complete');
    // Prompt builder animation
    const promptParts = [
        'Test Results',
        'Source Code',
        'Documentation',
        'Feature Specs'
    ];
    promptParts.forEach((part, i) => {
        promptBuilder().add(React.createElement(_2d_1.Rect, { width: 200, height: 40, fill: '#585b70', radius: 4 },
            React.createElement(_2d_1.Txt, { text: part, fill: '#cdd6f4', fontFamily: 'JetBrains Mono', fontSize: 18 })));
    });
    for (let i = 0; i < promptBuilder().children().length; i++) {
        yield* promptBuilder().children()[i].opacity(1, 0.3);
        yield* (0, core_1.waitFor)(0.2);
    }
    yield* (0, core_1.waitUntil)('prompt-builder-complete');
    // Fix button animation
    const fixButton = (0, core_1.createRef)();
    view.add(React.createElement(_2d_1.Rect, { ref: fixButton, width: 200, height: 60, fill: '#a6e3a1', radius: 8, y: 200, opacity: 0 },
        React.createElement(_2d_1.Txt, { text: "Fix Tests", fill: '#292F36', fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 'bold' })));
    yield* (0, core_1.all)(fixButton().opacity(1, 0.5), fixButton().scale(1.2, 0.3).to(1, 0.3), (0, core_1.waitUntil)('fix-button-complete'));
    // Final buffer - maintain scene timing
    yield* (0, core_1.waitFor)(totalDuration - 0.5);
});
