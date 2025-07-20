/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab, Table } from "react-bootstrap";

import { Footer } from "./Footer";
import { IBuiltConfig } from "./lib";
import { ISummary } from "./Types";

import "bootstrap/dist/css/bootstrap.min.css";
import { SettingsButton } from "./SettingsButton";

import "./themesAndFonts.scss"
import SunriseAnimation from "./components/SunriseAnimation";

type ISummaries = [string, IBuiltConfig, ISummary][];

const BigBoard = () => {

  const bigConfigElement = document.getElementById("bigConfig");

  if (!bigConfigElement) throw new Error("bigConfig element not found");
  const projects = JSON.parse(bigConfigElement.innerHTML) as string[];

  const [summary, setSummary] = useState<ISummaries>();
  const [nodeLogs, setNodeLogs] = useState<Record<string, string>>({});
  const [webLogs, setWebLogs] = useState<Record<string, string>>({});
  const [pureLogs, setPureLogs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("node");

  const fetchLogs = async (project: string) => {
    try {
      const [nodeRes, webRes, pureRes] = await Promise.all([
        fetch(`./testeranto/bundles/node/${project}/metafile.json`),
        fetch(`./testeranto/bundles/web/${project}/metafile.json`),
        fetch(`./testeranto/bundles/pure/${project}/metafile.json`),
      ]);

      setNodeLogs({ [project]: await nodeRes.json() });
      setWebLogs({ [project]: await webRes.json() });
      setPureLogs({ [project]: await pureRes.json() });
    } catch (error) {
      console.error("Error fetching logs:", error);
      setNodeLogs({ [project]: "ERROR" });
      setNodeLogs({ [project]: "ERROR" });
      setNodeLogs({ [project]: "ERROR" });

    }
  };

  useEffect(() => {

    (async () => {
      const x: Promise<[string, IBuiltConfig, ISummary]>[] = projects.map(
        async (p) => {

          fetchLogs(p);

          return [
            p,

            (await (
              await fetch(`./testeranto/reports/${p}/config.json`)
            ).json()) as IBuiltConfig,

            (await (
              await fetch(`./testeranto/reports/${p}/summary.json`)
            ).json()) as ISummary,
          ] as [string, IBuiltConfig, ISummary];
        }
      );

      Promise.all(x).then((v) => {
        setSummary(v);
      });
    })();


  }, []);

  if (!summary || summary?.length === 0) {
    return <div>loading...</div>;
  }


  return (
    <div>

      <SunriseAnimation />

      <div className="container-fluid p-4" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}>
        {/* Sky and sun elements */}
        {/* <div id="sky"></div>
      <div id="sun"></div>
      <div id="sunDay"></div>
      <div id="sunSet"></div>
      <div id="horizon"></div>
      <div id="water"></div>
      <div id="waterReflectionContainer">
        <div id="waterReflectionMiddle"></div>
      </div> */}
        <Tab.Container activeKey={activeTab} defaultActiveKey="node">
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 rounded">
            <div className="container-fluid">
              <span className="navbar-brand text-muted">Project: testeranto</span>
              <Nav variant="pills" className="me-auto" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "node")}>
                <Nav.Item>
                  <Nav.Link eventKey="projects">Test Results</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="node"
                    className={Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0)
                      ? "text-success"
                      : "text-danger"}
                  >
                    Node Build {Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0) ? "✅" : "❌"}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="web"
                    className={Object.values(webLogs).every(log => !log.errors || log.errors.length === 0)
                      ? "text-success"
                      : "text-danger"}
                  >
                    Web Build {Object.values(webLogs).every(log => !log.errors || log.errors.length === 0) ? "✅" : "❌"}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="pure"
                    className={Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0)
                      ? "text-success"
                      : "text-danger"}
                  >
                    Pure Build {Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0) ? "✅" : "❌"}
                  </Nav.Link>
                </Nav.Item>

              </Nav>
            </div>
          </nav>
          <Row>
            <Tab.Content>
              <Tab.Pane eventKey="node">
                {Object.keys(nodeLogs).length > 0 && (
                  <div className={`alert ${Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0)
                    ? 'alert-success'
                    : 'alert-danger'} d-flex justify-content-between align-items-center`}>
                    <span>
                      {Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0)
                        ? '✅ All Node builds passed successfully'
                        : '❌ Some Node builds failed'}
                    </span>
                    {!Object.values(nodeLogs).every(log => !log.errors || log.errors.length === 0) && (
                      <button
                        onClick={() => alert('AI debugger coming soon!')}
                        className="btn btn-sm btn-primary"
                        title="Get AI help debugging these build failures"
                      >
                        🤖🪄✨
                      </button>
                    )}
                  </div>
                )}
                <pre >
                  {JSON.stringify(nodeLogs, null, 2)}
                </pre>
              </Tab.Pane>
              <Tab.Pane eventKey="web">
                {Object.keys(webLogs).length > 0 && (
                  <div className={`alert ${Object.values(webLogs).every(log => !log.errors || log.errors.length === 0)
                    ? 'alert-success'
                    : 'alert-danger'} d-flex justify-content-between align-items-center`}>
                    <span>
                      {Object.values(webLogs).every(log => !log.errors || log.errors.length === 0)
                        ? '✅ All Web builds passed successfully'
                        : '❌ Some Web builds failed'}
                    </span>
                    {!Object.values(webLogs).every(log => !log.errors || log.errors.length === 0) && (
                      <button
                        onClick={() => alert('AI debugger coming soon!')}
                        className="btn btn-sm btn-primary"
                        title="Get AI help debugging these build failures"
                      >
                        🤖🪄✨
                      </button>
                    )}
                  </div>
                )}
                <pre >
                  {JSON.stringify(webLogs, null, 2)}
                </pre>
              </Tab.Pane>
              <Tab.Pane eventKey="pure">
                {Object.keys(pureLogs).length > 0 && (
                  <div className={`alert ${Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0)
                    ? 'alert-success'
                    : 'alert-danger'} d-flex justify-content-between align-items-center`}>
                    <span>
                      {Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0)
                        ? '✅ All Pure builds passed successfully'
                        : '❌ Some Pure builds failed'}
                    </span>
                    {!Object.values(pureLogs).every(log => !log.errors || log.errors.length === 0) && (
                      <button
                        onClick={() => alert('AI debugger coming soon!')}
                        className="btn btn-sm btn-primary"
                        title="Get AI help debugging these build failures"
                      >
                        🤖🪄✨
                      </button>
                    )}
                  </div>
                )}
                <pre >
                  {JSON.stringify(pureLogs, null, 2)}
                </pre>
              </Tab.Pane>
              <Tab.Pane eventKey="projects">
                <Tab.Container defaultActiveKey={projects[0]}>
                  <Row>
                    <Col sm={3}>
                      <Nav variant="pills" className="flex-column">
                        {projects.map((project) => (
                          <Nav.Item key={project}>
                            <Nav.Link eventKey={project}>{project}</Nav.Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                    </Col>
                    <Col sm={9}>
                      <Tab.Content>
                        {projects.map((project) => (
                          <Tab.Pane key={project} eventKey={project}>
                            <Table>
                              <Table>
                                <thead>
                                  <tr>
                                    <th>project</th>
                                    <th>platform</th>
                                    <th>BDD errors</th>
                                    <th>Lint errors</th>
                                    <th>Type errors</th>

                                  </tr>
                                </thead>

                                <tbody>
                                  {...summary.map((s) => {
                                    return (
                                      <>
                                        <tr>
                                          <th>{s[0]}</th>
                                        </tr>
                                        {...s[1].tests.map((t) => {
                                          const x = `${s[0]}/${t[0]
                                            .split(".")
                                            .slice(0, -1)
                                            .join(".")}/${t[1]}`;
                                          const y = s[2][t[0]];

                                          if (!y) return <pre>ERROR</pre>

                                          return (
                                            <tr>
                                              <td>{t[0]}</td>
                                              <td>
                                                <button
                                                  className={`btn btn-sm ${(t[1] === "node" && nodeLogs[s[0]]?.errors?.length === 0) ||
                                                    (t[1] === "web" && webLogs[s[0]]?.errors?.length === 0) ||
                                                    (t[1] === "pure" && pureLogs[s[0]]?.errors?.length === 0)
                                                    ? "btn-outline-success"
                                                    : "btn-outline-danger"
                                                    }`}
                                                  onClick={() => {
                                                    const tabKey = t[1] === "node" ? "node" : t[1] === "web" ? "web" : "pure";
                                                    setActiveTab(tabKey);
                                                  }}
                                                  title={
                                                    (t[1] === "node" && nodeLogs[s[0]]?.errors?.length === 0) ||
                                                      (t[1] === "web" && webLogs[s[0]]?.errors?.length === 0) ||
                                                      (t[1] === "pure" && pureLogs[s[0]]?.errors?.length === 0)
                                                      ? "Build succeeded"
                                                      : "Build failed"
                                                  }
                                                >
                                                  {t[1]}
                                                  {(t[1] === "node" && nodeLogs[s[0]]?.errors?.length === 0) ||
                                                    (t[1] === "web" && webLogs[s[0]]?.errors?.length === 0) ||
                                                    (t[1] === "pure" && pureLogs[s[0]]?.errors?.length === 0)
                                                    ? " ✅"
                                                    : " ❌"}
                                                </button>
                                              </td>
                                              <td>




                                                <a
                                                  href={`./testeranto/reports/${x}/index.html`}
                                                >

                                                  {
                                                    (y.runTimeErrors < 0) && "‼️ Tests did not complete"
                                                  }

                                                  {
                                                    y.runTimeErrors === 0 && "✅ All tests passed"
                                                  }

                                                  {
                                                    y.runTimeErrors > 0 && `⚠️ ${y.runTimeErrors} failures`
                                                  }

                                                </a>
                                              </td>
                                              <td>
                                                <a
                                                  href={`./testeranto/reports/${x}/lint_errors.json`}
                                                >
                                                  {y.staticErrors}
                                                </a>
                                              </td>
                                              <td>
                                                <a
                                                  href={`./testeranto/reports/${x}/type_errors.txt`}
                                                >
                                                  {y.typeErrors}
                                                </a>
                                              </td>


                                            </tr>
                                          );
                                        })}
                                      </>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </Table>
                          </Tab.Pane>
                        ))}
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Tab.Pane>
            </Tab.Content>
          </Row>
        </Tab.Container>

        <SettingsButton className="gear-icon" />

        <Footer />
      </div></div>
  );
};

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'system';
let themeToApply = savedTheme;
if (savedTheme === 'system') {
  themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
} else if (['light-vibrant', 'dark-vibrant', 'light-grayscale', 'dark-grayscale', 'sepia'].includes(savedTheme)) {
  themeToApply = savedTheme;
}
document.documentElement.setAttribute('data-bs-theme', themeToApply);
document.body.classList.add(`${themeToApply}-theme`);

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}));
  }
});
