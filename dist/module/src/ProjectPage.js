import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Tab, Container, Alert, Table } from 'react-bootstrap';
const useRouter = () => {
    const [route, setRoute] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || 'tests';
    });
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setRoute(hash || 'tests');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const navigate = (newRoute) => {
        window.location.hash = newRoute;
        setRoute(newRoute);
    };
    return { route, navigate };
};
export const ProjectPage = () => {
    var _a, _b;
    const [summary, setSummary] = useState(null);
    const [nodeLogs, setNodeLogs] = useState(null);
    const [webLogs, setWebLogs] = useState(null);
    const [pureLogs, setPureLogs] = useState(null);
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState('');
    const { route, navigate } = useRouter();
    // Set initial tab based on hash
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
            navigate(hash);
        }
    }, [navigate]);
    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const name = pathParts[pathParts.length - 1].replace('.html', '');
        setProjectName(name);
        const fetchData = async () => {
            try {
                const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                    fetch(`/testeranto/reports/${name}/summary.json`),
                    fetch(`/testeranto/bundles/node/${name}/metafile.json`),
                    fetch(`/testeranto/bundles/web/${name}/metafile.json`),
                    fetch(`/testeranto/bundles/pure/${name}/metafile.json`),
                    fetch(`/testeranto/reports/${name}/config.json`)
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
        React.createElement(Navbar, { bg: "light", expand: "lg", className: "mb-4" },
            React.createElement(Container, { fluid: true },
                React.createElement(Navbar.Brand, null,
                    "Project: ",
                    projectName),
                React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                    React.createElement(Nav, { variant: "tabs", activeKey: route, onSelect: (k) => navigate(k || 'tests'), className: "me-auto" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "tests" }, "Tests")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "node" }, "Node Build")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "web" }, "Web Build")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "pure" }, "Pure Build")))))),
        React.createElement(Tab.Container, { activeKey: route, onSelect: (k) => navigate(k || 'tests') },
            React.createElement(Tab.Content, null,
                React.createElement(Tab.Pane, { eventKey: "tests" },
                    React.createElement(Table, { striped: true, bordered: true, hover: true },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Test"),
                                React.createElement("th", null, "Status"),
                                React.createElement("th", null, "Type Errors"),
                                React.createElement("th", null, "Lint Errors"))),
                        React.createElement("tbody", null, Object.entries(summary).map(([testName, testData]) => {
                            const runTime = config.tests.find((t) => t[0] === testName)[1];
                            return (React.createElement("tr", { key: testName },
                                React.createElement("td", null,
                                    React.createElement("a", { href: `/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runTime}/index.html` }, testName)),
                                React.createElement("td", null, testData.runTimeErrors === 0 ? '✅ Passed' :
                                    testData.runTimeErrors > 0 ? `⚠️ ${testData.runTimeErrors} errors` :
                                        '❌ Failed'),
                                React.createElement("td", null, testData.typeErrors),
                                React.createElement("td", null, testData.staticErrors)));
                        })))),
                React.createElement(Tab.Pane, { eventKey: "node" },
                    nodeLogs && (React.createElement("div", { className: `alert ${((_a = nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? 'alert-danger' : 'alert-success'} mb-3` }, ((_b = nodeLogs.errors) === null || _b === void 0 ? void 0 : _b.length) ? (React.createElement(React.Fragment, null,
                        React.createElement("h5", null, "\u274C Node Build Failed"),
                        React.createElement("ul", null, nodeLogs.errors.map((err, i) => (React.createElement("li", { key: i }, err.text || err.message || JSON.stringify(err))))))) : (React.createElement("h5", null, "\u2705 Node Build Succeeded")))),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, nodeLogs ? JSON.stringify(nodeLogs, null, 2) : 'Loading node build logs...')),
                React.createElement(Tab.Pane, { eventKey: "web" },
                    webLogs && (React.createElement("div", { className: `alert ${!webLogs.errors || webLogs.errors.length === 0
                            ? 'alert-success'
                            : 'alert-danger'} mb-3` }, !webLogs.errors || webLogs.errors.length === 0
                        ? '✅ Web build succeeded'
                        : `❌ Web build failed with ${webLogs.errors.length} errors`)),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, webLogs ? JSON.stringify(webLogs, null, 2) : 'Loading web build logs...')),
                React.createElement(Tab.Pane, { eventKey: "pure" },
                    pureLogs && (React.createElement("div", { className: `alert ${!pureLogs.errors || pureLogs.errors.length === 0
                            ? 'alert-success'
                            : 'alert-danger'} mb-3` }, !pureLogs.errors || pureLogs.errors.length === 0
                        ? '✅ Pure build succeeded'
                        : `❌ Pure build failed with ${pureLogs.errors.length} errors`)),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, pureLogs ? JSON.stringify(pureLogs, null, 2) : 'Loading pure build logs...'))))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(ProjectPage, {}));
    }
});
