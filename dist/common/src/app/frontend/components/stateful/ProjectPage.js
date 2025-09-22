"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.ProjectPage = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ProjectPageView_1 = require("../pure/ProjectPageView");
const api_1 = require("../../api");
const ProjectPage = () => {
    const [summary, setSummary] = (0, react_1.useState)(null);
    const [nodeLogs, setNodeLogs] = (0, react_1.useState)(null);
    const [webLogs, setWebLogs] = (0, react_1.useState)(null);
    const [pureLogs, setPureLogs] = (0, react_1.useState)(null);
    const [config, setConfig] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [projectName, setProjectName] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [route, setRoute] = (0, react_1.useState)("tests");
    (0, react_1.useEffect)(() => {
        const hash = location.hash.replace("#", "");
        if (hash && ["tests", "node", "web", "pure"].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute("tests");
        }
    }, [location.hash]);
    const { projectName: name } = (0, react_router_dom_1.useParams)();
    (0, react_1.useEffect)(() => {
        if (!name)
            return;
        setProjectName(name);
        const fetchData = async () => {
            try {
                const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                    fetch((0, api_1.summaryDotJson)(name)),
                    fetch(`metafiles/node/${name}.json`),
                    fetch(`metafiles/web/${name}.json`),
                    fetch(`metafiles/pure/${name}.json`),
                    fetch(`reports/${name}/config.json`),
                ]);
                const [summaryData, nodeData, webData, pureData, configData] = await Promise.all([
                    summaryRes.ok ? summaryRes.json() : {},
                    nodeRes.ok
                        ? nodeRes.json()
                        : { errors: ["Failed to load node build logs"] },
                    webRes.ok
                        ? webRes.json()
                        : { errors: ["Failed to load web build logs"] },
                    pureRes.ok
                        ? pureRes.json()
                        : { errors: ["Failed to load pure build logs"] },
                    configRes.ok ? configRes.json() : { tests: [] },
                ]);
                setSummary(summaryData);
                setNodeLogs(nodeData);
                setWebLogs(webData);
                setPureLogs(pureData);
                setConfig(configData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [name]);
    return (react_1.default.createElement(ProjectPageView_1.ProjectPageView, { summary: summary, nodeLogs: nodeLogs, webLogs: webLogs, pureLogs: pureLogs, config: config, loading: loading, error: error, projectName: projectName, activeTab: route, setActiveTab: setRoute }));
};
exports.ProjectPage = ProjectPage;
