/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Tab, Container, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchTestData } from './utils/api';
import { NavBar } from "./NavBar";
import { TestStatusBadge } from "./components/TestStatusBadge";
export const TestPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [route, setRoute] = useState('results');
    // Sync route with hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && ['results', 'logs', 'types', 'lint', 'coverage'].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute('results');
        }
    }, [location.hash]);
    const [testName, setTestName] = useState('');
    // const [projectName, setProjectName] = useState('');
    const [testData, setTestData] = useState(null);
    const [logs, setLogs] = useState('');
    const [typeErrors, setTypeErrors] = useState('');
    const [lintErrors, setLintErrors] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testsExist, setTestsExist] = useState(true);
    const [errorCounts, setErrorCounts] = useState({
        typeErrors: 0,
        staticErrors: 0,
        runTimeErrors: 0
    });
    const [summary, setSummary] = useState(null);
    const { projectName, '*': splat } = useParams();
    const pathParts = splat ? splat.split('/') : [];
    const runtime = pathParts.pop() || '';
    const testPath = pathParts.join('/');
    const decodedTestPath = testPath ? decodeURIComponent(testPath) : '';
    useEffect(() => {
        if (!projectName || !testPath || !runtime)
            return;
        setTestName(testPath);
        // setProjectName(projectName);
        const fetchData = async () => {
            try {
                // First fetch test data
                const testResponse = await fetchTestData(projectName, testPath, runtime);
                setTestData(testResponse.testData);
                setTestsExist(!!testResponse.testData);
                setLogs(testResponse.logs === null ? undefined : testResponse.logs);
                setTypeErrors(testResponse.typeErrors);
                setLintErrors(testResponse.lintErrors);
                // Then fetch summary.json
                try {
                    const summaryResponse = await fetch(`reports/${projectName}/summary.json`);
                    if (!summaryResponse.ok)
                        throw new Error('Failed to fetch summary');
                    const allSummaries = await summaryResponse.json();
                    const testSummary = allSummaries[testPath];
                    console.log("testSummary", testSummary);
                    if (testSummary) {
                        console.groupCollapsed(`[TestPage] Processing test summary for ${testPath}`);
                        console.log('Raw test summary:', testSummary);
                        const counts = {
                            typeErrors: Number(testSummary.typeErrors) || 0,
                            staticErrors: Number(testSummary.staticErrors) || 0,
                            runTimeErrors: Number(testSummary.runTimeErrors) || 0
                        };
                        console.log('Normalized counts:', counts);
                        // Validate counts
                        if (counts.runTimeErrors === -1 && testSummary.testsExist) {
                            console.warn('Inconsistent state: runTimeErrors=-1 but testsExist=true');
                        }
                        if (!testSummary.testsExist && counts.runTimeErrors > 0) {
                            console.warn('Inconsistent state: testsExist=false but runTimeErrors>0');
                        }
                        setSummary(testSummary);
                        setErrorCounts(counts);
                        setTestsExist(testSummary.testsExist !== false);
                        console.groupEnd();
                    }
                }
                catch (err) {
                    console.error('Failed to load summary:', err);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setTestsExist(false);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading)
        return React.createElement("div", null, "Loading test data...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    console.log('Test status debug:', {
        testName,
        testsExist,
        testData,
        fails: testData === null || testData === void 0 ? void 0 : testData.fails,
        runTimeErrors: errorCounts.runTimeErrors,
        typeErrors: errorCounts.typeErrors,
        staticErrors: errorCounts.staticErrors
    });
    console.log('Test data:', {
        testData,
        testsExist,
        errorCounts,
        summary
    });
    return (React.createElement(Container, { fluid: true },
        React.createElement(NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
                {
                    label: '',
                    badge: {
                        variant: runtime === 'node' ? 'primary' :
                            runtime === 'web' ? 'success' :
                                'info',
                        text: runtime
                    },
                    className: 'pe-none d-flex align-items-center gap-2'
                },
                {
                    to: `#results`,
                    label: (React.createElement(TestStatusBadge, { testName: decodedTestPath, testsExist: testsExist, runTimeErrors: errorCounts.runTimeErrors, variant: "compact" })),
                    className: !testsExist || errorCounts.runTimeErrors > 0
                        ? 'text-danger fw-bold'
                        : '',
                    active: route === 'results'
                },
                {
                    to: `#logs`,
                    label: `Runtime logs`,
                    active: route === 'logs'
                },
                {
                    to: `#types`,
                    label: errorCounts.typeErrors > 0
                        ? `tsc (❌ * ${errorCounts.typeErrors})`
                        : 'tsc ✅ ',
                    active: route === 'types'
                },
                {
                    to: `#lint`,
                    label: errorCounts.staticErrors > 0
                        ? `eslint (❌ *${errorCounts.staticErrors}) `
                        : 'eslint ✅',
                    active: route === 'lint'
                },
            ], rightContent: React.createElement(Button, { variant: "info", onClick: async () => {
                    try {
                        const promptPath = `testeranto/reports/${projectName}/${testPath.split('.').slice(0, -1).join('.')}/${runtime}/prompt.txt`;
                        const messagePath = `testeranto/reports/${projectName}/${testPath.split('.').slice(0, -1).join('.')}/${runtime}/message.txt`;
                        const command = `aider --load ${promptPath} --message-file ${messagePath}`;
                        await navigator.clipboard.writeText(command);
                        alert("Copied aider command to clipboard!");
                    }
                    catch (err) {
                        alert("Failed to copy command to clipboard");
                        console.error("Copy failed:", err);
                    }
                }, className: "ms-2" }, "\uD83E\uDD16") }),
        React.createElement(Tab.Container, { activeKey: route, onSelect: (k) => {
                if (k) {
                    setRoute(k);
                    navigate(`#${k}`, { replace: true });
                }
            } },
            React.createElement(Tab.Content, { className: "mt-3" },
                React.createElement(Tab.Pane, { eventKey: "results" }, !testsExist ? (React.createElement(Alert, { variant: "danger", className: "mt-3" },
                    React.createElement("h4", null, "Tests did not run to completion"),
                    React.createElement("p", null, "The test results file (tests.json) was not found or could not be loaded."),
                    React.createElement("div", { className: "mt-3" },
                        React.createElement(Button, { variant: "outline-light", onClick: () => setRoute('logs'), className: "me-2" }, "View Runtime Logs"),
                        React.createElement(Button, { variant: "outline-light", onClick: () => navigate(`/projects/${projectName}#${runtime}`) }, "View Build Logs")))) : testData ? (React.createElement("div", { className: "test-results" },
                    React.createElement("div", { className: "mb-3" }),
                    testData.givens.map((given, i) => {
                        var _a, _b;
                        return (React.createElement("div", { key: i, className: "mb-4 card" },
                            React.createElement("div", { className: "card-header bg-primary text-white" },
                                React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                                    React.createElement("div", null,
                                        React.createElement("h4", null,
                                            "Given: ",
                                            given.name),
                                        ((_a = given.features) === null || _a === void 0 ? void 0 : _a.length) > 0 && (React.createElement("div", { className: "mt-1" },
                                            React.createElement("small", null, "Features:"),
                                            React.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (React.createElement("span", { className: "text-white" }, feature))))))))),
                                    ((_b = given.artifacts) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("div", { className: "dropdown" },
                                        React.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                                            "Artifacts (",
                                            given.artifacts.length,
                                            ")"),
                                        React.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                            React.createElement("a", { className: "dropdown-item", href: `/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))),
                            React.createElement("div", { className: "card-body" },
                                given.whens.map((when, j) => {
                                    var _a, _b;
                                    return (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                                        React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                                            React.createElement("div", null,
                                                React.createElement("div", null,
                                                    React.createElement("strong", null, "When:"),
                                                    " ",
                                                    when.name,
                                                    ((_a = when.features) === null || _a === void 0 ? void 0 : _a.length) > 0 && (React.createElement("div", { className: "mt-2" },
                                                        React.createElement("small", null, "Features:"),
                                                        React.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                                    when.error && React.createElement("pre", { className: "mt-2" }, when.error))),
                                            ((_b = when.artifacts) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("div", { className: "ms-3" },
                                                React.createElement("strong", null, "Artifacts:"),
                                                React.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                                    React.createElement("a", { href: `/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))));
                                }),
                                given.thens.map((then, k) => {
                                    var _a, _b;
                                    return (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                                        React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                                            React.createElement("div", null,
                                                React.createElement("div", null,
                                                    React.createElement("strong", null, "Then:"),
                                                    " ",
                                                    then.name,
                                                    ((_a = then.features) === null || _a === void 0 ? void 0 : _a.length) > 0 && (React.createElement("div", { className: "mt-2" },
                                                        React.createElement("small", null, "Features:"),
                                                        React.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                                    then.error && React.createElement("pre", { className: "mt-2" }, then.error))),
                                            ((_b = then.artifacts) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("div", { className: "ms-3" },
                                                React.createElement("strong", null, "Artifacts:"),
                                                React.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                                    React.createElement("a", { href: `/testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))));
                                }))));
                    }))) : (React.createElement(Alert, { variant: "warning" }, "No test results found"))),
                React.createElement(Tab.Pane, { eventKey: "logs" }, logs === undefined ? (React.createElement(Alert, { variant: "danger" },
                    React.createElement("h4", null, "Logs file missing"),
                    React.createElement("p", null, "The runtime logs file (logs.txt) was not found."),
                    React.createElement("p", null, "This suggests the test may not have executed properly."))) : logs === '' ? (React.createElement(Alert, { variant: "success" },
                    React.createElement("h4", null, "No runtime logs"),
                    React.createElement("p", null, "The test executed successfully with no log output."))) : (React.createElement("pre", { className: "bg-dark text-white p-3" }, logs))),
                React.createElement(Tab.Pane, { eventKey: "types" }, typeErrors ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, typeErrors)) : (React.createElement(Alert, { variant: "warning" }, "No type errors found"))),
                React.createElement(Tab.Pane, { eventKey: "lint" }, lintErrors ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, lintErrors)) : (React.createElement(Alert, { variant: "warning" }, "No lint errors found"))),
                React.createElement(Tab.Pane, { eventKey: "coverage" },
                    React.createElement("div", { className: "coverage-report" },
                        React.createElement(Alert, { variant: "info" }, "Coverage reports coming soon!"),
                        React.createElement("div", { className: "coverage-stats" },
                            React.createElement("div", { className: "stat-card bg-success text-white" },
                                React.createElement("h4", null, "85%"),
                                React.createElement("p", null, "Lines Covered")),
                            React.createElement("div", { className: "stat-card bg-warning text-dark" },
                                React.createElement("h4", null, "72%"),
                                React.createElement("p", null, "Branches Covered")),
                            React.createElement("div", { className: "stat-card bg-info text-white" },
                                React.createElement("h4", null, "91%"),
                                React.createElement("p", null, "Functions Covered")))))))));
};
// document.addEventListener("DOMContentLoaded", function () {
//   const elem = document.getElementById("root");
//   if (elem) {
//     ReactDom.createRoot(elem).render(React.createElement(TestPage, {}));
//   }
// });
