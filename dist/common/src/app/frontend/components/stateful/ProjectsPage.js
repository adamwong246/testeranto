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
exports.ProjectsPage = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
// import { useWebSocket } from "../../App";
const ProjectsPageView_1 = require("../pure/ProjectsPageView");
const useWebSocket_1 = require("../../useWebSocket");
const useFs_1 = require("../../useFs");
const ProjectsPage = () => {
    // const [projects, setProjects] = useState<any[]>([]);
    // const [summaries, setSummaries] = useState<Record<string, ISummary>>({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [configs, setConfigs] = (0, react_1.useState)({});
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { ws } = (0, useWebSocket_1.useWebSocket)();
    const fs = (0, useFs_1.useFs)();
    // const summaries = fs.fs.readFile('./testeranto/projects.json', undefined, () => { });
    // useEffect(() => {
    //   if (!ws) return;
    //   const handleMessage = (event: MessageEvent) => {
    //     try {
    //       const data = JSON.parse(event.data);
    //       if (data.type === "summaryUpdate") {
    //         // Update summaries when we receive updates
    //         setSummaries((prev) => ({ ...prev, ...data.data }));
    //       }
    //     } catch (error) {
    //       console.error("Error parsing WebSocket message:", error);
    //     }
    //   };
    //   ws.addEventListener("message", handleMessage);
    //   return () => {
    //     ws.removeEventListener("message", handleMessage);
    //   };
    // }, [ws]);
    // useEffect(() => {
    //   const fetchProjects = async () => {
    //     try {
    //       const projectsRes = await fetch(`projects.json`);
    //       const projectNames = await projectsRes.json();
    //       const projectsData = await Promise.all(
    //         projectNames.map(async (name) => {
    //           const [summaryRes, nodeRes, webRes, pureRes, configRes] =
    //             await Promise.all([
    //               fetch(summaryDotJson(name)),
    //               fetch(`metafiles/node/${name}.json`),
    //               fetch(`metafiles/web/${name}.json`),
    //               fetch(`metafiles/pure/${name}.json`),
    //               fetch(`reports/${name}/config.json`),
    //             ]);
    //           const [summary, nodeData, webData, pureData, configData] =
    //             await Promise.all([
    //               summaryRes.json(),
    //               nodeRes.ok
    //                 ? nodeRes.json()
    //                 : { errors: ["Failed to load node build logs"] },
    //               webRes.ok
    //                 ? webRes.json()
    //                 : { errors: ["Failed to load web build logs"] },
    //               pureRes.ok
    //                 ? pureRes.json()
    //                 : { errors: ["Failed to load pure build logs"] },
    //               configRes.json(),
    //             ]);
    //           setSummaries((prev) => ({ ...prev, [name]: summary }));
    //           setConfigs((prev) => ({ ...prev, [name]: configData }));
    //           return {
    //             name,
    //             testCount: Object.keys(summary).length,
    //             nodeStatus: nodeData.errors?.length
    //               ? "failed"
    //               : nodeData.warnings?.length
    //                 ? "warning"
    //                 : "success",
    //             webStatus: webData.errors?.length
    //               ? "failed"
    //               : webData.warnings?.length
    //                 ? "warning"
    //                 : "success",
    //             pureStatus: pureData.errors?.length
    //               ? "failed"
    //               : pureData.warnings?.length
    //                 ? "warning"
    //                 : "success",
    //           };
    //         })
    //       );
    //       setProjects(projectsData);
    //     } catch (err) {
    //       setError(err instanceof Error ? err.message : "Unknown error");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   fetchProjects();
    // }, []);
    return (react_1.default.createElement(ProjectsPageView_1.ProjectsPageView, { projects: projects, summaries: summaries, configs: configs, loading: loading, error: error, navigate: navigate }));
};
exports.ProjectsPage = ProjectsPage;
