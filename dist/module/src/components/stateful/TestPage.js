/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchTestData } from '../../utils/api';
import { TestPageView } from '../pure/TestPageView';
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
    // const [testData, setTestData] = useState(null);
    const [logs, setLogs] = useState({});
    // const [typeErrors, setTypeErrors] = useState('');
    // const [lintErrors, setLintErrors] = useState('');
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
        const fetchData = async () => {
            try {
                const testResponse = await fetchTestData(projectName, testPath, runtime);
                console.log("testResponse", testResponse);
                // setTestData(testResponse.testData);
                // setTestsExist(!!testResponse.testData);
                const receivedLogs = await testResponse.logs;
                // Ensure tests.json is properly formatted
                if (receivedLogs['tests.json'] && typeof receivedLogs['tests.json'] === 'string') {
                    try {
                        receivedLogs['tests.json'] = JSON.parse(receivedLogs['tests.json']);
                    }
                    catch (e) {
                        console.error('Failed to parse tests.json:', e);
                    }
                }
                setLogs(receivedLogs);
                // setTypeErrors(testResponse.typeErrors);
                // setLintErrors(testResponse.lintErrors);
                try {
                    const summaryResponse = await fetch(`reports/${projectName}/summary.json`);
                    if (!summaryResponse.ok)
                        throw new Error('Failed to fetch summary');
                    const allSummaries = await summaryResponse.json();
                    const testSummary = allSummaries[testPath];
                    if (testSummary) {
                        const counts = {
                            typeErrors: Number(testSummary.typeErrors) || 0,
                            staticErrors: Number(testSummary.staticErrors) || 0,
                            runTimeErrors: Number(testSummary.runTimeErrors) || 0
                        };
                        setSummary(testSummary);
                        setErrorCounts(counts);
                        setTestsExist(testSummary.testsExist !== false);
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
    if (!logs)
        return React.createElement("div", null, "loading...");
    return (React.createElement(React.Fragment, null,
        React.createElement(TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, logs: logs, testsExist: testsExist, errorCounts: errorCounts })));
};
