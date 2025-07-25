import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TestPageView } from '../pure/TestPageView';
import { fetchTestData } from '../../utils/api';
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
        const fetchData = async () => {
            try {
                const testResponse = await fetchTestData(projectName, testPath, runtime);
                setTestData(testResponse.testData);
                setTestsExist(!!testResponse.testData);
                setLogs(testResponse.logs === null ? undefined : testResponse.logs);
                setTypeErrors(testResponse.typeErrors);
                setLintErrors(testResponse.lintErrors);
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
    return (React.createElement(TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, testData: testData, logs: logs, typeErrors: typeErrors, lintErrors: lintErrors, loading: loading, error: error, testsExist: testsExist, errorCounts: errorCounts, summary: summary }));
};
