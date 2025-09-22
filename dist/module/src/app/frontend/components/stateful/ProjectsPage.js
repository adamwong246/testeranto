/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { summaryDotJson } from "../../api";
import { useWebSocket } from "../../App";
import { ProjectsPageView } from "../pure/ProjectsPageView";
export const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [configs, setConfigs] = useState({});
    const navigate = useNavigate();
    const { ws } = useWebSocket();
    useEffect(() => {
        if (!ws)
            return;
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "summaryUpdate") {
                    // Update summaries when we receive updates
                    setSummaries((prev) => (Object.assign(Object.assign({}, prev), data.data)));
                }
            }
            catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        ws.addEventListener("message", handleMessage);
        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws]);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await fetch(`projects.json`);
                const projectNames = await projectsRes.json();
                const projectsData = await Promise.all(projectNames.map(async (name) => {
                    var _a, _b, _c, _d, _e, _f;
                    const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                        fetch(summaryDotJson(name)),
                        fetch(`metafiles/node/${name}.json`),
                        fetch(`metafiles/web/${name}.json`),
                        fetch(`metafiles/pure/${name}.json`),
                        fetch(`reports/${name}/config.json`),
                    ]);
                    const [summary, nodeData, webData, pureData, configData] = await Promise.all([
                        summaryRes.json(),
                        nodeRes.ok
                            ? nodeRes.json()
                            : { errors: ["Failed to load node build logs"] },
                        webRes.ok
                            ? webRes.json()
                            : { errors: ["Failed to load web build logs"] },
                        pureRes.ok
                            ? pureRes.json()
                            : { errors: ["Failed to load pure build logs"] },
                        configRes.json(),
                    ]);
                    setSummaries((prev) => (Object.assign(Object.assign({}, prev), { [name]: summary })));
                    setConfigs((prev) => (Object.assign(Object.assign({}, prev), { [name]: configData })));
                    return {
                        name,
                        testCount: Object.keys(summary).length,
                        nodeStatus: ((_a = nodeData.errors) === null || _a === void 0 ? void 0 : _a.length)
                            ? "failed"
                            : ((_b = nodeData.warnings) === null || _b === void 0 ? void 0 : _b.length)
                                ? "warning"
                                : "success",
                        webStatus: ((_c = webData.errors) === null || _c === void 0 ? void 0 : _c.length)
                            ? "failed"
                            : ((_d = webData.warnings) === null || _d === void 0 ? void 0 : _d.length)
                                ? "warning"
                                : "success",
                        pureStatus: ((_e = pureData.errors) === null || _e === void 0 ? void 0 : _e.length)
                            ? "failed"
                            : ((_f = pureData.warnings) === null || _f === void 0 ? void 0 : _f.length)
                                ? "warning"
                                : "success",
                    };
                }));
                setProjects(projectsData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    return (React.createElement(ProjectsPageView, { projects: projects, summaries: summaries, configs: configs, loading: loading, error: error, navigate: navigate }));
};
