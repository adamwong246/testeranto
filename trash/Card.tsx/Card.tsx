import React, { useState } from 'react';

export type ICardProps = {
  title: string,
  paragraph: string
}

export const Card = ({ title, paragraph }: ICardProps) => {
  const [count, setCount] = useState(0);

  return (<aside>
    <h2>{title}</h2>
    <p>
      {paragraph}
    </p>
    <pre>Count: {count}</pre>
    <button onClick={(e) => setCount(count + 1)}>count plus 1</button>
  </aside>)
}

export type ICard = ({ title, paragraph }: ICardProps) => JSX.Element 