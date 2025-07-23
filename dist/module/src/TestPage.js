import React, { useEffect, useState } from 'react';
import { Tab, Container, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchTestData } from './utils/api';
import { NavBar } from "./NavBar";
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
                setLogs(testResponse.logs);
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
                        setSummary(testSummary);
                        setErrorCounts({
                            typeErrors: testSummary.typeErrors || 0,
                            staticErrors: testSummary.staticErrors || 0,
                            runTimeErrors: testSummary.runTimeErrors || 0
                        });
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
    return (React.createElement(Container, { fluid: true },
        React.createElement(NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
                {
                    to: `#results`,
                    label: !testsExist
                        ? '❌ BDD'
                        : (testData === null || testData === void 0 ? void 0 : testData.givens.some(g => g.whens.some(w => w.error) || g.thens.some(t => t.error)))
                            ? '❌ BDD'
                            : '✅ BDD',
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
                    testData.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4 card" },
                        React.createElement("div", { className: "card-header bg-primary text-white" },
                            React.createElement("h4", null,
                                "Given: ",
                                given.name)),
                        React.createElement("div", { className: "card-body" },
                            given.whens.map((when, j) => (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                                React.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.error && React.createElement("pre", { className: "mt-2" }, when.error)))),
                            given.thens.map((then, k) => (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                                React.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.error && React.createElement("pre", { className: "mt-2" }, then.error)))))))))) : (React.createElement(Alert, { variant: "warning" }, "No test results found"))),
                React.createElement(Tab.Pane, { eventKey: "logs" }, logs ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, logs)) : (React.createElement(Alert, { variant: "warning" }, "No runtime logs found"))),
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
