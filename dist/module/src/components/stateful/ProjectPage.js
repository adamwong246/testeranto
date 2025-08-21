/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProjectPageView } from '../pure/ProjectPageView';
export const ProjectPage = () => {
    const [summary, setSummary] = useState(null);
    const [nodeLogs, setNodeLogs] = useState(null);
    const [webLogs, setWebLogs] = useState(null);
    const [pureLogs, setPureLogs] = useState(null);
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [route, setRoute] = useState('tests');
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && ['tests', 'node', 'web', 'pure'].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute('tests');
        }
    }, [location.hash]);
    const { projectName: name } = useParams();
    useEffect(() => {
        if (!name)
            return;
        setProjectName(name);
        const fetchData = async () => {
            try {
                const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                    fetch(`/reports/${name}/summary.json`),
                    fetch(`/metafiles/node/${name}.json`),
                    fetch(`/metafiles/web/${name}.json`),
                    fetch(`/metafiles/pure/${name}.json`),
                    fetch(`/reports/${name}/config.json`)
                ]);
                const [summaryData, nodeData, webData, pureData, configData] = await Promise.all([
                    summaryRes.ok ? summaryRes.json() : {},
                    nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
                    webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
                    pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
                    configRes.ok ? configRes.json() : { tests: [] }
                ]);
                setSummary(summaryData);
                setNodeLogs(nodeData);
                setWebLogs(webData);
                setPureLogs(pureData);
                setConfig(configData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [name]);
    return (React.createElement(ProjectPageView, { summary: summary, nodeLogs: nodeLogs, webLogs: webLogs, pureLogs: pureLogs, config: config, loading: loading, error: error, projectName: projectName, activeTab: route, setActiveTab: setRoute }));
};
