import React from "react";
import { useState, useEffect } from "react";

export type IProps = void;
export type IState = number;

function ReactStateAndHook<IProps, IState>(): React.JSX.Element {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`You have clicked the first button ${count} times`);
  }, [count]);

  return (
    <div>
      <pre>{count}</pre>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default ReactStateAndHook;