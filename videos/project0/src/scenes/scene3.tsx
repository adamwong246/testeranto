import { makeScene2D, Txt, Rect, Img, Circle, Layout } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import durations from '../audio/durations.json';
import howItWorksAudio from '../audio/how_it_works.mp3';

export default makeScene2D(function* (view) {
  // Create background
  const background = createRef<Rect>();
  const title = createRef<Txt>();
  const semanticLayer = createRef<Circle>();
  const gherkinEditor = createRef<Rect>();
  const envSwitcher = createRef<Layout>();
  const promptBuilder = createRef<Layout>();

  view.add(
    <>
      <Rect
        ref={background}
        width={'100%'}
        height={'100%'}
        fill={'#1e1e2e'}
      />
      <Txt
        ref={title}
        text={"How Testeranto Works"}
        fontSize={60}
        fontFamily={'JetBrains Mono'}
        fill={'#cdd6f4'}
        y={-300}
      />
      <Circle
        ref={semanticLayer}
        size={0}
        fill={'rgba(137, 180, 250, 0.2)'}
        lineWidth={4}
        stroke={'#89b4fa'}
      />
      <Rect
        ref={gherkinEditor}
        width={0}
        height={0}
        fill={'#313244'}
        radius={8}
        x={-300}
      />
      <Layout
        ref={envSwitcher}
        layout
        direction={'row'}
        gap={40}
        y={100}
      />
      <Layout
        ref={promptBuilder}
        layout
        direction={'column'}
        gap={20}
        x={300}
      />
    </>
  );

  const totalDuration = durations.how_it_works.duration;
  
  // Debug audio setup
  console.log('Audio duration:', totalDuration);
  
  // Start animations with small buffer
  yield* waitFor(0.5);

  // Semantic layer animation with easing
  yield* all(
    semanticLayer().size(600, 1, easeInOutCubic),
    waitUntil('semantic-layer-complete')
  );

  // Gherkin editor animation with text typing effect
  yield* all(
    gherkinEditor().size([400, 200], 0.5),
    ...(gherkinEditor().findAll<Txt>().map((text, i) =>
      text.opacity(1, 0.3).delay(i * 0.1)
    )),
    waitUntil('gherkin-complete')
  );

  // Add sample Gherkin text
  gherkinEditor().add(
    <Txt
      text="Feature: AI Testing\n  Scenario: Fix broken tests\n    Given a failing test\n    When I analyze with AI\n    Then it should suggest fixes"
      fill="#cdd6f4"
      fontFamily="JetBrains Mono"
      fontSize={18}
      lineHeight={28}
      textAlign="left"
      padding={20}
      opacity={0}
    />
  );

  // Environment switcher
  const envs = ['Browser', 'Node', 'Pure JS'];
  envs.forEach((env, i) => {
    envSwitcher().add(
      <Rect
        width={120}
        height={80}
        fill={'#45475a'}
        radius={8}
      >
        <Txt
          text={env}
          fill={'#cdd6f4'}
          fontFamily={'JetBrains Mono'}
          fontSize={24}
        />
      </Rect>
    );
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
    promptBuilder().add(
      <Rect
        width={200}
        height={40}
        fill={'#585b70'}
        radius={4}
      >
        <Txt
          text={part}
          fill={'#cdd6f4'}
          fontFamily={'JetBrains Mono'}
          fontSize={18}
        />
      </Rect>
    );
  });

  for (let i = 0; i < promptBuilder().children().length; i++) {
    yield* promptBuilder().children()[i].opacity(1, 0.3);
    yield* waitFor(0.2);
  }
  yield* waitUntil('prompt-builder-complete');

  // Fix button animation
  const fixButton = createRef<Rect>();
  view.add(
    <Rect
      ref={fixButton}
      width={200}
      height={60}
      fill={'#a6e3a1'}
      radius={8}
      y={200}
      opacity={0}
    >
      <Txt
        text="Fix Tests"
        fill={'#292F36'}
        fontFamily={'JetBrains Mono'}
        fontSize={24}
        fontWeight={'bold'}
      />
    </Rect>
  );

  yield* all(
    fixButton().opacity(1, 0.5),
    fixButton().scale(1.2, 0.3).to(1, 0.3),
    waitUntil('fix-button-complete')
  );

  // Final buffer - maintain scene timing
  yield* waitFor(totalDuration - 0.5);
});
