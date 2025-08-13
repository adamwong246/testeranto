import { makeScene2D, Circle, Txt, Img, Rect } from '@motion-canvas/2d';
import { all, createRef, beginSlide, waitFor } from '@motion-canvas/core';

import testerantoLogo from '../../../../logo.svg';

export default makeScene2D(function* (view) {
  // Set up scene elements
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const aiCode = createRef<Img>();
  const problemText = createRef<Txt>();
  const zoomRect = createRef<Rect>();

  view.add(
    <>
      <Txt
        ref={title}
        text="The AI Code Problem"
        fontSize={60}
        fontWeight={700}
        y={-300}
      />
      <Txt
        ref={subtitle}
        text="Too much code, not enough context"
        fontSize={40}
        opacity={0}
        y={-250}
      />
      <Img
        ref={aiCode}
        src={testerantoLogo}
        width={400}
        opacity={0}
      />
      <Txt
        ref={problemText}
        text=""
        fontSize={32}
        width={800}
        textAlign={'center'}
        y={200}
        opacity={0}
      />
      <Rect
        ref={zoomRect}
        width={200}
        height={200}
        lineWidth={4}
        stroke={'white'}
        opacity={0}
      />
    </>
  );

  // Animation sequence
  yield* title().opacity(1, 1);
  yield* subtitle().opacity(1, 1);
  yield* aiCode().opacity(1, 1);

  yield* beginSlide('show problem');
  yield* problemText().text(
    "AI generates hundreds of files but only 2-3 are relevant\nContext window overflows with useless code",
    1
  );
  yield* problemText().opacity(1, 1);

  yield* beginSlide('zoom in');
  zoomRect().position(aiCode().position());
  yield* all(
    zoomRect().opacity(1, 0.5),
    zoomRect().size([100, 100], 1),
    aiCode().size([600, 600], 1).to([400, 400], 1)
  );

  yield* beginSlide('end scene');
});
