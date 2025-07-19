import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

import { Footer } from "./Footer";

import "bootstrap/dist/css/bootstrap.min.css";

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

  if (bddErrors === undefined || log === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div className="container-fluid p-4">
      <Tab.Container defaultActiveKey="tests">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="tests">Test Results</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="logs">Execution Logs</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
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
                    <h2>Execution Logs</h2>
                    <pre className="bg-light p-3" style={{ maxHeight: '500px', overflow: 'auto' }}>
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
