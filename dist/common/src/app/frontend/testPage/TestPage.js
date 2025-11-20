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
// import { useWebSocket } from "../App";
const TestPageView_1 = require("./TestPageView");
const useFs_1 = require("./../useFs");
// import { fetchDataUtil } from "../fetchDataUtil";
// import { fetchTestData } from "../api";
const TestPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [route, setRoute] = (0, react_1.useState)("results");
    // const wsContext = useWebSocket();
    const fs = (0, useFs_1.useFs)();
    const isConnected = (fs === null || fs === void 0 ? void 0 : fs.isConnected) || false;
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
    const [testName, setTestName] = (0, react_1.useState)("");
    const [logs, setLogs] = (0, react_1.useState)({});
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
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
    if (!logs)
        return react_1.default.createElement("div", null, "loading...");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TestPageView_1.TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, logs: logs, testsExist: testsExist, errorCounts: errorCounts, isWebSocketConnected: isConnected })));
};
exports.TestPage = TestPage;
