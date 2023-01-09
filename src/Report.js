import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
export function Report() {
    var _a;
    const [data, setData] = useState({
        configs: {},
        features: {
            features: []
        },
        tests: [],
        featureTests: {},
        summaries: { dags: [], directed: [], undirected: [] }
    });
    const getData = async () => {
        const configs = await (await fetch('testeranto.config.json')).json();
        const features = await (await fetch('TesterantoFeatures.json')).json();
        const featureTests = await (await fetch('results/featureTestJoin.json')).json();
        const summaries = await (await fetch('report.json')).json();
        const testPromises = await configs.tests.map(async (test) => {
            return await (await (await fetch(`results/${test[0]}.json`)).json());
        });
        const tests = await Promise.all(testPromises);
        setData({ configs, features, tests, featureTests, summaries });
    };
    useEffect(() => { getData(); }, []);
    return (React.createElement("div", null,
        data && data.configs && React.createElement(React.Fragment, null,
            React.createElement(Tabs, { defaultActiveKey: "home" },
                React.createElement(Tab, { eventKey: "home", title: "config" },
                    React.createElement("pre", null,
                        React.createElement("code", null, JSON.stringify(data.configs, null, 2)))),
                React.createElement(Tab, { eventKey: "features", title: "features" },
                    React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 3 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.features.features.map((feature, ndx) => React.createElement(Nav.Item, { key: ndx },
                                    React.createElement(Nav.Link, { eventKey: `feature-${ndx}` }, feature.name))))),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(Tab.Content, null, data.features.features.map((feature, ndx) => React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                    React.createElement("p", null, feature.name),
                                    React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "relations-0" },
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 3 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, feature.inNetworks.map((summary, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `relations-${ndx2}` }, summary.network))))),
                                            React.createElement(Col, { sm: 9 },
                                                React.createElement(Tab.Content, null, feature.inNetworks.map((summary, ndx2) => React.createElement(Tab.Pane, { eventKey: `relations-${ndx2}`, key: ndx2 },
                                                    React.createElement("pre", null, JSON.stringify(summary.neighbors, null, 2))))))))))))))),
                React.createElement(Tab, { eventKey: "results", title: "tests" },
                    React.createElement(Tab.Container, { id: "left-tabs-example", defaultActiveKey: "first" },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 3 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.tests.map((suite, ndx) => React.createElement(Nav.Item, { key: ndx },
                                    React.createElement(Nav.Link, { eventKey: `suite-${ndx}` },
                                        (suite.fails.length > 0 ? `❌ * ${suite.fails.length.toString()}` : `✅ * ${suite.givens.length.toString()}`),
                                        " - ",
                                        suite.name))))),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(Tab.Content, null, data.tests.map((suite, ndx) => React.createElement(Tab.Pane, { eventKey: `suite-${ndx}`, key: ndx },
                                    React.createElement(Tab.Container, { id: "left-tabs-example2", defaultActiveKey: `given-0` },
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 3 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, suite.givens.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `given-${ndx2}` },
                                                        (g.errors ? `❌` : `✅`),
                                                        " - ",
                                                        g.name))))),
                                            React.createElement(Col, { sm: 9 },
                                                React.createElement(Tab.Content, null, suite.givens.map((g, ndx2) => React.createElement(Tab.Pane, { key: ndx2, eventKey: `given-${ndx2}` },
                                                    React.createElement("p", null, "when"),
                                                    React.createElement("ul", null, g.whens.map((w, ndx3) => React.createElement("li", { key: ndx3 },
                                                        (w.error === true ? `❌` : `✅`),
                                                        " - ",
                                                        w.name))),
                                                    React.createElement("p", null, "then"),
                                                    React.createElement("ul", null, g.thens.map((t, ndx3) => React.createElement("li", { key: ndx3 },
                                                        React.createElement("p", null,
                                                            (t.error === true ? `❌` : `✅`),
                                                            " - ",
                                                            t.name)))),
                                                    React.createElement("pre", null,
                                                        React.createElement("code", null, JSON.stringify(g.errors, null, 2)))))))))))))))),
                React.createElement(Tab, { eventKey: "featureTests", title: "feature-tests" },
                    React.createElement(Tab.Container, { id: "left-tabs-example7", defaultActiveKey: "first" },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 3 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, Object.keys(data.featureTests).map((ftKey, ndx) => React.createElement(Nav.Item, { key: ndx },
                                    React.createElement(Nav.Link, { eventKey: `featureTests-${ndx}` },
                                        Object.values(data.featureTests[ftKey]).reduce((testMemo, test) => test.errors) ? `❌` : `✅`,
                                        " ",
                                        ftKey))))),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(Tab.Content, null, Object.keys(data.featureTests).map((ftKey, ndx) => React.createElement(Tab.Pane, { eventKey: `featureTests-${ndx}`, key: ndx },
                                    React.createElement(Tab.Container, { id: "left-tabs-example8", defaultActiveKey: `ft-suite-0` },
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 6 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.featureTests[ftKey].map((s, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `ft-suite-${ndx2}` },
                                                        s.errors ? `❌` : `✅`,
                                                        " ",
                                                        React.createElement("strong", null, s.testKey),
                                                        "  ",
                                                        React.createElement("em", null, s.name)))))),
                                            React.createElement(Col, { sm: 6 },
                                                React.createElement(Tab.Content, null, data.featureTests[ftKey].map((g, ndx2) => React.createElement(Tab.Pane, { key: ndx2, eventKey: `ft-suite-${ndx2}` },
                                                    React.createElement("p", null, "when"),
                                                    React.createElement("ul", null, g.whens.map((w, ndx3) => React.createElement("li", { key: ndx3 },
                                                        React.createElement("p", null, w)))),
                                                    React.createElement("p", null, "then"),
                                                    React.createElement("ul", null, g.thens.map((t, ndx3) => React.createElement("li", { key: ndx3 },
                                                        React.createElement("p", null, t)))),
                                                    React.createElement("pre", null,
                                                        React.createElement("code", null, JSON.stringify(g.errors, null, 2)))))))))))))))),
                React.createElement(Tab, { eventKey: "networks", title: "networks" },
                    React.createElement(Tab.Container, { id: "left-tabs-example88", defaultActiveKey: `networks-dags` },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 3 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" },
                                    React.createElement(Nav.Link, { eventKey: `networks-dags` }, "DAG"),
                                    React.createElement(Nav.Link, { eventKey: `networks-directed` }, "Directed (not acyclic)"),
                                    React.createElement(Nav.Link, { eventKey: `networks-undirected` }, "Undirected"))),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(Tab.Content, null,
                                    React.createElement(Tab.Pane, { eventKey: `networks-dags` },
                                        React.createElement(Tab.Container, { defaultActiveKey: `networks-dags-0` },
                                            React.createElement(Row, null,
                                                React.createElement(Col, { sm: 3 },
                                                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.summaries.dags.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                        React.createElement(Nav.Link, { eventKey: `networks-dags-${ndx2}` }, g.name))))),
                                                React.createElement(Col, { sm: 9 },
                                                    React.createElement(Tab.Content, null,
                                                        React.createElement("p", null, "idk dags")))))),
                                    React.createElement(Tab.Pane, { eventKey: `networks-directed` },
                                        React.createElement(Tab.Container, { defaultActiveKey: `networks-directed-0` },
                                            React.createElement(Row, null,
                                                React.createElement(Col, { sm: 3 },
                                                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.summaries.directed.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                        React.createElement(Nav.Link, { eventKey: `networks-directed-${ndx2}` }, g.name))))),
                                                React.createElement(Col, { sm: 9 },
                                                    React.createElement(Tab.Content, null,
                                                        React.createElement("p", null, "idk directed")))))),
                                    React.createElement(Tab.Pane, { eventKey: `networks-undirected` },
                                        React.createElement(Tab.Container, { defaultActiveKey: `networks-undirected-0` },
                                            React.createElement(Row, null,
                                                React.createElement(Col, { sm: 3 },
                                                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, data.summaries.undirected.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                        React.createElement(Nav.Link, { eventKey: `networks-undirected-${ndx2}` }, g.name))))),
                                                React.createElement(Col, { sm: 9 },
                                                    React.createElement(Tab.Content, null,
                                                        React.createElement("p", null, "idk undirected"))))))))))),
                React.createElement(Tab, { eventKey: "summary", title: "summaries" },
                    React.createElement(Tab.Container, { id: "left-tabs-example3", defaultActiveKey: `summary-0` },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 3 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, (_a = data.summaries.dags) === null || _a === void 0 ? void 0 : _a.map((summary, ndx) => React.createElement(Nav.Item, { key: ndx },
                                    React.createElement(Nav.Link, { eventKey: `summary-${ndx}` }, summary.name))))),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(Tab.Content, null, Object.keys(data.summaries.dags).map((summaryKey, ndx2) => React.createElement(Tab.Pane, { key: ndx2, eventKey: `summary-${ndx2}` },
                                    React.createElement("pre", null,
                                        React.createElement("code", null, JSON.stringify(data.summaries.dags[summaryKey].dagReduction, null, 2)))))))))))),
        !data && React.createElement("p", null, "LOADING"),
        React.createElement("footer", { style: { position: 'fixed', bottom: 0, right: 0 } },
            "made with \u2764\uFE0F and ",
            React.createElement("a", { href: "https://adamwong246.github.io/testeranto.ts/" }, "testeranto.ts"))));
}
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report));
    }
});
