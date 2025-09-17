/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchTestData } from "../../utils/api";
import { useWebSocket } from "../../App";
import { TestPageView } from "./TestPageView";
import { fetchDataUtil } from "../../fetchDataUtil";
export const TestPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [route, setRoute] = useState("results");
    const wsContext = useWebSocket();
    const isConnected = (wsContext === null || wsContext === void 0 ? void 0 : wsContext.isConnected) || false;
    // Sync route with hash changes
    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash &&
            ["results", "logs", "types", "lint", "coverage"].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute("results");
        }
    }, [location.hash]);
    const [testName, setTestName] = useState("");
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testsExist, setTestsExist] = useState(true);
    const [errorCounts, setErrorCounts] = useState({
        typeErrors: 0,
        staticErrors: 0,
        runTimeErrors: 0,
    });
    const [summary, setSummary] = useState(null);
    const { projectName, "*": splat } = useParams();
    const pathParts = splat ? splat.split("/") : [];
    const runtime = pathParts.pop() || "";
    const testPath = pathParts.join("/");
    const decodedTestPath = testPath ? decodeURIComponent(testPath) : "";
    useEffect(() => {
        if (!projectName || !testPath || !runtime)
            return;
        setTestName(testPath);
        const fetchData = async () => {
            try {
                const [testResponse, metafileRes] = await Promise.all([
                    fetchTestData(projectName, testPath, runtime),
                    fetch(`metafiles/${runtime}/${projectName}.json`),
                ]);
                fetchDataUtil(testResponse, metafileRes, testPath, setLogs, projectName, setSummary, setErrorCounts, setTestsExist, runtime);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
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
        React.createElement(TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, logs: logs, testsExist: testsExist, errorCounts: errorCounts, isWebSocketConnected: isConnected })));
};
