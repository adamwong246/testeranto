/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeProject } from '@motion-canvas/core';
// import { Img, makeScene2D, Rect, Txt, Audio } from '@revideo/2d';
// import { all, chain, createRef, waitFor } from '@revideo/core';
import durations from './audio/durations.json';
// import { AudioManager } from '@revideo/media';
// Text with audio
// Import durations
// import durations from './audio/durations';
// Scene 1: The Problem
const problemScene = makeScene2D('problem', function* (view) {
    const devRef = createRef();
    const clockRef = createRef();
    const testFailuresRef = createRef();
    view.add(React.createElement(Audio, { src: "src/revideo/audio/problem.mp3", time: 0, play: true, volume: 1 }));
    // Background
    yield view.add(React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }));
    // Developer with multiple monitors
    yield view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { width: 600, height: 400, fill: '#333', x: -300, y: 0, radius: 10 }),
        React.createElement(Rect, { width: 600, height: 400, fill: '#333', x: 300, y: 0, radius: 10 }),
        React.createElement(Rect, { width: 200, height: 200, fill: '#00ffaa', x: 0, y: -200, radius: 100 },
            React.createElement(Txt, { text: "Dev", fontSize: 40, fill: '#1a1a2e' }))));
    // Get duration from imported JSON
    const problemDuration = durations.problem;
    // Test failures piling up - spread over first 1/3 of scene
    const failureDuration = problemDuration * 0.33;
    const failureInterval = failureDuration / 10;
    yield* waitFor(0.5);
    for (let i = 0; i < 10; i++) {
        view.add(React.createElement(Rect, { ref: testFailuresRef, width: 300, height: 50, fill: '#ff5555', x: 300, y: 100 + i * 60, radius: 10, shadowColor: 'rgba(255,85,85,0.5)', shadowBlur: 10, shadowOffsetY: 5 },
            React.createElement(Txt, { text: `Test Failed ${i + 1}`, fontSize: 20, fill: '#fff' })));
        yield* waitFor(failureInterval);
    }
    // Clock animation - runs for full duration
    view.add(React.createElement(Rect, { ref: clockRef, width: 200, height: 200, fill: '#333', x: -400, y: -100, radius: 100 }));
    // Developer text appears at 1/3 point
    const text = view.add(React.createElement(Txt, { text: "AI has changed the game forever...", fontSize: 42, fill: '#ffffff', fontFamily: 'M PLUS Rounded 1c', fontWeight: 500, y: 200, lineHeight: 60, textAlign: 'center', opacity: 0 }));
    yield* all(
    // Clock completes full rotation by end
    clockRef().rotation(360, problemDuration), 
    // Test failures move down over middle third
    testFailuresRef().position.y(200, failureDuration), 
    // Text appears at 1/3 point
    waitFor(failureDuration).then(text.opacity(1, 0.5)));
    // const text = view.add(
    //   <Txt
    //     text={"AI has changed the game forever.\nIt's never been easier to generate code,\nbut it's also never been harder to know\nif your code is as robust as ChatGpt\nwould lead you to believe.\nSure, you can scaffold out a react app\nfrom scratch with 1 prompt...\nbut can you vibe your way around\na real-world codebase?"}
    //     fontSize={42}
    //     fill={'#ffffff'}
    //     fontFamily={'M PLUS Rounded 1c'}
    //     fontWeight={500}
    //     y={200}
    //     lineHeight={60}
    //     textAlign={'center'}
    //     opacity={0}
    //     shadowColor={'rgba(0,0,0,0.5)'}
    //     shadowBlur={5}
    //     shadowOffsetY={3}
    //   />
    // );
    // // Sync animations with audio
    // yield* all(
    //   // Text animation
    //   chain(
    //     text.opacity(1, 0.5),
    //     text.position.y(150, durations.problem - 0.5)
    //   ),
    //   // Test failures animation
    //   testFailuresRef().position.y(200, durations.problem),
    //   // Clock animation
    //   clockRef().rotation(360, durations.problem)
    // );
});
// Scene 2: Testeranto Solution
const solutionScene = makeScene2D('solution', function* (view) {
    const logoRef = createRef();
    // Setup scene
    view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }),
        React.createElement(Audio, { src: "./src/revideo/audio/solution.mp3", volume: 1, time: 0, play: true })));
    // LLM Context Window Visualization
    const contextWindow = createRef();
    view.add(React.createElement(Rect, { ref: contextWindow, width: 800, height: 500, fill: '#333', radius: 10, opacity: 0 },
        React.createElement(Txt, { text: "LLM Context Window", fontSize: 30, fill: '#fff', y: -230 }),
        React.createElement(Rect, { width: 750, height: 400, fill: '#1a1a2e' })));
    yield* all(contextWindow().opacity(1, 0.5), contextWindow().position.y(0, 0.5));
    // Files loading into context
    for (let i = 0; i < 20; i++) {
        view.add(React.createElement(Rect, { width: 100, height: 20, fill: '#555', x: -300 + Math.random() * 600, y: -150 + Math.random() * 300, opacity: 0 },
            React.createElement(Txt, { text: `file${i}.ts`, fontSize: 12, fill: '#fff' }))).opacity(1, 0.2).to(0.3, 2);
    }
    // Relevant files highlighting
    yield* waitFor(1);
    for (let i = 0; i < 3; i++) {
        view.add(React.createElement(Rect, { width: 150, height: 30, fill: '#00ffaa', x: -200 + i * 200, y: -100 + i * 100, radius: 5, opacity: 0 },
            React.createElement(Txt, { text: `relevant${i}.ts`, fontSize: 16, fill: '#1a1a2e' }))).opacity(1, 0.3);
    }
    // Main text reveal
    const text = view.add(React.createElement(Txt, { text: "Introducing Testeranto", fontSize: 80, fontFamily: 'M PLUS Rounded 1c', fontWeight: 800, fill: '#00ffaa', y: 200, opacity: 0, shadowColor: 'rgba(0,255,170,0.5)', shadowBlur: 10, shadowOffsetY: 5 }));
    yield* chain(waitFor(durations.solution * 0.2), all(text.opacity(1, 0.5), text.scale(1.1, 0.3).to(1, 0.3)));
    // Simple particle effect
    for (let i = 0; i < 20; i++) {
        view.add(React.createElement(Rect, { width: 10, height: 10, fill: '#00ffaa', x: 0, y: 0, opacity: 0 })).opacity(0.8, 0.2).to(0, 0.5);
    }
});
// Scene 3: Context Optimization
const contextScene = makeScene2D('context', function* (view) {
    // Setup scene
    view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }),
        React.createElement(Audio, { src: "./src/revideo/audio/context.mp3", volume: 1, time: 0, play: true })));
    // Simple comparison visualization
    const messySide = createRef();
    const cleanSide = createRef();
    view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { ref: messySide, width: 400, height: 400, fill: '#ff5555', x: -300, opacity: 0, radius: 20, shadowColor: 'rgba(255,85,85,0.5)', shadowBlur: 15 },
            React.createElement(Txt, { text: "Traditional", fontSize: 42, fill: '#ffffff', y: -180, fontFamily: 'M PLUS Rounded 1c', fontWeight: 600 })),
        React.createElement(Rect, { ref: cleanSide, width: 400, height: 400, fill: '#00ffaa', x: 300, opacity: 0, radius: 20, shadowColor: 'rgba(0,255,170,0.5)', shadowBlur: 15 },
            React.createElement(Txt, { text: "Testeranto", fontSize: 42, fill: '#ffffff', y: -180, fontFamily: 'M PLUS Rounded 1c', fontWeight: 600 }))));
    // Animate comparison
    yield* all(messySide().opacity(0.7, 0.5), cleanSide().opacity(1, 0.5));
    // Main text
    const text = view.add(React.createElement(Txt, { text: "Precision Context Optimization", fontSize: 60, fill: '#fff', y: 250, opacity: 0 }));
    yield* text.opacity(1, 0.5);
});
// Scene 4: Cross-Runtime Demo
const runtimeScene = makeScene2D('runtimes', function* (view) {
    yield view.add(React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }));
    const runtimes = ['Node', 'Browser', 'Pure'];
    const runtimeRefs = runtimes.map(() => createRef());
    // Create runtime boxes
    runtimes.forEach((runtime, i) => {
        view.add(React.createElement(Rect, { ref: runtimeRefs[i], width: 300, height: 200, fill: '#00ffaa', y: -100 + i * 200, opacity: 0 },
            React.createElement(Txt, { text: runtime, fontSize: 40, fill: '#1a1a2e' })));
    });
    // Animate in
    yield* all(...runtimeRefs.map((ref, i) => chain(waitFor(i * 0.2), ref().opacity(1, 0.3), ref().position.x(-300 + i * 300, 0.5))));
    // Text
    const text = view.add(React.createElement(Txt, { text: "Write once, test anywhere", fontSize: 60, fill: '#fff', y: 300, opacity: 0 }));
    const runtimesAudio = view.add(React.createElement(Audio, { src: "./src/revideo/audio/runtimes.mp3", volume: 1, playbackRate: 1, time: 0, play: true }));
    yield* all(text.opacity(1, 0.5));
});
// Scene 5: Call to Action
const ctaScene = makeScene2D('cta', function* (view) {
    yield view.add(React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }));
    const commandRef = createRef();
    const starRef = createRef();
    // Command
    view.add(React.createElement(Txt, { ref: commandRef, text: "npm install testeranto@beta", fontSize: 60, fill: '#00ffaa', y: -100, opacity: 0 }));
    // Star button
    view.add(React.createElement(Rect, { ref: starRef, width: 400, height: 100, fill: '#00ffaa', y: 100, radius: 50, opacity: 0 },
        React.createElement(Txt, { text: "Star on GitHub", fontSize: 40, fill: '#1a1a2e' })));
    // Animate in
    const ctaAudio = view.add(React.createElement(Audio, { src: "./src/revideo/audio/cta.mp3", volume: 1, playbackRate: 1, time: 0, play: true }));
    yield* all(commandRef().opacity(1, 0.5), starRef().opacity(1, 0.5));
    // Pulse animation
    yield* all(starRef().scale(1.1, 0.5), starRef().scale(1, 0.5));
});
// Scene 6: Type Safety Shield
const typeSafetyScene = makeScene2D('type-safety', function* (view) {
    yield view.add(React.createElement(Rect, { width: '100%', height: '100%', fill: '#1a1a2e' }));
    const shieldRef = createRef();
    const errorRef = createRef();
    // Create shield
    view.add(React.createElement(Rect, { ref: shieldRef, width: 400, height: 600, fill: '#00ffaa', radius: 200, lineWidth: 20, stroke: '#fff' },
        React.createElement(Txt, { text: "Type Safety", fontSize: 60, fill: '#1a1a2e', fontWeight: 800 })));
    // Create error projectile
    view.add(React.createElement(Rect, { ref: errorRef, width: 100, height: 50, fill: '#ff5555', x: -800, y: 0, radius: 10 },
        React.createElement(Txt, { text: "TypeError", fontSize: 30, fill: '#fff' })));
    // Animate error hitting shield
    yield* all(errorRef().position.x(-100, 0.5), shieldRef().fill('#ff5555', 0.1), shieldRef().fill('#00ffaa', 0.1));
    // Shield glow effect
    yield* chain(shieldRef().scale(1.1, 0.2), shieldRef().scale(1, 0.2));
    // Text
    const text = view.add(React.createElement(Txt, { text: "Type-safe across runtimes", fontSize: 60, fill: '#fff', y: 300, opacity: 0 }));
    const typeSafetyAudio = view.add(React.createElement(Audio, { src: "./src/revideo/audio/type-safety.mp3", volume: 1, playbackRate: 1, time: 0, play: true }));
    yield* all(text.opacity(1, 0.5));
});
export default makeProject({
    scenes: [
        problemScene,
        solutionScene,
        contextScene,
        runtimeScene,
        typeSafetyScene,
        ctaScene
    ],
    variables: {
        audioSrc: {
            problem: './src/revideo/audio/problem.mp3',
            solution: './src/revideo/audio/solution.mp3'
        }
    },
    settings: {
        shared: {
            size: { x: 1920, y: 1080 },
            background: '#1a1a2e'
        },
    },
});
