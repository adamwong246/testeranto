/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// import { useWebSocket } from "../App";

import { TestPageView } from "./TestPageView";

import { useFs } from "./../useFs";

// import { fetchDataUtil } from "../fetchDataUtil";
// import { fetchTestData } from "../api";


export const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState("results");
  // const wsContext = useWebSocket();

  const fs = useFs();

  const isConnected = fs?.isConnected || false;

  // Sync route with hash changes
  // useEffect(() => {
  //   const hash = location.hash.replace("#", "");
  //   if (
  //     hash &&
  //     ["results", "logs", "types", "lint", "coverage"].includes(hash)
  //   ) {
  //     setRoute(hash);
  //   } else {
  //     setRoute("results");
  //   }
  // }, [location.hash]);

  const [testName, setTestName] = useState("");
  const [logs, setLogs] = useState<Record<string, string>>({});
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
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

  if (!logs) return <div>loading...</div>;

  return (
    <>
      <TestPageView
        route={route}
        setRoute={setRoute}
        navigate={navigate}
        projectName={projectName as string}
        testName={testName}
        decodedTestPath={decodedTestPath}
        runtime={runtime}
        logs={logs}
        testsExist={testsExist}
        errorCounts={errorCounts}
        isWebSocketConnected={isConnected}
      />
    </>
  );
};
