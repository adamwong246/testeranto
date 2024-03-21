import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TesterantoFeatures } from "./Features";
const graphToIGraphData = (g) => {
    return {
        nodes: g.nodes().map((n) => {
            return {
                id: n,
                label: n
            };
        }),
        edges: g.mapEdges((id, attributes, source, target) => {
            return {
                id,
                label: id,
                source,
                target,
            };
        })
    };
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report, {}));
    }
});
const Report = () => {
    const [tests, setTests] = useState([]);
    const [features, setFeatures] = useState(new TesterantoFeatures({}, {
        undirected: [],
        directed: [],
        dags: []
    }));
    useEffect(() => {
        const importTests = async () => {
            const module = await import('tests.test.js');
            setTests(module.default);
        };
        importTests();
    }, []);
    useEffect(() => {
        const importFeatures = async () => {
            const module = await import('features.test.js');
            setFeatures(module.default);
        };
        importFeatures();
    }, []);
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
        features && tests && React.createElement(Tabs, { defaultActiveKey: "home" },
            React.createElement(Tab, { eventKey: "home", title: "config" },
                React.createElement("pre", null, JSON.stringify(features, null, 2)),
                React.createElement("pre", null, JSON.stringify(tests, null, 2))),
            React.createElement(Tab, { eventKey: "features", title: "features" },
                React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 2 },
                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, Object.keys(features.features).map((featureKey, ndx) => React.createElement(Nav.Item, { key: ndx },
                                React.createElement(Nav.Link, { eventKey: `feature-${ndx}` }, featureKey))))),
                        React.createElement(Col, { sm: 6 },
                            React.createElement(Tab.Content, null, Object.keys(features.features).map((featureKey, ndx) => {
                                const feature = features[featureKey];
                                return (React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                    React.createElement("pre", null, JSON.stringify(feature, null, 2))));
                            }))),
                        React.createElement(Col, { sm: 4 },
                            React.createElement(Tabs, { defaultActiveKey: "feature.networks" },
                                React.createElement(Tab, { eventKey: "feature.networks", title: "networks" },
                                    React.createElement(Tabs, { defaultActiveKey: "dag" },
                                        React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.dags, null, 2)))),
                                        React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.directed, null, 2)))),
                                        React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.undirected, null, 2)))))),
                                React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(tests, null, 2)))))))),
            React.createElement(Tab, { eventKey: "networks", title: "networks" },
                React.createElement(Tab.Container, { id: "left-tabs-example88", defaultActiveKey: `dag` },
                    React.createElement(Row, null,
                        React.createElement(Tabs, { defaultActiveKey: "dag" },
                            React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                React.createElement(Tab.Content, null,
                                    React.createElement(Row, null,
                                        React.createElement(Col, { sm: 2 },
                                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, features.graphs.dags.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                React.createElement(Nav.Link, { eventKey: `networks-dags-${ndx2}` }, g.name))))),
                                        React.createElement(Col, { sm: 6 },
                                            React.createElement(Tab.Content, null, features.graphs.dags[0] && React.createElement(React.Fragment, null,
                                                React.createElement(Sigma, { graph: graphToIGraphData(features.graphs.dags[0].graph), settings: { drawEdges: true, clone: false } },
                                                    React.createElement(RelativeSize, { initialSize: 25 }),
                                                    React.createElement(RandomizeNodePositions, null)),
                                                React.createElement("pre", null, JSON.stringify(features.graphs.dags[0].graph, null, 2))))),
                                        React.createElement(Col, { sm: 4 },
                                            React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(features, null, 2))),
                                                React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(tests, null, 2)))))))),
                            React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                React.createElement(Tab.Content, null,
                                    React.createElement(Row, null,
                                        React.createElement(Col, { sm: 2 },
                                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, features.graphs.directed.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                React.createElement(Nav.Link, { eventKey: `networks-directed-${ndx2}` }, g.name))))),
                                        React.createElement(Col, { sm: 6 },
                                            React.createElement(Tab.Content, null, features.graphs.directed[0] && React.createElement(React.Fragment, null,
                                                React.createElement(Sigma, { graph: graphToIGraphData(features.graphs.directed[0].graph), settings: { drawEdges: true, clone: false } },
                                                    React.createElement(RelativeSize, { initialSize: 25 }),
                                                    React.createElement(RandomizeNodePositions, null)),
                                                React.createElement("pre", null, JSON.stringify(features.graphs.directed[0].graph, null, 2))))),
                                        React.createElement(Col, { sm: 4 },
                                            React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(features, null, 2))),
                                                React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(tests, null, 2)))))))),
                            React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                React.createElement(Tab.Content, null,
                                    React.createElement(Row, null,
                                        React.createElement(Col, { sm: 2 },
                                            React.createElement(Nav, { variant: "pills", className: "flex-column" }, features.graphs.undirected.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                React.createElement(Nav.Link, { eventKey: `networks-undirected-${ndx2}` }, g.name))))),
                                        React.createElement(Col, { sm: 6 },
                                            React.createElement(Tab.Content, null, features.graphs.undirected[0] && React.createElement(React.Fragment, null,
                                                React.createElement(Sigma, { graph: graphToIGraphData(features.graphs.undirected[0].graph), settings: { drawEdges: true, clone: false } },
                                                    React.createElement(RelativeSize, { initialSize: 25 }),
                                                    React.createElement(RandomizeNodePositions, null)),
                                                React.createElement("pre", null, JSON.stringify(features.graphs.undirected[0].graph, null, 2))))),
                                        React.createElement(Col, { sm: 4 },
                                            React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(features, null, 2))),
                                                React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(tests, null, 2)))))))))))),
            React.createElement(Tab, { eventKey: "results", title: "tests" },
                React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 2 }),
                        React.createElement(Col, { sm: 6 },
                            React.createElement(Tab.Content, null, tests.map((t, ndx) => {
                                return (React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                    React.createElement("pre", null, JSON.stringify(t, null, 2))));
                            }))),
                        React.createElement(Col, { sm: 4 },
                            React.createElement(Tabs, { defaultActiveKey: "feature.networks" },
                                React.createElement(Tab, { eventKey: "feature.networks", title: "networks" },
                                    React.createElement(Tabs, { defaultActiveKey: "dag" },
                                        React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.dags, null, 2)))),
                                        React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.directed, null, 2)))),
                                        React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                            React.createElement(Tab.Content, null,
                                                React.createElement("pre", null, JSON.stringify(features.graphs.undirected, null, 2)))))),
                                React.createElement(Tab, { eventKey: "tests.features", title: "features" },
                                    React.createElement("pre", { id: "theProps" }, JSON.stringify(features, null, 2))))))))),
        React.createElement("footer", null,
            "made with \u2764\uFE0F and ",
            React.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
};
