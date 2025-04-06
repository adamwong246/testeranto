import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import { Footer } from "./Footer";
const StepPane = ({ step }) => {
    return React.createElement("div", null,
        React.createElement("pre", null,
            React.createElement("code", null, JSON.stringify(step, null, 2))));
};
const TestPane = ({ given, log }) => {
    return React.createElement("div", null,
        "    ",
        React.createElement(Tab.Container, { id: "TestPane-tabs", defaultActiveKey: "first" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 3 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: `bdd-features` }, "features"),
                            ...given.whens.map((w, ndx) => React.createElement(Nav.Link, { eventKey: `bdd-when-${ndx}` },
                                "When ",
                                w.name,
                                " ",
                                w.error && "!")),
                            ...given.thens.map((t, ndx) => React.createElement(Nav.Link, { eventKey: `bdd-then-${ndx}` },
                                "Then ",
                                t.name,
                                " ",
                                t.error && "!")),
                            React.createElement(Nav.Link, { eventKey: `bdd-errors` }, "errors")))),
                React.createElement(Col, { sm: 6 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: `bdd-features` },
                            React.createElement("pre", null,
                                React.createElement("code", null, JSON.stringify(given.features, null, 2)))),
                        ...given.whens.map((w, ndx) => React.createElement(Tab.Pane, { eventKey: `bdd-when-${ndx}` },
                            React.createElement(StepPane, { step: w }))),
                        ...given.thens.map((t, ndx) => React.createElement(Tab.Pane, { eventKey: `bdd-then-${ndx}` },
                            React.createElement(StepPane, { step: t }))),
                        React.createElement(Tab.Pane, { eventKey: `bdd-errors` },
                            React.createElement("pre", null,
                                React.createElement("code", null, JSON.stringify(given.error, null, 2)))))))));
};
const BddPage = () => {
    const [configs, setConfigs] = useState();
    useEffect(() => {
        (async () => {
            fetch('/kokomoBay/docs/testeranto.json')
                .then(response => response.json())
                .then(json => {
                setConfigs(json);
            })
                .catch(error => console.error(error));
        })();
    }, []);
    const [bddErrors, setBddErrors] = useState();
    useEffect(() => {
        (async () => {
            setBddErrors(await (await fetch(`tests.json`)).json());
        })();
    }, [configs]);
    const [log, setLog] = useState();
    useEffect(() => {
        (async () => {
            setLog(await (await fetch(`log.txt`)).text());
        })();
    }, [configs]);
    if (!configs || !bddErrors || !log) {
        return React.createElement("div", null, "loading...");
    }
    return React.createElement("div", null,
        "  ",
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("h2", null, bddErrors.name))),
        React.createElement(Row, null,
            React.createElement(Tab.Container, { id: "root-tab-container", defaultActiveKey: "first" },
                React.createElement(Row, null,
                    React.createElement(Col, { sm: 3 },
                        React.createElement("pre", null,
                            React.createElement("code", null, log))),
                    React.createElement(Col, { sm: 3 },
                        React.createElement(Nav, { variant: "pills", className: "flex-column" }, ...bddErrors.givens.map((g) => React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: g.key },
                                g.key,
                                ": Given ",
                                g.name))))),
                    React.createElement(Col, { sm: 6 },
                        React.createElement(Tab.Content, null, ...bddErrors.givens.map((g) => React.createElement(Tab.Pane, { eventKey: g.key },
                            React.createElement(TestPane, { given: g })))))))),
        React.createElement(Footer, null));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BddPage, {}, []));
    }
});
console.log("hello BddPage!");
