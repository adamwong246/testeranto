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
exports.ProjectsPage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ProjectsPageView_1 = require("../pure/ProjectsPageView");
const ProjectsPage = () => {
    const [projects, setProjects] = (0, react_1.useState)([]);
    const [summaries, setSummaries] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [configs, setConfigs] = (0, react_1.useState)({});
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await fetch(`projects.json`);
                const projectNames = await projectsRes.json();
                const projectsData = await Promise.all(projectNames.map(async (name) => {
                    var _a, _b, _c, _d, _e, _f;
                    const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                        fetch(`reports/${name}/summary.json`),
                        fetch(`metafiles/node/${name}.json`),
                        fetch(`metafiles/web/${name}.json`),
                        fetch(`metafiles/pure/${name}.json`),
                        fetch(`reports/${name}/config.json`),
                    ]);
                    const [summary, nodeData, webData, pureData, configData] = await Promise.all([
                        summaryRes.json(),
                        nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
                        webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
                        pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
                        configRes.json(),
                    ]);
                    setSummaries(prev => (Object.assign(Object.assign({}, prev), { [name]: summary })));
                    setConfigs(prev => (Object.assign(Object.assign({}, prev), { [name]: configData })));
                    return {
                        name,
                        testCount: Object.keys(summary).length,
                        nodeStatus: ((_a = nodeData.errors) === null || _a === void 0 ? void 0 : _a.length) ? 'failed' : ((_b = nodeData.warnings) === null || _b === void 0 ? void 0 : _b.length) ? 'warning' : 'success',
                        webStatus: ((_c = webData.errors) === null || _c === void 0 ? void 0 : _c.length) ? 'failed' : ((_d = webData.warnings) === null || _d === void 0 ? void 0 : _d.length) ? 'warning' : 'success',
                        pureStatus: ((_e = pureData.errors) === null || _e === void 0 ? void 0 : _e.length) ? 'failed' : ((_f = pureData.warnings) === null || _f === void 0 ? void 0 : _f.length) ? 'warning' : 'success',
                    };
                }));
                setProjects(projectsData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    return (react_1.default.createElement(ProjectsPageView_1.ProjectsPageView, { projects: projects, summaries: summaries, configs: configs, loading: loading, error: error, navigate: navigate }));
};
exports.ProjectsPage = ProjectsPage;
