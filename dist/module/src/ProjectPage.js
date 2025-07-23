import React, { useEffect, useState } from 'react';
import { Tab, Container, Alert, Table } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "./TestReport.scss";
import { NavBar } from './NavBar';
export const ProjectPage = () => {
    var _a, _b, _c, _d, _e, _f;
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
                { to: `#tests`, label: 'Tests', active: route === 'tests' },
                {
                    to: `#node`,
                    label: ((_a = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? '❌ Node Build' : '✅ Node Build',
                    active: route === 'node',
                    className: ((_b = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _b === void 0 ? void 0 : _b.length) ? 'text-danger fw-bold' : 'text-success fw-bold'
                },
                {
                    to: `#web`,
                    label: ((_c = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _c === void 0 ? void 0 : _c.length) ? '❌ Web Build' : '✅ Web Build',
                    active: route === 'web',
                    className: ((_d = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _d === void 0 ? void 0 : _d.length) ? 'text-danger fw-bold' : 'text-success fw-bold'
                },
                {
                    to: `#pure`,
                    label: ((_e = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _e === void 0 ? void 0 : _e.length) ? '❌ Pure Build' : '✅ Pure Build',
                    active: route === 'pure',
                    className: ((_f = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _f === void 0 ? void 0 : _f.length) ? 'text-danger fw-bold' : 'text-success fw-bold'
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
                                React.createElement("th", null, "Build logs"),
                                React.createElement("th", null, "BDD Errors"),
                                React.createElement("th", null, "Type Errors"),
                                React.createElement("th", null, "Lint Errors"))),
                        React.createElement("tbody", null, Object.entries(summary).map(([testName, testData]) => {
                            const runTime = config.tests.find((t) => t[0] === testName)[1];
                            return (React.createElement("tr", { key: testName },
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(testName)}/${runTime}` }, testName)),
                                React.createElement("td", null,
                                    React.createElement("a", { href: `#/projects/${projectName}#${runTime}` },
                                        runTime,
                                        " ",
                                        testData.runTimeErrors === 0 ? '✅' : '❌')),
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
                    React.createElement("ul", null, nodeLogs.errors.map((err, i) => (React.createElement("li", { key: i }, err.text || err.message || JSON.stringify(err))))),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, nodeLogs ? JSON.stringify(nodeLogs, null, 2) : 'Loading node build logs...')),
                React.createElement(Tab.Pane, { eventKey: "web" },
                    React.createElement("ul", null, webLogs.errors.map((err, i) => (React.createElement("li", { key: i }, err.text || err.message || JSON.stringify(err))))),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, webLogs ? JSON.stringify(webLogs, null, 2) : 'Loading web build logs...')),
                React.createElement(Tab.Pane, { eventKey: "pure" },
                    React.createElement("ul", null, pureLogs.errors.map((err, i) => (React.createElement("li", { key: i }, err.text || err.message || JSON.stringify(err))))),
                    React.createElement("pre", { className: "bg-dark text-white p-3" }, pureLogs ? JSON.stringify(pureLogs, null, 2) : 'Loading pure build logs...'))))));
};
