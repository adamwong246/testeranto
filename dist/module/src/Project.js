/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab, Table } from "react-bootstrap";
import { Footer } from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
const BigBoard = () => {
    const bigConfigElement = document.getElementById("bigConfig");
    if (!bigConfigElement)
        throw new Error("bigConfig element not found");
    const projects = JSON.parse(bigConfigElement.innerHTML);
    const [summary, setSummary] = useState();
    const [nodeLogs, setNodeLogs] = useState({});
    const [webLogs, setWebLogs] = useState({});
    const [pureLogs, setPureLogs] = useState({});
    const [activeTab, setActiveTab] = useState("node");
    const fetchLogs = async (project) => {
        try {
            const [nodeRes, webRes, pureRes] = await Promise.all([
                fetch(`./testeranto/bundles/node/${project}/metafile.json`),
                fetch(`./testeranto/bundles/web/${project}/metafile.json`),
                fetch(`./testeranto/bundles/pure/${project}/metafile.json`),
            ]);
            setNodeLogs({ [project]: await nodeRes.json() });
            setWebLogs({ [project]: await webRes.json() });
            setPureLogs({ [project]: await pureRes.json() });
        }
        catch (error) {
            console.error("Error fetching logs:", error);
            setNodeLogs({ [project]: "ERROR" });
            setNodeLogs({ [project]: "ERROR" });
            setNodeLogs({ [project]: "ERROR" });
        }
    };
    useEffect(() => {
        (async () => {
            const x = projects.map(async (p) => {
                fetchLogs(p);
                return [
                    p,
                    (await (await fetch(`./testeranto/reports/${p}/config.json`)).json()),
                    (await (await fetch(`./testeranto/reports/${p}/summary.json`)).json()),
                ];
            });
            Promise.all(x).then((v) => {
                setSummary(v);
            });
        })();
    }, []);
    if (!summary || (summary === null || summary === void 0 ? void 0 : summary.length) === 0) {
        return React.createElement("div", null, "loading...");
    }
    return (React.createElement("div", { className: "container-fluid" },
        React.createElement(Tab.Container, { defaultActiveKey: "node" },
            React.createElement("nav", { className: "navbar navbar-expand-lg navbar-light bg-light mb-3 rounded" },
                React.createElement("div", { className: "container-fluid" },
                    React.createElement("span", { className: "navbar-brand text-muted" }, "Project: testeranto"),
                    React.createElement(Nav, { variant: "pills", className: "me-auto", activeKey: activeTab, onSelect: (k) => setActiveTab(k || "node") },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "projects" }, "Test Results")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "node" }, "Node Build")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "web" }, "Web Build")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "pure" }, "Pure Build"))))),
            React.createElement(Row, null,
                React.createElement(Tab.Content, null,
                    React.createElement(Tab.Pane, { eventKey: "node" },
                        Object.keys(nodeLogs).length > 0 && (React.createElement("div", { className: `alert ${Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0)
                                ? 'alert-success'
                                : 'alert-danger'} d-flex justify-content-between align-items-center` },
                            React.createElement("span", null, Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0)
                                ? '✅ All Node builds passed successfully'
                                : '❌ Some Node builds failed'),
                            !Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0) && (React.createElement("button", { onClick: () => alert('AI debugger coming soon!'), className: "btn btn-sm btn-primary", title: "Get AI help debugging these build failures" }, "\uD83E\uDD16\uD83E\uDE84\u2728")))),
                        React.createElement("pre", { style: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' } }, JSON.stringify(nodeLogs, null, 2))),
                    React.createElement(Tab.Pane, { eventKey: "web" },
                        Object.keys(webLogs).length > 0 && (React.createElement("div", { className: `alert ${Object.values(webLogs).every(log => !log.errors || log.errors.length === 0)
                                ? 'alert-success'
                                : 'alert-danger'} d-flex justify-content-between align-items-center` },
                            React.createElement("span", null, Object.values(webLogs).every(log => !log.errors || log.errors.length === 0)
                                ? '✅ All Web builds passed successfully'
                                : '❌ Some Web builds failed'),
                            !Object.values(webLogs).every(log => !log.errors || log.errors.length === 0) && (React.createElement("button", { onClick: () => alert('AI debugger coming soon!'), className: "btn btn-sm btn-primary", title: "Get AI help debugging these build failures" }, "\uD83E\uDD16\uD83E\uDE84\u2728")))),
                        React.createElement("pre", { style: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' } }, JSON.stringify(webLogs, null, 2))),
                    React.createElement(Tab.Pane, { eventKey: "pure" },
                        Object.keys(pureLogs).length > 0 && (React.createElement("div", { className: `alert ${Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0)
                                ? 'alert-success'
                                : 'alert-danger'} d-flex justify-content-between align-items-center` },
                            React.createElement("span", null, Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0)
                                ? '✅ All Pure builds passed successfully'
                                : '❌ Some Pure builds failed'),
                            !Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0) && (React.createElement("button", { onClick: () => alert('AI debugger coming soon!'), className: "btn btn-sm btn-primary", title: "Get AI help debugging these build failures" }, "\uD83E\uDD16\uD83E\uDE84\u2728")))),
                        React.createElement("pre", { style: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' } }, JSON.stringify(pureLogs, null, 2))),
                    React.createElement(Tab.Pane, { eventKey: "projects" },
                        React.createElement(Tab.Container, { defaultActiveKey: projects[0] },
                            React.createElement(Row, null,
                                React.createElement(Col, { sm: 3 },
                                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, projects.map((project) => (React.createElement(Nav.Item, { key: project },
                                        React.createElement(Nav.Link, { eventKey: project }, project)))))),
                                React.createElement(Col, { sm: 9 },
                                    React.createElement(Tab.Content, null, projects.map((project) => (React.createElement(Tab.Pane, { key: project, eventKey: project },
                                        React.createElement(Table, null,
                                            React.createElement(Table, null,
                                                React.createElement("thead", null,
                                                    React.createElement("tr", null,
                                                        React.createElement("th", null, "project"),
                                                        React.createElement("th", null, "platform"),
                                                        React.createElement("th", null, "BDD errors"),
                                                        React.createElement("th", null, "Lint errors"),
                                                        React.createElement("th", null, "Type errors"))),
                                                React.createElement("tbody", null, ...summary.map((s) => {
                                                    return (React.createElement(React.Fragment, null,
                                                        React.createElement("tr", null,
                                                            React.createElement("th", null, s[0])),
                                                        ...s[1].tests.map((t) => {
                                                            const x = `${s[0]}/${t[0]
                                                                .split(".")
                                                                .slice(0, -1)
                                                                .join(".")}/${t[1]}`;
                                                            const y = s[2][t[0]];
                                                            if (!y)
                                                                return React.createElement("pre", null, "ERROR");
                                                            return (React.createElement("tr", null,
                                                                React.createElement("td", null, t[0]),
                                                                React.createElement("td", null, t[1]),
                                                                React.createElement("td", null,
                                                                    React.createElement("a", { href: `./testeranto/reports/${x}/index.html` },
                                                                        (y.runTimeErrors < 0) && "‼️ Tests did not complete",
                                                                        y.runTimeErrors === 0 && "✅ All tests passed",
                                                                        y.runTimeErrors > 0 && `⚠️ ${y.runTimeErrors} failures`)),
                                                                React.createElement("td", null,
                                                                    React.createElement("a", { href: `./testeranto/reports/${x}/lint_errors.json` }, y.staticErrors)),
                                                                React.createElement("td", null,
                                                                    React.createElement("a", { href: `./testeranto/reports/${x}/type_errors.txt` }, y.typeErrors))));
                                                        })));
                                                }))))))))))))))),
        React.createElement(Footer, null)));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}));
    }
});
