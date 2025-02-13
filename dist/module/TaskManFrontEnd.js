import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import 'bootstrap/dist/css/bootstrap.min.css';
const Report = () => {
    const [state, setState] = useState({
        tests: [],
        buildDir: "",
        // features: new TesterantoFeatures({}, {
        //   undirected: [],
        //   directed: [],
        //   dags: []
        // }),
        results: {}
    });
    const [tests, setTests] = useState({
        tests: [],
        buildDir: ""
    });
    const [features, setFeatures] = useState([]);
    // const [results, setResults] = useState<Record<string, { exitcode, log, testresults, manifest }>>(
    //   {}
    // );
    const importResults = async () => {
        // const features = await import('features.test.js');
        const config = await (await fetch("./testeranto.json")).json();
        const results = await Promise.all(config.tests.map((test) => {
            return new Promise(async (res, rej) => {
                const src = test[0];
                const runtime = test[1];
                const s = [tests.buildDir, runtime].concat(src.split(".").slice(0, -1).join(".")).join("/");
                const exitcode = await (await fetch(config.outdir + "/" + s + "/exitcode")).text();
                const log = await (await fetch(config.outdir + "/" + s + "/log.txt")).text();
                const testresults = await (await fetch(config.outdir + "/" + s + "/tests.json")).json();
                const manifest = await (await fetch(config.outdir + "/" + s + "/manifest.json")).json();
                res({ src, exitcode, log, testresults, manifest });
            });
        }));
        setState({ tests: config.tests, results, buildDir: config.buildDir });
    };
    const importFeatures = async () => {
        fetch('http://localhost:3000/features')
            .then(response => response.json())
            .then(json => setFeatures(json))
            .catch(error => console.error(error));
    };
    useEffect(() => { importFeatures(); }, []);
    const importTests = async () => {
        const x = await fetch("./testeranto.json");
        const y = await x.json();
        setTests(y);
    };
    useEffect(() => { importResults(); }, []);
    // useEffect(() => { importFeatures(); }, []);
    useEffect(() => { importTests(); }, []);
    // useEffect(() => {
    //   const collateResults = async () => {
    //     console.log("collating", tests, features);
    //     const r = tests.tests.reduce(async (p, test) => {
    //       const src: string = test[0];
    //       const runtime: IRunTime = test[1];
    //       console.log(runtime)
    //       const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
    //       const exitcode = await (await fetch(s + "/exitcode")).text()
    //       const log = await (await fetch(s + "/log.txt")).text()
    //       const testresults = await (await fetch(s + "/tests.json")).text()
    //       p[src] = { exitcode, log, testresults }
    //     }, {});
    //     setResults(r);
    //   };
    //   collateResults();
    // }, []);
    return (React.createElement("div", null,
        React.createElement("style", null, `
pre, code, p {
  max-width: 40rem;
  text-wrap: auto;
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
        React.createElement(Tabs, { defaultActiveKey: "manual" },
            React.createElement(Tab, { eventKey: "manual", title: "manual" },
                React.createElement("article", null,
                    React.createElement("h1", null, "Testeranto"),
                    React.createElement("h2", null, "What is testeranto?"),
                    React.createElement("p", null, "Testeranto is a novel testing framework for typescript project. Inspired by Behavior Driven Development, testeranto allows you to wrap you typescript with gherkin-like semantics, producing a report in the form of a static website. Testeranto runs it's tests both in node and chromium."))),
            React.createElement(Tab, { eventKey: "features", title: "features" },
                React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 2 },
                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, (features).map((feature, ndx) => React.createElement(Nav.Item, { key: ndx },
                                React.createElement(Nav.Link, { eventKey: `feature-${ndx}` }, feature.title))))),
                        React.createElement(Col, { sm: 6 },
                            React.createElement(Tab.Content, null, (features).map((feature, ndx) => {
                                // const feature = features[featureKey];
                                return (React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                    React.createElement("pre", null, JSON.stringify(feature, null, 2))));
                            })))))),
            React.createElement(Tab, { eventKey: "tests", title: "tests" },
                React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 4 },
                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, tests.tests.map((t, ndx) => React.createElement(Nav.Item, { key: ndx },
                                React.createElement(Nav.Link, { eventKey: `test-${ndx}` },
                                    t[0],
                                    " - ",
                                    t[1]))))),
                        React.createElement(Col, { sm: 4 },
                            React.createElement(Tab.Content, null, tests.tests.map((t, ndx) => React.createElement(Tab.Pane, { eventKey: `test-${ndx}` },
                                React.createElement("pre", null, JSON.stringify(Object.entries(state.results).filter(([k, v]) => {
                                    console.log(v.src, tests.tests[ndx][0]);
                                    return v.src === tests.tests[ndx][0];
                                }), null, 2))))))))),
            React.createElement(Tab, { eventKey: "kanban", title: "kanban" },
                React.createElement("article", null,
                    React.createElement("h1", null, "kanban goes here"))),
            React.createElement(Tab, { eventKey: "gantt", title: "gantt" },
                React.createElement("article", null,
                    React.createElement("h1", null, "gantt goes here")))),
        React.createElement("footer", null,
            "made with \u2764\uFE0F and ",
            React.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report, {}));
    }
});
