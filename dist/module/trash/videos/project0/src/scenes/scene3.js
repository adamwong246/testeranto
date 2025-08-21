import { makeScene2D, Txt, Rect, Circle, Layout } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import durations from '../audio/durations.json';
export default makeScene2D(function* (view) {
    // Create background
    const background = createRef();
    const title = createRef();
    const semanticLayer = createRef();
    const gherkinEditor = createRef();
    const envSwitcher = createRef();
    const promptBuilder = createRef();
    view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { ref: background, width: '100%', height: '100%', fill: '#1e1e2e' }),
        React.createElement(Txt, { ref: title, text: "How Testeranto Works", fontSize: 60, fontFamily: 'JetBrains Mono', fill: '#cdd6f4', y: -300 }),
        React.createElement(Circle, { ref: semanticLayer, size: 0, fill: 'rgba(137, 180, 250, 0.2)', lineWidth: 4, stroke: '#89b4fa' }),
        React.createElement(Rect, { ref: gherkinEditor, width: 0, height: 0, fill: '#313244', radius: 8, x: -300 }),
        React.createElement(Layout, { ref: envSwitcher, layout: true, direction: 'row', gap: 40, y: 100 }),
        React.createElement(Layout, { ref: promptBuilder, layout: true, direction: 'column', gap: 20, x: 300 })));
    const totalDuration = durations.how_it_works.duration;
    // Debug audio setup
    console.log('Audio duration:', totalDuration);
    // Start animations with small buffer
    yield* waitFor(0.5);
    // Semantic layer animation with easing
    yield* all(semanticLayer().size(600, 1, easeInOutCubic), waitUntil('semantic-layer-complete'));
    // Gherkin editor animation with text typing effect
    yield* all(gherkinEditor().size([400, 200], 0.5), ...(gherkinEditor().findAll().map((text, i) => text.opacity(1, 0.3).delay(i * 0.1))), waitUntil('gherkin-complete'));
    // Add sample Gherkin text
    gherkinEditor().add(React.createElement(Txt, { text: "Feature: AI Testing\\n  Scenario: Fix broken tests\\n    Given a failing test\\n    When I analyze with AI\\n    Then it should suggest fixes", fill: "#cdd6f4", fontFamily: "JetBrains Mono", fontSize: 18, lineHeight: 28, textAlign: "left", padding: 20, opacity: 0 }));
    // Environment switcher
    const envs = ['Browser', 'Node', 'Pure JS'];
    envs.forEach((env, i) => {
        envSwitcher().add(React.createElement(Rect, { width: 120, height: 80, fill: '#45475a', radius: 8 },
            React.createElement(Txt, { text: env, fill: '#cdd6f4', fontFamily: 'JetBrains Mono', fontSize: 24 })));
    });
    for (let i = 0; i < envSwitcher().children().length; i++) {
        yield* envSwitcher().children()[i].opacity(1, 0.3);
        yield* waitFor(0.2);
    }
    yield* waitUntil('env-switcher-complete');
    // Prompt builder animation
    const promptParts = [
        'Test Results',
        'Source Code',
        'Documentation',
        'Feature Specs'
    ];
    promptParts.forEach((part, i) => {
        promptBuilder().add(React.createElement(Rect, { width: 200, height: 40, fill: '#585b70', radius: 4 },
            React.createElement(Txt, { text: part, fill: '#cdd6f4', fontFamily: 'JetBrains Mono', fontSize: 18 })));
    });
    for (let i = 0; i < promptBuilder().children().length; i++) {
        yield* promptBuilder().children()[i].opacity(1, 0.3);
        yield* waitFor(0.2);
    }
    yield* waitUntil('prompt-builder-complete');
    // Fix button animation
    const fixButton = createRef();
    view.add(React.createElement(Rect, { ref: fixButton, width: 200, height: 60, fill: '#a6e3a1', radius: 8, y: 200, opacity: 0 },
        React.createElement(Txt, { text: "Fix Tests", fill: '#292F36', fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 'bold' })));
    yield* all(fixButton().opacity(1, 0.5), fixButton().scale(1.2, 0.3).to(1, 0.3), waitUntil('fix-button-complete'));
    // Final buffer - maintain scene timing
    yield* waitFor(totalDuration - 0.5);
});
