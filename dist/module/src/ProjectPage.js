import React, { useEffect, useState } from 'react';
import { Tab } from 'react-bootstrap';
import { Card, ListGroup, Badge } from 'react-bootstrap';
const BuildLogViewer = ({ logs, runtime }) => {
    var _a, _b, _c, _d, _e, _f;
    if (!logs)
        return React.createElement(Alert, { variant: "info" },
            "Loading ",
            runtime.toLowerCase(),
            " build logs...");
    const hasErrors = ((_a = logs.errors) === null || _a === void 0 ? void 0 : _a.length) > 0;
    const hasWarnings = ((_b = logs.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0;
    const [activeTab, setActiveTab] = useState('summary');
    return (React.createElement("div", null,
        React.createElement(Tab.Container, { activeKey: activeTab, onSelect: (k) => setActiveTab(k || 'summary') },
            React.createElement(Nav, { variant: "tabs", className: "mb-3" },
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "summary" }, "Build Summary")),
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "warnings" }, hasWarnings ? `⚠️ Warnings (${logs.warnings.length})` : 'Warnings')),
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "errors" }, hasErrors ? `❌ Errors (${logs.errors.length})` : 'Errors'))),
            React.createElement(Tab.Content, null,
                React.createElement(Tab.Pane, { eventKey: "summary" },
                    React.createElement(Card, null,
                        React.createElement(Card.Header, { className: "d-flex justify-content-between align-items-center" },
                            React.createElement("h5", null, "Build Summary"),
                            React.createElement("div", null,
                                hasErrors && (React.createElement(Badge, { bg: "danger", className: "me-2" },
                                    logs.errors.length,
                                    " Error",
                                    logs.errors.length !== 1 ? 's' : '')),
                                hasWarnings && (React.createElement(Badge, { bg: "warning", text: "dark" },
                                    logs.warnings.length,
                                    " Warning",
                                    logs.warnings.length !== 1 ? 's' : '')),
                                !hasErrors && !hasWarnings && (React.createElement(Badge, { bg: "success" }, "Build Successful")))),
                        React.createElement(Card.Body, null,
                            React.createElement("div", { className: "mb-3" },
                                React.createElement("h6", null,
                                    "Input Files (",
                                    Object.keys(((_c = logs.metafile) === null || _c === void 0 ? void 0 : _c.inputs) || {}).length,
                                    ")"),
                                React.createElement(ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_d = logs.metafile) === null || _d === void 0 ? void 0 : _d.inputs) || {}).map((file) => (React.createElement(ListGroup.Item, { key: file, className: "py-2" },
                                    React.createElement("code", null, file),
                                    React.createElement("div", { className: "text-muted small" },
                                        logs.metafile.inputs[file].bytes,
                                        " bytes")))))),
                            React.createElement("div", null,
                                React.createElement("h6", null,
                                    "Output Files (",
                                    Object.keys(((_e = logs.metafile) === null || _e === void 0 ? void 0 : _e.outputs) || {}).length,
                                    ")"),
                                React.createElement(ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_f = logs.metafile) === null || _f === void 0 ? void 0 : _f.outputs) || {}).map((file) => (React.createElement(ListGroup.Item, { key: file, className: "py-2" },
                                    React.createElement("code", null, file),
                                    React.createElement("div", { className: "text-muted small" },
                                        logs.metafile.outputs[file].bytes,
                                        " bytes",
                                        logs.metafile.outputs[file].entryPoint && (React.createElement("span", { className: "ms-2 badge bg-info" }, "Entry Point"))))))))))),
                React.createElement(Tab.Pane, { eventKey: "warnings" }, hasWarnings ? (React.createElement(Card, { className: "border-warning" },
                    React.createElement(Card.Header, { className: "bg-warning text-white d-flex justify-content-between align-items-center" },
                        React.createElement("span", null,
                            "Build Warnings (",
                            logs.warnings.length,
                            ")"),
                        React.createElement(Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    React.createElement(Card.Body, { className: "p-0" },
                        React.createElement(ListGroup, { variant: "flush" }, logs.warnings.map((warn, i) => {
                            var _a, _b;
                            return (React.createElement(ListGroup.Item, { key: i, className: "text-warning" },
                                React.createElement("div", { className: "d-flex justify-content-between" },
                                    React.createElement("strong", null,
                                        ((_a = warn.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = warn.location) === null || _b === void 0 ? void 0 : _b.line) && `:${warn.location.line}`),
                                    React.createElement("small", { className: "text-muted" }, warn.pluginName ? `[${warn.pluginName}]` : '')),
                                React.createElement("div", { className: "mt-1" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, warn.text || warn.message || JSON.stringify(warn))),
                                warn.detail && (React.createElement("div", { className: "mt-1 small text-muted" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, warn.detail)))));
                        }))))) : (React.createElement(Alert, { variant: "info" }, "No warnings found"))),
                React.createElement(Tab.Pane, { eventKey: "errors" }, hasErrors ? (React.createElement(Card, { className: "border-danger" },
                    React.createElement(Card.Header, { className: "bg-danger text-white d-flex justify-content-between align-items-center" },
                        React.createElement("span", null,
                            "Build Errors (",
                            logs.errors.length,
                            ")"),
                        React.createElement(Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    React.createElement(Card.Body, { className: "p-0" },
                        React.createElement(ListGroup, { variant: "flush" }, logs.errors.map((err, i) => {
                            var _a, _b;
                            return (React.createElement(ListGroup.Item, { key: i, className: "text-danger" },
                                React.createElement("div", { className: "d-flex justify-content-between" },
                                    React.createElement("strong", null,
                                        ((_a = err.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = err.location) === null || _b === void 0 ? void 0 : _b.line) && `:${err.location.line}`),
                                    React.createElement("small", { className: "text-muted" }, err.pluginName ? `[${err.pluginName}]` : '')),
                                React.createElement("div", { className: "mt-1" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, err.text || err.message || JSON.stringify(err))),
                                err.detail && (React.createElement("div", { className: "mt-1 small text-muted" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, err.detail)))));
                        }))))) : (React.createElement(Alert, { variant: "success" },
                    React.createElement("h5", null, "No Errors Found"),
                    React.createElement("p", { className: "mb-0" }, "The build completed without any errors."))))))));
};
import { Nav, Container, Alert, Table } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "./TestReport.scss";
import { NavBar } from './NavBar';
export const ProjectPage = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const [summary, setSummary] = useState(null);
    const [nodeLogs, setNodeLogs] = useState(null);
    const [webLogs, setWebLogs] = useState(null);
    const [pureLogs, setPureLogs] = useState(null);
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [route, setRoute] = useState('tests');
    // Sync route with hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute('tests');
        }
    }, [location.hash]);
    const { projectName: name } = useParams();
    useEffect(() => {
        if (!name)
            return;
        setProjectName(name);
        // Set initial tab from hash
        const hash = window.location.hash.replace('#', '');
        if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
            setRoute(hash);
        }
        const fetchData = async () => {
            try {
                const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                    fetch(`reports/${name}/summary.json`),
                    fetch(`bundles/node/${name}/metafile.json`),
                    fetch(`bundles/web/${name}/metafile.json`),
                    fetch(`bundles/pure/${name}/metafile.json`),
                    fetch(`reports/${name}/config.json`)
                ]);
                if (!summaryRes.ok)
                    throw new Error('Failed to fetch summary');
                const [summaryData, nodeData, webData, pureData, configData] = await Promise.all([
                    summaryRes.json(),
                    nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
                    webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
                    pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
                    configRes.ok ? configRes.json() : { tests: [] }
                ]);
                // Get runtime from first test in config
                // const runtime = configData.tests.length > 0 ? configData.tests[0][1] : 'node';
                // setRuntime(runtime);
                // ]);
                setSummary(summaryData);
                setNodeLogs(nodeData);
                setWebLogs(webData);
                setPureLogs(pureData);
                setConfig(configData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading)
        return React.createElement("div", null, "Loading project data...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    if (!summary)
        return React.createElement(Alert, { variant: "warning" }, "No data found for project");
    return (React.createElement(Container, { fluid: true },
        React.createElement(NavBar, { title: projectName, backLink: "/", navItems: [
                {
                    to: `#tests`,
                    label: Object.values(summary).some(t => t.runTimeErrors > 0) ? '❌ Tests' :
                        Object.values(summary).some(t => t.typeErrors > 0 || t.staticErrors > 0) ? '⚠️ Tests' : '✅ Tests',
                    active: route === 'tests',
                    className: Object.values(summary).some(t => t.runTimeErrors > 0) ? 'text-danger fw-bold' :
                        Object.values(summary).some(t => t.typeErrors > 0 || t.staticErrors > 0) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#node`,
                    label: ((_a = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? '❌ Node Build' :
                        ((_b = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _b === void 0 ? void 0 : _b.length) ? '⚠️ Node Build' : 'Node Build',
                    active: route === 'node',
                    className: ((_c = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _c === void 0 ? void 0 : _c.length) ? 'text-danger fw-bold' :
                        ((_d = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _d === void 0 ? void 0 : _d.length) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#web`,
                    label: ((_e = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _e === void 0 ? void 0 : _e.length) ? '❌ Web Build' :
                        ((_f = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _f === void 0 ? void 0 : _f.length) ? '⚠️ Web Build' : 'Web Build',
                    active: route === 'web',
                    className: ((_g = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _g === void 0 ? void 0 : _g.length) ? 'text-danger fw-bold' :
                        ((_h = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _h === void 0 ? void 0 : _h.length) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#pure`,
                    label: ((_j = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _j === void 0 ? void 0 : _j.length) ? '❌ Pure Build' :
                        ((_k = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _k === void 0 ? void 0 : _k.length) ? '⚠️ Pure Build' : 'Pure Build',
                    active: route === 'pure',
                    className: ((_l = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _l === void 0 ? void 0 : _l.length) ? 'text-danger fw-bold' :
                        ((_m = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _m === void 0 ? void 0 : _m.length) ? 'text-warning fw-bold' : ''
                },
            ] }),
        React.createElement(Tab.Container, { activeKey: route, onSelect: (k) => {
                if (k) {
                    setRoute(k);
                    navigate(`#${k}`, { replace: true });
                }
            } },
            React.createElement(Tab.Content, null,
                React.createElement(Tab.Pane, { eventKey: "tests" },
                    React.createElement(Table, { striped: true, bordered: true, hover: true },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Test"),
                                React.createElement("th", null, "BDD Errors"),
                                React.createElement("th", null, "Type Errors"),
                                React.createElement("th", null, "Lint Errors"))),
                        React.createElement("tbody", null, Object.entries(summary).map(([testName, testData]) => {
                            const runTime = config.tests.find((t) => t[0] === testName)[1];
                            return (React.createElement("tr", { key: testName },
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}` }, testName)),
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#results` }, testData.runTimeErrors === 0 ? '✅ Passed' :
                                        testData.runTimeErrors > 0 ? `⚠️ ${testData.runTimeErrors} errors` :
                                            '❌ Failed')),
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#types` }, testData.typeErrors)),
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}#lint` }, testData.staticErrors))));
                        })))),
                React.createElement(Tab.Pane, { eventKey: "node" },
                    React.createElement(BuildLogViewer, { logs: nodeLogs, runtime: "Node" })),
                React.createElement(Tab.Pane, { eventKey: "web" },
                    React.createElement(BuildLogViewer, { logs: webLogs, runtime: "Web" })),
                React.createElement(Tab.Pane, { eventKey: "pure" },
                    React.createElement(BuildLogViewer, { logs: pureLogs, runtime: "Pure" }))))));
};
