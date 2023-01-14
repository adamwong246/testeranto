import React from 'react';

function Storefront({ counter, inc, dec }: {
  counter: number,
  inc: () => void,
  dec: () => void
}) {
  return <div>

    <h2>storefront.tsx</h2>

    <pre id="counter">{counter}</pre>
    <button id="inc" onClick={inc}> plus one</button>
    <button id="dec" onClick={dec}> minus one</button>

  </div>
}

export default Storefront;