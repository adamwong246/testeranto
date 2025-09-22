"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPage = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("../App");
const TestPageView_1 = require("./TestPageView");
const fetchDataUtil_1 = require("../fetchDataUtil");
const api_1 = require("../api");
const TestPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [route, setRoute] = (0, react_1.useState)("results");
    const wsContext = (0, App_1.useWebSocket)();
    const isConnected = (wsContext === null || wsContext === void 0 ? void 0 : wsContext.isConnected) || false;
    // Sync route with hash changes
    (0, react_1.useEffect)(() => {
        const hash = location.hash.replace("#", "");
        if (hash &&
            ["results", "logs", "types", "lint", "coverage"].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute("results");
        }
    }, [location.hash]);
    const [testName, setTestName] = (0, react_1.useState)("");
    const [logs, setLogs] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [testsExist, setTestsExist] = (0, react_1.useState)(true);
    const [errorCounts, setErrorCounts] = (0, react_1.useState)({
        typeErrors: 0,
        staticErrors: 0,
        runTimeErrors: 0,
    });
    const [summary, setSummary] = (0, react_1.useState)(null);
    const { projectName, "*": splat } = (0, react_router_dom_1.useParams)();
    const pathParts = splat ? splat.split("/") : [];
    const runtime = pathParts.pop() || "";
    const testPath = pathParts.join("/");
    const decodedTestPath = testPath ? decodeURIComponent(testPath) : "";
    (0, react_1.useEffect)(() => {
        if (!projectName || !testPath || !runtime)
            return;
        setTestName(testPath);
        const fetchData = async () => {
            try {
                const [testResponse, metafileRes] = await Promise.all([
                    (0, api_1.fetchTestData)(projectName, testPath, runtime),
                    fetch(`metafiles/${runtime}/${projectName}.json`),
                ]);
                (0, fetchDataUtil_1.fetchDataUtil)(testResponse, metafileRes, testPath, setLogs, projectName, setSummary, setErrorCounts, setTestsExist, runtime);
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
        return react_1.default.createElement("div", null, "loading...");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TestPageView_1.TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, logs: logs, testsExist: testsExist, errorCounts: errorCounts, isWebSocketConnected: isConnected })));
};
exports.TestPage = TestPage;
