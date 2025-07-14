import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Footer } from "./Footer";

const StepPane = ({
  step,
}: {
  step: {
    name: string;
    error: string;
  };
}) => {
  return (
    <div>
      <pre>
        <code>{JSON.stringify(step, null, 2)}</code>
      </pre>
    </div>
  );
};

const TestPane = ({
  given,
}: {
  given: {
    key: string;
    name: string;
    error?: string[];
    features?: string[];
    whens: {
      name: string;
      error: string;
    }[];
    thens: {
      name: string;
      error: string;
    }[];
  };
}) => {
  return (
    <div>
      {" "}
      <Tab.Container id="TestPane-tabs" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey={`bdd-features`}>features</Nav.Link>
                {...given.whens.map((w, ndx) => (
                  <Nav.Link eventKey={`bdd-when-${ndx}`}>
                    When {w.name} {w.error && "!"}
                  </Nav.Link>
                ))}
                {...given.thens.map((t, ndx) => (
                  <Nav.Link eventKey={`bdd-then-${ndx}`}>
                    Then {t.name} {t.error && "!"}
                  </Nav.Link>
                ))}
                <Nav.Link eventKey={`bdd-errors`}>errors</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={6}>
            <Tab.Content>
              <Tab.Pane eventKey={`bdd-features`}>
                <pre>
                  <code>{JSON.stringify(given.features, null, 2)}</code>
                </pre>
              </Tab.Pane>

              {...given.whens.map((w, ndx) => (
                <Tab.Pane eventKey={`bdd-when-${ndx}`}>
                  <StepPane step={w} />
                </Tab.Pane>
              ))}
              {...given.thens.map((t, ndx) => (
                <Tab.Pane eventKey={`bdd-then-${ndx}`}>
                  <StepPane step={t} />
                </Tab.Pane>
              ))}
              <Tab.Pane eventKey={`bdd-errors`}>
                <pre>
                  <code>{JSON.stringify(given.error, null, 2)}</code>
                </pre>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

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
  }>();
  useEffect(() => {
    (async () => {
      setBddErrors(
        await (
          await fetch(
            `${window.location.href
              .split("/")
              .slice(0, -1)
              .join("/")}/tests.json`
          )
        ).json()
      );
    })();
  }, []);

  const [log, setLog] = useState<string>();
  useEffect(() => {
    (async () => {
      setLog(
        await (
          await fetch(
            `${window.location.href.split("/").slice(0, -1).join("/")}/log.txt`
          )
        ).text()
      );
    })();
  }, []);

  if (bddErrors === undefined || log === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {" "}
      <Row>
        <Col sm={12}>
          <h2>{bddErrors.name}</h2>
        </Col>
      </Row>
      <Row>
        <Tab.Container id="root-tab-container" defaultActiveKey="log">
          <Row>
            <Col sm={1}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey={"log"}>log</Nav.Link>
                  <Nav.Link eventKey={"steps"}>steps</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col sm={11}>
              <Tab.Content>
                <Tab.Pane eventKey={"log"}>
                  <pre>
                    <code>{log}</code>
                  </pre>
                </Tab.Pane>

                <Tab.Pane eventKey={"steps"}>
                  <Tab.Container
                    id="secondary-tab-container"
                    defaultActiveKey="first"
                  >
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          {...bddErrors.givens.map((g) => (
                            <Nav.Item>
                              <Nav.Link eventKey={g.key}>
                                {g.key}: Given {g.name}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content>
                          {...bddErrors.givens.map((g) => (
                            <Tab.Pane eventKey={g.key}>
                              <TestPane given={g} />
                            </Tab.Pane>
                          ))}
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>

            {/* <Col sm={3}>
            


          </Col>

          <Col sm={3}>
            <Nav variant="pills" className="flex-column">

              {
                ...bddErrors.givens.map((g) =>
                  <Nav.Item>
                    <Nav.Link eventKey={g.key}>
                      {g.key}: Given {g.name}
                    </Nav.Link>
                  </Nav.Item>
                )
              }

            </Nav>
          </Col>
          <Col sm={6}>
            <Tab.Content>
              {
                ...bddErrors.givens.map((g) =>

                  <Tab.Pane eventKey={g.key}><TestPane given={g} /></Tab.Pane>

                )
              }
            </Tab.Content>
          </Col> */}
          </Row>
        </Tab.Container>
      </Row>
      <div
        style={{
          backgroundColor: "lightgray",
          margin: "0.5rem",
          padding: "0.5rem",
          position: "fixed",
          left: 0,
          bottom: 0,
        }}
      >
        <a href="/">🏠</a>
      </div>
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
