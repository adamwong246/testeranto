import { makeScene2D, Txt, Rect } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';
import problemAudio from '../audio/problem.mp3'; // Ensure this path is correct
import durations from '../audio/durations.json';
import { Layout } from '@motion-canvas/2d';

// import testerantoLogo from '../../../../logo.svg';


// import { all, createRef, waitFor, waitUntil } from '@motion-canvas/core';
import { CodeBlock } from '@motion-canvas/2d/lib/components/CodeBlock';
import { createSignal } from '@motion-canvas/core/lib/signals';

export default makeScene2D(function* (view) {
  // Create background
  const background = createRef<Rect>();
  const title = createRef<Txt>();
  const codeExplosion = createRef<Layout>();
  const codeCount = createSignal(0);

  // console.log('Logo path:', testerantoLogo); // Debug logo path
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
        text={"AI has changed the game forever"}
        fontSize={60}
        fontFamily={'JetBrains Mono'}
        fill={'#cdd6f4'}
        y={-300}
        opacity={0}
      />
      <Layout
        ref={codeExplosion}
        layout
        direction={'column'}
        gap={20}
        wrap={'wrap'}
        width={1000}
        height={600}
      />
    </>
  );

  // Animation sequence - perfectly timed to audio
  const totalDuration = durations.problem.duration;

  // Audio synchronization setup
  const audioOffset = 0.5; // Start animation 0.5s before audio
  yield* waitFor(audioOffset);

  // Start audio playback with precise timing
  try {
    yield* all(
      title().opacity(1, totalDuration * 0.08), // ~1.5s for title
      waitFor(totalDuration * 0.08 - audioOffset)
    );
  } catch (error) {
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

    codeExplosion().add(
      <CodeBlock
        code={`// ${file}`}
        fontSize={24}
        fontFamily={'JetBrains Mono'}
        fill={color}
        x={x}
        y={y}
        scale={scale}
        opacity={0}
      />
    );
    codeCount(codeCount() + 1);
    yield* waitFor(explosionDuration / 50); // Divide by number of iterations
  }

  // Files appear
  yield* all(
    ...codeExplosion().children().map(child =>
      child.opacity(1, totalDuration * 0.08)
    )
  );

  // Highlight relevant files
  const relevantFiles = codeExplosion().children().slice(0, 3);
  yield* all(
    ...relevantFiles.map(file =>
      file.scale(2, totalDuration * 0.08).to(1, totalDuration * 0.08)
    )
  );

  // Zoom effect
  yield* all(
    ...relevantFiles.map(file =>
      file.scale(3, totalDuration * 0.11).to(2, totalDuration * 0.11)
    )
  );

  // Final message
  yield* all(
    title().text("AI has changed testing forever", totalDuration * 0.11),
    ...relevantFiles.map(file =>
      file.fill('#a6e3a1', totalDuration * 0.11)
    )
  );
  yield* waitFor(totalDuration * 0.2); // Final buffer
});
