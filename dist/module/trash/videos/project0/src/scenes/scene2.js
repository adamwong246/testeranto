import { makeScene2D, Txt, Rect, Circle, Layout } from '@motion-canvas/2d';
import { createRef, waitFor } from '@motion-canvas/core';
import durations from '../audio/durations.json';
// logo is broken ATM
// import testerantoLogo from '../../../logo.svg';
export default makeScene2D(function* (view) {
    // Create background
    const background = createRef();
    const title = createRef();
    const logoContainer = createRef();
    const testFailures = createRef();
    // console.log('Logo path:', testerantoLogo); // Debug logo path
    view.add(React.createElement(React.Fragment, null,
        React.createElement(Rect, { ref: background, width: '100%', height: '100%', fill: '#1e1e2e' }),
        React.createElement(Txt, { ref: title, text: "Testeranto's Solution", fontSize: 60, fontFamily: 'JetBrains Mono', fill: '#cdd6f4', y: -300 }),
        React.createElement(Layout, { ref: testFailures, layout: true, direction: 'column', gap: 20, width: 800, height: 600 }),
        React.createElement(Circle, { ref: logoContainer, size: 0, fill: '#1e1e2e' })));
    // Animation sequence - timed to audio
    // console.log('Solution audio duration:', durations.solution.duration);
    const totalDuration = durations.solution.duration;
    // // Create test failure indicators
    // const failures = [
    //   'Test failed: User login',
    //   'Test failed: API response',
    //   'Test failed: Data validation',
    //   'Test failed: UI rendering'
    // ];
    // failures.forEach((failure, i) => {
    //   testFailures().add(
    //     <Txt
    //       text={failure}
    //       fontSize={32}
    //       fontFamily={'JetBrains Mono'}
    //       fill={'#f38ba8'}
    //       opacity={0}
    //     />
    //   );
    // });
    // Animate test failures appearing with sequenced timing
    for (let i = 0; i < testFailures().children().length; i++) {
        yield* testFailures().children()[i].opacity(1, 0.5);
        yield* waitFor(0.2);
    }
    // Transform failures into logo with smooth transition
    // yield* all(
    //   ...testFailures().children().map((child, i) =>
    //     child.opacity(0, 0.3).delay(i * 0.1)
    //   ),
    //   logoContainer().size(300, 1),
    //   logoContainer().findFirst<Img>().opacity(1, 0.5)
    // );
    // // Blue pulse effect with logo scaling
    // for (let i = 0; i < 3; i++) {
    //   yield* all(
    //     logoContainer().fill('#89b4fa', 0.2).to('#1e1e2e', 0.2),
    //     logoContainer().findFirst<Img>()
    //       .scale(1.1, 0.2)
    //       .to(1, 0.2)
    //   );
    // }
    // Add BDD orbiting elements
    const bddOrbit = createRef();
    view.add(React.createElement(Layout, { ref: bddOrbit, rotation: 0 },
        React.createElement(Circle, { fill: "#E6B422", size: 40, y: -80 },
            React.createElement(Txt, { text: "GIVEN", fill: "#292F36", fontFamily: 'JetBrains Mono', fontSize: 14 })),
        React.createElement(Circle, { fill: "#FF6B6B", size: 40, x: 80 },
            React.createElement(Txt, { text: "WHEN", fill: "#292F36", fontFamily: 'JetBrains Mono', fontSize: 14 })),
        React.createElement(Circle, { fill: "#4ECDC4", size: 40, y: 80 },
            React.createElement(Txt, { text: "THEN", fill: "#292F36", fontFamily: 'JetBrains Mono', fontSize: 14 }))));
    // Animate BDD orbit
    yield* bddOrbit().rotation(360, 4);
    // Show solution text
    yield* title().text("Harnessing AI with BDD Control", totalDuration * 0.2);
    yield* waitFor(totalDuration * 0.2); // Final buffer
});
