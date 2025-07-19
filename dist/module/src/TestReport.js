import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { Footer } from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
const BddPage = () => {
    // const [configs, setConfigs] = useState<IBuiltConfig>();
    // useEffect(() => {
    //   (async () => {
    //     fetch('../config.json')
    //       .then(response => response.json())
    //       .then(json => {
    //         setConfigs(json)
    //       })
    //       .catch(error => console.error(error));
    //   })();
    // }, []);
    const [bddErrors, setBddErrors] = useState();
    useEffect(() => {
        (async () => {
            try {
                const fetched = await fetch(`${window.location.href
                    .split("/")
                    .slice(0, -1)
                    .join("/")}/tests.json`);
                const testsJson = await (fetched).json();
                setBddErrors(testsJson);
            }
            catch (e) {
                setBddErrors({ error: e });
            }
        })();
    }, []);
    const [log, setLog] = useState();
    useEffect(() => {
        (async () => {
            try {
                setLog(await (await fetch(`${window.location.href.split("/").slice(0, -1).join("/")}/logs.txt`)).text());
            }
            catch (e) {
                setLog({ error: e });
            }
        })();
    }, []);
    if (bddErrors === undefined || log === undefined) {
        return React.createElement("div", null, "loading...");
    }
    return (React.createElement("div", { className: "container-fluid p-4" },
        React.createElement(Tab.Container, { defaultActiveKey: "tests" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 3 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "tests" }, "Test Results")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "logs" }, "Execution Logs")))),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: "tests" }, 'error' in bddErrors ? (React.createElement("div", { className: "alert alert-danger" },
                            React.createElement("h4", null, "Error loading test results"),
                            React.createElement("pre", null, JSON.stringify(bddErrors.error, null, 2)))) : (React.createElement("div", null,
                            React.createElement("h2", null, "Test Results"),
                            bddErrors.name && React.createElement("h3", null, bddErrors.name),
                            bddErrors.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4" },
                                React.createElement("h4", null,
                                    "Given: ",
                                    given.name),
                                React.createElement("ul", { className: "list-group" }, given.whens.map((when, j) => (React.createElement("li", { key: `w-${j}`, className: `list-group-item ${when.error ? 'list-group-item-danger' : 'list-group-item-success'}` },
                                    React.createElement("strong", null, "When:"),
                                    " ",
                                    when.name,
                                    when.error && (React.createElement("div", { className: "mt-2" },
                                        React.createElement("pre", { className: "text-danger" }, when.error))))))),
                                React.createElement("ul", { className: "list-group mt-2" }, given.thens.map((then, k) => (React.createElement("li", { key: `t-${k}`, className: `list-group-item ${then.error ? 'list-group-item-danger' : 'list-group-item-success'}` },
                                    React.createElement("strong", null, "Then:"),
                                    " ",
                                    then.name,
                                    then.error && (React.createElement("div", { className: "mt-2" },
                                        React.createElement("pre", { className: "text-danger" }, then.error))))))))))))),
                        React.createElement(Tab.Pane, { eventKey: "logs" }, typeof log === 'string' ? (React.createElement("div", null,
                            React.createElement("h2", null, "Execution Logs"),
                            React.createElement("pre", { className: "bg-light p-3", style: { maxHeight: '500px', overflow: 'auto' } }, log))) : (React.createElement("div", { className: "alert alert-danger" },
                            React.createElement("h4", null, "Error loading logs"),
                            React.createElement("pre", null, JSON.stringify(log.error, null, 2))))))))),
        React.createElement(Footer, null)));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        if (elem) {
            const root = ReactDom.createRoot(elem);
            root.render(React.createElement(BddPage, {}));
        }
    }
});
