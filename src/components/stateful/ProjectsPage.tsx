/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectsPageView } from '../pure/ProjectsPageView';
import { ISummary } from '../../Types';
import { summaryDotJson } from '../../utils/api';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<Record<string, ISummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, object>>({});
  const navigate = useNavigate();
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket on the same host and port as the HTTP server
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'summaryUpdate') {
          // Update summaries when we receive updates
          setSummaries(prev => ({ ...prev, ...data.data }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch(`/projects.json`);
        const projectNames = await projectsRes.json();

        const projectsData = await Promise.all(
          projectNames.map(async (name) => {
            const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
              fetch(summaryDotJson(name)),
              fetch(`/metafiles/node/${name}.json`),
              fetch(`/metafiles/web/${name}.json`),
              fetch(`/metafiles/pure/${name}.json`),
              fetch(`/reports/${name}/config.json`),
            ]);

            const [summary, nodeData, webData, pureData, configData] = await Promise.all([
              summaryRes.json(),
              nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
              webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
              pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
              configRes.json(),
            ]);

            setSummaries(prev => ({ ...prev, [name]: summary }));
            setConfigs(prev => ({ ...prev, [name]: configData }));

            return {
              name,
              testCount: Object.keys(summary).length,
              nodeStatus: nodeData.errors?.length ? 'failed' : nodeData.warnings?.length ? 'warning' : 'success',
              webStatus: webData.errors?.length ? 'failed' : webData.warnings?.length ? 'warning' : 'success',
              pureStatus: pureData.errors?.length ? 'failed' : pureData.warnings?.length ? 'warning' : 'success',
            };
          })
        );

        setProjects(projectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProjectsPageView
      projects={projects}
      summaries={summaries}
      configs={configs}
      loading={loading}
      error={error}
      navigate={navigate}
    />
  );
};
