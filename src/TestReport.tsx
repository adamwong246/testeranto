import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

import { Footer } from "./Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./TestReport.scss"

const BddPage = () => {
  // const [configs, setConfigs] = useState<IBuiltConfig>();
  // useEffect(() => {
  //   (async () => {
  //     fetch('../config.json')
  //       .then(response => response.json())
  //       .then(json => {
  //         setConfigs(json)
  //       })
  //       .catch(error => console.error(error));

  //   })();
  // }, []);

  const [bddErrors, setBddErrors] = useState<{
    name: string;
    givens: {
      key: string;
      name: string;
      whens: {
        name: string;
        error: string;
      }[];
      thens: {
        name: string;
        error: string;
      }[];
    }[];
  } | { error: object }>();


  useEffect(() => {
    (async () => {
      try {
        const fetched = await fetch(
          `${window.location.href
            .split("/")
            .slice(0, -1)
            .join("/")}/tests.json`
        );

        const testsJson = await (fetched).json();
        setBddErrors(testsJson);

      } catch (e) {
        setBddErrors({ error: e });
      }
    })();
  }, []);

  const [log, setLog] = useState<string | { error: object }>();
  const [message, setMessage] = useState<string | { error: object }>();
  const [prompt, setPrompt] = useState<string | { error: object }>();

  useEffect(() => {
    (async () => {
      try {
        setLog(
          await (
            await fetch(
              `${window.location.href.split("/").slice(0, -1).join("/")}/logs.txt`
            )
          ).text()
        );
      } catch (e) {
        setLog({ error: e })
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const messageText = await (
          await fetch(
            `${window.location.href.split("/").slice(0, -1).join("/")}/message.txt`
          )
        ).text();
        setMessage(messageText);
        console.log('Message:', messageText);
      } catch (e) {
        setMessage({ error: e });
        console.error('Error loading message:', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const promptText = await (
          await fetch(
            `${window.location.href.split("/").slice(0, -1).join("/")}/prompt.txt`
          )
        ).text();
        setPrompt(promptText);
        console.log('Prompt:', promptText);
      } catch (e) {
        setPrompt({ error: e });
        console.error('Error loading prompt:', e);
      }
    })();
  }, []);



  // })();
  //   }, []);

  if (bddErrors === undefined || log === undefined) {
    return <div>loading...</div>;
  }

  function stripDomainFromUrl(url) {
    try {
      const urlObj = new URL(url);
      // Construct the new URL by combining pathname, search (query parameters), and hash
      // The slice(1) removes the leading '/' from pathname if it's not the root path
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null; // Or throw an error, depending on desired error handling
    }
  }

  const copyAiderCommand = async () => {
    if (typeof prompt !== 'string' || typeof message !== 'string') {
      alert('Prompt and message files must be loaded first');
      return;
    }

    const basePath = `.${stripDomainFromUrl(window.location.href).split('/').slice(0, -1).join('/')}`;


    const command = `aider --load ${basePath}/prompt.txt  --message-file ${basePath}/message.txt`;

    try {
      await navigator.clipboard.writeText(command);
      alert('Copied to clipboard:\n' + command);
    } catch (err) {
      alert('Failed to copy command: ' + err);
    }
  };

  const basePath = window.location.href.split('/').slice(0, -1).join('/');

  return (
    <div className="container-fluid p-4">
      <Tab.Container defaultActiveKey="tests">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 rounded">
          <div className="container-fluid">
            <span className="navbar-brand text-muted">{basePath.split("testeranto/reports")[1]}</span>
            <Nav variant="pills" className="me-auto">
              <Nav.Item>
                <Nav.Link eventKey="tests">Results</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="logs">Logs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ai">Aider</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="ms-auto">
              <button
                onClick={copyAiderCommand}
                className="btn btn-primary"
                title="Copy aider command to clipboard"
              >
                🤖🪄✨
              </button>
            </div>
          </div>
        </nav>
        <Row>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="tests">
                {'error' in bddErrors ? (
                  <div className="alert alert-danger">
                    <h4>Error loading test results</h4>
                    <pre>{JSON.stringify(bddErrors.error, null, 2)}</pre>
                  </div>
                ) : (
                  <div>
                    <h2>Test Results</h2>
                    {bddErrors.name && <h3>{bddErrors.name}</h3>}
                    {bddErrors.givens.map((given, i) => (
                      <div key={i} className="mb-4">
                        <h4>Given: {given.name}</h4>
                        <ul className="list-group">
                          {given.whens.map((when, j) => (
                            <li key={`w-${j}`} className={`list-group-item ${when.error ? 'list-group-item-danger' : 'list-group-item-success'}`}>
                              <strong>When:</strong> {when.name}
                              {when.error && (
                                <div className="mt-2">
                                  <pre className="text-danger">{when.error}</pre>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        <ul className="list-group mt-2">
                          {given.thens.map((then, k) => (
                            <li key={`t-${k}`} className={`list-group-item ${then.error ? 'list-group-item-danger' : 'list-group-item-success'}`}>
                              <strong>Then:</strong> {then.name}
                              {then.error && (
                                <div className="mt-2">
                                  <pre className="text-danger">{then.error}</pre>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="logs">
                {typeof log === 'string' ? (
                  <div>
                    <pre className="bg-secondary text-white p-3" style={{ overflow: 'auto' }}>
                      {log}
                    </pre>
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    <h4>Error loading logs</h4>
                    <pre>{JSON.stringify(log.error, null, 2)}</pre>
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="ai">
                <div className="row">
                  <div className="col-md-12">


                    {typeof message === 'string' ? (
                      <pre className="bg-secondary text-white p-3" style={{ overflow: 'auto' }}>
                        {message}
                      </pre>
                    ) : (
                      <div className="alert alert-danger">
                        <h5>Error loading AI message</h5>
                        <pre>{JSON.stringify(message.error, null, 2)}</pre>
                      </div>
                    )}


                    {typeof prompt === 'string' ? (
                      <pre className="bg-secondary text-white  p-3" style={{ overflow: 'auto' }}>
                        {prompt}
                      </pre>
                    ) : (
                      <div className="alert alert-danger">
                        <h5>Error loading AI prompt</h5>
                        <pre>{JSON.stringify(prompt.error, null, 2)}</pre>
                      </div>
                    )}


                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      <Footer />
    </div>
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    if (elem) {
      const root = ReactDom.createRoot(elem);
      root.render(React.createElement(BddPage, {}));
    }
  }
});
