import React from "react";
import ReactDom from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report, {}));
    }
});
export class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: {}
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("style", null, `
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
          `),
            React.createElement("h1", null, "hello report"),
            React.createElement("footer", null,
                "made with \u2764\uFE0F and ",
                React.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
    }
}
