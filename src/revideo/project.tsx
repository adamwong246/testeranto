import { makeProject } from '@revideo/core';
import { Img, makeScene2D, Rect, Txt } from '@revideo/2d';
import { all, chain, createRef, waitFor } from '@revideo/core';
import React from 'react';

// Scene 1: The Problem
const problemScene = makeScene2D('problem', function* (view) {
  // const devRef = createRef<Img>();
  const clockRef = createRef<Rect>();
  const testFailuresRef = createRef<Rect>();

  // Background
  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  // Developer at desk
  // yield view.add(
  //   <Img
  //     ref={devRef}
  //     src={'https://revideo-example-assets.s3.amazonaws.com/developer.png'}
  //     width={400}
  //     y={-100}
  //   />
  // );

  // Test failures piling up
  yield* waitFor(0.5);
  for (let i = 0; i < 5; i++) {
    view.add(
      <Rect
        ref={testFailuresRef}
        width={300}
        height={50}
        fill={'#ff5555'}
        x={300}
        y={100 + i * 60}
        radius={10}
      />
    );
    yield* waitFor(0.2);
  }

  // Clock animation
  view.add(
    <Rect
      ref={clockRef}
      width={200}
      height={200}
      fill={'#333'}
      x={-400}
      y={-100}
      radius={100}
    />
  );
  yield* all(
    clockRef().rotation(360, 3),
    testFailuresRef().position.y(200, 3)
  );

  // Text
  const text = view.add(
    <Txt
      text={"Hours wasted fixing broken tests..."}
      fontSize={60}
      fill={'#fff'}
      y={300}
    />
  );
  yield* text.opacity(1, 0.5);
});

// Scene 2: Testeranto Solution
const solutionScene = makeScene2D('solution', function* (view) {
  const logoRef = createRef<Img>();

  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  // Testeranto logo reveal
  yield view.add(
    <Img
      ref={logoRef}
      src={'logo.svg'}
      width={0}
    />
  );

  yield* chain(
    logoRef().width(400, 1),
    all(
      logoRef().fill('#00ffaa', 0.5),
      logoRef().position.y(-100, 0.5)
    )
  );

  // Text
  const text = view.add(
    <Txt
      text={"Introducing Testeranto"}
      fontSize={60}
      fill={'#fff'}
      y={200}
      opacity={0}
    />
  );
  yield* text.opacity(1, 0.5);
});

// Scene 3: Context Optimization
const contextScene = makeScene2D('context', function* (view) {
  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  // Split screen comparison
  const leftSide = createRef<Rect>();
  const rightSide = createRef<Rect>();

  view.add(
    <>
      <Rect
        ref={leftSide}
        width={800}
        height={600}
        fill={'#ff5555'}
        x={-450}
        opacity={0}
      >
        <Txt text={"Traditional Testing"} fontSize={50} fill={'#fff'} y={-250} />
        {/* Traditional test files representation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Rect
            key={i}
            width={100}
            height={20}
            fill={'#fff'}
            x={-450 + Math.random() * 700 - 350}
            y={-200 + Math.random() * 400}
            opacity={0.5}
          />
        ))}
      </Rect>
      <Rect
        ref={rightSide}
        width={800}
        height={600}
        fill={'#00ffaa'}
        x={450}
        opacity={0}
      >
        <Txt text={"Testeranto"} fontSize={50} fill={'#fff'} y={-250} />
        {[1, 2, 3].map((i) => (
          <Rect
            key={`file-${i}`}
            width={150}
            height={30}
            fill={'#00ffaa'}
            x={450 + Math.random() * 200 - 100}
            y={-200 + i * 100}
            opacity={0}
          />
        ))}
      </Rect>
    </>
  );

  // Animate in split screens
  yield* all(
    leftSide().opacity(1, 0.5),
    rightSide().opacity(1, 0.5)
  );

  // Highlight relevant files on right side
  yield* waitFor(0.5);
  const relevantFiles = view.findAll(node => 
    typeof node.key === 'string' && node.key.includes('file-')
  );
  yield* all(...relevantFiles.map(file => file.opacity(1, 0.3)));

  // Text overlay
  const text = view.add(
    <Txt
      text={"Precision context optimization"}
      fontSize={60}
      fill={'#fff'}
      y={300}
      opacity={0}
    />
  );
  yield* text.opacity(1, 0.5);
});

// Scene 4: Cross-Runtime Demo
const runtimeScene = makeScene2D('runtimes', function* (view) {
  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  const runtimes = ['Node', 'Browser', 'Pure'];
  const runtimeRefs = runtimes.map(() => createRef<Rect>());

  // Create runtime boxes
  runtimes.forEach((runtime, i) => {
    view.add(
      <Rect
        ref={runtimeRefs[i]}
        width={300}
        height={200}
        fill={'#00ffaa'}
        y={-100 + i * 200}
        opacity={0}
      >
        <Txt text={runtime} fontSize={40} fill={'#1a1a2e'} />
      </Rect>
    );
  });

  // Animate in
  yield* all(
    ...runtimeRefs.map((ref, i) =>
      chain(
        waitFor(i * 0.2),
        ref().opacity(1, 0.3),
        ref().position.x(-300 + i * 300, 0.5)
      )
    )
  );

  // Text
  const text = view.add(
    <Txt
      text={"Write once, test anywhere"}
      fontSize={60}
      fill={'#fff'}
      y={300}
      opacity={0}
    />
  );
  yield* text.opacity(1, 0.5);
});

// Scene 5: Call to Action
const ctaScene = makeScene2D('cta', function* (view) {
  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  const commandRef = createRef<Txt>();
  const starRef = createRef<Rect>();

  // Command
  view.add(
    <Txt
      ref={commandRef}
      text={"npm install testeranto@beta"}
      fontSize={60}
      fill={'#00ffaa'}
      y={-100}
      opacity={0}
    />
  );

  // Star button
  view.add(
    <Rect
      ref={starRef}
      width={400}
      height={100}
      fill={'#00ffaa'}
      y={100}
      radius={50}
      opacity={0}
    >
      <Txt text={"Star on GitHub"} fontSize={40} fill={'#1a1a2e'} />
    </Rect>
  );

  // Animate in
  yield* all(
    commandRef().opacity(1, 0.5),
    starRef().opacity(1, 0.5)
  );

  // Pulse animation
  yield* all(
    starRef().scale(1.1, 0.5),
    starRef().scale(1, 0.5)
  );
});

// Scene 6: Type Safety Shield
const typeSafetyScene = makeScene2D('type-safety', function* (view) {
  yield view.add(
    <Rect width={'100%'} height={'100%'} fill={'#1a1a2e'} />
  );

  const shieldRef = createRef<Rect>();
  const errorRef = createRef<Rect>();

  // Create shield
  view.add(
    <Rect
      ref={shieldRef}
      width={400}
      height={600}
      fill={'#00ffaa'}
      radius={200}
      lineWidth={20}
      stroke={'#fff'}
    >
      <Txt
        text={"Type Safety"}
        fontSize={60}
        fill={'#1a1a2e'}
        fontWeight={800}
      />
    </Rect>
  );

  // Create error projectile
  view.add(
    <Rect
      ref={errorRef}
      width={100}
      height={50}
      fill={'#ff5555'}
      x={-800}
      y={0}
      radius={10}
    >
      <Txt text={"TypeError"} fontSize={30} fill={'#fff'} />
    </Rect>
  );

  // Animate error hitting shield
  yield* all(
    errorRef().position.x(-100, 0.5),
    shieldRef().fill('#ff5555', 0.1),
    shieldRef().fill('#00ffaa', 0.1)
  );

  // Shield glow effect
  yield* chain(
    shieldRef().scale(1.1, 0.2),
    shieldRef().scale(1, 0.2)
  );

  // Text
  const text = view.add(
    <Txt
      text={"Type-safe across runtimes"}
      fontSize={60}
      fill={'#fff'}
      y={300}
      opacity={0}
    />
  );
  yield* text.opacity(1, 0.5);
});

export default makeProject({
  scenes: [
    problemScene,
    solutionScene,
    contextScene,
    runtimeScene,
    ctaScene,
    typeSafetyScene
  ],
  settings: {
    shared: {
      size: { x: 1920, y: 1080 },
    },
  },
});
