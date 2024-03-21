import React from "react";
import ReactDom from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.min.css';

import { ITestTypes } from "./Project";
import { TesterantoFeatures } from "./Features";

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, {}));
  }
});

export class Report extends React.Component<
  {
    tests: ITestTypes[],
    features: TesterantoFeatures
  }, {
    tests: Record<string, { logs, results }>
  }> {
  constructor(props) {
    super(props);

    this.state = {
      tests: {}
    };
  }

  render() {
    return (
      <div>
        <style>
          {`
pre, code, p {
  max-width: 30rem;
}
footer {
  background-color: lightgray;
  margin: 0.5rem;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  right: 0;
}
          `}
        </style>

        <h1>hello report</h1>

        <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

      </div >

    );
  }
}


